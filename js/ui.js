/*
 * v3.25.1
 * 15/11/2025 04:04
 */
// --- LÓGICA DE CONSTRUÇÃO E RENDERIZAÇÃO DA UI ---

function buildAdvancedFilters() {
  var periodLabels = { 'no_mes': 'No Mês', 'no_ano': 'No Ano', '12_meses': '12 Meses' };
  ui.displayPeriodButtons.innerHTML = Object.keys(periodLabels).map(function(period) {
    return (
      '<button' +
      ' data-value="' + period + '"' +
      ' class="segmented-btn filter-display-period ' + (period === appState.displayPeriod ? 'active' : '') + '"' +
      ' aria-pressed="' + (period === appState.displayPeriod ? 'true' : 'false') + '"' +
      '>' +
      periodLabels[period] +
      '</button>'
    );
  }).join('');

  ui.perfBenchmarkButtons.innerHTML = CDI_TIERS.map(function(tier) {
    return (
      '<button' +
      ' data-value="' + tier.value + '"' +
      ' class="segmented-btn filter-perf-benchmark ' + (tier.value === appState.perfBenchmark ? 'active' : '') + '"' +
      ' aria-pressed="' + (tier.value === appState.perfBenchmark ? 'true' : 'false') + '"' +
      '>' +
      '&gt; ' + tier.label +
      '</button>'
    );
  }).join('');

  ui.taxBracketButtons.innerHTML = Object.keys(TAX_LABELS).map(function(bracketValue) {
    var isActive = bracketValue === appState.taxBracket;
    return (
      '<button' +
      ' data-value="' + bracketValue + '"' +
      ' class="segmented-btn filter-tax-bracket ' + (isActive ? 'active' : '') + '"' +
      ' aria-pressed="' + (isActive ? 'true' : 'false') + '"' +
      '>' +
      TAX_LABELS[bracketValue] +
      '</button>'
    );
  }).join('');

  document.querySelectorAll('.filter-display-period').forEach(function(btn) { btn.addEventListener('click', handleDisplayPeriodChange); });
  ui.perfFilterToggle.addEventListener('change', handleIsPerfFilterChange);
  document.querySelectorAll('.filter-perf-benchmark').forEach(function(btn) { btn.addEventListener('click', handlePerfBenchmarkClick); });
  document.querySelectorAll('.filter-tax-bracket').forEach(function(btn) { btn.addEventListener('click', handleTaxBracketChange); });
}

