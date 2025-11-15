// --- PONTO DE ENTRADA E PIPELINE DE DADOS ---

document.addEventListener("DOMContentLoaded", function() {
  ui.exportCsvBtn = document.getElementById("exportCsvBtn"); // FEAT_DataExport_CSV
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  buildAdvancedFilters();
  buildMobileSort();
  updateUIForScreenSize();
  handleLoadFromGithub();

  // --- MODO DEV ---
  window.toggleDevView = function() {
    if (appState.isDevMobileOverride === null) {
      appState.isDevMobileOverride = 'mobile';
      console.log('%cDEV: Forçando UI Mobile', 'color: #EC7000; font-weight: bold;');
    } else if (appState.isDevMobileOverride === 'mobile') {
      appState.isDevMobileOverride = 'desktop';
      console.log('%cDEV: Forçando UI Desktop', 'color: #00509D; font-weight: bold;');
    } else {
      appState.isDevMobileOverride = null;
      console.log('%cDEV: Voltando ao modo Automático (responsivo)', 'color: gray; font-weight: bold;');
    }
    handleResize();
    runDataPipeline();
  };
  // --- FIM MODO DEV ---
}

function sanitizeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function runDataPipeline() {
  var taxBracketMatch = TAX_BRACKETS.find(function(b) { return b.value === appState.taxBracket; });
  var currentTaxRate = (taxBracketMatch ? taxBracketMatch.rate : 0) || 0;

  // 1. MAP (Processa os dados brutos)
  var data = appState.allData.map(function(item) {
    var isento = isFundoIsento(item.nome);
    var resgateInfo = parseResgate(item.resgate);

    var newItem = {};
    for (var key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        newItem[key] = sanitizeHTML(item[key]);
      }
    }

    newItem.id = item.nome;
    newItem.resgateDisplay = resgateInfo.display;
    newItem.resgateDias = resgateInfo.dias;
    newItem.resgateOriginal = resgateInfo.original;

    if (currentTaxRate > 0 && !isento) {
      var yieldKeys = ['12_meses', 'no_ano', 'no_mes'];
      var originalYields = {};

      for (var i = 0; i < yieldKeys.length; i++) {
        var key = yieldKeys[i];
        var grossYieldStr = item[key];
        var grossYieldNum = parsePercent(grossYieldStr);
        originalYields[key] = grossYieldStr;

        if (grossYieldNum !== null) {
          var netYieldNum = grossYieldNum * (1.0 - currentTaxRate);
          newItem[key] = formatPercent(netYieldNum);
        }
      }
      newItem.originalYields = originalYields;
    }
    return newItem;
  });

  // 2. FILTRAR
  var query = appState.filterQuery;
  var mode = appState.searchMode;

  if (mode === 'text' && query) {
    data = data.filter(function(item) { return item.nome && normalizeString(item.nome).includes(query); });
  } else if (mode === 'cnpj' && query) {
    var normalizedQuery = query.replace(/[.\-/]/g, "");
    data = data.filter(function(item) {
      return Array.isArray(item.possivel_cnpj) &&
        item.possivel_cnpj.some(function(cnpj) {
          return cnpj && cnpj.replace(/[.\-/]/g, "").includes(normalizedQuery);
        });
    });
  }

  if (query && data.length === 0 && !appState.searchError) {
    appState.searchError = mode === 'cnpj' ?
      "CNPJ não encontrado nesta lista." :
      "Nenhum fundo encontrado com este nome.";
  }
  renderSearchFeedback();

  data = data.filter(function(item) {
    var matchRisco = appState.filters.risco === 'todos' || (item.risco && appState.filters.risco === item.risco.toLowerCase());
    var matchPerf = true;
    if (appState.isPerfFilterActive) {
      var baseCdi = BENCHMARKS_CDI[appState.displayPeriod];
      var targetRate = baseCdi * appState.perfBenchmark;
      if (currentTaxRate > 0 && !isFundoIsento(item.nome)) {
        targetRate = targetRate * (1.0 - currentTaxRate);
      }
      var itemValue = parsePercent(item[appState.displayPeriod]);
      matchPerf = (itemValue !== null) && (itemValue >= targetRate);
    }
    return matchRisco && matchPerf;
  });

  // v3.22.0: Filtro para Fundos de Infraestrutura (adicionado após outros filtros)
  if (appState.filters.isInfraOnly) {
    data = data.filter(function(fundo) {
      var nomeLower = fundo.nome.toLowerCase();
      // Verifica se o nome do fundo contém alguma das palavras-chave
      return INFRA_KEYWORDS.some(function(keyword) {
        // Usamos indexOf para compatibilidade com ES5
        return nomeLower.indexOf(keyword) !== -1;
      });
    });
  }

  // 3. ORDENAR
  var sortColumn = appState.sortConfig.column;
  var sortDirection = appState.sortConfig.direction;

  var getSortValue = function(item, column) {
    switch (column) {
      case "nome": return normalizeString(item.nome);
      case "risco":
        var riscoNum = RISCO_ORDER_MAP[normalizeString(item.risco)];
        return riscoNum || 99;
      case "resgate": return item.resgateDias;
      case "rentabilidade_dinamica":
        var periodKey = appState.displayPeriod;
        return parsePercent(item[periodKey]);
      default: return item[column] || "";
    }
  };

  data.sort(function(a, b) {
    var valA = getSortValue(a, sortColumn);
    var valB = getSortValue(b, sortColumn);
    var aIsNull = valA === null;
    var bIsNull = valB === null;
    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return 1;
    if (bIsNull) return -1;
    var comparison = 0;
    if (valA > valB) comparison = 1;
    else if (valA < valB) comparison = -1;
    return sortDirection === "asc" ? comparison : comparison * -1;
  });

  appState.processedData = data;

  // 4. RENDERIZAR
  renderTable();
  renderPagination();
}