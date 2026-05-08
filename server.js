require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');
const fetch = require('node-fetch');
const {
  createScaledOffersSourceService,
  collectScaledOffersFromWeb,
  normalizeCollectorSeedsInput,
  isCollectorResultEmpty,
  createCollectorStatusPayload,
  createCollectedImportPayload,
  createCollectedImportErrorPayload,
  createCollectedImportConflictPayload,
} = require('./services/scaled-offers-source');

const app = express();
const PORT = process.env.PORT || 3005;

// In serverless (Vercel/Lambda), __dirname is read-only. Use /tmp for writable storage.
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const DATA_DIR = isServerless ? path.join('/tmp', 'data') : path.join(__dirname, 'data');

const DATA_FILE = path.join(DATA_DIR, 'offers.json');
const META_DATA_FILE = path.join(DATA_DIR, 'meta-ads-offers.json');
const SCALED_LIBRARY_FILE = path.join(DATA_DIR, 'scaled-offers-source.json');
const EXTERNAL_ADS_API_URL = cleanEnv(process.env.EXTERNAL_ADS_API_URL);
const EXTERNAL_ADS_API_KEY = cleanEnv(process.env.EXTERNAL_ADS_API_KEY);
const scaledOffersSourceService = createScaledOffersSourceService({
  projectRoot: __dirname,
  dataDir: DATA_DIR,
  env: process.env,
  fetchImpl: fetch,
});

const SCORE_WEIGHTS = {
  adRepetition: 18,
  messageClarity: 16,
  mechanismSpecificity: 18,
  easePerception: 12,
  upsellPresence: 10,
  micropersonaFit: 12,
  funnelStrength: 14,
};

const META_SCORE_WEIGHTS = {
  recurrenceStrength: 17,
  creativeVolume: 14,
  hookClarity: 13,
  mechanismSpecificity: 14,
  offerClarity: 13,
  landingPageStrength: 10,
  ctaStrength: 9,
  micropersonaFit: 10,
};

const SCORE_FIELDS = Object.keys(SCORE_WEIGHTS);
const META_SCORE_FIELDS = Object.keys(META_SCORE_WEIGHTS);

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function cleanEnv(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function ensureCollectionFile(filePath) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    // In serverless, try to copy seed data from the bundled source
    if (isServerless) {
      const seedPath = path.join(__dirname, 'data', path.basename(filePath));
      try {
        await fs.copyFile(seedPath, filePath);
        return;
      } catch { /* no seed file, create empty */ }
    }
    await fs.writeFile(filePath, '[]\n', 'utf8');
  }
}

async function loadCollection(filePath) {
  await ensureCollectionFile(filePath);
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

async function saveCollection(filePath, items) {
  await ensureCollectionFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2) + '\n', 'utf8');
}

async function loadOffers() {
  return loadCollection(DATA_FILE);
}

async function saveOffers(offers) {
  return saveCollection(DATA_FILE, offers);
}

async function loadMetaAds() {
  return loadCollection(META_DATA_FILE);
}

async function saveMetaAds(metaAds) {
  return saveCollection(META_DATA_FILE, metaAds);
}

async function loadScaledLibrary() {
  return loadCollection(SCALED_LIBRARY_FILE);
}

async function saveScaledLibrary(items) {
  return saveCollection(SCALED_LIBRARY_FILE, items);
}

function makeId(prefix = 'offer') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function clampSignal(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(5, Math.round(parsed * 10) / 10));
}

function cleanString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function cleanNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanInteger(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.round(parsed));
}

function cleanTags(value) {
  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];

  return [...new Set(tags.map((tag) => cleanString(tag)).filter(Boolean))];
}

