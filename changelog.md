<!--
 * v3.26.0
 * 15/11/2025 04:04
 * v3.27.0
 * 2025-11-15 18:17 (Local)
-->
# **Itau Insights: Histórico de Versões**

## v3.27.0 (15/11/2025)

*   **FIX (Core/JS):** Corrigido o bug `BUG_InconsistentData_AfterAPIFailure`.
*   **REFAT (JS):** A função `handleLoadFromGithub` (em `api.js`) agora invoca `resetApplication` antes de iniciar a busca de dados. Isso garante que, se a busca de rede falhar, o estado da aplicação seja completamente limpo, prevenindo a exibição de dados antigos junto com uma mensagem de erro.
*   **CHORE (Docs):** Atualizado o changelog e a versão do app.

## v3.26.0 (15/11/2025)

*   **FIX (Security/JS):** Corrigido o bug `BUG_DataSanitizationToPreventXSS`.
*   **REFAT (JS):** Adicionada sanitização de dados na entrada do pipeline (`runDataPipeline`) para prevenir vulnerabilidades de Cross-Site Scripting (XSS). A função agora limpa todas as propriedades dos itens de dados antes do processamento, garantindo que nenhum script malicioso seja renderizado na UI.
*   **CHORE (Docs):** Atualizado o changelog e a versão do app.

## v3.25.1 (15/11/2025)
*   **FEAT (UI/JS):** Implementada a funcionalidade `FEAT_DataExport_CSV`.
*   **FEAT (UI):** Adicionado um botão "Exportar para CSV" no cabeçalho do dashboard, permitindo que o usuário baixe a visualização de dados atual (já filtrada e ordenada) como um arquivo `.csv`.
*   **CHORE (Docs):** Adicionado comentário de rastreamento (versão e data/hora) no topo dos arquivos modificados, conforme solicitado.
*   **CHORE (Docs):** Atualizado o changelog e a versão do app.

## v3.25.0 (15/11/2025)

*   **OPT (CSS/JS):** Implementada a otimização `OPT-STYLE-HARDCODED-TAG-INFRA`.
*   **REFAT (CSS):** O estilo da tag "Infra" foi movido do JavaScript para uma classe dedicada `.infra-tag` no arquivo `styles.css`, melhorando a separação de responsabilidades.
*   **REFAT (JS):** A função `buildNomeComTag` foi atualizada para usar a nova classe CSS, removendo os estilos embutidos.
*   **CHORE (Docs):** Atualizado o changelog e a versão do app.

## v3.24.0 (15/11/2025)

*   **FEAT (UI/UX):** Implementada a funcionalidade `FEAT-TAG-ISENTO` para identificação visual de fundos de infraestrutura.
*   **FEAT (UI):** Uma tag "Infra" agora é exibida permanentemente ao lado do nome de todos os fundos isentos de IR, tanto na visão de tabela (desktop) quanto nos cards (mobile).
*   **CHORE (Docs):** Atualizado o changelog e a versão do app.

## v3.23.0 (15/11/2025)

*   **FIX (API/JS):** Corrigido o bug `BUG-VALIDADOR-CNPJ`. A busca por CNPJ agora normaliza a entrada do usuário, removendo caracteres não numéricos (`.`, `/`, `-`). Isso torna a busca mais flexível e robusta.
*   **REFAT (JS):** A lógica de busca por CNPJ em `runDataPipeline` foi atualizada para usar a nova entrada normalizada.
*   **CHORE (Docs):** Atualizado o changelog e a versão do app.

## v3.22.0 (15/11/2025)

*   **FEAT (UI/JS):** Adicionado novo filtro "Apenas Fundos de Infraestrutura" no painel de filtros avançados.
*   **FEAT (Core/JS):** Implementada a lógica de filtragem em `runDataPipeline` para exibir apenas fundos que contenham palavras-chave como "infra", "debenture", etc.
*   **FEAT (UX/JS):** Ao ativar o filtro de infraestrutura, o filtro de "Ajuste de Rentabilidade (IR)" é automaticamente desabilitado e travado na opção "Bruta", melhorando a experiência do usuário.
*   **FEAT (UI/JS):** Adicionada a tag de filtro ativo "Apenas Fundos de Infra" quando o filtro está em uso.
*   **CHORE (Docs):** Atualizado o changelog com as novas funcionalidades.

## v3.21.0 (15/11/2025)

