const API_BASE = window.location.origin;

// Safe DOM helpers — prevent crash when element is missing
function $(id) { return document.getElementById(id); }
function setText(id, text) { const el = $(id); if (el) el.textContent = text; }
function safeOn(id, event, handler) { const el = $(id); if (el) el.addEventListener(event, handler); }

const META_IMPORT_EXAMPLE = `[
  {
    "adTitle": "Creatina Clean Performance",
    "brandName": "VitalForge",
    "niche": "Suplementos",
    "promise": "Ganhar força e consistência sem complicar a suplementação",
    "adLibraryUrl": "https://www.facebook.com/ads/library/"
  }
]`;

const SCALED_LIBRARY_IMPORT_EXAMPLE = `[
  {
    "offerTitle": "Creatina Clean Performance",
    "brandName": "VitalForge",
    "niche": "Suplementos",
    "copyText": "Criativo centrado em força, consistência e rotina simples de adesão.",
    "creativeType": "Vídeo",
    "creativeUrl": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "libraryUrl": "https://www.facebook.com/ads/library/?id=706455939160239",
    "scaleSignal": "Anúncio com forte recorrência visual.",
    "adsCount": 334
  }
]`;

const LIBRARY_SOURCE_LABEL = 'Biblioteca Meta';

function defaultScaledImportState() {
  return {
    importedCount: 0,
    skippedCount: 0,
    errorCount: 0,
    message: 'Nenhuma importação executada nesta sessão.',
  };
}

function defaultScaledUiState() {
  return {
    query: LIBRARY_SOURCE_LABEL,
    message: 'Carregando a biblioteca independente de anúncios Meta.',
  };
}

const initialScaledUi = defaultScaledUiState();

function scaledCardButtonLabel(mode) {
  return mode === 'external' ? 'Abrir anúncio' : 'Abrir na biblioteca';
}

function scaledHeroStatus(mode, configured) {
  if (mode === 'external') return 'Fonte externa ativa';
  if (mode === 'internal') return 'Biblioteca local ativa';
  if (configured) return 'Conector pronto';
  return 'Modo demonstração';
}

function scaledBadgeText(mode, configured) {
  if (mode === 'external') return 'Fonte externa';
  if (mode === 'internal') return 'Biblioteca local';
  if (configured) return 'Conector configurado';
  return 'Demonstração';
}

function scaledEmptyMessage(mode) {
  return mode === 'internal'
    ? 'Nenhum anúncio foi encontrado na biblioteca independente agora.'
    : 'Nenhum anúncio disponível foi encontrado na biblioteca.';
}

function scaledLoadingMessage() {
  return 'Carregando biblioteca de anúncios Meta...';
}

function scaledRefreshSuccess() {
  return 'Biblioteca Meta atualizada.';
}

function scaledDefaultMessage(responseMessage) {
  return responseMessage || 'Biblioteca carregada.';
}

function scaledRefreshButtonText() {
  return 'Atualizar biblioteca';
}

function scaledRefreshingButtonText() {
  return 'Atualizando...';
}

function scaledStatusWhileLoading() {
  return 'Atualizando';
}

function scaledStatusInitial() {
  return 'Carregando biblioteca';
}

function scaledResultsHeadingSource() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledRefreshPendingMessage() {
  return 'Consultando a biblioteca independente de anúncios Meta...';
}

function scaledImportSuccessMessage(response) {
  return response.message || 'Importação da biblioteca concluída.';
}

function scaledImportErrorMessage(payload, error) {
  return payload.error || error.message;
}

function scaledImportResultMessage(response) {
  return `${scaledImportSuccessMessage(response)} Importados: ${response.importedCount || 0}, ignorados: ${response.skippedCount || 0}, erros: ${response.errorCount || 0}.`;
}

function scaledImportEmptyMessage() {
  return 'Cole um JSON antes de importar.';
}

function scaledImportInvalidJsonMessage() {
  return 'JSON inválido. Revise a sintaxe e tente novamente.';
}

function scaledImportProcessingMessage() {
  return 'Processando biblioteca...';
}

function scaledImportButtonBusyText() {
  return 'Importando...';
}

function scaledImportButtonIdleText() {
  return 'Importar biblioteca';
}

function scaledImportExampleLoadedMessage() {
  return 'Exemplo da biblioteca carregado. Você pode editar antes de importar.';
}

function scaledImportInitialMessage() {
  return 'Cole seu JSON e rode a importação para abastecer a biblioteca independente.';
}

function scaledImportSourceDescription() {
  return 'Biblioteca independente do topo: importa direto para a base do módulo inferior.';
}

function scaledLibraryHelperText() {
  return 'A biblioteca de baixo não depende do cadastro manual do topo.';
}

function scaledModuleTitle() {
  return 'Biblioteca de anúncios Meta';
}

function scaledModuleSubtitle() {
  return 'Veja uma biblioteca própria de anúncios Meta, independente do cadastro manual do topo.';
}

function scaledModuleDescription() {
  return 'Este módulo lê uma base própria da biblioteca, com importação separada e carregamento automático ao abrir a página.';
}

function scaledSectionTitle() {
  return 'Biblioteca do momento';
}

function scaledCommandTitle() {
  return 'Operações da biblioteca';
}

function scaledCommandKicker() {
  return 'Atualização da biblioteca';
}

function scaledSourceLabel() {
  return 'Biblioteca';
}

function scaledHeroCountLabel() {
  return 'Anúncios disponíveis';
}

function scaledButtonOpenImportText() {
  return 'Importar biblioteca';
}

function scaledImportSummaryIdle() {
  return 'Nenhuma importação executada nesta sessão.';
}

function scaledCounterLabel(count) {
  return `${count} anúncio(s)`;
}

function scaledResultsEmptyInitial() {
  return 'Carregando biblioteca...';
}

function scaledFormTitle() {
  return 'Biblioteca Meta';
}

function scaledImportModalTitle() {
  return 'Subir anúncios na biblioteca inferior';
}

function scaledImportPreviewTitle() {
  return 'Formato recomendado';
}

function scaledImportInputTitle() {
  return 'JSON da biblioteca';
}

function scaledImportInputHelp() {
  return 'Campos mínimos: offerTitle, brandName, libraryUrl e adsCount >= 200.';
}

function scaledImportResultIdle() {
  return 'Cole seu JSON e rode a importação. A biblioteca inferior é separada do topo.';
}

function scaledImportUseExampleText() {
  return 'Usar exemplo';
}

function scaledImportCancelText() {
  return 'Cancelar';
}

function scaledImportOpenInlineText() {
  return 'Abrir importador';
}

function scaledImportSectionLabel() {
  return 'Importação própria';
}

function scaledImportSectionTitle() {
  return 'Abasteça a biblioteca inferior';
}

function scaledImportSummaryTitle() {
  return 'Resultado da última importação';
}

function scaledImportSummaryLabel() {
  return 'Resumo operacional';
}

function scaledImportPromoText() {
  return 'Use este importador para popular a biblioteca de baixo sem depender do radar/cadastro manual do topo.';
}

function scaledImportStatsImportedLabel() {
  return 'Importados';
}

function scaledImportStatsSkippedLabel() {
  return 'Ignorados';
}

function scaledImportStatsErrorLabel() {
  return 'Erros';
}

function scaledHelperLoadMessage() {
  return 'Carregando a biblioteca independente de anúncios Meta.';
}

function scaledResultsKicker() {
  return 'Leitura prática';
}

function scaledSectionKicker() {
  return 'Biblioteca independente';
}

function scaledFeedStatusPill(mode, configured) {
  return scaledBadgeText(mode, configured);
}

function scaledHeroSourceText() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledRefreshMessageDefault() {
  return 'Biblioteca carregada da base interna.';
}

function scaledImportToastSuccess(response) {
  return scaledImportSuccessMessage(response);
}

function scaledImportToastError(payload, error) {
  return scaledImportErrorMessage(payload, error);
}

function scaledLoadToastSuccess() {
  return scaledRefreshSuccess();
}

function scaledInitialStateMessage() {
  return initialScaledUi.message;
}

function scaledInitialStateQuery() {
  return initialScaledUi.query;
}

function scaledImportDefaultState() {
  return defaultScaledImportState();
}

function scaledCreateStatsMessage(last) {
  return last?.message || scaledImportSummaryIdle();
}

function scaledLibraryHeading() {
  return 'Biblioteca Meta';
}

function scaledFeedLoadingEmpty() {
  return 'Carregando biblioteca de anúncios Meta...';
}

function scaledEmptyAfterFilter(mode) {
  return scaledEmptyMessage(mode);
}

function scaledOpenButtonText(mode) {
  return scaledCardButtonLabel(mode);
}

function scaledStatusText(mode, configured) {
  return scaledHeroStatus(mode, configured);
}

function scaledBadge(mode, configured) {
  return scaledFeedStatusPill(mode, configured);
}

function scaledModeSource() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledRefreshLoadingMessage() {
  return scaledRefreshPendingMessage();
}

function scaledUiMessage(responseMessage) {
  return scaledDefaultMessage(responseMessage);
}

function scaledImportIdleState() {
  return scaledImportDefaultState();
}

