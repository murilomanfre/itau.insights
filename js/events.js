// --- CONFIGURAÇÃO E MANIPULADORES DE EVENTOS (HANDLERS) ---

function setupEventListeners() {
  ui.exportCsvBtn.addEventListener("click", handleExportCsv); // FEAT_DataExport_CSV
  ui.fileInput.addEventListener("change", handleFileLoad);
  ui.retryGithubBtn.addEventListener("click", handleLoadFromGithub);
  ui.reloadGithubBtn.addEventListener("click", handleLoadFromGithub);
  ui.filterGlobal.addEventListener("input", debounce(handleGlobalFilterChange, 300));
  ui.advancedPanelHeader.addEventListener("click", toggleFilterPanel);
  ui.clearAdvancedFiltersBtn.addEventListener("click", clearAdvancedFilters);
  ui.clearAllAppBtn.addEventListener("click", clearAllAppFilters);
  ui.sortableHeaders.forEach(function(header) {
    header.addEventListener("click", handleSortClick);
  });
  ui.mobileSortSelect.addEventListener("change", handleMobileSortChange);
  ui.itemsPerPage.addEventListener("change", handleItemsPerPageChange);
  ui.prevPageBtn.addEventListener("click", function() { handlePageChange(appState.currentPage - 1); });
  ui.nextPageBtn.addEventListener("click", function() { handlePageChange(appState.currentPage + 1); });
  window.addEventListener("resize", debounce(handleResize, 250));
  if (ui.infraFilterToggle) ui.infraFilterToggle.addEventListener('change', handleInfraFilterChange); // v3.22.0
  ui.modalCloseBtn.addEventListener("click", hideModal);
  if (ui.showFullNameToggle) ui.showFullNameToggle.addEventListener('change', handleShowFullNameToggle); // FEAT: Listener para o novo toggle
}

function handleResize() {
  var wasMobile = appState.isMobile;

  if (appState.isDevMobileOverride !== null) {
    appState.isMobile = appState.isDevMobileOverride === 'mobile';
  } else {
    appState.isMobile = window.innerWidth <= 768;
  }

  if (wasMobile !== appState.isMobile) {
    updateUIForScreenSize();
    runDataPipeline();
  }
}

// FEAT: Handler para o toggle de exibir nomes completos
function handleShowFullNameToggle(e) {
  appState.showFullNames = e.target.checked;
  runDataPipeline();
}

/**
 * Manipulador para o evento de clique no botão de exportar para CSV.
 */
function handleExportCsv() {
  if (appState.processedData.length === 0) {
    alert("Não há dados filtrados para exportar.");
    return;
  }

  var csvContent = convertToCSV(appState.processedData);
  var date = new Date();
  var timestamp = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
  var fileName = 'Itau_Insights_Export_' + timestamp + '.csv';
  exportDataToCsv(csvContent, fileName);
}

function handleGlobalFilterChange(e) {
  var value = e.target.value;
  var cleanedValue = value.replace(/[.\-/]/g, "");
  appState.searchError = null;

  if (cleanedValue.length > 0 && /^\d+$/.test(cleanedValue)) {
    appState.searchMode = 'cnpj';
    appState.filterQuery = cleanedValue;
    if (cleanedValue.length === 14 && !isValidCNPJ(cleanedValue)) {
      appState.searchError = "CNPJ inválido (dígito verificador).";
    }
  } else {
    appState.searchMode = 'text';
    appState.filterQuery = normalizeString(value);
  }

  appState.currentPage = 1;
  runDataPipeline();
}

function toggleFilterPanel() {
  appState.isAdvancedPanelOpen = !appState.isAdvancedPanelOpen;
  ui.advancedPanelContent.classList.toggle('hidden');
  ui.advancedPanelChevron.innerHTML = appState.isAdvancedPanelOpen ? ICONS.ChevronUp : ICONS.ChevronDown;
  renderActiveFilterTags();
}