*   **FEAT (Core/JS):** A aplicação agora carrega os dados padrão de uma URL do GitHub que contém o JSON codificado em Base64.
*   **REFAT (JS/API):** A função `handleLoadFromGithub` foi atualizada para buscar o conteúdo como texto, decodificar a string Base64 (`atob`) e então processar o JSON resultante.
*   **CHORE (Docs):** Atualizado o changelog para refletir as novas funcionalidades.

## v3.20.0 (15/11/2025)

*   **FEAT (UI/HTML):** Adicionado um novo botão "Carregar Base64" para importar dados de um arquivo local (`.txt`, `.b64`, etc.) que contém uma string Base64.
*   **FEAT (JS/HTML):** Implementada a lógica de leitura de arquivo, decodificação de Base64 e carregamento dos dados via `processLoadedData` em um script isolado no HTML, sem alterar os módulos principais.
*   **CHORE (HTML):** Adicionado um novo `<input type="file">` oculto (`#base64FileInput`) para suportar a nova funcionalidade.

## v3.19.0 (14/11/2025)

*   **REFAT (Core/JS):** Realizada uma grande refatoração arquitetural no código JavaScript.
*   **CHORE (JS):** O arquivo monolítico `scripts.js` foi dividido em 7 módulos especializados (`constants.js`, `state.js`, `helpers.js`, `api.js`, `ui.js`, `events.js`, `app.js`) e movidos para um novo diretório `js/`.
*   **CHORE (HTML):** O arquivo HTML principal foi atualizado para carregar os novos módulos na ordem correta de dependência.
*   **BENEFÍCIO:** Essa modularização melhora drasticamente a organização, manutenibilidade, legibilidade e escalabilidade do código, seguindo o Princípio da Responsabilidade Única.

## v3.17.9 (14/11/2025)

*   **FIX (JS):** Conversão real para ES5. Substituídas todas as ocorrências de `const`, `let`, `...` (spread/rest) e arrow functions (`=>`) por `var` e `function() {}`.
*   **FIX (JS):** Isso corrige o `SyntaxError: Unexpected token '...'` que impedia o script de rodar.

## v3.17.8 (14/11/2025)

*   **FIX (JS):** Corrigido `SyntaxError: Unexpected token '...'`. (Falha na implementação)
*   **REFAT (JS):** Substituída toda a sintaxe ES6 (spread/rest `...` e `Object.assign`) por código ES5 compatível (loops `for`, `arguments`, `concat`). (Falha na implementação)

## v3.17.7 (14/11/2025)

*   **FIX (JS):** Corrigido o bug na ordenação "Crescente" (Menor > Maior) onde valores "N/A" iam para o topo.
*   **REFAT (JS):** A lógica de `data.sort` agora garante que valores nulos (N/A) sejam sempre enviados para o final da lista, independentemente da direção (asc/desc).
*   **REFAT (JS):** `getSortValue` para rentabilidade agora retorna `null` em vez de `Infinity` para ser tratado pela nova lógica de sort.

## v3.17.6 (14/11/2025)

*   **FEAT (UI/UX):** Alterados os textos (labels) do dropdown "Ordenar por:" (mobile) para serem mais claros e intuitivos (ex: "Maior > Menor" virou "Decrescente").

## **v3.17.5 (14/11/2025)**

* **FIX (JS):** Corrigido o bug na parsePercent que causava a ordenação incorreta de rentabilidades (ex: "Maior \> Menor").  
* **FIX (JS):** A função agora remove corretamente os separadores de milhar (ex: "1.234,56%") antes de converter para número, garantindo que valores altos sejam ordenados corretamente.

## **v3.17.4 (11/11/2025)**

* **FIX (HTML):** Corrigido o erro fatal TypeError: ui.tableBody is null.  
* **FIX (HTML):** O HTML dentro do \#desktopTableContainer estava malformado (faltavam as tags \<table\>, \<thead\> e o início do \<tr\>). Isso impedia o JavaScript de encontrar o elemento \#tableBody no DOM. O bloco da tabela foi restaurado.

## **v3.17.3 (11/11/2025)**

* **FIX (JS):** Corrigido outro SyntaxError: expected expression, got '\<' na função renderPagination. O loop forEach que gera os números da página estava corrompido.

## **v3.17.2 (11/11/2025)**