function normalizeUrl(value) {
  const trimmed = cleanString(value);
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizeDate(value) {
  const trimmed = cleanString(value);
  if (!trimmed) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function normalizeSearchQuery(value) {
  return cleanString(value).toUpperCase();
}

function computeWeightedScore(weights, signals = {}) {
  const fields = Object.keys(weights);
  const total = fields.reduce((sum, field) => {
    const value = clampSignal(signals[field]);
    return sum + (value / 5) * weights[field];
  }, 0);

  return Math.round(total);
}

function normalizeSignalSet(fields, input = {}) {
  return fields.reduce((acc, field) => {
    acc[field] = clampSignal(input[field]);
    return acc;
  }, {});
}

function computeScore(signals = {}) {
  return computeWeightedScore(SCORE_WEIGHTS, signals);
}

function computeMetaScore(signals = {}) {
  return computeWeightedScore(META_SCORE_WEIGHTS, signals);
}

function normalizeSignals(input = {}) {
  return normalizeSignalSet(SCORE_FIELDS, input);
}

function normalizeMetaSignals(input = {}) {
  return normalizeSignalSet(META_SCORE_FIELDS, input);
}

function calculateDaysRunning(firstSeenAt, lastSeenAt, fallbackValue) {
  const fallback = cleanInteger(fallbackValue);
  const start = normalizeDate(firstSeenAt);
  const end = normalizeDate(lastSeenAt) || new Date().toISOString().slice(0, 10);

  if (!start) return fallback;

  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
    return fallback;
  }

  return Math.floor((endDate - startDate) / 86400000) + 1;
}

function normalizeOfferInput(input, existingOffer = null) {
  const now = new Date().toISOString();
  const signals = normalizeSignals(input.signals || existingOffer?.signals || {});
  const score = computeScore(signals);

  return {
    id: existingOffer?.id || makeId('offer'),
    name: cleanString(input.name),
    niche: cleanString(input.niche),
    micropersona: cleanString(input.micropersona),
    mechanism: cleanString(input.mechanism),
    promise: cleanString(input.promise),
    offerType: cleanString(input.offerType),
    entryPrice: cleanNumber(input.entryPrice),
    sourcePlatform: cleanString(input.sourcePlatform),
    sourceUrl: normalizeUrl(input.sourceUrl),
    landingPageUrl: normalizeUrl(input.landingPageUrl),
    creativeUrl: normalizeUrl(input.creativeUrl),
    funnelType: cleanString(input.funnelType),
    tags: cleanTags(input.tags),
    notes: cleanString(input.notes),
    modelNotes: cleanString(input.modelNotes),
    signals,
    score,
    createdAt: existingOffer?.createdAt || now,
    updatedAt: now,
  };
}

function normalizeMetaAdInput(input, existingAd = null) {
  const now = new Date().toISOString();
  const signals = normalizeMetaSignals(input.signals || existingAd?.signals || {});
  const metaScore = computeMetaScore(signals);
  const firstSeenAt = normalizeDate(input.firstSeenAt || existingAd?.firstSeenAt);
  const lastSeenAt = normalizeDate(input.lastSeenAt || existingAd?.lastSeenAt);

  return {
    id: existingAd?.id || makeId('meta'),
    adLibraryUrl: normalizeUrl(input.adLibraryUrl),
    adTitle: cleanString(input.adTitle),
    brandName: cleanString(input.brandName),
    niche: cleanString(input.niche),
    micropersona: cleanString(input.micropersona),
    mechanism: cleanString(input.mechanism),
    promise: cleanString(input.promise),
    offerType: cleanString(input.offerType),
    landingPageUrl: normalizeUrl(input.landingPageUrl),
    creativeUrl: normalizeUrl(input.creativeUrl),
    creativeType: cleanString(input.creativeType),
    cta: cleanString(input.cta),
    detectedPlatform: 'Meta Ads',
    adFormatNotes: cleanString(input.adFormatNotes),
    copyHook: cleanString(input.copyHook),
    creativeCount: cleanInteger(input.creativeCount),
    firstSeenAt,
    lastSeenAt,
    daysRunning: calculateDaysRunning(firstSeenAt, lastSeenAt, input.daysRunning ?? existingAd?.daysRunning),
    tags: cleanTags(input.tags),
    notes: cleanString(input.notes),
    signals,
    metaScore,
    createdAt: existingAd?.createdAt || now,
    updatedAt: now,
  };
}

function validateOffer(offer) {
  const errors = [];
  if (!offer.name) errors.push('Nome da oferta é obrigatório');
  if (!offer.niche) errors.push('Nicho é obrigatório');
  if (!offer.mechanism) errors.push('Mecanismo é obrigatório');
  if (!offer.promise) errors.push('Promessa é obrigatória');
  if (!offer.sourcePlatform) errors.push('Plataforma de origem é obrigatória');
  return errors;
}

function validateMetaAd(metaAd) {
  const errors = [];
  if (!metaAd.adTitle) errors.push('Título do anúncio é obrigatório');
  if (!metaAd.brandName) errors.push('Marca é obrigatória');
  if (!metaAd.niche) errors.push('Nicho é obrigatório');
  if (!metaAd.promise) errors.push('Promessa é obrigatória');
  if (!metaAd.adLibraryUrl) errors.push('URL da Ad Library é obrigatória');
  return errors;
}

function findMetaDuplicateIndex(metaAds, metaAd) {
  if (!metaAd.adLibraryUrl) return -1;
  return metaAds.findIndex((item) => item.adLibraryUrl === metaAd.adLibraryUrl);
}

function normalizeScaledLibraryItem(input, existingItem = null) {
  const now = new Date().toISOString();
  return {
    id: existingItem?.id || makeId('scaled'),
    niche: cleanString(input.niche),
    offerTitle: cleanString(input.offerTitle || input.title || input.name),
    brandName: cleanString(input.brandName || input.brand || input.pageName),
    copyText: cleanString(input.copyText || input.copy || input.body),
    creativeType: cleanString(input.creativeType || input.creative_type),
    creativeUrl: normalizeUrl(input.creativeUrl || input.creative_url || input.imageUrl || input.videoUrl),
    thumbnailUrl: normalizeUrl(input.thumbnailUrl || input.thumbnail_url || input.imageUrl || input.creativeUrl),
    libraryUrl: normalizeUrl(input.libraryUrl || input.library_url || input.adLibraryUrl),
    scaleSignal: cleanString(input.scaleSignal || input.scale_signal || input.reason),
    adsCount: cleanInteger(input.adsCount || input.ads_count),
    source: cleanString(input.source) || 'library-import',
    createdAt: existingItem?.createdAt || now,
    updatedAt: now,
  };
}

function validateScaledLibraryItem(item) {
  const errors = [];
  if (!item.offerTitle) errors.push('Título da oferta é obrigatório');
  if (!item.brandName) errors.push('Marca é obrigatória');
  if (!item.libraryUrl) errors.push('URL específica da Ad Library é obrigatória');
  if (!Number.isFinite(item.adsCount) || item.adsCount < 200) errors.push('adsCount precisa ser 200 ou maior');
  return errors;
}

function findScaledLibraryDuplicateIndex(items, item) {
  if (!item.libraryUrl) return -1;
  return items.findIndex((existing) => existing.libraryUrl === item.libraryUrl);
}

function importScaledLibraryBatch(existingItems, rawItems) {
  const nextItems = [...existingItems];
  const imported = [];
  const skipped = [];
  const errors = [];

  rawItems.forEach((rawItem, index) => {
    if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
      errors.push({ index, reason: 'Item deve ser um objeto JSON válido' });
      return;
    }

    const normalized = normalizeScaledLibraryItem(rawItem);
    const validationErrors = validateScaledLibraryItem(normalized);
    if (validationErrors.length) {
      errors.push({ index, reason: validationErrors.join('. ') });
      return;
    }

    const duplicateIndex = findScaledLibraryDuplicateIndex(nextItems, normalized);
    if (duplicateIndex !== -1) {
      skipped.push({
        index,
        reason: 'URL da Ad Library já cadastrada na biblioteca',
        libraryUrl: normalized.libraryUrl,
        existingId: nextItems[duplicateIndex].id,
      });
      return;
    }

    nextItems.push(normalized);
    imported.push({
      index,
      id: normalized.id,
      offerTitle: normalized.offerTitle,
      libraryUrl: normalized.libraryUrl,
    });
  });

  const sortedItems = [...nextItems].sort((a, b) => {
    if ((b.adsCount || 0) !== (a.adsCount || 0)) return (b.adsCount || 0) - (a.adsCount || 0);
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });

  return {
    nextItems: sortedItems,
    imported,
    skipped,
    errors,
    importedCount: imported.length,
    skippedCount: skipped.length,
    errorCount: errors.length,
  };
}

