const fs = require('fs/promises');
const path = require('path');

function cleanEnv(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function cleanInteger(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.round(parsed));
}

function normalizeSearchQuery(value) {
  return cleanString(value).toUpperCase();
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

function makeId(prefix = 'scaled') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function ensureSupportedMode(mode) {
  return ['demo', 'external', 'internal'].includes(mode) ? mode : '';
}

function resolveInternalDataFile(projectRoot, dataDir, env) {
  const configuredPath = cleanEnv(env.INTERNAL_SCALED_OFFERS_DATA_FILE);
  if (!configuredPath) return path.join(dataDir, 'scaled-offers-source.json');
  return path.isAbsolute(configuredPath) ? configuredPath : path.join(projectRoot, configuredPath);
}

function resolveCollectorSeeds(env, overrideSeeds = []) {
  const explicitSeeds = Array.isArray(overrideSeeds) ? overrideSeeds : [];
  const envSeeds = cleanEnv(env.SCALED_LIBRARY_SEED_URLS)
    .split(/\r?\n|,/)
    .map((seed) => cleanString(seed))
    .filter(Boolean);

  const merged = [...explicitSeeds, ...envSeeds]
    .map((seed) => normalizeUrl(seed))
    .filter(Boolean);

  return [...new Set(merged)];
}

async function ensureCollectionFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]\n', 'utf8');
  }
}

async function loadCollection(filePath) {
  await ensureCollectionFile(filePath);
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw || '[]');
  return Array.isArray(parsed) ? parsed : [];
}

function createScaledOfferMockResults(niche) {
  const normalized = normalizeSearchQuery(niche);
  return [
    {
      id: `scaled_${normalized}_1`,
      niche: normalized,
      offerTitle: `${normalized} Protocolo 21 Dias`,
      brandName: 'Biblioteca Externa Demo',
      copyText: `Exemplo de copy de ${normalized} com promessa clara, mecanismo simples e apelo direto para o avatar principal.`,
      creativeType: 'image',
      creativeUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      libraryUrl: 'https://www.facebook.com/ads/library/?id=100000000000001',
      scaleSignal: 'Alta recorrência detectada pela fonte externa',
      adsCount: 240,
      source: 'demo-connector',
    },
    {
      id: `scaled_${normalized}_2`,
      niche: normalized,
      offerTitle: `${normalized} Reset Inteligente`,
      brandName: 'Biblioteca Externa Demo',
      copyText: 'Criativo e copy retornados como demonstração do conector externo. Troque pela API real quando tiver um provedor definido.',
      creativeType: 'video',
      creativeUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      libraryUrl: 'https://www.facebook.com/ads/library/?id=100000000000002',
      scaleSignal: 'Volume de ads acima do limiar da fonte externa',
      adsCount: 320,
      source: 'demo-connector',
    },
  ];
}

function normalizeScaledOfferItem(item, fallbackNiche) {
  return {
    id: cleanString(item.id) || makeId('scaled'),
    niche: cleanString(item.niche) || fallbackNiche,
    offerTitle: cleanString(item.offerTitle || item.title || item.name),
    brandName: cleanString(item.brandName || item.brand || item.pageName),
    copyText: cleanString(item.copyText || item.copy || item.body),
    creativeType: cleanString(item.creativeType || item.creative_type),
    creativeUrl: normalizeUrl(item.creativeUrl || item.creative_url || item.imageUrl || item.videoUrl),
    thumbnailUrl: normalizeUrl(item.thumbnailUrl || item.thumbnail_url || item.imageUrl || item.creativeUrl),
    libraryUrl: normalizeUrl(item.libraryUrl || item.library_url || item.adLibraryUrl),
    scaleSignal: cleanString(item.scaleSignal || item.scale_signal || item.reason),
    adsCount: cleanInteger(item.adsCount || item.ads_count),
    source: cleanString(item.source) || 'internal-source',
  };
}

function isGenericLibraryUrl(url) {
  const normalized = normalizeUrl(url);
  return !normalized || normalized === 'https://www.facebook.com/ads/library/';
}

function finalizeScaledOffersResults(items, niche) {
  return (items || [])
    .map((item) => normalizeScaledOfferItem(item, niche))
    .filter((item) => item.offerTitle && item.brandName)
    .filter((item) => (item.adsCount || 0) >= 200)
    .filter((item) => !isGenericLibraryUrl(item.libraryUrl))
    .sort((a, b) => {
      if ((b.adsCount || 0) !== (a.adsCount || 0)) return (b.adsCount || 0) - (a.adsCount || 0);
      return cleanString(a.offerTitle).localeCompare(cleanString(b.offerTitle), 'pt-BR');
    });
}