* **FIX (JS):** Corrigido um SyntaxError: expected expression, got '\<' (bloco de HTML dentro de JS).  
* **FIX (JS):** Restaurada a função renderMobileCard que estava corrompida.  
* **FIX (JS):** Movidas as funções helper para o escopo global.

## **v3.17.1 (11/11/2025)**

* **FIX (JS):** Corrigido um SyntaxError: missing ) after argument list (vários erros de sintaxe).

## **v3.17.0 (11/11/2025)**

* **FEAT (UI/UX):** Adicionado um menu dropdown "Ordenar por:" (visível apenas em mobile).  
* **FEAT (JS):** Implementada a lógica handleMobileSortChange.  
* **CHORE (JS):** Sincronizado o handleSortClick (desktop) e handleMobileSortChange (mobile).  
* **FIX (JS):** Corrigida a lógica getSortValue para 'risco' (ordenar por Baixo=1, Medio=2, Alto=3).

## **v3.16.0 (11/11/2025)**

* **FEAT (UI/UX):** Implementada a "Card View" para dispositivos móveis (appState.isMobile \=== true).  
* **REFAT (UI):** A tabela tradicional (\<table\>) agora é exibida apenas em desktops. Celulares veem uma lista de cards verticais.  
* **FEAT (UI):** O "Card View" resolve completamente o problema de scroll horizontal em telas pequenas.  
* **REFAT (JS):** A função renderTable() agora comanda a lógica de alternar entre "Card View" e "Table View".  
* **FEAT (JS):** Criada a função renderMobileCard() para gerar o HTML de cada card.  
* **CHORE (HTML):** Adicionados os containers \#desktopTableContainer e \#mobileCardContainer.  
* **CHORE (CSS):** Adicionado estilo .detail-row-mobile para a expansão dos cards.

## **v3.15.0 (11/11/2025)**

* **REFAT (UI):** Redesenhado o filtro de "Risco" para usar "Segmented Control" (horizontal), atendendo ao pedido do usuário por consistência visual.  
* **FEAT (UI):** Botões de Risco agora usam cores (Verde/Amarelo/Vermelho) quando ativos, combinando com as tags da tabela.  
* **REFAT (JS):** Lógica do filtro de Risco alterada de multi-select (array) para single-select (string), para se adequar ao Segmented Control.  
* **STYLE (CSS):** Adicionadas classes CSS (.risco-baixo, .risco-medio, .risco-alto) para os botões de filtro ativos.

## **v3.14.0 (11/11/2025)**

* **REFAT (UI):** Revertidos os botões de "Ajuste de IR" para o estilo segmented-control (horizontal) para manter a consistência visual com a "Análise de Performance", atendendo ao pedido do usuário.  
* **FIX (UI):** Encurtados os rótulos de texto (TAX\_LABELS) dos botões de IR (ex: "22.5%") para que os 5 botões caibam no layout de 1/3 de coluna sem quebrar a linha.  
* **CHORE (JS):** Revertida a lógica em buildAdvancedFilters e handleTaxBracketChange para usar segmented-btn em vez de filter-btn.

## **v3.13.3 (11/11/2025)**

* **FIX (UI):** Corrigido o layout quebrado dos botões de "Ajuste de Rentabilidade (IR)" (mesmo bug do Risco da v3.13.2).  
* **REFAT (UI/JS):** Botões de IR agora usam flex-col e o estilo filter-btn (vertical) em vez de segmented-control (horizontal).  
* **CHORE (JS):** Atualizada a lógica em buildAdvancedFilters e handleTaxBracketChange para os new botões de IR.

## **v3.13.2 (11/11/2025)**

* **FIX (UI):** Corrigido o layout quebrado dos botões de Risco dentro do painel de 3 colunas (v3.13.0).  
* **STYLE (UI):** Botões de Risco (filter-btn-group) agora são uma pilha vertical (flex-col) para se ajustarem à coluna de 1/3.  
* **STYLE (UI):** Botões de Risco (filter-btn) agora têm w-full para preencher a pilha vertical.

## **v3.13.1 (11/11/2025)**

* **FIX (JS):** Corrigido um SyntaxError (missing ) after argument list) causado por código duplicado (renderActiveFilterTags() e }) entre as funções handlePerfBenchmarkClick e handleTaxBracketChange.

## **v3.13.0 (11/11/2025)**

