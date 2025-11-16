// --- LÓGICA DE CARREGAMENTO E API ---

/**
 * Gera um nome curto para um fundo removendo termos comuns.
 * @param {string} fullName O nome completo do fundo.
 * @returns {string} O nome curto gerado.
 */
function generateShortName(fullName) {
  if (!fullName) return '';

  // Lista de termos a serem removidos. A ordem pode ser importante.
  // Inclui variações e siglas comuns no mercado brasileiro.
  var termsToRemove = [
    'FUNDO DE INVESTIMENTO EM COTAS DE FUNDOS DE INVESTIMENTO', 'FUNDO DE INVESTIMENTO EM COTAS', 'FUNDO DE INVESTIMENTO',
    'CRÉDITO PRIVADO', 'RENDA FIXA', 'LONGO PRAZO', 'INVESTIMENTO NO EXTERIOR', 'INFRAESTRUTURA', 'INFRA',
    'MULTIMERCADO', 'REFERENCIADO', 'PREVIDÊNCIA', 'AÇÕES', 'CAMBIAL', 'SIMPLES',
    'FIQ', 'FIC', 'FIRF', 'FIM', 'FIA', 'PREV', 'REF', 'LP', 'CP', 'IE', 'DI'
  ];

  // Cria uma expressão regular para encontrar todas as ocorrências dos termos (case-insensitive).
  // O `\b` garante que estamos removendo palavras inteiras.
  var regex = new RegExp('\\b(' + termsToRemove.join('|') + ')\\b', 'gi');

  // Remove os termos e depois limpa espaços extras.
  return fullName.replace(regex, '').replace(/\s\s+/g, ' ').trim();
}

/**
 * Gera um nome curto para um fundo removendo termos comuns.
 * @param {string} fullName O nome completo do fundo.
 * @returns {string} O nome curto gerado.
 */

function processLoadedData(json) {
  try {
    if (!json.dados || !Array.isArray(json.dados)) {
      throw new Error("O JSON não contém um array 'dados' válido.");
    }
    appState.allData = json.dados.map(function(item) {
      // FIX: Substituído o spread operator ({...item}) por um loop para compatibilidade com ES5.
      var newItem = {};
      for (var key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          newItem[key] = item[key];
        }
      }
      newItem.fullName = item.nome; // Salva o nome original
      newItem.nome = generateShortName(item.nome); // Usa o nome curto como principal
      return newItem;
    });
    appState.currentPage = 1;
    populateRiscoFilter(json.dados);
  } catch (error) {
    console.error("Erro ao processar o JSON:", error);
    appState.error = 'Falha ao processar o JSON: ' + error.message;
    ui.emptyStateMessage.textContent = appState.error;
    ui.emptyState.classList.remove('hidden');
    ui.dashboardState.classList.add('hidden');
  } finally {
    appState.isLoading = false;
    runDataPipeline();
  }
}

async function handleLoadFromGithub() {
  // v3.27.0: Garante que o estado anterior seja limpo antes da busca.
  resetApplication();
  
  // v3.21.1: A URL agora aponta para um arquivo que contém os dados em Base64.
  var GITHUB_URL_BASE64 = "https://raw.githubusercontent.com/murilomanfre/itau.insights/76621291363e8d7bc4f0f242c9bb43bf1b831c81/dados.json";

  try {
    var response = await fetch(GITHUB_URL_BASE64, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Falha na rede: " + response.status + " " + response.statusText);
    }
    var base64String = await response.text();

    if (!base64String || base64String.trim() === '') {
      throw new Error("O arquivo do GitHub está vazio.");
    }

    // Decodifica a string Base64 para a string JSON original.
    var jsonString = atob(base64String);
    var jsonData = JSON.parse(jsonString);

    processLoadedData(jsonData);
  } catch (error) {
    console.error("Erro ao carregar do GitHub:", error);
    appState.error = "Falha ao carregar dados do GitHub: " + error.message;
    appState.isLoading = false;
    runDataPipeline(); // Atualiza a UI para mostrar o estado de erro
    ui.emptyStateMessage.textContent = appState.error;
    ui.emptyState.classList.remove('hidden');
    ui.dashboardState.classList.add('hidden');
  }
}