function populateRiscoFilter(data) {
  var ordemCorreta = ["baixo", "médio", "alto"];
  var riscosUnicos = [];
  var RiscoSet = new Set();
  data.forEach(function(item) {
    if (item.risco && !RiscoSet.has(item.risco)) {
      RiscoSet.add(item.risco);
      riscosUnicos.push(item.risco);
    }
  });

  var riscos = riscosUnicos.sort(function(a, b) {
    var aLower = a ? a.toLowerCase() : '';
    var bLower = b ? b.toLowerCase() : '';
    var indexA = ordemCorreta.indexOf(aLower);
    var indexB = ordemCorreta.indexOf(bLower);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
  appState.riscoOptions = riscos;

  var riscoItemsBase = [{ value: 'todos', label: 'Todos' }];
  var riscoItemsMapped = riscos.map(function(r) {
    return ({
      value: r.toLowerCase(),
      label: r.charAt(0).toUpperCase() + r.slice(1)
    });
  });
  var riscoItems = riscoItemsBase.concat(riscoItemsMapped);

  var getColorClass = function(risco) {
    switch (risco) {
      case 'baixo': return 'risco-baixo';
      case 'médio': return 'risco-medio';
      case 'alto': return 'risco-alto';
      default: return 'risco-todos';
    }
  };

  ui.riscoButtonsContainer.innerHTML = riscoItems.map(function(item) {
    var isActive = item.value === appState.filters.risco;
    var colorClass = getColorClass(item.value);
    return (
      '<button' +
      ' data-value="' + item.value + '"' +
      ' class="segmented-btn filter-risco-btn ' + (isActive ? 'active' : '') + ' ' + colorClass + '"' +
      ' aria-pressed="' + (isActive ? 'true' : 'false') + '"' +
      '>' +
      item.label +
      '</button>'
    );
  }).join('');

  ui.riscoButtonsContainer.setAttribute('role', 'group');
  ui.riscoButtonsContainer.setAttribute('aria-label', 'Filtro de Nível de Risco');

  document.querySelectorAll('.filter-risco-btn').forEach(function(btn) { btn.addEventListener('click', handleRiscoToggle); });
}

function buildMobileSort() {
  var options = [
    { value: 'rentabilidade_dinamica_desc', label: 'Rentabilidade (Decrescente)' },
    { value: 'rentabilidade_dinamica_asc', label: 'Rentabilidade (Crescente)' },
    { value: 'nome_asc', label: 'Nome (A - Z)' },
    { value: 'nome_desc', label: 'Nome (Z - A)' },
    { value: 'risco_asc', label: 'Risco (Menor primeiro)' },
    { value: 'risco_desc', label: 'Risco (Maior primeiro)' },
    { value: 'resgate_asc', label: 'Resgate (Mais rápido)' },
    { value: 'resgate_desc', label: 'Resgate (Mais lento)' },
  ];

  var currentSortValue = appState.sortConfig.column + '_' + appState.sortConfig.direction;

  ui.mobileSortSelect.innerHTML = options.map(function(opt) {
    return (
      '<option' +
      ' value="' + opt.value + '"' +
      (opt.value === currentSortValue ? ' selected' : '') +
      '>' +
      opt.label +
      '</option>'
    );
  }).join('');
}

function updateUIForScreenSize() {
  if (appState.isMobile) {
    ui.filterGlobal.placeholder = "Buscar Nome ou CNPJ...";
    ui.desktopTableContainer.classList.add('hidden');
    ui.mobileCardContainer.classList.remove('hidden');
    ui.mobileSortControls.classList.remove('hidden');
  } else {
    ui.filterGlobal.placeholder = "Buscar por Nome do Fundo ou CNPJ...";
    ui.desktopTableContainer.classList.remove('hidden');
    ui.mobileCardContainer.classList.add('hidden');
    ui.mobileSortControls.classList.add('hidden');
  }
}

function updateBenchmarkLabels() {
  var taxBracketMatch = TAX_BRACKETS.find(function(b) { return b.value === appState.taxBracket; });
  var currentTaxRate = (taxBracketMatch ? taxBracketMatch.rate : 0) || 0;

  ['12_meses', 'no_ano', 'no_mes'].forEach(function(period) {
    var labelEl = document.getElementById('benchmark-label-' + period);
    if (labelEl) {
      var benchmarkValue = BENCHMARKS_CDI[period];
      var displayValue = currentTaxRate > 0
        ? benchmarkValue * (1 - currentTaxRate)
        : benchmarkValue;
      labelEl.textContent = '(Benchmark: ' + formatPercent(displayValue) + ')';
    }
  });
}

function renderSearchFeedback() {
  if (appState.searchError) {
    ui.filterMessage.innerHTML = '<span class="text-red-600">' + appState.searchError + '</span>';
    ui.filterGlobal.classList.add('border-red-500');
    ui.filterGlobal.classList.remove('border-gray-300');
  } else {
    ui.filterMessage.innerHTML = "";
    ui.filterGlobal.classList.remove('border-red-500');
    ui.filterGlobal.classList.add('border-gray-300');
  }
}

/**
 * Escapa caracteres HTML para prevenir ataques XSS.
 * @param {string} str A string a ser escapada.
 * @returns {string} A string segura para ser inserida no HTML.
 */
function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Constrói o HTML para o nome do fundo, adicionando a tag "Infra" se for isento.
 * @param {object} fundo O objeto do fundo.
 * @returns {string} O HTML do nome do fundo com a tag, se aplicável.
 */
function buildNomeComTag(fundo) {
  var nomeHtml = escapeHtml(fundo.nome);
  if (isFundoIsento(fundo.nome)) {
    nomeHtml += ' <span class="infra-tag ml-2 px-2 py-0.5 text-xs font-semibold rounded-full">Infra</span>';
  }
  return nomeHtml;
}

function renderActiveFilterTags() {
  var tags = [];

  if (appState.filters.risco !== 'todos') {
    var riscoLabel = appState.filters.risco.charAt(0).toUpperCase() + appState.filters.risco.slice(1);
    tags.push({
      key: 'risco',
      label: 'Risco: ' + riscoLabel,
      onClear: function() {
        var btn = document.querySelector('.filter-risco-btn[data-value="todos"]');
        if (btn) btn.click();
      }
    });
  }

  if (appState.isPerfFilterActive) {
    var periodLabel = appState.displayPeriod.replace("_", " ");
    var label = 'Perf: > ' + (appState.perfBenchmark * 100) + '% CDI (' + periodLabel + ')';
    tags.push({
      key: 'perf',
      label: label,
      onClear: function() { ui.perfFilterToggle.click() }
    });
  }

  // v3.22.0: Filtro de Infraestrutura
  if (appState.filters.isInfraOnly) {
    tags.push({
      key: 'infra',
      label: 'Apenas Fundos de Infra',
      onClear: function() {
        // Simula o clique no toggle para desativar
        if (ui.infraFilterToggle) {
          ui.infraFilterToggle.checked = false;
          ui.infraFilterToggle.dispatchEvent(new Event('change'));
        }
      }
    });
  }

  if (appState.taxBracket !== 'bruta') {
    tags.push({
      key: 'ir',
      label: 'Líquido de IR (' + appState.taxBracket + '%)',
      onClear: function() { document.querySelector('.filter-tax-bracket[data-value="bruta"]').click() }
    });
  }

  if (tags.length > 0 && !appState.isAdvancedPanelOpen) {
    ui.filterTagsContainer.innerHTML = tags.map(function(tag) {
      return (
        '<span class="flex items-center gap-1.5 brand-tag text-xs font-semibold px-2.5 py-1 rounded-full">' +
        '<span>' + tag.label + '</span>' +
        '<button' +
        ' data-key="' + tag.key + '"' +
        ' class="clear-tag-btn brand-text brand-text-hover focus:outline-none"' +
        ' title="Limpar filtro: ' + tag.label + '"' +
        '>' +
        '<svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '</span>'
      );
    }).join('');

    document.querySelectorAll('.clear-tag-btn').forEach(function(btn) {
      var key = btn.dataset.key;
      var tag = tags.find(function(t) { return t.key === key; });
      if (tag) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          tag.onClear();
        });
      }
    });

    ui.filterTagsContainer.classList.remove('hidden');
    ui.clearAdvancedFiltersBtn.classList.remove('hidden');
  } else {
    ui.filterTagsContainer.innerHTML = '';
    ui.filterTagsContainer.classList.add('hidden');
    ui.clearAdvancedFiltersBtn.classList.add('hidden');
  }
}