* **REFAT (UI/UX):** Revertido o painel de Risco para dentro do painel de filtros principal (desfazendo a v3.9.0).  
* **FEAT (UI):** Painel de filtros renomeado para "Filtros Avançados".  
* **FEAT (UI):** Painel de "Filtros Avançados" agora usa um layout de 3 colunas (Risco, Performance, IR).  
* **FEAT (UI):** Tags de Risco agora aparecem corretamente quando o painel de filtros está fechado.  
* **CHORE (JS):** Atualizada a lógica de "Limpar Filtros" (agora limpa Risco) e "Limpar Tudo" para refletir a nova estrutura.

## **v3.12.1 (11/11/2025)**

* **FEAT (UI):** Adicionado o favicon oficial do Itaú à aba do navegador.  
* **FIX (HTML):** Corrigido bug visual onde texto HTML aparecia no cabeçalho do painel de filtros (comentário mal posicionado).

## **v3.12.0 (11/11/2025)**

* **FEAT (Core):** Implementado o carregamento automático de dados do GitHub ao iniciar o app.  
* **FEAT (UI/UX):** O app agora pula o emptyState e vai direto para o dashboard, exibindo um spinner de carregamento na tabela.  
* **REFAT (UI/UX):** O emptyState foi reimaginado como uma tela de "Falha no Carregamento".  
* **FEAT (UI):** Se o carregamento automático falhar, o emptyState aparece com um botão "Tentar Novamente" e a opção de carregar um arquivo local.

## **v3.11.0 (11/11/2025)**

* **FEAT (UI/UX):** Redesenhado o estado vazio (emptyState) para carregar dados do GitHub por padrão (conforme imagem do usuário).  
  * **FEAT (JS):** Implementada a função handleLoadFromGithub para buscar o JSON diretamente da URL raw do GitHub.  
  * **FEAT (UI):** Adicionado um botão "Recarregar do GitHub" no cabeçalho do dashboard.  
  * **FEAT (UI):** O "Carregar Arquivo JSON" (local) agora é um link secundário no estado vazio.  
  * **REFAT (JS):** Criada a função processLoadedData para unificar o processamento do JSON, seja ele vindo de um arquivo local ou do fetch do GitHub.

## **v3.10.0 (11/11/2025)**

* **FEAT (UI/UX):** Adicionado um botão "Limpar Tudo" (Master Reset) ao lado de "Trocar Arquivo".  
* **FEAT (JS):** O botão "Limpar Tudo" reseta a Busca Global, o filtro de Risco e os filtros de Performance/IR.  
* **REFAT (UI):** O botão "Limpar Filtros" (dentro do painel) foi renomeado para "Limpar (Perf/IR)" para evitar confusão.  
* **FEAT (A11y):** Adicionados atributos role="group" e aria-pressed aos botões de filtro (Risco, Período, Benchmark, IR) para melhorar a acessibilidade de leitores de tela.

## **v3.9.0 (11/11/2025)**

* **REFAT (UI):** Reestruturado o painel de filtros para melhorar o layout.  
* **FEAT (UI):** O filtro de "Risco" foi movido para seu próprio card, sempre visível.  
* **FEAT (UI):** O painel sanfona (accordion) foi renomeado para "Filtros de Performance e IR".  
* **CHORE (JS):** Atualizada a lógica de UI e de "Limpar Filtros" para refletir a nova estrutura.

## **v3.8.0 (11/11/2025)**

* **FEAT (Busca):** A busca por texto agora ignora acentos (accent-insensitive).  
* **FEAT (Busca):** A busca por "itau" agora encontra "Itaú" e vice-versa.  
* **CHORE (JS):** Movida a função normalizeString para o escopo global de helpers.  
* **CHORE (JS):** handleGlobalFilterChange e runDataPipeline agora usam normalizeString para filtrar.

## **v3.7.3 (11/11/2025)**