function importMetaAdsBatch(existingMetaAds, rawItems) {
  const nextMetaAds = [...existingMetaAds];
  const imported = [];
  const skipped = [];
  const errors = [];

  rawItems.forEach((rawItem, index) => {
    if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
      errors.push({ index, reason: 'Item deve ser um objeto JSON válido' });
      return;
    }

    const normalized = normalizeMetaAdInput(rawItem);
    const validationErrors = validateMetaAd(normalized);
    if (validationErrors.length) {
      errors.push({ index, reason: validationErrors.join('. ') });
      return;
    }

    const duplicateIndex = findMetaDuplicateIndex(nextMetaAds, normalized);
    if (duplicateIndex !== -1) {
      skipped.push({
        index,
        reason: 'URL da Ad Library já cadastrada',
        adLibraryUrl: normalized.adLibraryUrl,
        existingId: nextMetaAds[duplicateIndex].id,
      });
      return;
    }

    nextMetaAds.push(normalized);
    imported.push({
      index,
      id: normalized.id,
      adTitle: normalized.adTitle,
      adLibraryUrl: normalized.adLibraryUrl,
    });
  });

  return {
    nextMetaAds: sortMetaAds(nextMetaAds),
    imported,
    skipped,
    errors,
    importedCount: imported.length,
    skippedCount: skipped.length,
    errorCount: errors.length,
  };
}