function scaledStatusLabelInitial() {
  return scaledStatusInitial();
}

function scaledStatusLabelLoading() {
  return scaledStatusWhileLoading();
}

function scaledButtonLabelIdle() {
  return scaledRefreshButtonText();
}

function scaledButtonLabelBusy() {
  return scaledRefreshingButtonText();
}

function scaledImportModalResultDefault() {
  return scaledImportResultIdle();
}

function scaledImportPromptDefault() {
  return scaledImportInitialMessage();
}

function scaledImportPromptLoaded() {
  return scaledImportExampleLoadedMessage();
}

function scaledImportPromptProcessing() {
  return scaledImportProcessingMessage();
}

function scaledImportPromptEmpty() {
  return scaledImportEmptyMessage();
}

function scaledImportPromptInvalid() {
  return scaledImportInvalidJsonMessage();
}

function scaledImportButtonTextBusy() {
  return scaledImportButtonBusyText();
}

function scaledImportButtonTextIdle() {
  return scaledImportButtonIdleText();
}

function scaledImportToastMessage(response) {
  return scaledImportToastSuccess(response);
}

function scaledImportToastFailure(payload, error) {
  return scaledImportToastError(payload, error);
}

function scaledImportResultText(response) {
  return scaledImportResultMessage(response);
}

function scaledImportResultFailure(payload, error) {
  return scaledImportErrorMessage(payload, error);
}

function scaledImportStateFromResponse(response) {
  return {
    importedCount: response.importedCount || 0,
    skippedCount: response.skippedCount || 0,
    errorCount: response.errorCount || 0,
    message: response.message || 'Importação concluída.',
  };
}

function scaledImportStateFromError(payload, error) {
  return {
    importedCount: payload.importedCount || 0,
    skippedCount: payload.skippedCount || 0,
    errorCount: payload.errorCount || 0,
    message: scaledImportErrorMessage(payload, error),
  };
}

function scaledImportPlaceholder() {
  return `[
  {
    "offerTitle": "...",
    "brandName": "...",
    "libraryUrl": "https://...",
    "creativeUrl": "https://...",
    "adsCount": 200
  }
]`;
}

function scaledImportLogInitial() {
  return defaultScaledImportState().message;
}

function scaledLibraryModuleDescription() {
  return scaledModuleDescription();
}

function scaledUiInitialCounter() {
  return '0 anúncios';
}

function scaledSourceHeading() {
  return scaledHeroSourceText();
}

function scaledStatusHeader(mode, configured) {
  return scaledStatusText(mode, configured);
}

function scaledBadgeHeader(mode, configured) {
  return scaledBadge(mode, configured);
}

function scaledModuleMessage() {
  return scaledInitialStateMessage();
}

function scaledQueryLabel() {
  return scaledInitialStateQuery();
}

function scaledLibraryLabel() {
  return scaledLibraryHeading();
}

function scaledLibrarySectionTitle() {
  return scaledSectionTitle();
}

function scaledLibrarySectionKicker() {
  return scaledSectionKicker();
}

function scaledLibraryCommandTitle() {
  return scaledCommandTitle();
}

function scaledLibraryCommandKicker() {
  return scaledCommandKicker();
}

function scaledLibraryImportTitle() {
  return scaledImportModalTitle();
}

function scaledLibraryImportResultIdle() {
  return scaledImportModalResultDefault();
}

function scaledLibraryImportExample() {
  return SCALED_LIBRARY_IMPORT_EXAMPLE;
}

function scaledLibraryImportStatsDefault() {
  return scaledImportDefaultState();
}

function scaledLibraryCountLabel(count) {
  return scaledCounterLabel(count);
}

function scaledLibraryOpenButton(mode) {
  return scaledOpenButtonText(mode);
}

function scaledLibraryEmpty(mode) {
  return scaledEmptyAfterFilter(mode);
}

function scaledLibraryLoadingText() {
  return scaledFeedLoadingEmpty();
}

function scaledLibraryRefreshPending() {
  return scaledRefreshLoadingMessage();
}

function scaledLibraryRefreshSuccess() {
  return scaledLoadToastSuccess();
}

function scaledLibraryMessage(responseMessage) {
  return scaledUiMessage(responseMessage);
}

function scaledLibraryStateInit() {
  return defaultScaledUiState();
}

function scaledLibraryImportStateInit() {
  return defaultScaledImportState();
}

function scaledLibraryModalPlaceholder() {
  return scaledImportPlaceholder();
}

function scaledLibraryHelper() {
  return scaledLibraryHelperText();
}

function scaledLibraryPromo() {
  return scaledImportPromoText();
}

function scaledLibraryImportSummary() {
  return scaledImportSummaryTitle();
}

function scaledLibraryImportSummaryLabel() {
  return scaledImportSummaryLabel();
}

function scaledLibraryImportResultState(last) {
  return scaledCreateStatsMessage(last);
}

function scaledLibraryModeSourceLabel() {
  return scaledSourceLabel();
}

function scaledLibraryHeroCountLabel() {
  return scaledHeroCountLabel();
}

function scaledLibraryImportButtonLabel() {
  return scaledButtonOpenImportText();
}

function scaledLibraryModalButtonUseExample() {
  return scaledImportUseExampleText();
}

function scaledLibraryModalButtonCancel() {
  return scaledImportCancelText();
}

function scaledLibraryModalButtonImport() {
  return scaledImportButtonTextIdle();
}

function scaledLibraryInlineOpenText() {
  return scaledImportOpenInlineText();
}

function scaledLibraryImportSectionLabelText() {
  return scaledImportSectionLabel();
}

function scaledLibraryImportSectionTitleText() {
  return scaledImportSectionTitle();
}

function scaledLibraryImportInputHelpText() {
  return scaledImportInputHelp();
}

function scaledLibraryImportPreviewTitleText() {
  return scaledImportPreviewTitle();
}

function scaledLibraryImportInputTitleText() {
  return scaledImportInputTitle();
}

function scaledLibraryImportResultInitialText() {
  return scaledImportResultIdle();
}

function scaledLibraryImportStatsImportedText() {
  return scaledImportStatsImportedLabel();
}

function scaledLibraryImportStatsSkippedText() {
  return scaledImportStatsSkippedLabel();
}

function scaledLibraryImportStatsErrorText() {
  return scaledImportStatsErrorLabel();
}

function scaledLibraryImportDescriptionText() {
  return scaledImportSourceDescription();
}

function scaledLibraryTitleText() {
  return scaledModuleTitle();
}

function scaledLibrarySubtitleText() {
  return scaledModuleSubtitle();
}

function scaledLibraryDescriptionText() {
  return scaledModuleDescription();
}

function scaledLibraryResultsTitleText() {
  return scaledSectionTitle();
}

function scaledLibraryResultsKickerText() {
  return scaledResultsKicker();
}

function scaledLibrarySectionKickerText() {
  return scaledSectionKicker();
}

function scaledLibraryCommandKickerText() {
  return scaledCommandKicker();
}

function scaledLibraryCommandTitleText() {
  return scaledCommandTitle();
}

function scaledLibrarySourceText() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledLibraryHeaderText(mode, configured) {
  return scaledHeroStatus(mode, configured);
}

function scaledLibraryBadgeText(mode, configured) {
  return scaledBadgeText(mode, configured);
}

function scaledLibraryRefreshDefaultMessage() {
  return scaledRefreshMessageDefault();
}

function scaledLibraryModalTitleText() {
  return scaledImportModalTitle();
}

function scaledLibraryHelperMessage() {
  return scaledHelperLoadMessage();
}

function scaledLibrarySourceMode() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledLibraryHeaderSourceText() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledLibraryHeroStatusText(mode, configured) {
  return scaledHeroStatus(mode, configured);
}

function scaledLibraryHeroBadgeText(mode, configured) {
  return scaledBadgeText(mode, configured);
}

function scaledLibraryRefreshLabelText() {
  return scaledRefreshButtonText();
}

function scaledLibraryRefreshingLabelText() {
  return scaledRefreshingButtonText();
}

function scaledLibraryInitialLoadingText() {
  return scaledLoadingMessage();
}

function scaledLibraryPendingRefreshText() {
  return scaledRefreshPendingMessage();
}

function scaledLibraryRefreshToastText() {
  return scaledRefreshSuccess();
}

function scaledLibraryDefaultResponseText(responseMessage) {
  return scaledDefaultMessage(responseMessage);
}

function scaledLibraryModeLabel() {
  return LIBRARY_SOURCE_LABEL;
}

function scaledLibraryInitialStatusText() {
  return scaledStatusInitial();
}

function scaledLibraryUpdatingStatusText() {
  return scaledStatusWhileLoading();
}

function scaledLibraryLoadingEmptyText() {
  return scaledFeedLoadingEmpty();
}

function scaledLibraryNoItemsText(mode) {
  return scaledEmptyMessage(mode);
}

function scaledLibraryButtonText(mode) {
  return scaledCardButtonLabel(mode);
}

function scaledLibraryImportMessageDefault() {
  return scaledImportInitialMessage();
}

function scaledLibraryImportMessageLoaded() {
  return scaledImportExampleLoadedMessage();
}

function scaledLibraryImportMessageBusy() {
  return scaledImportProcessingMessage();
}