function handleRiscoToggle(e) {
  var riscoLevel = e.currentTarget.dataset.value;
  appState.filters.risco = riscoLevel;

  document.querySelectorAll('.filter-risco-btn').forEach(function(btn) {
    var isActive = btn.dataset.value === riscoLevel;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  appState.currentPage = 1;
  runDataPipeline();
  renderActiveFilterTags();
}

function handleDisplayPeriodChange(e) {
  var value = e.currentTarget.dataset.value;
  appState.displayPeriod = value;

  document.querySelectorAll('.filter-display-period').forEach(function(btn) {
    var isActive = btn.dataset.value === value;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  handleSortClick(null, 'rentabilidade_dinamica');
  runDataPipeline();
  renderActiveFilterTags();
}

function handleIsPerfFilterChange(e) {
  appState.isPerfFilterActive = e.target.checked;
  if (appState.isPerfFilterActive) {
    ui.perfBenchmarkContainer.classList.remove('hidden');
    ui.perfFilterLabel.textContent = "Filtro Ativado";
  } else {
    ui.perfBenchmarkContainer.classList.add('hidden');
    ui.perfFilterLabel.textContent = "Filtro Desativado";
  }
  appState.currentPage = 1;
  runDataPipeline();
  renderActiveFilterTags();
}

function handlePerfBenchmarkClick(e) {
  var value = parseFloat(e.currentTarget.dataset.value);
  appState.perfBenchmark = value;

  document.querySelectorAll('.filter-perf-benchmark').forEach(function(btn) {
    var isActive = parseFloat(btn.dataset.value) === value;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  appState.currentPage = 1;
  runDataPipeline();
  renderActiveFilterTags();
}

function handleTaxBracketChange(e) {
  var value = e.currentTarget.dataset.value;
  appState.taxBracket = value;

  document.querySelectorAll('.filter-tax-bracket').forEach(function(btn) {
    var isActive = btn.dataset.value === value;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  appState.currentPage = 1;
  updateBenchmarkLabels();
  runDataPipeline();
  renderActiveFilterTags();
}

// v3.22.0: Handler para o filtro de Infraestrutura
function handleInfraFilterChange(e) {
  var isActive = e.target.checked;
  
  // 1. Atualiza o estado
  appState.filters.isInfraOnly = isActive;
  
  // 2. Se o filtro for ativado, força o IR para 'bruta'
  if (isActive) {
    appState.taxBracket = 'bruta';
  }
  
  // 3. Atualiza a UI do filtro de IR (desativa/ativa botões)
  updateTaxFilterUI(isActive);
  
  // 4. Atualiza a UI dos botões de IR para refletir o estado 'bruta'
  document.querySelectorAll('.filter-tax-bracket').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.value === appState.taxBracket);
  });

  runDataPipeline();
  renderActiveFilterTags();
}

function resetAdvancedFilters() {
  appState.filters.risco = 'todos';
  appState.displayPeriod = '12_meses';
  appState.isPerfFilterActive = false;
  appState.perfBenchmark = 1.0;
  appState.taxBracket = 'bruta';

  // v3.22.0: Reseta também o filtro de infra
  appState.filters.isInfraOnly = false;
  if (ui.infraFilterToggle) ui.infraFilterToggle.checked = false;
  updateTaxFilterUI(false);
  buildAdvancedFilters();
  handleIsPerfFilterChange({ target: { checked: false } });
  document.querySelectorAll('.filter-risco-btn').forEach(function(btn) {
    var isTodos = btn.dataset.value === 'todos';
    btn.classList.toggle('active', isTodos);
    btn.setAttribute('aria-pressed', isTodos ? 'true' : 'false');
  });
}

function clearAdvancedFilters(e) {
  if (e) e.stopPropagation();
  resetAdvancedFilters();
  appState.currentPage = 1;
  runDataPipeline();
  renderActiveFilterTags();
}

function clearAllAppFilters() {
  resetAdvancedFilters();
  appState.filterQuery = '';
  appState.searchMode = 'text';
  appState.searchError = null;
  ui.filterGlobal.value = '';
  renderSearchFeedback();
  appState.currentPage = 1;
  runDataPipeline();
  renderActiveFilterTags();
}

function handleMobileSortChange(e) {
  var value = e.target.value;
  var parts = value.split('_');
  var column = parts.slice(0, parts.length - 1).join('_');
  var direction = parts[parts.length - 1];
  appState.sortConfig = { column: column, direction: direction };
  updateSortIcons();
  runDataPipeline();
}

function handleSortClick(e, column) {
  var newColumn = column || (e.currentTarget ? e.currentTarget.dataset.column : null);
  if (!newColumn) return;

  var newDirection = 'asc';
  if (appState.sortConfig.column === newColumn && appState.sortConfig.direction === "asc") {
    newDirection = "desc";
  }
  if (appState.sortConfig.column !== newColumn && newColumn === 'rentabilidade_dinamica') {
    newDirection = 'desc';
  }
  appState.sortConfig = { column: newColumn, direction: newDirection };
  updateSortIcons();
  var currentSortValue = newColumn + '_' + newDirection;
  ui.mobileSortSelect.value = currentSortValue;
  runDataPipeline();
}

function handleToggleRow(e) {
  var rowId = e.currentTarget.dataset.id;
  var detailRow = document.getElementById('detail-' + rowId);
  var mainContainer = appState.isMobile ? e.currentTarget.closest('.bg-white') : e.currentTarget.closest('tr');
  var icon = e.currentTarget.querySelector('svg');

  if (appState.expandedRows.has(rowId)) {
    appState.expandedRows.delete(rowId);
    if (detailRow) detailRow.classList.add('hidden');
    if (mainContainer) mainContainer.classList.remove('expanded');
    if (icon) icon.innerHTML = ICONS.ChevronDown;
  } else {
    appState.expandedRows.add(rowId);
    if (detailRow) detailRow.classList.remove('hidden');
    if (mainContainer) mainContainer.classList.add('expanded');
    if (icon) icon.innerHTML = ICONS.ChevronUp;
    var item = appState.processedData.find(function(d) { return d.id === rowId; });
    if (item) {
      renderCnpjValidator(item.possivel_cnpj, 'cnpj-validator-' + item.id);
    }
  }
}

function handleCopyCnpj(e, cnpj) {
  e.preventDefault();
  e.stopPropagation();
  if (!cnpj) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cnpj).then(function() {
      appState.copiedCnpj = cnpj;
      renderTable();
      setTimeout(function() {
        appState.copiedCnpj = null;
        renderTable();
      }, 2000);
    }).catch(function(err) {
      console.error("Falha ao copiar CNPJ (navigator):", err);
      copyFallback(cnpj);
    });
  } else {
    copyFallback(cnpj);
  }
}

function handleItemsPerPageChange(e) {
  appState.itemsPerPage = Number(e.target.value);
  appState.currentPage = 1;
  runDataPipeline();
}

function handlePageChange(newPage) {
  var totalPages = Math.ceil(appState.processedData.length / appState.itemsPerPage);
  if (newPage < 1) newPage = 1;
  if (newPage > totalPages) newPage = totalPages;
  appState.currentPage = newPage;
  renderTable();
  renderPagination();
}