function parseImportItems(input) {
  if (Array.isArray(input)) return input;
  if (Array.isArray(input?.items)) return input.items;
  return null;
}

function buildImportSummary(result) {
  return {
    importedCount: result.importedCount,
    skippedCount: result.skippedCount,
    errorCount: result.errorCount,
    imported: result.imported,
    skipped: result.skipped,
    errors: result.errors,
  };
}

function isImportRequestValid(items) {
  return Array.isArray(items) && items.length > 0;
}

function normalizeImportRequest(reqBody) {
  return parseImportItems(reqBody);
}

function isImportFullyRejected(result) {
  return result.importedCount === 0;
}

function isImportPartiallySuccessful(result) {
  return result.importedCount > 0 && (result.skippedCount > 0 || result.errorCount > 0);
}

function createImportSuccessMessage(result) {
  return result.errorCount || result.skippedCount
    ? 'Importação concluída com avisos'
    : 'Importação em lote concluída com sucesso';
}

function createImportMetaPayload(result) {
  return {
    message: createImportSuccessMessage(result),
    success: result.importedCount > 0,
    partial: isImportPartiallySuccessful(result),
    ...buildImportSummary(result),
  };
}

function createImportMetaConflictPayload(result) {
  return {
    error: 'Nenhum item novo foi importado',
    partial: false,
    ...buildImportSummary(result),
  };
}

function sortOffers(offers) {
  return [...offers].sort((a, b) => {
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });
}

function sortMetaAds(metaAds) {
  return [...metaAds].sort((a, b) => {
    if ((b.metaScore || 0) !== (a.metaScore || 0)) return (b.metaScore || 0) - (a.metaScore || 0);
    const lastSeenDiff = new Date(b.lastSeenAt || b.updatedAt || 0).getTime() - new Date(a.lastSeenAt || a.updatedAt || 0).getTime();
    if (lastSeenDiff !== 0) return lastSeenDiff;
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });
}