function handleFileLoad(event) {
  const file = event.target.files[0];
  if (!file) return;

  ui.emptyState.classList.add('hidden');
  ui.dashboardState.classList.remove('hidden');
  appState.isLoading = true;
  appState.error = null;
  appState.allData = [];
  appState.expandedRows.clear();
  runDataPipeline();

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      processLoadedData(json);
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
      appState.error = `Falha ao carregar o arquivo: ${error.message}`;
      appState.isLoading = false;
      runDataPipeline();
      ui.emptyStateMessage.textContent = appState.error;
      ui.emptyState.classList.remove('hidden');
      ui.dashboardState.classList.add('hidden');
    }
  };

  reader.onerror = () => {
    appState.error = "Erro ao ler o arquivo.";
    appState.isLoading = false;
    runDataPipeline();
    ui.emptyStateMessage.textContent = appState.error;
    ui.emptyState.classList.remove('hidden');
    ui.dashboardState.classList.add('hidden');
  };

  reader.readAsText(file);
  event.target.value = null;
}

function renderCnpjValidator(cnpjs, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = (
    '<div class="flex items-center gap-2 text-sm text-gray-500">' +
    ICONS.Loader2 +
    ' Verificando CNPJ...' +
    '</div>'
  );

  if (!cnpjs || cnpjs.length === 0) {
    container.innerHTML = '<div class="flex items-center gap-2 text-sm text-red-600">' + ICONS.AlertCircle + ' Nenhum CNPJ fornecido.</div>';
    return;
  }

  function checkNextCnpj(index) {
    if (index >= cnpjs.length) {
      container.innerHTML = '<div class="flex items-center gap-2 text-sm text-red-600">' + ICONS.AlertCircle + ' Nenhum CNPJ válido encontrado.</div>';
      return;
    }

    var cnpj = cnpjs[index];
    var cnpjLimpo = cnpj.replace(/[.\-/]/g, "");
    if (cnpjLimpo.length < 14) {
      checkNextCnpj(index + 1);
      return;
    }

    var apiUrl = 'https://api.maisretorno.com/v4/general/search/' + encodeURIComponent(cnpjLimpo);

    fetch(apiUrl)
      .then(function(response) {
        if (!response.ok) throw new Error('API Error');
        return response.json();
      })
      .then(function(results) {
        if (results && results.length > 0 && results[0] && results[0].canonical_url) {
          var redirectUrl = 'https://maisretorno.com/' + results[0].canonical_url;
          var isCopiedThis = appState.copiedCnpj === cnpj;

          container.innerHTML = (
            '<div class="cnpj-item">' +
            '<span class="text-base font-medium text-gray-900" title="' + cnpj + '">' + cnpj + '</span>' +
            '<button class="copy-cnpj-btn ' + (isCopiedThis ? 'copied' : '') + '" title="' + (isCopiedThis ? "CNPJ copiado!" : "Copiar CNPJ") + '" data-cnpj="' + cnpj + '">' +
            (isCopiedThis ? ICONS.Check : ICONS.Copy) +
            '</button>' +
            '<a href="' + redirectUrl + '" target="_blank" rel="noopener noreferrer" class="copy-cnpj-btn" title="Abrir no Mais Retorno">' +
            ICONS.ExternalLink +
            '</a>' +
            '</div>'
          );

          container.querySelector('.copy-cnpj-btn[data-cnpj]').addEventListener('click', function(e) { handleCopyCnpj(e, cnpj); });
        } else {
          checkNextCnpj(index + 1);
        }
      })
      .catch(function(err) {
        console.warn('Falha ao validar CNPJ ' + cnpj + ':', err.message);
        checkNextCnpj(index + 1);
      });
  }

  checkNextCnpj(0);
}