function updateSortIcons() {
  ui.sortableHeaders.forEach(function(header) {
    var column = header.dataset.column;
    var icon = ICONS.ArrowUpDown;
    if (column === appState.sortConfig.column) {
      icon = appState.sortConfig.direction === 'asc' ? ICONS.ArrowUp : ICONS.ArrowDown;
    }
    var existingIcon = header.querySelector('svg');
    if (existingIcon) existingIcon.remove();

    var span = header.querySelector('span');
    if (span) span.insertAdjacentHTML('beforeend', icon);

    var iconEl = header.querySelector('svg');
    if (iconEl) {
      iconEl.classList.add('sort-icon');
      if (column === appState.sortConfig.column) {
        iconEl.style.opacity = '1';
      } else {
        iconEl.style.opacity = '0.2';
      }
    }
  });
}

function renderTable() {
  if (ui.tableBody) ui.tableBody.innerHTML = "";
  if (ui.mobileCardContainer) ui.mobileCardContainer.innerHTML = "";

  if (appState.isLoading) {
    var loadingHtml = '<div class="flex flex-col items-center justify-center p-8 text-gray-500">' + ICONS.Spinner + '<span class="mt-2 text-sm">Carregando dados...</span></div>';
    if (appState.isMobile) {
      if (ui.mobileCardContainer) ui.mobileCardContainer.innerHTML = loadingHtml;
    } else {
      if (ui.tableBody) ui.tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center">' + loadingHtml + '</td></tr>';
    }
    if (ui.noResultsMessage) ui.noResultsMessage.classList.add('hidden');
    return;
  }

  if (appState.error) {
    var errorHtml = '<div class="flex flex-col items-center justify-center p-8 text-red-500">' + ICONS.FileWarning + '<span class="mt-2 text-sm">' + appState.error + '</span></div>';
    if (appState.isMobile) {
      if (ui.mobileCardContainer) ui.mobileCardContainer.innerHTML = errorHtml;
    } else {
      if (ui.tableBody) ui.tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center">' + errorHtml + '</td></tr>';
    }
    if (ui.noResultsMessage) ui.noResultsMessage.classList.add('hidden');
    return;
  }

  if (appState.allData.length === 0) {
    if (ui.noResultsMessage) ui.noResultsMessage.classList.add('hidden');
    return;
  }

  if (appState.processedData.length === 0) {
    if (ui.noResultsMessage) ui.noResultsMessage.classList.remove('hidden');
    return;
  }

  if (ui.noResultsMessage) ui.noResultsMessage.classList.add('hidden');

  var start = (appState.currentPage - 1) * appState.itemsPerPage;
  var end = start + appState.itemsPerPage;
  var pageData = appState.processedData.slice(start, end);

  if (appState.isMobile) {
    renderMobileView(pageData);
  } else {
    renderDesktopView(pageData);
  }

  if (ui.dashboardState) {
    ui.dashboardState.querySelectorAll('.toggle-row-btn').forEach(function(btn) {
      btn.addEventListener('click', handleToggleRow);
    });
  }

  pageData.forEach(function(item) {
    if (appState.expandedRows.has(item.id)) {
      renderCnpjValidator(item.possivel_cnpj, 'cnpj-validator-' + item.id);
    }
  });
}