function countByField(items, field) {
  const counts = new Map();
  for (const item of items) {
    const value = cleanString(item[field]);
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'));
}

function countTags(items) {
  const counts = new Map();
  for (const item of items) {
    for (const tag of cleanTags(item.tags)) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'));
}

function buildSummary(offers) {
  const totalOffers = offers.length;
  const averageScore = totalOffers ? Math.round(offers.reduce((sum, offer) => sum + (offer.score || 0), 0) / totalOffers) : 0;
  const highestScore = totalOffers ? Math.max(...offers.map((offer) => offer.score || 0)) : 0;
  const pricedOffers = offers.filter((offer) => Number.isFinite(offer.entryPrice));
  const averageEntryPrice = pricedOffers.length ? pricedOffers.reduce((sum, offer) => sum + offer.entryPrice, 0) / pricedOffers.length : 0;

  return {
    totalOffers,
    averageScore,
    highestScore,
    averageEntryPrice: Number(averageEntryPrice.toFixed(2)),
    topMechanism: countByField(offers, 'mechanism')[0] || null,
    topMicropersona: countByField(offers, 'micropersona')[0] || null,
    topPlatform: countByField(offers, 'sourcePlatform')[0] || null,
  };
}

function buildRankings(offers) {
  return {
    mechanisms: countByField(offers, 'mechanism').slice(0, 6),
    micropersonas: countByField(offers, 'micropersona').slice(0, 6),
    platforms: countByField(offers, 'sourcePlatform').slice(0, 6),
    tags: countTags(offers).slice(0, 10),
    scoreBands: [
      { label: '80-100', count: offers.filter((offer) => offer.score >= 80).length },
      { label: '60-79', count: offers.filter((offer) => offer.score >= 60 && offer.score < 80).length },
      { label: '40-59', count: offers.filter((offer) => offer.score >= 40 && offer.score < 60).length },
      { label: '0-39', count: offers.filter((offer) => offer.score < 40).length },
    ],
  };
}

function buildMetaSummary(metaAds) {
  const totalAds = metaAds.length;
  const averageMetaScore = totalAds ? Math.round(metaAds.reduce((sum, ad) => sum + (ad.metaScore || 0), 0) / totalAds) : 0;
  const highestMetaScore = totalAds ? Math.max(...metaAds.map((ad) => ad.metaScore || 0)) : 0;
  const activeAds = metaAds.filter((ad) => cleanString(ad.lastSeenAt)).length;
  const averageCreativeCountSource = metaAds.filter((ad) => Number.isFinite(ad.creativeCount));
  const averageCreativeCount = averageCreativeCountSource.length ? averageCreativeCountSource.reduce((sum, ad) => sum + ad.creativeCount, 0) / averageCreativeCountSource.length : 0;

  return {
    totalAds,
    averageMetaScore,
    highestMetaScore,
    activeAds,
    averageCreativeCount: Number(averageCreativeCount.toFixed(1)),
    topBrand: countByField(metaAds, 'brandName')[0] || null,
    topNiche: countByField(metaAds, 'niche')[0] || null,
  };
}

function buildMetaRankings(metaAds) {
  return {
    brands: countByField(metaAds, 'brandName').slice(0, 6),
    niches: countByField(metaAds, 'niche').slice(0, 6),
    creativeTypes: countByField(metaAds, 'creativeType').slice(0, 6),
    tags: countTags(metaAds).slice(0, 10),
    scoreBands: [
      { label: '80-100', count: metaAds.filter((ad) => ad.metaScore >= 80).length },
      { label: '60-79', count: metaAds.filter((ad) => ad.metaScore >= 60 && ad.metaScore < 80).length },
      { label: '40-59', count: metaAds.filter((ad) => ad.metaScore >= 40 && ad.metaScore < 60).length },
      { label: '0-39', count: metaAds.filter((ad) => ad.metaScore < 40).length },
    ],
  };
}

function isPrivateHostname(hostname) {
  const host = hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local')) return true;
  if (host === '::1') return true;
  if (/^127\./.test(host)) return true;
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  return false;
}

function extractMeta(html, tagName, attrName, attrValue) {
  const pattern = new RegExp(`<meta[^>]*${attrName}=["']${attrValue}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  const match = html.match(pattern);
  if (match) return match[1].trim();
  if (tagName === 'title') {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }
  return '';
}

function parsePageMetadata(html, finalUrl) {
  const title = extractMeta(html, 'meta', 'property', 'og:title') || extractMeta(html, 'meta', 'name', 'twitter:title') || extractMeta(html, 'title') || '';
  const description = extractMeta(html, 'meta', 'name', 'description') || extractMeta(html, 'meta', 'property', 'og:description') || '';
  return { finalUrl, title, description };
}

async function fetchPublicMetadata(rawUrl) {
  const parsedUrl = new URL(rawUrl);
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Use apenas URLs públicas HTTP/HTTPS');
  if (isPrivateHostname(parsedUrl.hostname)) throw new Error('URLs locais ou privadas não são permitidas');

  const response = await fetch(parsedUrl.toString(), {
    redirect: 'follow',
    timeout: 8000,
    headers: {
      'User-Agent': 'OpenClaude Offer Dashboard/1.0',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) throw new Error(`Falha ao acessar URL pública (${response.status})`);

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return { finalUrl: response.url, title: '', description: '' };
  }

  const html = await response.text();
  return parsePageMetadata(html, response.url);
}

app.get('/api/status', async (req, res) => {
  const [offers, metaAds] = await Promise.all([loadOffers(), loadMetaAds()]);
  res.json({
    connected: true,
    mode: 'local-offer-intelligence',
    offersCount: offers.length,
    metaAdsCount: metaAds.length,
    scaledOffersConnectorConfigured: scaledOffersSourceService.isConfigured(),
    scaledOffersSourceMode: scaledOffersSourceService.getMode(),
    lastUpdated: offers[0]?.updatedAt || null,
    metaLastUpdated: metaAds[0]?.updatedAt || null,
  });
});

app.get('/api/offers', async (req, res) => {
  try {
    res.json({ data: sortOffers(await loadOffers()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/offers/:id', async (req, res) => {
  try {
    const offers = await loadOffers();
    const offer = offers.find((item) => item.id === req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta não encontrada' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const offers = await loadOffers();
    const offer = normalizeOfferInput(req.body);
    const errors = validateOffer(offer);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    offers.push(offer);
    await saveOffers(sortOffers(offers));
    res.status(201).json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/offers/:id', async (req, res) => {
  try {
    const offers = await loadOffers();
    const index = offers.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Oferta não encontrada' });
    const updatedOffer = normalizeOfferInput(req.body, offers[index]);
    const errors = validateOffer(updatedOffer);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    offers[index] = updatedOffer;
    await saveOffers(sortOffers(offers));
    res.json({ success: true, offer: updatedOffer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/offers/:id', async (req, res) => {
  try {
    const offers = await loadOffers();
    const remaining = offers.filter((item) => item.id !== req.params.id);
    if (remaining.length === offers.length) return res.status(404).json({ error: 'Oferta não encontrada' });
    await saveOffers(sortOffers(remaining));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers/enrich-url', async (req, res) => {
  try {
    const url = normalizeUrl(req.body?.url);
    if (!url) return res.status(400).json({ error: 'URL pública válida é obrigatória' });
    const metadata = await fetchPublicMetadata(url);
    res.json({ success: true, metadata });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/dashboard/summary', async (req, res) => {
  try {
    res.json(buildSummary(sortOffers(await loadOffers())));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/dashboard/rankings', async (req, res) => {
  try {
    res.json(buildRankings(sortOffers(await loadOffers())));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/meta-ads/status', async (req, res) => {
  try {
    const metaAds = sortMetaAds(await loadMetaAds());
    res.json({ connected: true, metaAdsCount: metaAds.length, lastUpdated: metaAds[0]?.updatedAt || null, topScore: metaAds[0]?.metaScore || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/meta-ads', async (req, res) => {
  try {
    res.json({ data: sortMetaAds(await loadMetaAds()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/meta-ads/:id', async (req, res) => {
  try {
    const metaAds = await loadMetaAds();
    const metaAd = metaAds.find((item) => item.id === req.params.id);
    if (!metaAd) return res.status(404).json({ error: 'Anúncio Meta não encontrado' });
    res.json(metaAd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/meta-ads', async (req, res) => {
  try {
    const metaAds = await loadMetaAds();
    const metaAd = normalizeMetaAdInput(req.body);
    const errors = validateMetaAd(metaAd);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    metaAds.push(metaAd);
    await saveMetaAds(sortMetaAds(metaAds));
    res.status(201).json({ success: true, metaAd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/meta-ads/import', async (req, res) => {
  try {
    const items = normalizeImportRequest(req.body);
    if (!isImportRequestValid(items)) return res.status(400).json({ error: 'Envie um array JSON de itens ou um objeto com a chave items' });
    const metaAds = await loadMetaAds();
    const result = importMetaAdsBatch(metaAds, items);
    if (isImportFullyRejected(result)) return res.status(400).json(createImportMetaConflictPayload(result));
    await saveMetaAds(result.nextMetaAds);
    res.status(201).json(createImportMetaPayload(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/meta-ads/:id', async (req, res) => {
  try {
    const metaAds = await loadMetaAds();
    const index = metaAds.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Anúncio Meta não encontrado' });
    const updatedMetaAd = normalizeMetaAdInput(req.body, metaAds[index]);
    const errors = validateMetaAd(updatedMetaAd);
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    metaAds[index] = updatedMetaAd;
    await saveMetaAds(sortMetaAds(metaAds));
    res.json({ success: true, metaAd: updatedMetaAd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/meta-ads/:id', async (req, res) => {
  try {
    const metaAds = await loadMetaAds();
    const remaining = metaAds.filter((item) => item.id !== req.params.id);
    if (remaining.length === metaAds.length) return res.status(404).json({ error: 'Anúncio Meta não encontrado' });
    await saveMetaAds(sortMetaAds(remaining));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/meta-ads/enrich-url', async (req, res) => {
  try {
    const url = normalizeUrl(req.body?.url);
    if (!url) return res.status(400).json({ error: 'URL pública válida é obrigatória' });
    const metadata = await fetchPublicMetadata(url);
    res.json({ success: true, metadata });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/meta-ads/dashboard/summary', async (req, res) => {
  try {
    res.json(buildMetaSummary(sortMetaAds(await loadMetaAds())));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/meta-ads/dashboard/rankings', async (req, res) => {
  try {
    res.json(buildMetaRankings(sortMetaAds(await loadMetaAds())));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scaled-offers/library', async (req, res) => {
  try {
    res.json({ data: await loadScaledLibrary() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scaled-offers/import', async (req, res) => {
  try {
    const items = normalizeImportRequest(req.body);
    if (!isImportRequestValid(items)) return res.status(400).json({ error: 'Envie um array JSON de itens ou um objeto com a chave items' });
    const existingItems = await loadScaledLibrary();
    const result = importScaledLibraryBatch(existingItems, items);
    if (isImportFullyRejected(result)) {
      return res.status(400).json({
        error: 'Nenhum item novo foi importado para a biblioteca',
        partial: false,
        ...buildImportSummary(result),
      });
    }
    await saveScaledLibrary(result.nextItems);
    res.status(201).json({
      message: result.errorCount || result.skippedCount ? 'Importação da biblioteca concluída com avisos' : 'Importação da biblioteca concluída com sucesso',
      success: result.importedCount > 0,
      partial: isImportPartiallySuccessful(result),
      ...buildImportSummary(result),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scaled-offers/collect', async (req, res) => {
  try {
    const overrideSeeds = normalizeCollectorSeedsInput(req.body?.seeds);
    const collectResult = await collectScaledOffersFromWeb(process.env, fetch, overrideSeeds);
    if (isCollectorResultEmpty(collectResult)) {
      return res.status(400).json(createCollectedImportErrorPayload(collectResult));
    }

    const existingItems = await loadScaledLibrary();
    const importResult = importScaledLibraryBatch(existingItems, collectResult.items);
    if (isImportFullyRejected(importResult)) {
      return res.status(400).json(createCollectedImportConflictPayload(importResult, collectResult));
    }

    await saveScaledLibrary(importResult.nextItems);
    res.status(201).json(createCollectedImportPayload(importResult, collectResult));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scaled-offers/collector-status', async (req, res) => {
  try {
    const seeds = normalizeCollectorSeedsInput(req.query?.seeds ? [req.query.seeds] : []);
    const result = await collectScaledOffersFromWeb(process.env, fetch, seeds);
    res.json(createCollectorStatusPayload(result));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/scaled-offers/top', async (req, res) => {
  try {
    const payload = await scaledOffersSourceService.fetchTopScaledOffers();
    res.json({
      success: true,
      connectorConfigured: payload.configured,
      mode: payload.mode,
      message: payload.message,
      data: payload.results,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Offer Intelligence Dashboard rodando em http://localhost:${PORT}`);
});