function scaledLibraryImportMessageEmpty() {
  return scaledImportEmptyMessage();
}

function scaledLibraryImportMessageInvalid() {
  return scaledImportInvalidJsonMessage();
}

function scaledLibraryImportBusyLabel() {
  return scaledImportButtonBusyText();
}

function scaledLibraryImportIdleLabel() {
  return scaledImportButtonIdleText();
}

function scaledLibraryImportResponseState(response) {
  return scaledImportStateFromResponse(response);
}

function scaledLibraryImportErrorState(payload, error) {
  return scaledImportStateFromError(payload, error);
}

function scaledLibraryImportResponseMessage(response) {
  return scaledImportResultMessage(response);
}

function scaledLibraryImportErrorMessage(payload, error) {
  return scaledImportErrorMessage(payload, error);
}

const state = {
  offers: [],
  summary: null,
  rankings: null,
  filters: {
    search: '',
    niche: '',
    platform: '',
    micropersona: '',
    tag: '',
    minScore: '',
  },
  editingId: null,
  selectedOfferId: null,
  metaAds: [],
  metaSummary: null,
  metaRankings: null,
  metaFilters: {
    search: '',
    niche: '',
    brand: '',
    creativeType: '',
    tag: '',
    minScore: '',
  },
  editingMetaId: null,
  selectedMetaAdId: null,
  lastMetaImport: null,
  lastScaledImport: defaultScaledImportState(),
  scaledOffers: [],
  scaledOffersQuery: scaledInitialStateQuery(),
  scaledOffersMode: '',
  scaledOffersConnectorConfigured: false,
  scaledOffersMessage: scaledInitialStateMessage(),
};

const scoreWeights = {
  adRepetition: 18,
  messageClarity: 16,
  mechanismSpecificity: 18,
  easePerception: 12,
  upsellPresence: 10,
  micropersonaFit: 12,
  funnelStrength: 14,
};

const metaScoreWeights = {
  recurrenceStrength: 17,
  creativeVolume: 14,
  hookClarity: 13,
  mechanismSpecificity: 14,
  offerClarity: 13,
  landingPageStrength: 10,
  ctaStrength: 9,
  micropersonaFit: 10,
};

const scoreFields = Object.keys(scoreWeights);
const metaScoreFields = Object.keys(metaScoreWeights);

function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function notify(message, type = 'info') {
  const container = document.getElementById('notifications');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 180);
  }, 3200);
}

async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data.error || data || `HTTP ${response.status}`);
    error.payload = data;
    throw error;
  }

  return data;
}

function computeWeightedScore(signals, weights) {
  const fields = Object.keys(weights);
  const total = fields.reduce((sum, field) => {
    const value = Number(signals[field]) || 0;
    return sum + (Math.max(0, Math.min(5, value)) / 5) * weights[field];
  }, 0);

  return Math.round(total);
}

function computeScore(signals) {
  return computeWeightedScore(signals, scoreWeights);
}

function computeMetaScore(signals) {
  return computeWeightedScore(signals, metaScoreWeights);
}

function scoreClass(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  return 'low';
}

function setStatus(text, connected = true) {
  const badge = document.getElementById('connection-status');
  badge.textContent = text;
  badge.style.color = connected ? 'var(--text)' : 'var(--danger)';
}

async function loadStatus() {
  try {
    const status = await apiFetch('/api/status');
    state.scaledOffersConnectorConfigured = Boolean(status.scaledOffersConnectorConfigured);
    setStatus(`Local ativo · ${status.offersCount} ofertas · ${status.metaAdsCount || 0} anúncios Meta`, true);
  } catch (error) {
    setStatus(`Offline · ${error.message}`, false);
  }
}

async function loadOffers() {
  const response = await apiFetch('/api/offers');
  state.offers = response.data || [];
}

async function loadSummary() {
  state.summary = await apiFetch('/api/dashboard/summary');
}

async function loadRankings() {
  state.rankings = await apiFetch('/api/dashboard/rankings');
}

async function loadMetaAds() {
  const response = await apiFetch('/api/meta-ads');
  state.metaAds = response.data || [];
}

async function loadMetaSummary() {
  state.metaSummary = await apiFetch('/api/meta-ads/dashboard/summary');
}

async function loadMetaRankings() {
  state.metaRankings = await apiFetch('/api/meta-ads/dashboard/rankings');
}

async function loadTopScaledOffers() {
  const response = await apiFetch('/api/scaled-offers/top');
  state.scaledOffers = response.data || [];
  state.scaledOffersQuery = scaledLibrarySourceMode();
  state.scaledOffersMode = response.mode || '';
  state.scaledOffersConnectorConfigured = Boolean(response.connectorConfigured);
  state.scaledOffersMessage = scaledLibraryDefaultResponseText(response.message);
}

function fillSelect(selectId, items) {
  const select = document.getElementById(selectId);
  const current = select.value;
  select.innerHTML = '<option value="">Todos</option>';

  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });

  if (items.includes(current)) {
    select.value = current;
  }
}