function renderDesktopView(pageData) {
  var tableHtml = "";
  pageData.forEach(function(item, index) {
    var isExpanded = appState.expandedRows.has(item.id);
    var rowClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";
    var displayPeriodKey = appState.displayPeriod;

    var rawValue = item[displayPeriodKey];
    var title = item.originalYields ? 'Bruta: ' + (item.originalYields[displayPeriodKey] || '') : '';
    var displayable = getDisplayablePercent(rawValue);
    var displayNode = displayable.displayNode;
    var titleContext = displayable.title;
    var isNet = appState.taxBracket !== 'bruta';
    var isento = isFundoIsento(item.nome);

    var rentabilidadeHtml =
      '<div' +
      ' class="text-sm flex items-center ' + getPerformanceColor(rawValue) + '"' +
      ' title="' + (title || titleContext || '') + '"' +
      '>' +
      displayNode +
      ((isNet && !isento) ? '<span class="text-red-600 ml-1">*</span>' : '') +
      '</div>';

    tableHtml +=
      '<tr class="main-row ' + rowClass + ' ' + (isExpanded ? 'expanded' : '') + '">' +
      '<td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900" title="' + escapeHtml(item.nome) + '">' +
      buildNomeComTag(item) +
      '</td>' +
      '<td class="px-3 py-3 whitespace-nowrap">' + rentabilidadeHtml + '</td>' +
      '<td class="px-3 py-3 whitespace-nowrap text-sm text-gray-700" title="' + (item.resgateOriginal || '') + '">' +
      (item.resgateDisplay || '-') +
      '</td>' +
      '<td class="px-3 py-3 whitespace-nowrap">' +
      '<span class="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ' + getRiscoClasses(item.risco) + '">' +
      (appState.isMobile ? getRiscoAbreviado(item.risco) : (item.risco || 'N/A')) +
      '</span>' +
      '</td>' +
      '<td class="px-3 py-3 whitespace-nowrap text-center text-sm font-medium">' +
      '<button' +
      ' class="toggle-row-btn p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"' +
      ' data-id="' + item.id + '"' +
      ' title="' + (isExpanded ? "Recolher detalhes" : "Ver detalhes") + '"' +
      '>' +
      (isExpanded ? ICONS.ChevronUp : ICONS.ChevronDown) +
      '</button>' +
      '</td>' +
      '</tr>';

    tableHtml +=
      '<tr id="detail-' + item.id + '" class="detail-row ' + (isExpanded ? '' : 'hidden') + '">' +
      '<td colspan="5">' +
      renderDetailPanel(item) +
      '</td>' +
      '</tr>';
  });

  if (ui.tableBody) ui.tableBody.innerHTML = tableHtml;
}