function createScaledOffersMessage(baseMessage, results) {
  if (!results.length) {
    return `${baseMessage} Nenhum anúncio disponível foi encontrado na biblioteca.`;
  }

  return `${baseMessage} ${results.length} anúncio(s) disponíveis carregados na biblioteca.`;
}

function resolveMetaApiVersion(env) {
  return cleanEnv(env.META_API_VERSION) || 'v21.0';
}

function resolveCollectorLimit(env) {
  const parsed = Number(cleanEnv(env.SCALED_LIBRARY_META_LIMIT));
  if (!Number.isFinite(parsed)) return 25;
  return Math.max(1, Math.min(100, Math.round(parsed)));
}

function parseCsvEnvList(value) {
  return cleanEnv(value)
    .split(/\r?\n|,/)
    .map((item) => cleanString(item).toUpperCase())
    .filter(Boolean);
}

function resolveCollectorReachedCountries(env, url) {
  const envCountries = parseCsvEnvList(env.SCALED_LIBRARY_REACHED_COUNTRIES);

  try {
    const parsed = new URL(url);
    const country = cleanString(parsed.searchParams.get('country')).toUpperCase();
    if (country && country !== 'ALL') return [country];
  } catch {
    // ignore malformed url here; caller validates earlier
  }

  return envCountries.length ? envCountries : ['BR'];
}

function mapSeedActiveStatus(value) {
  const normalized = cleanString(value).toLowerCase();
  if (normalized === 'active') return 'ACTIVE';
  if (normalized === 'inactive') return 'INACTIVE';
  return 'ALL';
}

function mapSeedAdType(value) {
  const normalized = cleanString(value).toUpperCase();
  return normalized || 'ALL';
}

function extractCollectorSeedDescriptor(seedUrl, env) {
  const parsed = new URL(seedUrl);
  const pageId = cleanString(
    parsed.searchParams.get('view_all_page_id')
      || parsed.searchParams.get('page_id')
  );

  return {
    seedUrl,
    pageId,
    adId: cleanString(parsed.searchParams.get('id')),
    activeStatus: mapSeedActiveStatus(parsed.searchParams.get('active_status')),
    adType: mapSeedAdType(parsed.searchParams.get('ad_type')),
    reachedCountries: resolveCollectorReachedCountries(env, seedUrl),
  };
}

function assertMetaCollectorConfig(env) {
  const token = cleanEnv(env.META_ACCESS_TOKEN);
  if (!token) {
    throw new Error('Configure META_ACCESS_TOKEN para consultar a biblioteca via Meta Ads Archive API.');
  }

  return {
    token,
    version: resolveMetaApiVersion(env),
    limit: resolveCollectorLimit(env),
  };
}

function buildAdsArchiveFields() {
  return [
    'id',
    'page_id',
    'page_name',
    'ad_snapshot_url',
    'ad_creation_time',
    'ad_delivery_start_time',
    'ad_delivery_stop_time',
    'ad_creative_bodies',
    'ad_creative_link_titles',
    'ad_creative_link_descriptions',
    'ad_creative_link_captions',
    'publisher_platforms',
  ].join(',');
}

function pickFirstText(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => cleanString(entry)).find(Boolean) || '';
  }

  return cleanString(value);
}

function buildPublicLibraryUrl(adId) {
  const normalizedId = cleanString(adId);
  if (!normalizedId) return '';
  return `https://www.facebook.com/ads/library/?id=${encodeURIComponent(normalizedId)}`;
}

function buildScaleSignal(ad, descriptor) {
  const platforms = Array.isArray(ad.publisher_platforms)
    ? ad.publisher_platforms.map((platform) => cleanString(platform)).filter(Boolean)
    : [];

  const parts = ['Coletado via Meta Ads Archive API'];
  if (platforms.length) parts.push(`Plataformas: ${platforms.join(', ')}`);
  if (descriptor.pageId) parts.push(`Página ${descriptor.pageId}`);
  return parts.join(' · ');
}