* **FIX (UI):** Corrigido o "vazamento" visual (bug da "tag de filtro").  
* **STYLE (UI):** Removida a borda superior (border-t) do contêiner de tags (\#filterTagsContainer).  
* **STYLE (UI):** As tags de filtro ativas agora aparecem em um fundo limpo (sem borda) quando o painel está fechado, não parecendo mais um "vazamento" do conteúdo.

## **v3.7.2 (11/11/2025)**

* **HOTFIX (JS/HTML):** Corrigido o erro fatal ui.perfFilterToggle is null.  
* **FIX (HTML):** Restaurado o HTML do "Toggle Switch" de performance (id="perfFilterToggle") que estava faltando no Bloco B.

## **v3.7.1 (11/11/2025)**

* **HOTFIX (JS/HTML):** Corrigido o erro fatal ui.displayPeriodButtons is null.  
* **FIX (HTML):** Restaurado o conteúdo da coluna "Análise de Performance" (Blocos A, B, C) que foi acidentalmente removido na v3.7.0.

## **v3.7.0 (11/11/2025)**

* **REFAT (UI/UX):** Reestruturado o layout do painel de filtros para corrigir o desequilíbrio.  
* **FEAT (UI):** O filtro "Risco" agora ocupa 100% da largura (full-width) no topo do painel.  
* **FEAT (UI):** Os filtros "Performance" e "IR" agora ocupam 50% da largura cada, em uma grade de 2 colunas abaixo de "Risco".  
* **FIX (UI):** Corrigido o problema de "espaço em branco" e colunas "espremidas" (squeezed) do v3.6.1.

## **v3.6.1 (11/11/2025)**

* **HOTFIX (UI):** Corrigido o layout do filtro "Risco" que estava quebrado.  
* **FIX (JS):** Removidas classes obsoletas (w-full, text-left) do gerador de botões de Risco.  
* **FIX (JS):** Removido o ícone "Check" redundante dos botões de Risco, que causava o "wrap" incorreto do layout.  
* **STYLE (UI):** O painel de filtros avançados agora está com o layout de 3 colunas corrigido e equilibrado.

## **v3.6.0 (11/11/2025)**

* **REFAT (UI/UX):** Redesenhado o filtro de "Risco" de uma lista vertical para botões horizontais (flex-wrap).  
* **FIX (UI):** Corrigido o layout de 3 colunas que estava desequilibrado devido à altura da coluna "Risco".  
* **STYLE (UI):** O painel de filtros avançados agora tem um design 100% coeso.

## **v3.5.0 (11/11/2025)**

* **REFAT (UI/UX):** Redesenhada radicalmente a seção "Ajuste de Rentabilidade (IR)".  
* **FEAT (UI):** Substituído o toggle "Ligar/Desligar IR" e os rádio buttons por um único "Botão de Segmento".  
* **FEAT (Lógica):** A opção "Bruta" (sem IR) agora é a opção padrão no novo controle, simplificando o estado (removido isNetYield).

## **v3.4.0 (11/11/2025)**

* **REFAT (UI/UX):** Redesenhada radicalmente a seção "Análise de Performance".  
* **FEAT (UI):** Substituídos os botões de rádio por "Botões de Segmento" (Segmented Controls) para uma UI mais moderna.  
* **FEAT (Lógica):** Separada a lógica de "Período de Exibição" (o que a coluna mostra) da lógica de "Filtrar Performance" (o que a tabela esconde).  
* **FEAT (UI):** O filtro de performance agora é um toggle "opt-in", tornando a ação de filtrar muito mais clara.  
* **CHORE (CSS):** Adicionadas classes CSS (.segmented-control) para estilizar os novos componentes de botão.

## **v3.3.0 (11/11/2025)**

* **FEAT (Busca):** Unificada a barra de busca de "Nome" e "CNPJ" em uma única barra global.  
* **FEAT (Busca):** A barra agora detecta automaticamente se o input é texto (busca por nome) ou numérico (busca por CNPJ).  
* **FEAT (Validação):** Adicionada validação de dígito verificador para CNPJs de 14 dígitos.  
* **STYLE (Busca):** Adicionado feedback visual (texto de erro/aviso) abaixo da barra de busca para CNPJ inválido ou não encontrado.

## **v3.2.0 (11/11/2025)**

* **STYLE (Branding):** Aprofundada η identidade visual do "Itau Insights".  
* **FEAT (UI):** Adicionado ícone SVG minimalista inspirado no logo do Itaú ao cabeçalho.  
* **STYLE (UI):** Redesenhado o estado vazio (\#emptyState) com um botão de ação primário (laranja).  
* **STYLE (UI):** Alterado o fundo do body para bg-gray-100 (neutro).  
* **STYLE (UI):** Atualizado o cabeçalho da tabela (\<thead\>) para usar o texto azul escuro da marca.  
* **STYLE (UI):** Ícones de funcionalidade agora usam a cor laranja da marca (brand-icon).

## **v3.1.0 (11/11/2025)**

* **FEAT (Branding):** Renomeado o aplicativo de "LaminasX" para "Itau Insights".  
* **STYLE (UI):** Atualizado o esquema de cores de azul para o laranja corporativo do Itaú.  
* **FEAT (UI):** Adicionada nova descrição focada na análise de fundos do Itaú.

## ***Nota: Histórico anterior (como "LaminasX") importado do arquivo changelog.md original.***

## **v3.0.5-js (11/11/2025)**

* **REFAT (Plataforma):** Revertida toda a base de código de **React (.jsx)** de volta para **HTML e JavaScript puros** (Vanilla JS) com manipulação direta do DOM.  
* **FEAT (Build):** O aplicativo foi consolidado em um **único arquivo .html**, eliminando a necessidade de npm, node\_modules, ou qualquer processo de build.  
* **FEAT (Hosting):** A nova versão em arquivo único agora suporta hospedagem estática simples (como **GitHub Pages**), que era o objetivo principal da reversão.  
* **FEAT (Paridade):** Todas as funcionalidades e melhorias de UI da versão React v3.0.5 foram portadas com sucesso para o Vanilla JS, incluindo:  
  * A nova interface de Dashboard.  
  * O Painel de Filtros Avançados retrátil (accordion).  
  * As "Tags de Filtro Ativo" (quando o painel está fechado).  
  * O Filtro de Performance (\> 100% CDI, etc.).  
  * O cálculo de Rentabilidade Líquida (com toggle de IR).  
  * A validação assíncrona de CNPJ (com a API do Mais Retorno).  
  * As linhas da tabela expansíveis (painel de detalhes).  
* **CHORE (Deps):** Removidas todas as dependências de React e lucide-react. O app agora depende apenas do CDN do Tailwind CSS.

## **v3.0.5 (11/11/2025) \- Versão React**

* **REFAT (UI/UX):** Implementada a "Opção C" (Painel Retrátil / Accordion) para filtros.  
* **FEAT (UI):** Removido o componente \<FilterSidebar\> (layout de 2 colunas).  
* **FEAT (UI):** Adicionado o novo componente \<AdvancedFilterPanel\> à \<main\>, abaixo da Busca.  
* **FEAT (UI):** O novo painel é retrátil (accordion) e fechado por defeito.  
* **FEAT (UI):** Quando fechado, o painel exibe "tags" de filtros ativos (ex:$$Risco: Baixo (x)$$  
  ).  
* **FEAT (UI):** Quando aberto, o painel exibe os filtros num layout de 3 colunas (Risco, Performance, IR).  
* **CHORE:** Adicionado o ícone "X" (para fechar tags) e "SlidersHorizontal".

## **v2.5.0 (10/11/2025)**

* **FEAT (UI/UX):** Reestruturação do Painel de Filtros para um layout de coluna única vertical, inspirado no FundosX.  
* **STYLE:** Removido o layout lg:grid-cols-2 do painel de filtros.  
* **STYLE:** Adicionados cabeçalhos de seção (h4) para agrupar filtros (Busca Rápida, Filtros Principais, Análise Financeira, Estatísticas), melhorando η navegabilidade.  
* **STYLE:** Otimizado o layout vertical para eliminar o espaço em branco lateral e criar um fluxo de leitura de cima para baixo.

## **v2.4.0 (10/11/2025)**

* **FEAT (UI/UX):** Reestruturação visual do Painel de Filtros (v2.4.0), conforme sugestão do usuário.  
* **STYLE:** Removidos os labels de texto dos inputs "Nome" e "CNPJ".  
* **STYLE:** Adicionado ícone de Search (Lupa) *dentro* dos inputs de Nome e CNPJ.  
* **FEAT (UI/UX):** Substituídos os checkboxes de "Risco" por um componente de toggle visual.  
* **STYLE:** Adicionados ícones SignalLow, SignalMedium e SignalHigh para representar os níveis de risco de forma interativa.  
* **CHORE:** Atualizada a função de handleRiscoChange para handleRiscoToggle.

## **v2.3.0 (10/11/2025)**

* **FIX (Build):** Corrigido um erro de compilação (Unexpected "}") causado por um import incompleto/corrompido do lucide-react.  
* **FIX (Build):** Re-adicionados ChevronDown e ChevronUp à lista de importação (eles são usados pela tabela expansível).  
* **NOTE:** Esta versão foi um *hotfix* para a v2.2.1, que estava quebrada.

## **v2.2.1 (10/11/2025)**

* **FIX (Build):** Corrigido um erro de compilação (Unexpected "}") causado por um import incompleto/corrompido do lucide-react.  
* **FIX (Build):** Re-adicionados ChevronDown e ChevronUp à lista de importação (eles são usados pela tabela expansível).  
* **(ERRATA):** Esta versão foi gerada incompleta (causando App is undefined).

## **v2.2.0 (10/11/2025)**

* **FEAT (UI/UX):** Invertida a prioridade da UI (Foco nos Filtros, não nas Estatísticas).  
* **STYLE:** Removida a "Barra de Status" (que continha as estatísticas) do topo da página.  
* **STYLE:** O "Painel de Filtros" agora fica **visível por padrão** (não mais retrátil) após o carregamento dos dados.  
* **STYLE:** As estatísticas (Total de Fundos, Visíveis, Média) foram movidas para o **final** do Painel de Filtros, em uma nova seção "Estatísticas do Arquivo".

## **v2.1.2 (10/11/2025)**

* **FIX (Build):** Restaurado o código completo do LaminasX.jsx (v2.1.1 estava incompleto e causando o erro App is undefined).  
* **CHORE:** O CHANGELOG.md permanece separado.

## **v2.1.1 (10/11/2025)**

* **CHORE:** Movido o changelog do LaminasX.jsx para este arquivo (CHANGELOG.md).  
* **CHORE:** Atualizada a versão do app principal para v2.1.1.

## **v2.1.0 (10/11/2025)**

* **FEAT (UI/UX):** Corrigido o bug de usabilidade onde o filtro de performance (ex: "No Ano") não se refletia na tabela.  
* **FEAT:** A coluna "12 Meses" foi renomeada para "Rentabilidade".  
* **FEAT:** A seleção de período (No Ano, 12 Meses, No Mês) agora controla *dinamicamente* quais dados são exibidos na coluna "Rentabilidade".  
* **FEAT:** A ordenação da coluna "Rentabilidade" também é dinâmica.  
* **CHORE:** Adicionada η opção "No Mês" ao filtro de performance.

## **v2.0.4 (10/11/2025)**

* **FIX (Build):** Corrigido um erro de compilação (Unexpected "}") causado por um import incompleto/corrompido do lucide-react.

## **v2.0.3 (10/11/2025)**

* **FIX (Lógica):** Corrigido o operador do Filtro de Performance de \> (maior que) para \>= (maior ou igual a).  
* **FIX (UI/UX):** Os rótulos do "Filtro de Performance" agora são dinâmicos (mostrando benchmark líquido).

## **v2.0.2 (09/11/2025)**

* **FIX (Build):** Corrigido um erro de compilação (Unexpected "}") e removidos placeholders.

## **v2.0.1 (09/11/2025)**

* **FIX (Lógica):** Corrigido bug crítico onde o Filtro de Performance não interagia com o Ajuste de IR.

## **v2.0.0 (09/11/2025)**

* **FEAT (CNPJ):** Implementada "Validação Proativa de CNPJ" (Solicitado pelo usuário).  
* **FEAT:** Ao expandir os detalhes, o app agora testa *automaticamente* a lista de possivel\_cnpj contra a API do Mais Retorno.  
* **STYLE:** O painel de detalhes agora exibe um estado de "Verificando...", "Sucesso" (mostrando apenas o CNPJ válido) ou "Erro" (se nenhum for válido).  
* **FIX:** Removido o pop-up (Modal) de "Erro na Busca" de CNPJ. O app não oferece mais links inválidos.  
* **CHORE:** Refatorada a lógica de CNPJ para um novo componente CnpjValidator e removido o state loadingCnpj do componente App.

## **v1.9.2 (09/11/2025)**

* **FIX (Build):** Corrigido um bug de geração em que comentários de placeholder (// ...) eram enviados no arquivo final.

## **v1.9.1 (09/11/2025)**

* **FIX:** Corrigido um ReferenceError (ex: ArrowUp is not defined).

## **v1.9.0 (09/11/2025)**

* **FEAT (UI/UX):** Melhorada η exibição de dados não-numéricos (Fix da v1.8.0).  
* **STYLE:** Dados ausentes (ex: "--", null) são mostrados como um hífen (-).  
* **STYLE:** Dados não-aplicáveis (ex: "fundo com...") são mostrados como um ícone de Informação (\<Info /\>) com um tooltip.