function renderMobileView(pageData) {
  var cardHtml = "";
  pageData.forEach(function(item) {
    cardHtml += renderMobileCard(item);
  });
  if (ui.mobileCardContainer) ui.mobileCardContainer.innerHTML = cardHtml;
}

function renderDetailPanel(item) {
  var detailItem = function(icon, label, content) {
    return (
      '<div class="flex items-start gap-3">' +
      icon +
      '<div class="flex-1 min-w-0">' +
      '<h5 class="text-sm text-gray-600">' + label + '</h5>' +
      content +
      '</div>' +
      '</div>'
    );
  };

  var dynamicPeriod = appState.displayPeriod;
  var isNet = appState.taxBracket !== 'bruta';
  var isento = isFundoIsento(item.nome);

  var rentabilidadeItem = function(periodKey, label) {
    if (dynamicPeriod === periodKey) return '';

    var rawValue = item[periodKey];
    var title = item.originalYields ? 'Bruta: ' + (item.originalYields[periodKey] || '') : '';
    var displayable = getDisplayablePercent(rawValue);
    var displayNode = displayable.displayNode;
    var titleContext = displayable.title;

    return detailItem(ICONS.Calendar, label,
      '<div' +
      ' class="text-base font-medium flex items-center ' + getPerformanceColor(rawValue) + '"' +
      ' title="' + (title || titleContext || '') + '"' +
      '>' +
      displayNode +
      ((isNet && !isento) ? '<span class="text-red-600 ml-1">*</span>' : '') +
      '</div>'
    );
  };

  var taxaMaxima = getDisplayablePercent(item.taxa_maxima);

  return (
    '<div class="detail-content grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">' +
    '<!-- Coluna 1: Dados Principais -->' +
    '<div class="space-y-6">' +
    detailItem(ICONS.Info, "CNPJ (Validado)",
      '<div id="cnpj-validator-' + item.id + '" class="cnpj-validator-container">' +
      '<!-- Validador será injetado aqui -->' +
      '</div>'
    ) +
    detailItem(ICONS.DollarSign, "Aplicação Inicial",
      '<p class="text-base font-medium text-gray-900">' + formatCurrencyString(item.aplicacao_inicial) + '</p>'
    ) +
    detailItem(ICONS.Tag, "Taxa Máx.",
      '<p class="text-base font-medium text-gray-900 flex items-center" title="' + (taxaMaxima.title || '') + '">' +
      taxaMaxima.displayNode +
      '</p>'
    ) +
    '</div>' +
    '<!-- Coluna 2: Rentabilidades e Lâmina -->' +
    '<div class="space-y-6">' +
    rentabilidadeItem('no_ano', 'Rentabilidade No Ano') +
    rentabilidadeItem('12_meses', 'Rentabilidade 12 Meses') +
    rentabilidadeItem('no_mes', 'Rentabilidade No Mês') +

    detailItem(ICONS.Download, "Lâmina do Fundo",
      item.lamina_link ?
      '<a' +
      ' href="' + item.lamina_link + '"' +
      ' target="_blank"' +
      ' rel="noopener noreferrer"' +
      ' title="Baixar Lâmina"' +
      ' class="text-base font-medium brand-text brand-text-hover inline-flex items-center gap-1"' +
      '>' +
      'Baixar Documento' +
      '</a>' :
      '<p class="text-base font-medium text-gray-500">N/A</p>'
    ) +
    '</div>' +
    '</div>'
  );
}

// v3.22.0: Nova função para gerenciar a UI do filtro de IR
function updateTaxFilterUI(isInfraFilterActive) {
  var taxButtons = document.querySelectorAll('#taxBracketButtons button');
  var taxContainer = document.getElementById('taxBracketButtons');

  if (isInfraFilterActive) {
    // Desativa todos os botões e remove a classe 'active'
    taxButtons.forEach(function(btn) {
      btn.disabled = true;
      btn.classList.remove('active');
      btn.classList.add('disabled'); // Adiciona classe para feedback visual
    });
    // Ativa e seleciona o botão 'Bruta'
    var grossButton = document.querySelector('#taxBracketButtons button[data-value="bruta"]');
    if (grossButton) {
      grossButton.classList.add('active');
      grossButton.setAttribute('aria-pressed', 'true');
    }
    taxContainer.title = 'O ajuste de IR é desativado ao filtrar por fundos de infraestrutura.';
  } else {
    // Reativa todos os botões
    taxButtons.forEach(function(btn) {
      btn.disabled = false;
      btn.classList.remove('disabled');
    });
    taxContainer.title = '';
  }
}

