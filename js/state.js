// --- ESTADO DA APLICAÇÃO ---
var appState = { // v3.17.9: var
  allData: [],
  processedData: [],
  riscoOptions: [],
  currentPage: 1,
  itemsPerPage: 100,
  sortConfig: { column: "rentabilidade_dinamica", direction: "desc" },
  
  // v3.3.0: Filtros de Busca Unificada
  searchMode: 'text', // 'text' ou 'cnpj'
  filterQuery: '',    // String normalizada (texto) ou limpa (cnpj)
  searchError: null,  // Mensagem de erro da busca
  
  // Filtros Avançados
  filters: {
    risco: 'todos', // v3.15.0: Mudado de array para string (single-select)
    isInfraOnly: false, // v3.22.0: Filtro para fundos de infraestrutura
  },
  
  // v3.4.0: Novos estados de Performance
  displayPeriod: '12_meses',  // '12_meses', 'no_ano', 'no_mes'
  isPerfFilterActive: false, // boolean (toggle)
  perfBenchmark: 1.0,      // 1.0, 1.05, 1.20
  customPerfBenchmark: null, // v3.34.0: Para o valor customizado
  
  // v3.5.0: Estado de IR simplificado
  taxBracket: 'bruta', // 'bruta', '15.0', '17.5', etc.

  expandedRows: new Set(), // Set de IDs (nome do fundo)
  copiedCnpj: null,   // String do CNPJ copiado
  isLoading: false,
  error: null,
  isMobile: window.innerWidth <= 768,
  isAdvancedPanelOpen: false, // v3.13.0: Estado do painel (renomeado)
  isDevMobileOverride: null, // v3.17.9: Adicionado para Dev Toggle
};
appState.showFullNames = false; // FEAT: Novo estado para controlar a exibição dos nomes

// --- REFERÊNCIAS DA UI ---
var ui = { // v3.17.9: var
  fileInput: document.getElementById("fileInput"),
  emptyState: document.getElementById("emptyState"),
  emptyStateMessage: document.getElementById("emptyStateMessage"), // v3.12.0
  dashboardState: document.getElementById("dashboardState"),
  
  // v3.3.0: Filtros de Busca Unificada
  filterGlobal: document.getElementById("filterGlobal"),
  filterMessage: document.getElementById("filterMessage"),
  
  // v3.9.0: Painel de Risco (separado)
  riscoButtonsContainer: document.getElementById("riscoButtonsContainer"),

  // v3.13.0: Painel de Filtros Avançados (renomeado)
  advancedFilterPanel: document.getElementById("advancedFilterPanel"),
  advancedPanelHeader: document.getElementById("advancedPanelHeader"),
  advancedPanelChevron: document.getElementById("advancedPanelChevron"),
  filterTagsContainer: document.getElementById("filterTagsContainer"),
  advancedPanelContent: document.getElementById("advancedPanelContent"),
  clearAdvancedFiltersBtn: document.getElementById("clearAdvancedFiltersBtn"),
  
  // Conteúdo dos Filtros Avançados
  displayPeriodButtons: document.getElementById("displayPeriodButtons"),
  perfFilterToggle: document.getElementById("perfFilterToggle"),
  perfFilterLabel: document.getElementById("perfFilterLabel"),
  perfBenchmarkContainer: document.getElementById("perfBenchmarkContainer"),
  perfBenchmarkButtons: document.getElementById("perfBenchmarkButtons"),
  perfBenchmarkCustom: document.getElementById("perfBenchmarkCustom"), // v3.34.0
  taxBracketButtons: document.getElementById("taxBracketButtons"),
  infraFilterToggle: document.getElementById("infraFilterToggle"), // v3.22.0
  showFullNameToggle: document.getElementById("showFullNameToggle"), // FEAT: Novo toggle
  
  // v3.16.0: Containers da Tabela/Cards
  desktopTableContainer: document.getElementById("desktopTableContainer"),
  mobileCardContainer: document.getElementById("mobileCardContainer"),
  
  // v3.17.0: Ordenação Mobile
  mobileSortControls: document.getElementById("mobileSortControls"),
  mobileSortSelect: document.getElementById("mobileSortSelect"),
  
  // Tabela
  tableBody: document.getElementById("tableBody"),
  headerSummary: document.getElementById("headerSummary"), // v3.31.0
  sortableHeaders: document.querySelectorAll("th.sortable"),
  noResultsMessage: document.getElementById("noResultsMessage"),

  // Paginação
  paginationControls: document.getElementById("paginationControls"),
  paginationSummary: document.getElementById("paginationSummary"),
  pageNumbersContainer: document.getElementById("pageNumbersContainer"),
  itemsPerPage: document.getElementById("itemsPerPage"),
  prevPageBtn: document.getElementById("prevPageBtn"),
  nextPageBtn: document.getElementById("nextPageBtn"),

  // Modal
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  
  // v3.10.0: Botão Master Reset
  clearAllAppBtn: document.getElementById("clearAllAppBtn"),

  // v3.11.0: Botões de Carregamento
  retryGithubBtn: document.getElementById("retryGithubBtn"), // v3.12.0: Renamed
  reloadGithubBtn: document.getElementById("reloadGithubBtn"),
};