function refreshFilterOptions() {
  const niches = [...new Set(state.offers.map((offer) => offer.niche).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const platforms = [...new Set(state.offers.map((offer) => offer.sourcePlatform).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const micropersonas = [...new Set(state.offers.map((offer) => offer.micropersona).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const tags = [...new Set(state.offers.flatMap((offer) => offer.tags || []))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  fillSelect('filter-niche', niches);
  fillSelect('filter-platform', platforms);
  fillSelect('filter-micropersona', micropersonas);
  fillSelect('filter-tag', tags);
}

function refreshMetaFilterOptions() {
  const niches = [...new Set(state.metaAds.map((ad) => ad.niche).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const brands = [...new Set(state.metaAds.map((ad) => ad.brandName).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const creativeTypes = [...new Set(state.metaAds.map((ad) => ad.creativeType).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const tags = [...new Set(state.metaAds.flatMap((ad) => ad.tags || []))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  fillSelect('meta-filter-niche', niches);
  fillSelect('meta-filter-brand', brands);
  fillSelect('meta-filter-creative-type', creativeTypes);
  fillSelect('meta-filter-tag', tags);
}

function getFilteredOffers() {
  return state.offers.filter((offer) => {
    const haystack = [offer.name, offer.promise, offer.mechanism, offer.micropersona, offer.niche, offer.notes]
      .join(' ')
      .toLowerCase();

    if (state.filters.search && !haystack.includes(state.filters.search.toLowerCase())) return false;
    if (state.filters.niche && offer.niche !== state.filters.niche) return false;
    if (state.filters.platform && offer.sourcePlatform !== state.filters.platform) return false;
    if (state.filters.micropersona && offer.micropersona !== state.filters.micropersona) return false;
    if (state.filters.tag && !(offer.tags || []).includes(state.filters.tag)) return false;
    if (state.filters.minScore && (offer.score || 0) < Number(state.filters.minScore)) return false;
    return true;
  });
}

function getFilteredMetaAds() {
  return state.metaAds.filter((ad) => {
    const haystack = [ad.adTitle, ad.brandName, ad.promise, ad.copyHook, ad.mechanism, ad.niche, ad.notes]
      .join(' ')
      .toLowerCase();

    if (state.metaFilters.search && !haystack.includes(state.metaFilters.search.toLowerCase())) return false;
    if (state.metaFilters.niche && ad.niche !== state.metaFilters.niche) return false;
    if (state.metaFilters.brand && ad.brandName !== state.metaFilters.brand) return false;
    if (state.metaFilters.creativeType && ad.creativeType !== state.metaFilters.creativeType) return false;
    if (state.metaFilters.tag && !(ad.tags || []).includes(state.metaFilters.tag)) return false;
    if (state.metaFilters.minScore && (ad.metaScore || 0) < Number(state.metaFilters.minScore)) return false;
    return true;
  });
}

function renderSummary() {
  const summary = state.summary || {
    totalOffers: 0,
    averageScore: 0,
    highestScore: 0,
    averageEntryPrice: 0,
    topPlatform: null,
  };

  setText('total-offers', summary.totalOffers || 0);
  setText('average-score', summary.averageScore || 0);
  setText('highest-score', summary.highestScore || 0);
  setText('average-entry-price', formatCurrency(summary.averageEntryPrice || 0));

  setText('hero-total-offers', summary.totalOffers || 0);
  setText('hero-average-score', summary.averageScore || 0);
  setText('hero-top-platform', summary.topPlatform?.label || 'Radar vazio');
}

function renderMetaSummary() {
  const summary = state.metaSummary || {
    totalAds: 0,
    averageMetaScore: 0,
    highestMetaScore: 0,
    averageCreativeCount: 0,
    topBrand: null,
  };

  setText('meta-total-ads', summary.totalAds || 0);
  setText('meta-average-score', summary.averageMetaScore || 0);
  setText('meta-highest-score', summary.highestMetaScore || 0);
  setText('meta-average-creative-count', summary.averageCreativeCount || 0);

  setText('meta-hero-total-ads', summary.totalAds || 0);
  setText('meta-hero-average-score', summary.averageMetaScore || 0);
  setText('meta-hero-top-brand', summary.topBrand?.label || 'Radar vazio');
}

function renderMetaImportStats() {
  const last = state.lastMetaImport;
  setText('meta-imported-count', last?.importedCount || 0);
  setText('meta-skipped-count', last?.skippedCount || 0);
  setText('meta-error-count', last?.errorCount || 0);
  setText('meta-import-log', last?.message || 'Nenhuma importação em lote executada nesta sessão.');
}

function renderScoreBands(containerId, bands) {
  const items = bands || [];
  const max = Math.max(1, ...items.map((item) => item.count || 0));
  const container = document.getElementById(containerId);

  container.innerHTML = items.map((item) => {
    const width = ((item.count || 0) / max) * 100;
    return `
      <div class="score-band">
        <div class="score-band-head">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${item.count} item(ns)</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${width}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRankingList(containerId, items, emptyLabel) {
  const container = document.getElementById(containerId);
  if (!items?.length) {
    container.innerHTML = `<p class="muted-text">${emptyLabel}</p>`;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <div class="ranking-item">
      <div>
        <small>${String(index + 1).padStart(2, '0')}</small>
        <strong>${escapeHtml(item.label)}</strong>
      </div>
      <span>${item.count}</span>
    </div>
  `).join('');
}

function renderTagCloud(containerId, items, emptyLabel) {
  const container = document.getElementById(containerId);
  if (!items?.length) {
    container.innerHTML = `<p class="muted-text">${emptyLabel}</p>`;
    return;
  }

  container.innerHTML = items.map((item) => `<span class="tag-chip">${escapeHtml(item.label)} · ${item.count}</span>`).join('');
}

function renderRankings() {
  renderScoreBands('score-bands', state.rankings?.scoreBands || []);
  renderRankingList('ranking-mechanisms', state.rankings?.mechanisms, 'Nenhum mecanismo mapeado ainda.');
  renderRankingList('ranking-micropersonas', state.rankings?.micropersonas, 'Nenhuma micropersona mapeada ainda.');
  renderRankingList('ranking-platforms', state.rankings?.platforms, 'Nenhuma plataforma mapeada ainda.');
  renderTagCloud('ranking-tags', state.rankings?.tags, 'Sem tags por enquanto.');
}

function renderMetaRankings() {
  renderScoreBands('meta-score-bands', state.metaRankings?.scoreBands || []);
  renderRankingList('meta-ranking-brands', state.metaRankings?.brands, 'Nenhuma marca mapeada ainda.');
  renderRankingList('meta-ranking-niches', state.metaRankings?.niches, 'Nenhum nicho mapeado ainda.');
  renderRankingList('meta-ranking-creative-types', state.metaRankings?.creativeTypes, 'Nenhum formato mapeado ainda.');
  renderTagCloud('meta-ranking-tags', state.metaRankings?.tags, 'Sem tags Meta por enquanto.');
}

function renderOffers() {
  const offers = getFilteredOffers();
  const tbody = $('offers-body');
  setText('offers-counter', `${offers.length} oferta(s)`);

  if (!tbody) return;
  if (!offers.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">Nenhuma oferta corresponde aos filtros atuais.</td></tr>';
    return;
  }

  tbody.innerHTML = offers.map((offer) => {
    const tags = (offer.tags || []).slice(0, 3).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('');
    return `
      <tr>
        <td>
          <div class="offer-name">
            <button type="button" data-action="detail" data-id="${offer.id}">${escapeHtml(offer.name)}</button>
            <span class="detail-meta">${escapeHtml(offer.promise)}</span>
            <div class="inline-tags">${tags}</div>
          </div>
        </td>
        <td>${escapeHtml(offer.mechanism || '—')}</td>
        <td>${escapeHtml(offer.micropersona || '—')}</td>
        <td><span class="platform-chip">${escapeHtml(offer.sourcePlatform || 'Manual')}</span></td>
        <td>${formatCurrency(offer.entryPrice)}</td>
        <td><span class="score-chip ${scoreClass(offer.score || 0)}">${offer.score || 0}</span></td>
        <td>
          <div class="table-actions">
            <button type="button" data-action="edit" data-id="${offer.id}">Editar</button>
            <button type="button" data-action="detail" data-id="${offer.id}">Detalhe</button>
          </div>
        </td>
        <td>
          <button type="button" class="funnelby-export-btn" data-action="funnelby" data-id="${offer.id}" title="Enviar para Funnelby">🚀 Funnelby</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderMetaAds() {
  const metaAds = getFilteredMetaAds();
  const tbody = $('meta-ads-body');
  setText('meta-ads-counter', `${metaAds.length} anúncio(s)`);

  if (!tbody) return;
  if (!metaAds.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">Nenhum anúncio Meta corresponde aos filtros atuais.</td></tr>';
    return;
  }

  tbody.innerHTML = metaAds.map((ad) => {
    const tags = (ad.tags || []).slice(0, 2).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('');
    const submeta = [ad.brandName, ad.lastSeenAt ? `visto ${escapeHtml(ad.lastSeenAt)}` : 'sem data'].filter(Boolean).join(' · ');
    return `
      <tr>
        <td>
          <div class="offer-name meta-offer-name">
            <button type="button" data-meta-action="detail" data-id="${ad.id}">${escapeHtml(ad.adTitle)}</button>
            <span class="detail-meta">${escapeHtml(ad.promise)}</span>
            <div class="offer-subline">
              <span class="platform-chip">${escapeHtml(submeta)}</span>
              ${tags}
            </div>
          </div>
        </td>
        <td>${escapeHtml(ad.brandName || '—')}</td>
        <td>${escapeHtml(ad.mechanism || '—')}</td>
        <td><span class="platform-chip meta-creative-chip">${escapeHtml(ad.creativeType || 'Manual')}</span></td>
        <td>${ad.daysRunning ?? '—'}</td>
        <td><span class="score-chip ${scoreClass(ad.metaScore || 0)}">${ad.metaScore || 0}</span></td>
        <td>
          <div class="table-actions">
            <button type="button" data-meta-action="edit" data-id="${ad.id}">Editar</button>
            <button type="button" data-meta-action="detail" data-id="${ad.id}">Detalhe</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderScaledImportStats() {
  const last = state.lastScaledImport || defaultScaledImportState();
  setText('scaled-imported-count', last.importedCount || 0);
  setText('scaled-skipped-count', last.skippedCount || 0);
  setText('scaled-error-count', last.errorCount || 0);
  setText('scaled-import-log', last.message || 'Nenhuma importação executada nesta sessão.');
}

async function runScaledCollector() {
  const button = document.getElementById('btn-run-scaled-collector');
  button.disabled = true;
  button.textContent = 'Coletando...';

  try {
    const response = await apiFetch('/api/scaled-offers/collect', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    state.lastScaledImport = {
      importedCount: response.importedCount || 0,
      skippedCount: response.skippedCount || 0,
      errorCount: response.failedCount || response.errorCount || 0,
      message: response.message || 'Coleta concluída.',
    };

    renderScaledImportStats();
    setScaledImportMessage(response.message || 'Coleta concluída.');
    notify(response.message || 'Coleta concluída.', response.partial ? 'info' : 'success');
    await refreshScaledOffersFeed();
  } catch (error) {
    const payload = error.payload || {};
    state.lastScaledImport = {
      importedCount: payload.importedCount || 0,
      skippedCount: payload.skippedCount || 0,
      errorCount: payload.failedCount || payload.errorCount || 0,
      message: payload.error || error.message,
    };

    renderScaledImportStats();
    setScaledImportMessage(payload.error || error.message);
    notify(payload.error || error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Rodar coleta';
  }
}

function setScaledImportMessage(message) {
  document.getElementById('scaled-import-result').textContent = message;
}

function openScaledImportModal() {
  document.getElementById('scaled-import-modal').classList.add('open');
}

function closeScaledImportModal() {
  document.getElementById('scaled-import-modal').classList.remove('open');
}

function fillScaledImportExample() {
  document.getElementById('scaled-import-input').value = SCALED_LIBRARY_IMPORT_EXAMPLE;
  setScaledImportMessage('Exemplo da biblioteca carregado. Você pode editar antes de importar.');
}

async function importScaledLibraryBatch() {
  const button = document.getElementById('btn-run-scaled-import');
  const input = document.getElementById('scaled-import-input').value.trim();

  if (!input) {
    setScaledImportMessage('Cole um JSON antes de importar.');
    notify('Cole um JSON antes de importar.', 'error');
    return;
  }

  let items;
  try {
    items = JSON.parse(input);
  } catch {
    setScaledImportMessage('JSON inválido. Revise a sintaxe e tente novamente.');
    notify('JSON inválido.', 'error');
    return;
  }

  button.disabled = true;
  button.textContent = 'Importando...';
  setScaledImportMessage('Processando biblioteca...');

  try {
    const response = await apiFetch('/api/scaled-offers/import', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });

    state.lastScaledImport = {
      importedCount: response.importedCount || 0,
      skippedCount: response.skippedCount || 0,
      errorCount: response.errorCount || 0,
      message: response.message || 'Importação da biblioteca concluída.',
    };

    renderScaledImportStats();
    setScaledImportMessage(`${response.message}. Importados: ${response.importedCount || 0}, ignorados: ${response.skippedCount || 0}, erros: ${response.errorCount || 0}.`);
    notify(response.message || 'Importação da biblioteca concluída.', response.partial ? 'info' : 'success');
    closeScaledImportModal();
    await refreshScaledOffersFeed();
  } catch (error) {
    const payload = error.payload || {};
    state.lastScaledImport = {
      importedCount: payload.importedCount || 0,
      skippedCount: payload.skippedCount || 0,
      errorCount: payload.errorCount || 0,
      message: payload.error || error.message,
    };
    renderScaledImportStats();
    setScaledImportMessage(payload.error || error.message);
    notify(payload.error || error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Importar biblioteca';
  }
}

function renderScaledOffers() {
  const items = state.scaledOffers || [];
  const isExternal = state.scaledOffersMode === 'external';
  const heroStatus = isExternal
    ? 'Fonte externa ativa'
    : state.scaledOffersMode === 'internal'
      ? 'Biblioteca local ativa'
      : state.scaledOffersConnectorConfigured
        ? 'Conector pronto'
        : 'Modo demonstração';
  const badgeText = isExternal
    ? 'Fonte externa'
    : state.scaledOffersMode === 'internal'
      ? 'Biblioteca local'
      : state.scaledOffersConnectorConfigured
        ? 'Conector configurado'
        : 'Demonstração';
  const results = document.getElementById('scaled-offers-results');

  setText('scaled-offers-status-text', heroStatus);
  setText('scaled-offers-counter-hero', items.length);
  setText('scaled-offers-query-label', state.scaledOffersQuery || 'Biblioteca Meta');
  setText('scaled-offers-status', badgeText);
  setText('scaled-offers-counter', `${items.length} anúncio(s)`);
  setText('scaled-offers-message', state.scaledOffersMessage);

  if (!items.length) {
    results.innerHTML = '<div class="scaled-empty-state">Nenhum anúncio foi encontrado na biblioteca independente agora.</div>';
    return;
  }

  results.innerHTML = items.map((offer) => {
    const mediaUrl = offer.thumbnailUrl || offer.creativeUrl;
    const adsCount = Number.isFinite(offer.adsCount) ? offer.adsCount : '—';
    const creativeType = offer.creativeType || 'Criativo';
    const brandName = offer.brandName || 'Biblioteca não identificada';
    const scaleSignal = offer.scaleSignal || 'Sem detalhe adicional da fonte.';
    const libraryLink = offer.libraryUrl || 'https://www.facebook.com/ads/library/';

    return `
      <article class="scaled-offer-card">
        <div class="scaled-offer-media ${mediaUrl ? '' : 'is-empty'}">
          ${mediaUrl
            ? `<img src="${escapeHtml(mediaUrl)}" alt="Criativo de ${escapeHtml(offer.offerTitle || state.scaledOffersQuery || 'oferta')}" loading="lazy">`
            : '<div class="scaled-media-placeholder">Criativo indisponível</div>'}
        </div>
        <div class="scaled-offer-body">
          <div class="scaled-offer-topline">
            <span class="platform-chip">${escapeHtml(brandName)}</span>
            <span class="score-chip high">${adsCount}+ ads</span>
          </div>
          <h4>${escapeHtml(offer.offerTitle || 'Oferta sem título')}</h4>
          <p class="scaled-offer-copy">${escapeHtml(offer.copyText || 'A fonte conectada não retornou copy para esta oferta.')}</p>
          <div class="scaled-offer-meta">
            <span class="tag-chip">${escapeHtml(creativeType)}</span>
            <span class="tag-chip">${escapeHtml(scaleSignal)}</span>
          </div>
          <a class="ghost-btn scaled-offer-link" href="${escapeHtml(libraryLink)}" target="_blank" rel="noreferrer">${isExternal ? 'Abrir anúncio' : 'Abrir na biblioteca'}</a>
        </div>
      </article>
    `;
  }).join('');
}

async function refreshScaledOffersFeed() {
  const button = document.getElementById('btn-refresh-scaled-offers');
  button.disabled = true;
  button.textContent = 'Atualizando...';
  state.scaledOffers = [];
  state.scaledOffersQuery = 'Biblioteca Meta';
  state.scaledOffersMessage = 'Consultando a biblioteca independente de anúncios Meta...';
  renderScaledOffersLoading();

  try {
    await loadTopScaledOffers();
    renderScaledOffers();
    notify('Biblioteca Meta atualizada.', 'success');
  } catch (error) {
    state.scaledOffers = [];
    state.scaledOffersQuery = 'Biblioteca Meta';
    state.scaledOffersMessage = error.message;
    renderScaledOffers();
    notify(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Atualizar biblioteca';
  }
}

function bindScaledOffersHandlers() {
  document.getElementById('btn-refresh-scaled-offers').addEventListener('click', refreshScaledOffersFeed);
  document.getElementById('btn-open-scaled-import').addEventListener('click', openScaledImportModal);
  document.getElementById('btn-open-scaled-import-inline').addEventListener('click', openScaledImportModal);
  document.getElementById('btn-run-scaled-collector').addEventListener('click', runScaledCollector);
  document.getElementById('btn-fill-scaled-import-example').addEventListener('click', fillScaledImportExample);
  document.getElementById('btn-run-scaled-import').addEventListener('click', importScaledLibraryBatch);
  document.getElementById('scaled-import-modal-close').addEventListener('click', closeScaledImportModal);
  document.getElementById('btn-cancel-scaled-import').addEventListener('click', closeScaledImportModal);
  document.getElementById('scaled-import-modal').addEventListener('click', (event) => {
    if (event.target.id === 'scaled-import-modal') closeScaledImportModal();
  });
}

function renderScaledOffersLoading() {
  document.getElementById('scaled-offers-status-text').textContent = 'Consultando';
  document.getElementById('scaled-offers-query-label').textContent = state.scaledOffersQuery || 'Biblioteca Meta';
  document.getElementById('scaled-offers-counter-hero').textContent = '...';
  document.getElementById('scaled-offers-status').textContent = 'Atualizando';
  document.getElementById('scaled-offers-counter').textContent = '...';
  document.getElementById('scaled-offers-message').textContent = state.scaledOffersMessage;
  document.getElementById('scaled-offers-results').innerHTML = '<div class="scaled-empty-state">Carregando biblioteca de anúncios Meta...</div>';
}

function loadDashboardCollections() {
  return Promise.all([
    loadStatus(),
    loadOffers(),
    loadSummary(),
    loadRankings(),
    loadMetaAds(),
    loadMetaSummary(),
    loadMetaRankings(),
  ]);
}

function loadDashboardRenders() {
  refreshFilterOptions();
  refreshMetaFilterOptions();
  renderSummary();
  renderMetaSummary();
  renderMetaImportStats();
  renderRankings();
  renderMetaRankings();
  renderOffers();
  renderMetaAds();
  renderScaledOffers();
}

async function bootstrapScaledOffersModule() {
  bindScaledOffersHandlers();
  renderScaledOffersLoading();
  await refreshScaledOffersFeed();
}

function signalLabel(field) {
  return {
    adRepetition: 'Repetição do anúncio',
    messageClarity: 'Clareza da promessa',
    mechanismSpecificity: 'Especificidade do mecanismo',
    easePerception: 'Facilidade percebida',
    upsellPresence: 'Presença de upsell',
    micropersonaFit: 'Fit da micropersona',
    funnelStrength: 'Força do funil',
  }[field] || field;
}

function metaSignalLabel(field) {
  return {
    recurrenceStrength: 'Recorrência / continuidade',
    creativeVolume: 'Volume criativo',
    hookClarity: 'Clareza do hook',
    mechanismSpecificity: 'Especificidade do mecanismo',
    offerClarity: 'Clareza da oferta',
    landingPageStrength: 'Força da landing page',
    ctaStrength: 'Força do CTA',
    micropersonaFit: 'Fit da micropersona',
  }[field] || field;
}

function renderDetail(offer) {
  const detail = document.getElementById('detail-content');
  document.getElementById('detail-name').textContent = offer.name;

  const signalRows = scoreFields.map((field) => `
    <div class="detail-row">
      <span>${escapeHtml(signalLabel(field))}</span>
      <strong>${offer.signals?.[field] ?? 0}/5</strong>
    </div>
  `).join('');

  const links = [
    ['Origem', offer.sourceUrl],
    ['Landing page', offer.landingPageUrl],
    ['Criativo', offer.creativeUrl],
  ].filter(([, url]) => url).map(([label, url]) => `
    <div>
      <strong>${label}</strong>
      <a class="detail-link" href="${url}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>
    </div>
  `).join('');

  detail.innerHTML = `
    <div class="detail-stack">
      <section class="detail-block">
        <h4>Leitura central</h4>
        <div class="detail-grid">
          <div class="detail-row"><span>Nicho</span><strong>${escapeHtml(offer.niche || '—')}</strong></div>
          <div class="detail-row"><span>Micropersona</span><strong>${escapeHtml(offer.micropersona || '—')}</strong></div>
          <div class="detail-row"><span>Mecanismo</span><strong>${escapeHtml(offer.mechanism || '—')}</strong></div>
          <div class="detail-row"><span>Promessa</span><strong>${escapeHtml(offer.promise || '—')}</strong></div>
          <div class="detail-row"><span>Funil</span><strong>${escapeHtml(offer.funnelType || '—')}</strong></div>
          <div class="detail-row"><span>Ticket</span><strong>${formatCurrency(offer.entryPrice)}</strong></div>
          <div class="detail-row"><span>Score final</span><strong>${offer.score || 0}</strong></div>
          <div class="detail-row"><span>Atualizada</span><strong>${formatDate(offer.updatedAt)}</strong></div>
        </div>
      </section>

      <section class="detail-block">
        <h4>Sinais que sustentam a tese</h4>
        <div class="detail-grid">${signalRows}</div>
      </section>

      <section class="detail-block">
        <h4>Links de referência</h4>
        <div class="detail-link-list">${links || '<p>Sem links públicos cadastrados.</p>'}</div>
      </section>

      <section class="detail-block">
        <h4>Notas</h4>
        <p>${escapeHtml(offer.notes || 'Sem notas ainda.')}</p>
      </section>

      <section class="detail-block">
        <h4>Como modelar</h4>
        <p>${escapeHtml(offer.modelNotes || 'Sem observações de modelagem ainda.')}</p>
      </section>
    </div>
  `;
}

function renderMetaDetail(ad) {
  const detail = document.getElementById('meta-detail-content');
  document.getElementById('meta-detail-name').textContent = ad.adTitle;

  const signalRows = metaScoreFields.map((field) => `
    <div class="detail-row">
      <span>${escapeHtml(metaSignalLabel(field))}</span>
      <strong>${ad.signals?.[field] ?? 0}/5</strong>
    </div>
  `).join('');

  const links = [
    ['Ad Library', ad.adLibraryUrl],
    ['Landing page', ad.landingPageUrl],
    ['Criativo', ad.creativeUrl],
  ].filter(([, url]) => url).map(([label, url]) => `
    <div>
      <strong>${label}</strong>
      <a class="detail-link" href="${url}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>
    </div>
  `).join('');

  detail.innerHTML = `
    <div class="detail-stack">
      <section class="detail-block">
        <h4>Leitura central</h4>
        <div class="detail-grid">
          <div class="detail-row"><span>Marca</span><strong>${escapeHtml(ad.brandName || '—')}</strong></div>
          <div class="detail-row"><span>Nicho</span><strong>${escapeHtml(ad.niche || '—')}</strong></div>
          <div class="detail-row"><span>Micropersona</span><strong>${escapeHtml(ad.micropersona || '—')}</strong></div>
          <div class="detail-row"><span>Mecanismo</span><strong>${escapeHtml(ad.mechanism || '—')}</strong></div>
          <div class="detail-row"><span>Promessa</span><strong>${escapeHtml(ad.promise || '—')}</strong></div>
          <div class="detail-row"><span>CTA</span><strong>${escapeHtml(ad.cta || '—')}</strong></div>
          <div class="detail-row"><span>Tipo de criativo</span><strong>${escapeHtml(ad.creativeType || '—')}</strong></div>
          <div class="detail-row"><span>Criativos observados</span><strong>${ad.creativeCount ?? '—'}</strong></div>
          <div class="detail-row"><span>Dias rodando</span><strong>${ad.daysRunning ?? '—'}</strong></div>
          <div class="detail-row"><span>Meta score</span><strong>${ad.metaScore || 0}</strong></div>
          <div class="detail-row"><span>Última leitura</span><strong>${formatDate(ad.lastSeenAt || ad.updatedAt)}</strong></div>
        </div>
      </section>

      <section class="detail-block">
        <h4>Sinais públicos de escala</h4>
        <div class="detail-grid">${signalRows}</div>
      </section>

      <section class="detail-block">
        <h4>Hook e formato</h4>
        <div class="detail-grid">
          <div class="detail-row"><span>Hook</span><strong>${escapeHtml(ad.copyHook || '—')}</strong></div>
          <div class="detail-row"><span>Notas do formato</span><strong>${escapeHtml(ad.adFormatNotes || '—')}</strong></div>
        </div>
      </section>

      <section class="detail-block">
        <h4>Links públicos</h4>
        <div class="detail-link-list">${links || '<p>Sem links públicos cadastrados.</p>'}</div>
      </section>

      <section class="detail-block">
        <h4>Notas</h4>
        <p>${escapeHtml(ad.notes || 'Sem notas ainda.')}</p>
      </section>
    </div>
  `;
}

function openDrawer(offerId) {
  const offer = state.offers.find((item) => item.id === offerId);
  if (!offer) return;
  state.selectedOfferId = offerId;
  renderDetail(offer);
  document.getElementById('offer-drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('open');
}

function closeDrawer() {
  document.getElementById('offer-drawer').classList.remove('open');
  document.getElementById('drawer-backdrop').classList.remove('open');
}

function openMetaDrawer(metaAdId) {
  const ad = state.metaAds.find((item) => item.id === metaAdId);
  if (!ad) return;
  state.selectedMetaAdId = metaAdId;
  renderMetaDetail(ad);
  document.getElementById('meta-drawer').classList.add('open');
  document.getElementById('meta-drawer-backdrop').classList.add('open');
}

function closeMetaDrawer() {
  document.getElementById('meta-drawer').classList.remove('open');
  document.getElementById('meta-drawer-backdrop').classList.remove('open');
}

function openModal(offer = null) {
  state.editingId = offer?.id || null;
  const modal = document.getElementById('offer-modal');
  const form = document.getElementById('offer-form');
  const title = document.getElementById('modal-title');
  const deleteBtn = document.getElementById('btn-delete-offer');

  title.textContent = offer ? 'Editar oferta' : 'Nova oferta';
  deleteBtn.hidden = !offer;
  document.getElementById('enrich-feedback').textContent = 'Use links públicos para guardar referência ou puxar metadados básicos.';
  form.reset();

  form.name.value = offer?.name || '';
  form.niche.value = offer?.niche || '';
  form.micropersona.value = offer?.micropersona || '';
  form.mechanism.value = offer?.mechanism || '';
  form.promise.value = offer?.promise || '';
  form.offerType.value = offer?.offerType || '';
  form.entryPrice.value = Number.isFinite(offer?.entryPrice) ? offer.entryPrice : '';
  form.sourcePlatform.value = offer?.sourcePlatform || '';
  form.sourceUrl.value = offer?.sourceUrl || '';
  form.landingPageUrl.value = offer?.landingPageUrl || '';
  form.creativeUrl.value = offer?.creativeUrl || '';
  form.funnelType.value = offer?.funnelType || '';
  form.tags.value = (offer?.tags || []).join(', ');
  form.notes.value = offer?.notes || '';
  form.modelNotes.value = offer?.modelNotes || '';

  scoreFields.forEach((field) => {
    form.elements[`signal-${field}`].value = offer?.signals?.[field] ?? 0;
  });

  updateScorePreview();
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('offer-modal').classList.remove('open');
}

function openMetaModal(ad = null) {
  state.editingMetaId = ad?.id || null;
  const modal = document.getElementById('meta-modal');
  const form = document.getElementById('meta-form');
  const title = document.getElementById('meta-modal-title');
  const deleteBtn = document.getElementById('btn-delete-meta-ad');

  title.textContent = ad ? 'Editar anúncio Meta' : 'Novo anúncio Meta';
  deleteBtn.hidden = !ad;
  document.getElementById('meta-enrich-feedback').textContent = 'Cole o link da Ad Library e complete manualmente os sinais observáveis.';
  form.reset();

  form.adTitle.value = ad?.adTitle || '';
  form.brandName.value = ad?.brandName || '';
  form.niche.value = ad?.niche || '';
  form.offerType.value = ad?.offerType || '';
  form.micropersona.value = ad?.micropersona || '';
  form.cta.value = ad?.cta || '';
  form.copyHook.value = ad?.copyHook || '';
  form.mechanism.value = ad?.mechanism || '';
  form.promise.value = ad?.promise || '';
  form.adLibraryUrl.value = ad?.adLibraryUrl || '';
  form.landingPageUrl.value = ad?.landingPageUrl || '';
  form.creativeUrl.value = ad?.creativeUrl || '';
  form.creativeType.value = ad?.creativeType || '';
  form.creativeCount.value = Number.isFinite(ad?.creativeCount) ? ad.creativeCount : '';
  form.daysRunning.value = Number.isFinite(ad?.daysRunning) ? ad.daysRunning : '';
  form.firstSeenAt.value = ad?.firstSeenAt || '';
  form.lastSeenAt.value = ad?.lastSeenAt || '';
  form.tags.value = (ad?.tags || []).join(', ');
  form.adFormatNotes.value = ad?.adFormatNotes || '';
  form.notes.value = ad?.notes || '';

  metaScoreFields.forEach((field) => {
    form.elements[`meta-signal-${field}`].value = ad?.signals?.[field] ?? 0;
  });

  updateMetaScorePreview();
  modal.classList.add('open');
}

function closeMetaModal() {
  document.getElementById('meta-modal').classList.remove('open');
}

function openMetaImportModal() {
  document.getElementById('meta-import-modal').classList.add('open');
}

function closeMetaImportModal() {
  document.getElementById('meta-import-modal').classList.remove('open');
}

function setMetaImportMessage(message) {
  document.getElementById('meta-import-result').textContent = message;
}

function fillMetaImportExample() {
  document.getElementById('meta-import-input').value = META_IMPORT_EXAMPLE;
  setMetaImportMessage('Exemplo carregado. Você pode editar antes de importar.');
}

function updateScorePreview() {
  const form = document.getElementById('offer-form');
  const signals = {};
  scoreFields.forEach((field) => {
    const value = Number(form.elements[`signal-${field}`].value || 0);
    signals[field] = value;
    const label = document.querySelector(`[data-signal-value="${field}"]`);
    if (label) label.textContent = value;
  });

  document.getElementById('score-preview-value').textContent = computeScore(signals);
}

function updateMetaScorePreview() {
  const form = document.getElementById('meta-form');
  const signals = {};
  metaScoreFields.forEach((field) => {
    const value = Number(form.elements[`meta-signal-${field}`].value || 0);
    signals[field] = value;
    const label = document.querySelector(`[data-meta-signal-value="${field}"]`);
    if (label) label.textContent = value;
  });

  document.getElementById('meta-score-preview-value').textContent = computeMetaScore(signals);
}

function getFormPayload() {
  const form = document.getElementById('offer-form');
  const signals = scoreFields.reduce((acc, field) => {
    acc[field] = Number(form.elements[`signal-${field}`].value || 0);
    return acc;
  }, {});

  return {
    name: form.name.value,
    niche: form.niche.value,
    micropersona: form.micropersona.value,
    mechanism: form.mechanism.value,
    promise: form.promise.value,
    offerType: form.offerType.value,
    entryPrice: form.entryPrice.value,
    sourcePlatform: form.sourcePlatform.value,
    sourceUrl: form.sourceUrl.value,
    landingPageUrl: form.landingPageUrl.value,
    creativeUrl: form.creativeUrl.value,
    funnelType: form.funnelType.value,
    tags: form.tags.value,
    notes: form.notes.value,
    modelNotes: form.modelNotes.value,
    signals,
  };
}

function getMetaFormPayload() {
  const form = document.getElementById('meta-form');
  const signals = metaScoreFields.reduce((acc, field) => {
    acc[field] = Number(form.elements[`meta-signal-${field}`].value || 0);
    return acc;
  }, {});

  return {
    adTitle: form.adTitle.value,
    brandName: form.brandName.value,
    niche: form.niche.value,
    offerType: form.offerType.value,
    micropersona: form.micropersona.value,
    cta: form.cta.value,
    copyHook: form.copyHook.value,
    mechanism: form.mechanism.value,
    promise: form.promise.value,
    adLibraryUrl: form.adLibraryUrl.value,
    landingPageUrl: form.landingPageUrl.value,
    creativeUrl: form.creativeUrl.value,
    creativeType: form.creativeType.value,
    creativeCount: form.creativeCount.value,
    daysRunning: form.daysRunning.value,
    firstSeenAt: form.firstSeenAt.value,
    lastSeenAt: form.lastSeenAt.value,
    tags: form.tags.value,
    adFormatNotes: form.adFormatNotes.value,
    notes: form.notes.value,
    signals,
  };
}

async function saveOffer(event) {
  event.preventDefault();
  const button = document.getElementById('btn-save-offer');
  button.disabled = true;
  button.textContent = 'Salvando...';

  try {
    const payload = getFormPayload();
    const endpoint = state.editingId ? `/api/offers/${state.editingId}` : '/api/offers';
    const method = state.editingId ? 'PUT' : 'POST';
    await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    notify(state.editingId ? 'Oferta atualizada com sucesso.' : 'Oferta criada com sucesso.', 'success');
    closeModal();
    await refreshDashboard();
  } catch (error) {
    notify(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar oferta';
  }
}

async function saveMetaAd(event) {
  event.preventDefault();
  const button = document.getElementById('btn-save-meta-ad');
  button.disabled = true;
  button.textContent = 'Salvando...';

  try {
    const payload = getMetaFormPayload();
    const endpoint = state.editingMetaId ? `/api/meta-ads/${state.editingMetaId}` : '/api/meta-ads';
    const method = state.editingMetaId ? 'PUT' : 'POST';
    await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    notify(state.editingMetaId ? 'Anúncio Meta atualizado com sucesso.' : 'Anúncio Meta criado com sucesso.', 'success');
    closeMetaModal();
    await refreshDashboard();
  } catch (error) {
    notify(error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Salvar anúncio Meta';
  }
}

async function importMetaBatch() {
  const button = document.getElementById('btn-run-meta-import');
  const input = document.getElementById('meta-import-input').value.trim();

  if (!input) {
    setMetaImportMessage('Cole um JSON antes de importar.');
    notify('Cole um JSON antes de importar.', 'error');
    return;
  }

  let items;
  try {
    items = JSON.parse(input);
  } catch {
    setMetaImportMessage('JSON inválido. Revise a sintaxe e tente novamente.');
    notify('JSON inválido.', 'error');
    return;
  }

  button.disabled = true;
  button.textContent = 'Importando...';
  setMetaImportMessage('Processando lote...');

  try {
    const response = await apiFetch('/api/meta-ads/import', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });

    state.lastMetaImport = {
      importedCount: response.importedCount || 0,
      skippedCount: response.skippedCount || 0,
      errorCount: response.errorCount || 0,
      message: response.message || 'Importação concluída.',
    };

    renderMetaImportStats();
    setMetaImportMessage(`${response.message}. Importados: ${response.importedCount || 0}, ignorados: ${response.skippedCount || 0}, erros: ${response.errorCount || 0}.`);
    notify(response.message || 'Importação concluída.', response.partial ? 'info' : 'success');
    await refreshDashboard();
  } catch (error) {
    const payload = error.payload || {};
    state.lastMetaImport = {
      importedCount: payload.importedCount || 0,
      skippedCount: payload.skippedCount || 0,
      errorCount: payload.errorCount || 0,
      message: payload.error || error.message,
    };
    renderMetaImportStats();
    setMetaImportMessage(payload.error || error.message);
    notify(payload.error || error.message, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Importar JSON';
  }
}

async function deleteCurrentOffer() {
  if (!state.editingId) return;
  if (!window.confirm('Excluir esta oferta do radar?')) return;

  try {
    await apiFetch(`/api/offers/${state.editingId}`, { method: 'DELETE' });
    notify('Oferta removida.', 'success');
    closeModal();
    closeDrawer();
    await refreshDashboard();
  } catch (error) {
    notify(error.message, 'error');
  }
}

async function deleteCurrentMetaAd() {
  if (!state.editingMetaId) return;
  if (!window.confirm('Excluir este anúncio Meta do radar?')) return;

  try {
    await apiFetch(`/api/meta-ads/${state.editingMetaId}`, { method: 'DELETE' });
    notify('Anúncio Meta removido.', 'success');
    closeMetaModal();
    closeMetaDrawer();
    await refreshDashboard();
  } catch (error) {
    notify(error.message, 'error');
  }
}

async function enrichFromUrl() {
  const form = document.getElementById('offer-form');
  const feedback = document.getElementById('enrich-feedback');
  const url = form.sourceUrl.value || form.landingPageUrl.value || form.creativeUrl.value;

  if (!url) {
    notify('Preencha ao menos uma URL pública.', 'error');
    return;
  }

  feedback.textContent = 'Lendo metadados públicos...';

  try {
    const response = await apiFetch('/api/offers/enrich-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });

    const { metadata } = response;
    if (!form.name.value && metadata.title) {
      form.name.value = metadata.title;
    }

    if (!form.notes.value && metadata.description) {
      form.notes.value = metadata.description;
    }

    if (!form.landingPageUrl.value) {
      form.landingPageUrl.value = metadata.finalUrl || url;
    }

    feedback.textContent = metadata.title
      ? `Metadados lidos: ${metadata.title}`
      : 'URL validada, mas sem título legível.';
    notify('Enriquecimento concluído.', 'success');
  } catch (error) {
    feedback.textContent = error.message;
    notify(error.message, 'error');
  }
}

async function enrichMetaFromUrl() {
  const form = document.getElementById('meta-form');
  const feedback = document.getElementById('meta-enrich-feedback');
  const url = form.adLibraryUrl.value || form.landingPageUrl.value || form.creativeUrl.value;

  if (!url) {
    notify('Preencha ao menos uma URL pública.', 'error');
    return;
  }

  feedback.textContent = 'Lendo metadados públicos...';

  try {
    const response = await apiFetch('/api/meta-ads/enrich-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });

    const { metadata } = response;
    if (!form.adTitle.value && metadata.title) {
      form.adTitle.value = metadata.title;
    }

    if (!form.notes.value && metadata.description) {
      form.notes.value = metadata.description;
    }

    if (!form.landingPageUrl.value && metadata.finalUrl && metadata.finalUrl !== form.adLibraryUrl.value) {
      form.landingPageUrl.value = metadata.finalUrl;
    }

    feedback.textContent = metadata.title
      ? `Metadados lidos: ${metadata.title}`
      : 'URL validada, mas sem título legível.';
    notify('Enriquecimento Meta concluído.', 'success');
  } catch (error) {
    feedback.textContent = error.message;
    notify(error.message, 'error');
  }
}

function bindFilterHandlers(bindings, targetState, renderFn) {
  bindings.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (event) => {
      targetState[key] = event.target.value;
      renderFn();
    });
    el.addEventListener('change', (event) => {
      targetState[key] = event.target.value;
      renderFn();
    });
  });
}

async function refreshDashboard() {
  const refreshBtn = document.getElementById('btn-refresh');
  refreshBtn.disabled = true;
  refreshBtn.textContent = 'Atualizando...';

  try {
    await loadDashboardCollections();
    loadDashboardRenders();
  } catch (error) {
    notify(error.message, 'error');
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Atualizar base';
  }
}

function handleTableClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  const offer = state.offers.find((item) => item.id === id);
  if (!offer) return;

  if (action === 'detail') openDrawer(id);
  if (action === 'edit') openModal(offer);
  if (action === 'funnelby') exportToFunnelby(offer, button);
}

async function exportToFunnelby(offer, button) {
  const FUNNELBY_API = 'http://localhost:3333';
  const originalText = button.textContent;
  button.textContent = '⏳ Enviando...';
  button.disabled = true;

  try {
    const payload = {
      sourceId: offer.id,
      name: offer.name,
      niche: offer.niche,
      micropersona: offer.micropersona,
      mechanism: offer.mechanism,
      promise: offer.promise,
      offerType: offer.offerType,
      entryPrice: offer.entryPrice,
      sourcePlatform: offer.sourcePlatform,
      sourceUrl: offer.sourceUrl,
      landingPageUrl: offer.landingPageUrl,
      creativeUrl: offer.creativeUrl,
      funnelType: offer.funnelType,
      tags: offer.tags || [],
      notes: offer.notes,
      score: offer.score,
      signals: offer.signals,
    };

    const res = await fetch(`${FUNNELBY_API}/api/import-offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Erro ${res.status}`);

    const result = await res.json();
    button.textContent = '✅ Enviado!';
    button.style.background = 'rgba(16,185,129,0.2)';
    button.style.color = '#34d399';
    button.style.borderColor = 'rgba(16,185,129,0.3)';
    notify(`"${offer.name}" exportada para Funnelby com sucesso! Funil criado: ${result.funnelName}`, 'success');

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.style.background = '';
      button.style.color = '';
      button.style.borderColor = '';
    }, 3000);
  } catch (err) {
    button.textContent = '❌ Erro';
    button.style.background = 'rgba(239,68,68,0.2)';
    button.style.color = '#f87171';
    notify(`Erro ao enviar para Funnelby: ${err.message}. Certifique-se que o Funnelby está rodando (localhost:3333).`, 'error');

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.style.background = '';
      button.style.color = '';
    }, 3000);
  }
}

function handleMetaTableClick(event) {
  const button = event.target.closest('button[data-meta-action]');
  if (!button) return;

  const { metaAction, id } = button.dataset;
  const ad = state.metaAds.find((item) => item.id === id);
  if (!ad) return;

  if (metaAction === 'detail') openMetaDrawer(id);
  if (metaAction === 'edit') openMetaModal(ad);
}

function initBootAssembly() {
  const body = document.body;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        body.classList.add('is-ready');
        body.classList.remove('is-booting');
      }, 180);
    });
  });
}

function initScrollReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-in');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px',
  });

  items.forEach((item) => observer.observe(item));
}

function initParallaxMotion() {
  const items = Array.from(document.querySelectorAll('.motion-parallax[data-depth]'));
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;

    items.forEach((item) => {
      if (item.matches(':hover')) return;
      const depth = Number(item.dataset.depth || 0);
      const rect = item.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distanceFromCenter = (center - viewportHeight / 2) / viewportHeight;
      const offset = distanceFromCenter * depth * -6;
      item.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function initConstellationBackground() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const pointer = { x: null, y: null };
  let width = 0;
  let height = 0;
  let animationFrame = null;
  const particleCount = 80;
  const particles = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      radius: 1 + Math.random() * 2.4,
      alpha: 0.2 + Math.random() * 0.55,
    };
  }

  function resetParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(createParticle());
    }
  }

  function drawConnections() {
    const maxDistance = 160;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance > maxDistance) continue;

        const opacity = 1 - distance / maxDistance;
        context.beginPath();
        context.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.22})`;
        context.lineWidth = 1;
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
  }

  function drawPointerField() {
    if (pointer.x === null || pointer.y === null) return;
    const gradient = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 220);
    gradient.addColorStop(0, 'rgba(124, 77, 255, 0.14)');
    gradient.addColorStop(1, 'rgba(124, 77, 255, 0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(pointer.x, pointer.y, 220, 0, Math.PI * 2);
    context.fill();
  }

  function animate() {
    context.clearRect(0, 0, width, height);
    drawPointerField();

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20 || particle.x > width + 20) particle.vx *= -1;
      if (particle.y < -20 || particle.y > height + 20) particle.vy *= -1;

      context.beginPath();
      context.fillStyle = `rgba(226, 213, 255, ${particle.alpha})`;
      context.shadowBlur = 16;
      context.shadowColor = 'rgba(124, 77, 255, 0.34)';
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    });

    drawConnections();
    animationFrame = requestAnimationFrame(animate);
  }

  resize();
  resetParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    resetParticles();
  });

  window.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    pointer.x = null;
    pointer.y = null;
  });

  window.addEventListener('beforeunload', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initBootAssembly();
  initScrollReveal();
  initParallaxMotion();
  initConstellationBackground();
  document.getElementById('meta-import-example').textContent = META_IMPORT_EXAMPLE;

  bindFilterHandlers([
    ['filter-search', 'search'],
    ['filter-niche', 'niche'],
    ['filter-platform', 'platform'],
    ['filter-micropersona', 'micropersona'],
    ['filter-tag', 'tag'],
    ['filter-min-score', 'minScore'],
  ], state.filters, renderOffers);

  bindFilterHandlers([
    ['meta-filter-search', 'search'],
    ['meta-filter-niche', 'niche'],
    ['meta-filter-brand', 'brand'],
    ['meta-filter-creative-type', 'creativeType'],
    ['meta-filter-tag', 'tag'],
    ['meta-filter-min-score', 'minScore'],
  ], state.metaFilters, renderMetaAds);

  safeOn('btn-refresh', 'click', refreshDashboard);
  safeOn('btn-new-offer', 'click', () => openModal());
  safeOn('btn-new-meta-ad', 'click', () => openMetaModal());
  safeOn('btn-open-meta-import', 'click', openMetaImportModal);
  safeOn('btn-open-meta-import-inline', 'click', openMetaImportModal);
  safeOn('btn-fill-meta-import-example', 'click', fillMetaImportExample);
  safeOn('btn-run-meta-import', 'click', importMetaBatch);
  safeOn('offers-body', 'click', handleTableClick);
  safeOn('meta-ads-body', 'click', handleMetaTableClick);

  safeOn('drawer-backdrop', 'click', closeDrawer);
  safeOn('detail-close', 'click', closeDrawer);
  safeOn('meta-drawer-backdrop', 'click', closeMetaDrawer);
  safeOn('meta-detail-close', 'click', closeMetaDrawer);

  safeOn('modal-close', 'click', closeModal);
  safeOn('btn-cancel-offer', 'click', closeModal);
  safeOn('offer-form', 'submit', saveOffer);
  safeOn('btn-delete-offer', 'click', deleteCurrentOffer);
  safeOn('btn-enrich-url', 'click', enrichFromUrl);

  safeOn('meta-modal-close', 'click', closeMetaModal);
  safeOn('btn-cancel-meta-ad', 'click', closeMetaModal);
  safeOn('meta-form', 'submit', saveMetaAd);
  safeOn('btn-delete-meta-ad', 'click', deleteCurrentMetaAd);
  safeOn('btn-meta-enrich-url', 'click', enrichMetaFromUrl);

  safeOn('meta-import-modal-close', 'click', closeMetaImportModal);
  safeOn('btn-cancel-meta-import', 'click', closeMetaImportModal);
  safeOn('meta-import-modal', 'click', (event) => {
    if (event.target.id === 'meta-import-modal') closeMetaImportModal();
  });

  const offerForm = $('offer-form');
  if (offerForm) {
    scoreFields.forEach((field) => {
      const el = offerForm.elements[`signal-${field}`];
      if (el) el.addEventListener('input', updateScorePreview);
    });
  }

  const metaForm = $('meta-form');
  if (metaForm) {
    metaScoreFields.forEach((field) => {
      const el = metaForm.elements[`meta-signal-${field}`];
      if (el) el.addEventListener('input', updateMetaScorePreview);
    });
  }

  setText('scaled-import-preview', SCALED_LIBRARY_IMPORT_EXAMPLE);
  setText('scaled-import-example', SCALED_LIBRARY_IMPORT_EXAMPLE);
  renderMetaImportStats();
  renderScaledImportStats();
  setScaledImportMessage('Cole seu JSON e rode a importação para abastecer a biblioteca independente.');
  await refreshDashboard();
  await bootstrapScaledOffersModule();
});