function mapArchivedAdToScaledOffer(ad, descriptor) {
  const offerTitle = pickFirstText(ad.ad_creative_link_titles) || `Anúncio ${cleanString(ad.id) || descriptor.adId || 'Meta'}`;
  const copyBody = pickFirstText(ad.ad_creative_bodies);
  const copyDescription = pickFirstText(ad.ad_creative_link_descriptions);
  const copyCaption = pickFirstText(ad.ad_creative_link_captions);

  return {
    id: cleanString(ad.id) || makeId('scaled-collected'),
    niche: 'Meta Ads',
    offerTitle,
    brandName: cleanString(ad.page_name) || `Página ${descriptor.pageId || cleanString(ad.page_id) || 'Meta'}`,
    copyText: copyBody || copyDescription || copyCaption,
    creativeType: 'Biblioteca Meta',
    creativeUrl: '',
    thumbnailUrl: '',
    libraryUrl: buildPublicLibraryUrl(ad.id) || normalizeUrl(ad.ad_snapshot_url),
    scaleSignal: buildScaleSignal(ad, descriptor),
    adsCount: 200,
    source: 'meta-ads-archive-api',
  };
}

function validateCollectedScaledOffer(item) {
  const errors = [];
  if (!item.offerTitle) errors.push('Sem título legível');
  if (!item.brandName) errors.push('Sem marca/página identificável');
  if (!item.libraryUrl) errors.push('Sem URL específica da biblioteca');
  return errors;
}