function renderPagination() {
  var totalItems = appState.processedData.length;
  var totalPages = Math.ceil(totalItems / appState.itemsPerPage);

  if (totalPages <= 1) {
    if (ui.paginationControls) ui.paginationControls.classList.add('hidden');
    return;
  }

  if (ui.paginationControls) ui.paginationControls.classList.remove('hidden');

  var startItem = totalItems === 0 ? 0 : (appState.currentPage - 1) * appState.itemsPerPage + 1;
  var endItem = Math.min(startItem + appState.itemsPerPage - 1, totalItems);

  var filtersActive = appState.processedData.length !== appState.allData.length;
  var baseSummary = appState.isMobile ?
    (startItem + '-' + endItem + ' / ' + totalItems) :
    ('Mostrando ' + startItem + '-' + endItem + ' de ' + totalItems);

  if (ui.paginationSummary) {
    ui.paginationSummary.textContent = filtersActive ?
      (baseSummary + ' (de ' + appState.allData.length + ' no total)') :
      baseSummary;
  }

  if (ui.prevPageBtn) ui.prevPageBtn.disabled = appState.currentPage === 1;
  if (ui.nextPageBtn) ui.nextPageBtn.disabled = appState.currentPage === totalPages;

  if (ui.pageNumbersContainer) ui.pageNumbersContainer.innerHTML = "";

  if (!appState.isMobile && ui.pageNumbersContainer) {
    var pagesToShow = [];
    if (totalPages <= 7) {
      pagesToShow = [];
      for (var i = 0; i < totalPages; i++) {
        pagesToShow.push(i + 1);
      }
    } else {
      pagesToShow = [1];
      if (appState.currentPage > 3) pagesToShow.push("...");
      var start = Math.max(2, appState.currentPage - 1);
      var end = Math.min(totalPages - 1, appState.currentPage + 1);
      for (var i = start; i <= end; i++) pagesToShow.push(i);
      if (appState.currentPage < totalPages - 2) pagesToShow.push("...");
      pagesToShow.push(totalPages);
    }

    var pageHtml = "";
    pagesToShow.forEach(function(page, index) {
      if (page === "...") {
        pageHtml += '<span class="px-3 py-2 text-sm text-gray-500">...</span>';
      } else {
        pageHtml += (
          '<button' +
          ' data-page="' + page + '"' +
          ' class="page-number-btn px-3 py-2 text-sm border font-medium rounded-lg transition duration-150 ' +
          (page === appState.currentPage ?
            "z-10 brand-bg text-white border-orange-600 shadow-sm" :
            "bg-white border-gray-300 text-gray-700 hover:bg-gray-50") +
          '"' +
          '>' +
          page +
          '</button>'
        );
      }
    });
    ui.pageNumbersContainer.innerHTML = pageHtml;

    document.querySelectorAll('.page-number-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { handlePageChange(Number(btn.dataset.page)); });
    });
  }
}