async function fetchAdsArchivePage(descriptor, env, fetchImpl) {
  const config = assertMetaCollectorConfig(env);
  if (!descriptor.pageId) {
    throw new Error('A seed precisa conter view_all_page_id ou page_id para consulta oficial da biblioteca.');
  }

  const params = new URLSearchParams({
    access_token: config.token,
    ad_reached_countries: JSON.stringify(descriptor.reachedCountries),
    search_page_ids: JSON.stringify([descriptor.pageId]),
    ad_active_status: descriptor.activeStatus,
    ad_type: descriptor.adType,
    fields: buildAdsArchiveFields(),
    limit: String(config.limit),
  });

  const url = `https://graph.facebook.com/${config.version}/ads_archive?${params.toString()}`;
  const response = await fetchImpl(url, {
    timeout: 15000,
    headers: { Accept: 'application/json' },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = cleanString(payload?.error?.message) || `Falha ao consultar Meta Ads Archive API (${response.status})`;
    throw new Error(reason);
  }

  const data = Array.isArray(payload?.data) ? payload.data : [];
  return data;
}

async function collectScaledOffersFromWeb(env, fetchImpl, overrideSeeds = []) {
  const seeds = resolveCollectorSeeds(env, overrideSeeds);
  if (!seeds.length) {
    throw new Error('Configure SCALED_LIBRARY_SEED_URLS para rodar a coleta automática.');
  }

  const collected = [];
  const errors = [];

  for (const seedUrl of seeds) {
    try {
      const descriptor = extractCollectorSeedDescriptor(seedUrl, env);
      const archivedAds = await fetchAdsArchivePage(descriptor, env, fetchImpl);

      const items = archivedAds
        .map((ad) => mapArchivedAdToScaledOffer(ad, descriptor))
        .filter((item) => {
          const validationErrors = validateCollectedScaledOffer(item);
          if (!validationErrors.length) return true;
          errors.push({ seedUrl, reason: validationErrors.join('. '), adId: item.id || '' });
          return false;
        });

      collected.push(...items);
    } catch (error) {
      errors.push({ seedUrl, reason: error.message });
    }
  }

  return {
    seeds,
    items: collected,
    errors,
    processedCount: seeds.length,
    collectedCount: collected.length,
    failedCount: errors.filter((entry) => !entry.adId).length,
  };
}

function normalizeCollectorSeedsInput(value) {
  if (!Array.isArray(value)) return [];
  return value.map((seed) => cleanString(seed)).filter(Boolean);
}

function isCollectorResultEmpty(result) {
  return result.collectedCount === 0;
}

function buildCollectedImportSummary(importResult, collectResult) {
  return {
    importedCount: importResult.importedCount,
    skippedCount: importResult.skippedCount,
    errorCount: importResult.errorCount,
    processedCount: collectResult.processedCount,
    collectedCount: collectResult.collectedCount,
    failedCount: collectResult.failedCount,
    errors: collectResult.errors,
    imported: importResult.imported,
    skipped: importResult.skipped,
    seeds: collectResult.seeds,
  };
}

function createCollectorStatusPayload(result) {
  return {
    success: result.collectedCount > 0,
    message: result.collectedCount
      ? `Coleta concluída: ${result.collectedCount} anúncio(s) extraído(s) de ${result.processedCount} seed(s).`
      : 'Coleta executada, mas nenhum anúncio utilizável foi extraído das seeds.',
    processedCount: result.processedCount,
    collectedCount: result.collectedCount,
    failedCount: result.failedCount,
    errors: result.errors,
    seeds: result.seeds,
  };
}

function createCollectedImportPayload(importResult, collectResult) {
  return {
    message: importResult.errorCount || importResult.skippedCount || collectResult.failedCount
      ? 'Coleta concluída com avisos'
      : 'Coleta concluída com sucesso',
    success: importResult.importedCount > 0,
    partial: importResult.importedCount > 0 && (importResult.skippedCount > 0 || importResult.errorCount > 0 || collectResult.failedCount > 0),
    ...buildCollectedImportSummary(importResult, collectResult),
  };
}

function createCollectedImportErrorPayload(collectResult) {
  return {
    error: 'Nenhum anúncio utilizável foi coletado das seeds configuradas',
    partial: false,
    processedCount: collectResult.processedCount,
    collectedCount: collectResult.collectedCount,
    failedCount: collectResult.failedCount,
    errors: collectResult.errors,
    seeds: collectResult.seeds,
  };
}

function createCollectedImportConflictPayload(importResult, collectResult) {
  return {
    error: 'A coleta encontrou anúncios, mas nenhum item novo foi importado para a biblioteca',
    partial: false,
    ...buildCollectedImportSummary(importResult, collectResult),
  };
}

async function fetchScaledOffersFromExternalSource(env, fetchImpl) {
  const externalUrl = cleanEnv(env.EXTERNAL_ADS_API_URL);
  const externalKey = cleanEnv(env.EXTERNAL_ADS_API_KEY);

  if (!externalUrl) {
    return {
      configured: false,
      mode: 'demo',
      results: createScaledOfferMockResults('BRASIL'),
      message: 'Fonte externa não configurada. Exibindo demonstração da biblioteca.',
    };
  }

  const url = new URL(externalUrl);
  const headers = { Accept: 'application/json' };
  if (externalKey) headers.Authorization = `Bearer ${externalKey}`;

  const response = await fetchImpl(url.toString(), { headers, timeout: 12000 });
  if (!response.ok) throw new Error(`Falha ao consultar fonte externa (${response.status})`);

  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : Array.isArray(payload.items) ? payload.items : [];
  return {
    configured: true,
    mode: 'external',
    results: items,
    message: payload.message || 'Biblioteca carregada da fonte externa.',
  };
}

async function fetchScaledOffersFromInternalSource(internalDataFile) {
  const items = await loadCollection(internalDataFile);
  return {
    configured: true,
    mode: 'internal',
    results: items,
    message: 'Biblioteca carregada da base interna.',
  };
}

function resolveFeedMode(env) {
  const explicitMode = ensureSupportedMode(cleanEnv(env.SCALED_OFFERS_SOURCE_MODE).toLowerCase());
  if (explicitMode) return explicitMode;
  return cleanEnv(env.EXTERNAL_ADS_API_URL) ? 'external' : 'internal';
}

function createScaledOffersSourceService({ projectRoot, dataDir, env, fetchImpl }) {
  const internalDataFile = resolveInternalDataFile(projectRoot, dataDir, env);

  return {
    async fetchTopScaledOffers() {
      const mode = resolveFeedMode(env);

      if (mode === 'internal') {
        const payload = await fetchScaledOffersFromInternalSource(internalDataFile);
        const results = finalizeScaledOffersResults(payload.results, 'BRASIL');
        return {
          ...payload,
          results,
          message: createScaledOffersMessage(payload.message, results),
        };
      }

      if (mode === 'external') {
        const payload = await fetchScaledOffersFromExternalSource(env, fetchImpl);
        const results = finalizeScaledOffersResults(payload.results, 'BRASIL');
        return {
          ...payload,
          results,
          message: createScaledOffersMessage(payload.message, results),
        };
      }

      const results = finalizeScaledOffersResults(createScaledOfferMockResults('BRASIL'), 'BRASIL');
      return {
        configured: false,
        mode: 'demo',
        results,
        message: createScaledOffersMessage('Fonte externa não configurada. Exibindo demonstração temporária da biblioteca.', results),
      };
    },

    isConfigured() {
      const mode = resolveFeedMode(env);
      if (mode === 'internal') return true;
      if (mode === 'external') return Boolean(cleanEnv(env.EXTERNAL_ADS_API_URL));
      return false;
    },

    getMode() {
      return resolveFeedMode(env);
    },

    getInternalDataFile() {
      return internalDataFile;
    },
  };
}

module.exports = {
  createScaledOffersSourceService,
  collectScaledOffersFromWeb,
  normalizeCollectorSeedsInput,
  isCollectorResultEmpty,
  createCollectorStatusPayload,
  createCollectedImportPayload,
  createCollectedImportErrorPayload,
  createCollectedImportConflictPayload,
};