function renderMobileCard(item) {
  var isExpanded = appState.expandedRows.has(item.id);
  var displayPeriodKey = appState.displayPeriod;
  var periodLabels = { 'no_mes': 'No Mês', 'no_ano': 'No Ano', '12_meses': '12 Meses' };

  var rawValue = item[displayPeriodKey];
  var title = item.originalYields ? 'Bruta: ' + (item.originalYields[displayPeriodKey] || '') : '';
  var displayable = getDisplayablePercent(rawValue);
  var displayNode = displayable.displayNode;
  var titleContext = displayable.title;

  var isNet = appState.taxBracket !== 'bruta';
  var isento = isFundoIsento(item.nome);

  var riscoClasses = getRiscoClasses(item.risco);

  return (
    '<div class="bg-white rounded-lg shadow border border-gray-200 animate-fadeIn">' +
    '<!-- Card Header (Nome + Botão) -->' +
    '<div class="flex justify-between items-start p-4 ' + (isExpanded ? 'border-b border-gray-200 bg-gray-50' : '') + '">' +
    '<div class="flex-1 min-w-0">' +
    '<h4 class="text-base font-semibold text-gray-900" title="' + escapeHtml(item.nome) + '">' +
    buildNomeComTag(item) +
    '</div>' +
    '<button' +
    ' class="toggle-row-btn p-1 -mr-1 -mt-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"' +
    ' data-id="' + item.id + '"' +
    ' title="' + (isExpanded ? "Recolher detalhes" : "Ver detalhes") + '"' +
    '>' +
    (isExpanded ? ICONS.ChevronUp : ICONS.ChevronDown) +
    '</button>' +
    '</div>' +

    '<!-- Card Body (Grid 2x2) -->' +
    '<div class="p-4 grid grid-cols-2 gap-x-4 gap-y-5">' +
    '<!-- Rentabilidade (Destaque) -->' +
    '<div' +
    ' class="col-span-1"' +
    ' title="' + (title || titleContext || '') + '"' +
    '>' +
    '<span class="text-xs text-gray-500">Rentab. (' + periodLabels[displayPeriodKey] + ')</span>' +
    '<div class="text-xl font-bold ' + getPerformanceColor(rawValue) + ' flex items-center">' +
    displayNode +
    ((isNet && !isento) ? '<span class="text-red-600 ml-0.5">*</span>' : '') +
    '</div>' +
    '</div>' +

    '<!-- Risco (Tag) -->' +
    '<div class="col-span-1">' +
    '<span class="text-xs text-gray-500">Risco</span>' +
    '<div class="mt-1">' +
    '<span class="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ' + riscoClasses + '">' +
    (item.risco || 'N/A') +
    '</span>' +
    '</div>' +
    '</div>' +

    '<!-- Resgate -->' +
    '<div class="col-span-1">' +
    '<span class="text-xs text-gray-500">Resgate</span>' +
    '<div class="text-base font-medium text-gray-900" title="' + (item.resgateOriginal || '') + '">' +
    (item.resgateDisplay || '-') +
    '</div>' +
    '</div>' +
    '</div>' +

    '<!-- Detalhes (Escondido) -->' +
    '<div id="detail-' + item.id + '" class="detail-row-mobile ' + (isExpanded ? '' : 'hidden') + '">' +
    renderDetailPanel(item) +
    '</div>' +
    '</div>'
  );
}

/**
 * Converte um array de objetos JSON para uma string no formato CSV.
 * @param {Array<Object>} data O array de objetos a ser convertido.
 * @returns {string} A string formatada em CSV.
 */
function convertToCSV(data) {
  if (!data || data.length === 0) {
    return "";
  }

  var headers = [
    "Nome do Fundo", "CNPJ", "Risco", "Aplicação Inicial", "Resgate",
    "Rentabilidade 12 Meses", "Rentabilidade No Ano", "Rentabilidade No Mês",
    "Taxa Máxima", "Link da Lâmina"
  ];

  var rows = data.map(function(item) {
    var values = [
      item.nome,
      (item.possivel_cnpj || []).join('; '), // Concatena múltiplos CNPJs
      item.risco,
      item.aplicacao_inicial,
      item.resgateOriginal,
      item['12_meses'],
      item.no_ano,
      item.no_mes,
      item.taxa_maxima,
      item.lamina_link
    ];

    return values.map(function(value) {
      var strValue = String(value === null || value === undefined ? '' : value);
      // Se o valor contém vírgula, aspas ou quebra de linha, coloca entre aspas duplas
      if (strValue.search(/("|,|\n)/g) >= 0) {
        strValue = '"' + strValue.replace(/"/g, '""') + '"';
      }
      return strValue;
    }).join(',');
  });

  return [headers.join(',')].concat(rows).join('\n');
}

/**
 * Inicia o download de dados no formato CSV.
 * @param {string} csvContent O conteúdo do arquivo CSV.
 * @param {string} fileName O nome do arquivo a ser baixado.
 */
function exportDataToCsv(csvContent, fileName) {
  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement("a");

  if (link.download !== undefined) { // Feature detection
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}