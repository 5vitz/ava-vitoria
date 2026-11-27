# 📍 Protocolo de Passagem de Bastão (Handover) — AVA Sem Limites

Este documento é a nossa âncora de persistência para as sessões de planejamento e codificação. Ele deve ser lido no início de cada sessão e atualizado ao final.

---

## 1. O que realizamos nesta sessão (Estado Atual — 26/11/2026 · Tarde/Início da Noite)

*   **🍎 CALIBRAÇÃO ESTÉTICA DEFINITIVA DO PAINEL ADMIN ("APPLE PRO STUDIO & TELA DE PINTURA PRETA HALFTONE 3PX") (`src/app/admin/admin-cockpit.module.css` & módulos irmãos) ✅:**
    *   **Nível 1 (Fundo Root — Tela de Pintura a Óleo Preta com Retícula Halftone `3px × 3px`):**
        *   `--admin-bg-color: #101012` com `--admin-bg-halftone: radial-gradient(rgba(255, 255, 255, 0.28) 0.85px, transparent 0.85px)` em malha `3px × 3px`, aplicado exclusivamente no fundo da página (sem invadir os cards).
        *   **Espaçamento Vertical Unificado e Ampliado (`--admin-container-gap: 24px`):** Todos os cards containers em `/admin`, `/admin/diretoria`, `/admin/agentes`, nos 8 Departamentos e telas auxiliares (`assinaturas`, `grid-manager`, `media`, `stock`, `design-system`) agora respiram com a mesma distância vertical exata controlada por 1 único token.
    *   **Nível 2 (Bandejas Containers — Alumínio Anodizado Prata com Chanfro Sutil `4px`):**
        *   `--admin-surface-container: linear-gradient(180deg, #ECECF0 0%, #D6D6DE 100%)`, `--admin-radius-container: 4px` e luz especular de topo (`inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 28px rgba(0, 0, 0, 0.28)`).
        *   Garante 100% de legibilidade para a Logo Preta e para todos os títulos e subtítulos em `#1D1D1F` / `#3A3A3C` em qualquer ponto do container.
    *   **Nível 3 & 4 (Cards Internos e Botões em Porcelana Acetinada `#F5F5F8` + Transparência Ativa `:hover`):**
        *   Eliminado o branco puro ofuscante (`#FFFFFF`), adotando Porcelana Acetinada (`#F5F5F8`) com chanfro sutil de `3px` (`--admin-radius-card: 3px`, `--admin-btn-radius: 3px`) e brilho especular superior (`inset 0 1px 0 #FFFFFF`).
        *   Todos os botões ativos e primários (`🏛️ DIRETORIA`, `🗄️ ARQUIVO CENTRAL`, `+ PROPOR COLEÇÃO`, abas selecionadas) utilizam a transparência translúcida padronizada do estado `:hover` (`rgba(0, 0, 0, 0.14)` com texto `#000000` e borda escura).

*   **🪗 SISTEMA UNIFICADO DE ACCORDIONS & LIMPEZA DA DIRETORIA EXECUTIVA (`src/app/admin/diretoria/page.tsx` & `admin-cockpit.module.css`) ✅:**
    *   **Classes Globais de Accordion Criadas no `admin-cockpit.module.css`:** `.accordionHeaderBar`, `.accordionTitleGroup`, `.accordionRightGroup`, `.accordionToggleBtn`, `.accordionToggleBtnOpen`, `.accordionBody`, `.subAccordionBox`, `.subAccordionHeader` e `.subAccordionContent` — prontas para enxugar tabelas e seções longas em todos os departamentos com 1 único padrão.
    *   **Remoção da Telemetria Redundante na Diretoria (`/admin/diretoria`):** Eliminado o card final de Telemetria dos Agentes da página da Diretoria, pois os Agentes já possuem sua página própria e completa em `/admin/agentes` (botão `🤖 AGENTES` no topo).
    *   **3 Grandes Seções da Diretoria Convertidas em Accordions:**
        1. `⚡ 1. Motor de Inteligência da Diretoria: 2 Relatórios Automáticos (Flávio & Gustavo)` (com badges de resumo no cabeçalho).
        2. `🗄️ 2. Sistema Central de Arquivamento de Pedidos (Clientes vs. Amostras)` (nascendo recolhido, com atalhos diretos para as pastas no cabeçalho + **Sub-Accordion dedicado para a Tabela das 6 Peças Homologadas da Dimona `#755-460-927`**).
        3. `🏛️ 3. Conselho Societário (4 Sócios · 2 Deptos cada) & Espelho do Fluxo Geral (PDF Oficial)` (nascendo recolhido).

*   **🎯 PRÓXIMA TAREFA IMEDIATA (CONTINUAR EXATAMENTE DAQUI AO VOLTAR DO LANCHE):**
    1. **Importante para economia de cota (Fast Tier):** Na abertura da próxima conversa, ler **apenas o `docs/SESSION_HANDOVER.md`** (sem ler os outros 17 arquivos de `docs/` a menos que necessário).
    2. **Formatação em Accordions & Fluxo Tecno-Criativo `Depto 07 (Marketing de Produto)` ➔ `Depto 08 (Atelier Criativo)`:**
       * Continuar a varredura de formatação (Accordions para enxugar altura vertical) a partir do **`Depto 07 · Marketing de Produto` (`/admin/marketing`)**, onde está a **`FASE 0 (Ponto de Partida): Carta Conceitual da Coleção — Os 4 Pilares Fundadores`** (*1. Nome, 2. Tema/Tendência, 3. Estética, 4. Mensagem A·V·A* aprovados por toda a Diretoria 4/4).
       * **Conexão com o Início do Trabalho no `Depto 08 · Atelier Criativo` (`/admin/atelier`):** Uma vez aprovadas as definições iniciais da Coleção pela Diretoria (4/4), o ponto de partida de todo o processo tecno-criativo no Atelier é a **entrada/análise de uma Imagem de Referência** para ser decomposta em suas **propriedades mapeadas no JSON** (Decomposição Visual ➔ Desvinculação Autoral ➔ Geração do JSON de Escrita e Prompt to Image da nova obra da coleção), aproveitando também para organizar as tabelas/listas extensas do Atelier em **Accordions**.

---

## 1.0-AAA. Histórico da Sessão Anterior (25–26/11/2026 · Noite/Madrugada)

*   **🧭 O ESPELHO DO FLUXO GERAL DE PROCESSOS (360°), LIMPEZA DE DADOS FICTÍCIOS ("TABULA RASA") & ROTEIRO E2E DA PEÇA ÚNICA PELOS 8 DEPARTAMENTOS (`/api/admin/workflow`, `src/lib/workflowState.ts`, `docs/REUNIAO/05_ESPELHO_FLUXO_GERAL_DE_PROCESSOS.pdf` & `Vale_uma_NFe_AVA.pdf`) ✅:**
    *   **1. Levantamento Completo das Atribuições dos 4 Sócios × 8 Departamentos (Base para o Contrato Social MEI ➔ LTDA):**
        *   **Flávio (`01 · Jurídico & Compliance` + `02 · Financeiro, Fiscal & ERP`):** Transição MEI ➔ LTDA, INPI, Registro Blockchain (`.ots` OpenTimestamps Bitcoin) do JSON de 26 Chaves vindo do Atelier, Conta PJ, Bling ERP v3 (`NCM 6109.10.00 × cClassTrib` — LC 214/2025), emissão do PDF `"Vale uma NF-e"` na Sala de Reuniões, interlocução com o Contador (`Convidado Nível 2`), Unit Economics (DRE) e ressarcimentos pré-operacionais.
        *   **Armando / *Genera* (`03 · Arquitetura & TI` + `04 · Produção & Fornecedores`):** Arquitetura Next.js 16 / PostgreSQL ACID, VPS Contabo (`31.220.102.2`), 23 Agentes de IA, Hub Multi-Supplier PoD (Dimona, Printful, Reserva INK, Parceria Fábrica King SP), Estoque Físico e condução da esteira fabril até a fronteira **`4. Pronto na Doca / Aguardando Coleta`**.
        *   **Gustavo (`05 · SAC` + `06 · Marketing de Vendas`):** Torre Logística Pós-Coleta (`COLETADO` ➔ Entrega Final via GraphQL J&T/Intelipost), Concierge IA 24/7 + Cláusula de Terceirização BPO ao atingir 5 atendimentos humanos/dia (`Senha Convidado Nível 1`), Ciclo PDCA de Tráfego Pago (ROAS) guiado pelo Relatório da Diretoria (*Mais Vendido / Mais Encomendado / Menos Vendido*) e 10 Canais de Venda.
        *   **Tripoint (`07 · Marketing de Produto` + `08 · Atelier Criativo & Mídias`):** Ponto de Partida (Fase 0 — Os 4 Pilares da Coleção: *1. Nome, 2. Tema/Tendência, 3. Estética, 4. Mensagem A·V·A*), Visual Merchandising da Vitrine Canônica (Grid 3x3 9:16), Trios 3x3 Instagram, campanha `"EU TENHO CUPOM!"`, Matriz Canônica MDV 26 Chaves e Matrizes 300 DPI.
    *   **2. Fluxograma Executivo Oficial em PDF (Lâmina A4 — Estética 4 Níveis do Painel Admin):**
        *   Gravado em [`docs/REUNIAO/05_ESPELHO_FLUXO_GERAL_DE_PROCESSOS.pdf`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/05_ESPELHO_FLUXO_GERAL_DE_PROCESSOS.pdf) e indexado em [`docs/REUNIAO/INDEX.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/INDEX.md).
    *   **3. Eliminação de 100% dos Dados Fictícios ("Tabula Rasa") & Sistema Central de Arquivamento de Pedidos na Diretoria (`/admin/diretoria`):**
        *   Removidas todas as pautas fictícias da Urna 4/4 (`AdminCockpitClient.tsx`), pautas pré-fabricadas da Sala de Reuniões (`/api/admin/boardroom/pautas`), chamados fictícios de troca do SAC (`/admin/atendimento`) e métricas fictícias de tráfego (`/admin/vendas`).
        *   **Sistema Central de Arquivamento na Diretoria Executiva ([`/admin/diretoria`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/diretoria/page.tsx)):** Separa o histórico em duas gavetas:
            *   **`🧪 Pasta: Amostras`:** O lote real das 6 amostras da Dimona (`#755-460-927` · `R$ 472,80` · `NF-e #114273`), por já ter chegado e ser esporádico, nasce **arquivado aqui** e contabilizado como Investimento P&D no Financeiro do Flávio.
            *   **`👤 Pasta: Clientes`:** Nasce limpa (`0 pedidos`), recebendo os pedidos reais de clientes assim que o SAC confirma a entrega final.
        *   **Geração Automática dos 2 Relatórios Executivos na Diretoria:** Sempre que um pedido bate no Arquivo da Diretoria, o motor gera automaticamente:
            1.  **💎 Relatório #1 (Para o Flávio · `02 · Financeiro`):** Consolidado de Receita Bruta de Clientes, Custo PoD, Simples Nacional (6%), Taxa Gateway (3,5%), Lucro Líquido Real, Despesa P&D de Amostras (`- R$ 472,80`) e vínculos com as NF-es (`#114273` e `"Vale uma NF-e"`).
            2.  **📈 Relatório #2 (Para o Gustavo · `06 · Marketing de Vendas`):** Subsídio informacional apontando o **Produto Mais Vendido**, a **Modelagem/Cor Mais Encomendada**, o **Produto Menos Vendido** e o direcionamento automático de onde escalar ou pausar verba de tráfego pago (ROAS).
    *   **4. Documento Oficial `"Vale uma NF-e"` (`Vale_uma_NFe_AVA.pdf`) & Esteira Conectada da Peça Única (Fase 0 a Fase 4):**
        *   Gerado o PDF [`public/PDF/Vale_uma_NFe_AVA.pdf`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/public/PDF/Vale_uma_NFe_AVA.pdf) (espelhado em [`docs/REUNIAO/Vale_uma_NFe_AVA.pdf`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/Vale_uma_NFe_AVA.pdf)) como equivalente da NF-e Modelo 55 (pré-integração Bling) para anexação na Sala de Reuniões.
        *   Implantada a **Bússola Viva do Espelho do Fluxo** no `/admin` e a conexão persistente em banco PostgreSQL (`ava_unified_workflow_v1`) entre todos os departamentos:
            *   **Fase 0 (`/admin/marketing` ➔ `Urna 4/4`):** Tripoint propõe os **4 Pilares da Coleção** (*1. Nome, 2. Tema/Tendência, 3. Estética, 4. Mensagem A·V·A*) ➔ Diretoria vota 4/4 e destrava o Atelier.
            *   **Fase 1 (`/admin/atelier` ➔ `/admin/juridico`):** Tripoint aprova a Peça Única (`SHA-256`) ➔ Flávio registra o JSON de 26 Chaves na Blockchain (`.ots` OpenTimestamps Bitcoin).
            *   **Fase 2 (`/admin/financeiro` ➔ `Urna 4/4` ➔ `/admin/marketing`):** Flávio calcula o Unit Economics e envia à Urna 4/4 ➔ Preço aprovado ➔ Tripoint publica a **Peça Única repetida em todos os cards da Vitrine Oficial (`/`)**.
            *   **Fase 3 (`/admin/vendas` ➔ `/admin/financeiro` ➔ `Sala de Reuniões`):** Compra de cliente gera o Pedido Vivo `#AVA-101` ➔ Flávio anexa o **`Vale_uma_NFe_AVA.pdf`** na Sala de Reuniões (protocolado pelo Agente Porteiro) para Armando e Gustavo, liberando a Produção.
            *   **Fase 4 (`/admin/producao` ➔ `/admin/atendimento` ➔ `/admin/diretoria`):** Armando avança até `4. Pronto na Doca` e transborda `COLETADO` ao SAC ➔ Gustavo confirma a entrega final e arquiva na Diretoria (`👤 Clientes`), disparando os **2 Relatórios Automáticos (Flávio e Gustavo)**.
    *   **Validação Técnica:** `npx tsc --noEmit` validado com **0 erros TypeScript**.

---

## 1.0-AA. Histórico da Sessão Anterior (25/11/2026 · Tarde)

*   **🏛️ ARQUITETURA CSS UNIFICADA EM 4 NÍVEIS & LIMPEZA DE 758 ESTILOS INLINE NO PAINEL ADMIN (`src/app/admin/admin-cockpit.module.css`) ✅:**
    *   **Eliminação da Desorganização Herdada do Transplante (`Star-Ink` ➔ `Ava-Vitoria`):** Removidos **758 blocos `style={{ ... }}` inline** que haviam sido gerados na conversão do Tailwind da `Star-Ink`, zerando estilos inline em todos os **8 Departamentos**, `AdminCockpitClient.tsx`, `AdminHeader.tsx`, `diretoria/page.tsx`, `agentes/page.tsx`, `financeiro/assinaturas/page.tsx` e modais.
    *   **Domínio por Comando Único (Tokens CSS em 4 Níveis sob `.adminLayout`):**
        *   **Nível 1 (Fundo da Página):** `--admin-bg-page: linear-gradient(180deg, #E2E2E4 0%, #C0C0C5 100%)` (corrigido bug de `background-color: linear-gradient(...)` nos módulos irmãos).
        *   **Nível 2 (Cards Containers / Bandejas):** `--admin-surface-container: #EEEEF2` e `--admin-border-container: 1px solid #8E8E98`.
        *   **Nível 3 (Cards Internos Flutuantes):** `--admin-surface-card: #FFFFFF` (Branco Puro) e `--admin-border-card: 1px solid #8E8E98`.
        *   **Nível 4 (Botões, Abas e Inputs):** `--admin-btn-bg: #FFFFFF`, `--admin-btn-border: 1px solid #8E8E98` e vidro fumê translúcido nos botões ativos.
    *   **Refinamentos Visuais Homologados pelo Genera:**
        *   **Halftone Desativado (`src/app/globals.css`):** Desligada a camada global `body::before` que jogava micropontos escuros sobre o branco puro `#FFFFFF` dos cards.
        *   **Bordas Unificadas em Cinza Médio Metálico (`1px solid #8E8E98`):** Aplicadas tanto nos Cards Containers (Nível 2) quanto nos Cards Internos e Botões (Níveis 3 e 4).
        *   **Proporção da Logo AVA no Topo Admin:** Reduzida de `44px` para `36px` de altura (`.avaOfficialLogoImg`) para dar mais respiro à primeira faixa do cabeçalho.

*   **🔐 DECISÃO ARQUITETURAL & DE GOVERNANÇA SOCIETÁRIA: FLUXO BIPARTITE DE APROVAÇÃO DE ARTE (TRIPOINT · ATELIER) ➔ REGISTRO BLOCKCHAIN DO JSON 26 CHAVES (FLÁVIO · JURÍDICO / DR. LEX) 📋:**
    *   **Divisão Estrita de Competências entre Sócios e Departamentos:**
        1. **Etapa 1 — Aprovar Arte para Coleção (`Depto 08 · Atelier Criativo` — Titular: Tripoint / Direção Criativa: Genera):**
           * No painel `/admin/atelier`, ao aprovar uma obra para figurar na coleção/vitrine, o botão **`✅ Aprovar Arte para Coleção`** (assistido pelo agente **Curador Visual**) congela o arquivo JSON da Matriz Canônica de 26 Chaves (`{CODE}_writing_matrix26.json`) + Prompt Compilado, calcula o Hash Criptográfico definitivo **SHA-256** (`coa_hash_sha256`), muda o status para `APPROVED_PENDING_BLOCKCHAIN` e envia automaticamente para a fila do Jurídico.
        2. **Etapa 2 — Registrar JSON na Blockchain (`Depto 01 · Jurídico & Compliance` — Titular: Flávio / Agente: Dr. Lex):**
           * No painel `/admin/juridico`, uma bandeja dedicada recebe as **Artes Aprovadas Aguardando Registro Blockchain**.
           * O **Flávio** (com execução automatizada via API pelo agente **Dr. Lex**) aciona **`⛓️ Registrar JSON na Blockchain`**, ancorando o Hash SHA-256 nos calendários públicos do protocolo **OpenTimestamps (Blockchain Bitcoin — 100% on-line, custo R$ 0,00 por registro e zero mensalidade)** (com suporte preparado para Smart Contract Polygon PoS), gerando o comprovante imutável de anterioridade autoral (`.ots` / Certificado COA) e atualizando o status para **`🔒 APROVADA & REGISTRADA NA BLOCKCHAIN`** tanto no Jurídico quanto no Atelier.

---

## 1.0-A. Histórico da Sessão Anterior (24–25/11/2026 · Madrugada)

*   **🎨 GAVETA 3 TRANSPLANTADA & HOMOLOGADA: PROMPT TO IMAGE — MATRIZ CANÔNICA DE 26 CHAVES & MOTOR DE DECOMPOSIÇÃO VISUAL (MDV) (`/admin/atelier`, `/api/artworks` & `docs/atelier/`) ✅:**
    *   **Acervo Normativo & Scanner Matemático (`docs/atelier/` e `scripts/mdv_scanner.py`):**
        *   Transplantados da `Star-Ink` para a `Ava-Vitoria`: [`docs/atelier/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf) (espelhado em `/public/PDF/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf`), [`docs/atelier/COLECAO_OP_ART_RELOAD_E_ARQUITETURA_MDV.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/COLECAO_OP_ART_RELOAD_E_ARQUITETURA_MDV.md), [`docs/atelier/ENGENHARIA_DE_PROMPT_E_MATRIZ_DE_CORES_POD.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/ENGENHARIA_DE_PROMPT_E_MATRIZ_DE_CORES_POD.md) e [`docs/atelier/ENGENHARIA_REVERSA_DE_ARTES.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/ENGENHARIA_REVERSA_DE_ARTES.md).
        *   Script Python [`scripts/mdv_scanner.py`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/scripts/mdv_scanner.py) (NumPy + Pillow) para extração matemática de pixels (`negative_space_percent`, espessura de traço `1px-3px`, vetores de Sobel `45°` vs. `90°` e entropia zonal `3x3`).
    *   **Pasta-Projeto `Testes` & Obra Inaugural `AVA-TEST-001` (`public/imagens/projetos/Testes/`):**
        *   Arquivada a obra **[`AVA-TEST-001_jazz_dancer_3d_75deg.jpg`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg)** (*Bailarina de Jazz em Salto 3D — 75° Z-Axis Foreshortening*) com seu JSON de Escrita completo de 26 chaves ([`AVA-TEST-001_writing_matrix26.json`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/projetos/Testes/AVA-TEST-001_writing_matrix26.json)).
    *   **Camada de Persistência PostgreSQL & Compilador Prompt-to-Image ([`src/lib/artworks.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/lib/artworks.ts) & [`src/app/api/artworks/route.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/api/artworks/route.ts)):**
        *   Persiste **exclusivamente o JSON de Escrita (26 Chaves)** nos 4 Eixos Canônicos (*I. Ontológico `01-07`*, *II. Epistemológico `08-16`*, *III. Metodológico `17-24`*, *IV. Extensão MDV `25-26`*), validando o Subprocesso de Desvinculação Autoral (`mutated_keys_count >= 7`) e gerando o hash criptográfico real **SHA-256** (`crypto.createHash('sha256')`).
        *   Painel [`/admin/atelier`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/atelier/page.tsx) atualizado com Editor Interativo das 26 Chaves, Compilador **Prompt to Image** em tempo real, filtro por Pasta-Projeto (`Testes`, `Coleção Sem Limites`, `Op-Art Reload`) e chaveamento 1-clique `✓ Registrado: SIM / NÃO`.

*   **🚚 ENGENHARIA REVERSA DA API GRAPHQL INTELIPOST / J&T EXPRESS & DIVISÃO DE ALÇADAS PRODUÇÃO vs. SAC (`/api/sac/tracking`, `/admin/producao` & `/admin/atendimento`) ✅:**
    *   **Conexão Direta na API GraphQL da Transportadora (`POST https://tracking-graphql.intelipost.com.br/`):**
        *   Extraído o schema GraphQL do portal `status.ondeestameupedido.com/tracking/1168/755460927` (`clientId: "1168"` da Dimona) e criada a rota [`/api/sac/tracking`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/api/sac/tracking/route.ts).
    *   **Diagnóstico Real dos Tempos & Gargalo do Pedido `#755460927`:**
        1. **Produção Industrial (Dimona Silk HD):** Pago em `17/11 02:11` ➔ Etiqueta & Despacho CD em `20/11 09:30` = **`3d 07h (79.3h)`** (🟢 SLA Industrial 100% cumprido).
        2. **Gargalo de Doca / Espera por Coleta:** Despachado CD em `20/11 09:30` (sexta/feriado Consciência Negra) ➔ `COLETADO` pela J&T Express em `23/11 18:20` (segunda) = **`3d 09h (78.8h)`** parado na doca aguardando coleta.
        3. **Trânsito Rodoviário Interestadual (J&T Express RJ ➔ ES):** Coletado no RJ em `23/11 18:20` ➔ **Chegada na Filial Vitória/ES** em `24/11 15:45` = **`21h 25m`** (previsão de entrega: `27/11/2026`).
    *   **Fronteira Organizacional Definida no Sistema (Produção vs. SAC):**
        *   **`Depto 04 · Produção` (Armando — [`/admin/producao`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/producao/page.tsx)):** Alçada encerra estritamente em **`4. Pronto na Doca / Aguardando Coleta`**, transbordando a NF-e ao Financeiro (Flávio) e o Rastreio Logístico ao SAC (Gustavo).
        *   **`Depto 05 · SAC` (Gustavo — [`/admin/atendimento`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/atendimento/page.tsx)):** Recebeu a **Torre Logística Pós-Coleta & Comunicação com o Cliente**, com linha do tempo ao vivo da API J&T/Intelipost, detector automático de gargalo de coleta e gerador de comunicado proativo de WhatsApp para o cliente.

*   **🏛️ TAREFA 1 CONCLUÍDA & VALIDADA EM PRODUÇÃO: ESTILIZAÇÃO PALHA/MARFIM DAS TELAS MANTIDAS & CORREÇÃO DO CHAVEAMENTO DE COLEÇÕES DA VITRINE ✅:**
    *   **Padronização Visual (`#EFE4CC` / `#DFCFA8` / `#FAF6EE`):** Modernizadas 100% em CSS Modules as telas `/admin/grid-manager`, `/admin/media`, `/admin/stock`, `/admin/design-system` e `/admin/dashboard`, eliminando o fundo preto legado.
    *   **Rota Unificada [`/api/collections`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/api/collections/route.ts) & Ciclo de Vida React (`key={currentCollection.id}`):** Resolvido o congelamento de estado do React ao alternar coleções no seletor do Grid Manager e da Biblioteca de Mídia, garantindo que o botão **`[ ⚡ Definir esta Coleção como Vitrine Ativa ]`** apareça imediatamente e reflita na Vitrine pública (`/`).

---

## 1.0. Histórico Imediato Anterior (23/11/2026 · Noite)

*   **👑 ENGENHARIA REVERSA (REA) COMPLETA DA FÁBRICA KING & PITCH DE PERMUTA DISPARADO (`docs/KING/`) ✅:**
    *   **Pasta Dedicada Criada:** `docs/KING/` criada fora de Fornecedores, isolando o projeto estratégico de expansão fabril e criação de novo polo próprio em SP.
    *   **Auditoria REA nos Bundles de Produção da King (`fabricaking.com.br`):**
        *   **Stack Real Identificada:** Construtor **Lovable.dev** (Project ID `lovp_0b309z81x28fpt8hqbk1bqwear`), **TanStack Start / TanStack Router (TSR)**, runtime Rolldown/Vite (`rolldown-runtime-hePW80VL.js`), Cloudflare R2 (`pub-bb2e...r2.dev`) com proxy `/__l5e/assets-v1/...`.
        *   **Banco de Dados Operacional Real:** As Ordens de Produção (OPs) rodam em um aplicativo **Glide Apps** (`status_glide`).
        *   **O Gargalo de Ouro Comprovado pelo Código:** No bundle `op-detalhe-DzUAJHRz.js`, a origem dos pedidos é estritamente: `l.origem === 'manual' ? 'Lançamento manual' : 'Lote de PDFs'`. A fábrica **NÃO possui API**; os pedidos são digitados à mão ou baixados de PDFs de e-mail/WhatsApp.
        *   **A Trava de 5 MB:** No bundle `enviar-arte-DkfQQFaL.js`, o código bloqueia qualquer upload acima de 5 MB (`5242880` bytes), impedindo que marcas enviem matrizes profissionais em 300 DPI (15 MB a 50 MB) e redirecionando o cliente de volta para o WhatsApp da Adriane.
    *   **Dossiê Técnico Salvo:** [`docs/KING/AUDITORIA_ENGENHARIA_REVERSA_REA_FABRICA_KING.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/KING/AUDITORIA_ENGENHARIA_REVERSA_REA_FABRICA_KING.md) e projeto atualizado em [`docs/KING/PROJETO_PARCERIA_TECNOLOGICA_KING_CONNECT.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/KING/PROJETO_PARCERIA_TECNOLOGICA_KING_CONNECT.md).
    *   **Mensagem Executiva de Abordagem Disparada (WhatsApp · 23/11 às 23:26):**
        *   Enviada pelo Genera Armando com tom extremamente didático, coloquial, sem jargões em inglês e com alta inteligência psicológica:
        *   *"Anderson e Adriane, bom dia! Estivemos olhando com calma o site e o atendimento de vocês... Para fins de referência, entrem no site da Dimona, de estamparia sob demanda (https://www.camisadimona.com.br/estudio/)... Como temos e-commerce próprio nesse ramo, temos interesse em estudar um modelo baseado em permuta: seus produtos pelo nosso sistema. Se fizer sentido para vocês, damos prosseguimento a essa ideia"*.

*   **🤖 NOVO BOTÃO `AGENTES`, HUB `/admin/agentes` & TELEMETRIA NA DIRETORIA EXECUTIVA ✅:**
    *   **Botão `🤖 AGENTES` no Header Principal:** Removido o botão redundante `🚨 CONVOCAR REUNIÃO` de perto da Logo, substituindo-o pelo botão com visual vidro fumê `🤖 AGENTES` no `AdminHeader.tsx`.
    *   **Nova Página Dedicada (`/admin/agentes`):** Hub completo de monitoramento dos 16 agentes autônomos da Mesa Redonda com filtros por diretoria e status em tempo real.
    *   **Telemetria Reincorporada à Diretoria:** A seção de Telemetria foi reinserida na base da página de Diretoria Executiva (`/admin/diretoria`), com cards clicáveis que abrem o dossiê modal de atribuições de cada agente (`AgentDossierModal`).
    *   **Correção dos LEDs de Presença Societária:** Apenas o sócio logado (`armando`) exibe LED verde (`#059669`). Sócios ausentes (`flavio`, `tripoint`, `gustavo`) agora exibem LED âmbar/amarelo (`#D97706`). Fundo preto chapado do nome do sócio removido, mantendo o tom palha nobre (`#FAF6EE`).
    *   **Substituição do Preto Chapado por Vidro Fumê Translúcido:** Botões ativos (`🏛️ Diretoria`, cards de decisão e controles) padronizados com `rgba(0, 0, 0, 0.46)` e `backdrop-filter: blur(12px)`.

*   **🚚 ATUALIZAÇÃO DO PEDIDO DIMONA #755-460-927 ("PEDIDO ENVIADO" VIA J&T EXPRESS) ✅:**
    *   Auditoria do e-mail oficial recebido da Dimona em 23/11/2026 às 17:24 (`docs/Fornecedores/Dimona/Gmail - Pedido enviado ;D.pdf`).
    *   Status do lote físico das 6 amostras avançou para **`Pedido Enviado`** (ID 26) via transportadora **J&T Express**, total R$ 472,80 pago via PIX, com previsão de entrega em Vitória/ES em **26/11/2026**.
    *   Atualizados: `/admin/producao` (Stepper com etapa 4 concluída e etapa 5 ativa), rota `/api/production/samples` e card de decisão executiva `DEC-POD-02`.
    *   **Compilação Turbopack / Next.js:** Build executado e validado com **100% de sucesso (`Exit code 0`)**.

*   **🏛️ PLANEJAMENTO & PROTÓTIPO DA SALA DE REUNIÕES E CHAT SOCIETÁRIO (`docs/CHAT/`) ✅:**
    *   **Arquivos Criados & Homologados:**
        1. **Plano Técnico Completo:** [`docs/CHAT/PLANO_IMPLEMENTACAO_SALA_REUNIOES_CHAT.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/CHAT/PLANO_IMPLEMENTACAO_SALA_REUNIOES_CHAT.md)
        2. **Protótipo Interativo Funcional (CSS Real do Painel `#EFE4CC` / `#DFCFA8` / `#000000`):** [`docs/CHAT/prototipo_chat_societario.html`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/CHAT/prototipo_chat_societario.html)
    *   **Novo Topo do Painel em 2 Linhas (2 Cards Horizontais Independentes):**
        *   **Linha 1 (Card Superior):** Logo Oficial Preta ampliada (`68px`, `/imagens/AMOSTRAS/LOGOS/LOGO SEM LIMITES PRETO.png`, substituindo o antigo card "COCKPIT") + Card **`[ 🚨 CONVOCAR REUNIÃO ]`** + Card **`[ 💬 SALA DE REUNIÕES ]`** + Faixa **`CONECTADOS (4/4)`** (`🟢 Armando`, `🟢 Flávio`, `🟢 Tripoint`, `🟢 Gustavo` + Convidados Nível 2) + Botão **`🔑 Senha`** + **`↗ Vitrine`** (sem botão redundante de "Centralizar Sala").
        *   **Linha 2 (Card Inferior):** **`🏛️ Diretoria`** + os **8 Departamentos** em linha única limpa e uniforme.
    *   **Trava Obrigatória de "Nomear a Pauta" ao Convocar Reunião:** Quando um sócio clica em `🚨 CONVOCAR REUNIÃO` (ou `+ NOVA`), a Sala abre com todas as funções travadas/desabilitadas até que ele digite e grave o **Nome da Pauta** (que passa a figurar na lista de Pautas e preenche automaticamente o campo **Assunto**), impedindo conversas desorganizadas.
    *   **Hub Oficial de Documentos Corporativos (Não-Mídia):** Porta única para anexar documentos jurídicos, fiscais, contábeis e comerciais com campo de Assunto e explicação contextual, seletor **`🎯 ANEXAR / ENVIAR PARA: [TODOS | Flávio | Armando | Tripoint | Gustavo | 🔑 Convidado Nível 2]`**, caixinha **`☑️ Enviar para mim também`** e botão compacto de envio com **Flecha em 45° para cima (`↗`)**.
    *   **Agente Porteiro do Conselho (Arauto Societário):** Publica recibo oficial na Sala e dispara aviso via WhatsApp/E-mail para os sócios selecionados (e cópia para o remetente, se marcado) informando o anexo e seu Assunto.
    *   **Controle de Senhas em 2 Níveis de Acesso (`🔑 Senha`):**
        *   **Nível 1 (Somente Painel):** Para convidados ou operadores externos (como atendente terceirizado do SAC) que acessam apenas o Painel sem entrar na Sala de Reuniões.
        *   **Nível 2 (Painel + Sala de Reuniões):** Para especialistas como o **Contador**, que ao entrar aparece em `CONECTADOS (4+1)`, entra automaticamente como botão selecionável em **`ANEXAR / ENVIAR PARA`** e participa da **Sala de Vídeo** com compartilhamento de tela.
    *   **Próximo Passo na Próxima Sessão:** Executar a implantação do código nas 5 fases descritas em [`docs/CHAT/PLANO_IMPLEMENTACAO_SALA_REUNIOES_CHAT.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/CHAT/PLANO_IMPLEMENTACAO_SALA_REUNIOES_CHAT.md).

*   **📈 DIVISÃO CONCEITUAL DO MARKETING (`06` vs. `07`), NOMENCLATURA ENXUTA (`05 · SAC`) & POLÍTICA DE TERCEIRIZAÇÃO DO SAC (`docs/REUNIAO/04_DIVISAO_MARKETING_E_TERCEIRIZACAO_SAC.md`) ✅:**
    *   **Nomenclatura Definitiva dos Departamentos `05`, `06` e `07`:**
        *   **`05 · SAC` (Gustavo):** Eliminado o pleonasmo *"Atendimento & SAC"*.
        *   **`06 · Marketing de Vendas` (Gustavo):** Substitui *"Vendas, Tráfego & Canais"*. Quem vende é o E-commerce e os Canais; o departamento analisa KPIs de tráfego, traça o plano de investimentos estratégicos, convoca reunião, investe segundo o consenso 4/4, analisa resultados e repete o ciclo.
        *   **`07 · Marketing de Produto` (Tripoint):** Substitui *"Marketing & Branding"*. Cria a estratégia da Coleção, o tema das estampas e a exposição visual da mercadoria (Visual Merchandising) no Instagram (Trios 3x3) e na Vitrine Canônica.
    *   **Cláusula Anti-Sobrecarga e Gatilho de Terceirização do SAC (5 Atendimentos Humanos):**
        *   95% a 98% dos atendimentos são resolvidos pelos Agentes de IA (`Concierge 24/7` e `Discriminador de Ocorrências`).
        *   Ao atingir o gatilho de **5 atendimentos humanos recorrentes**, a fila humana é terceirizada para um **Secretariado Virtual Compartilhado / Call Center BPO** (custo levantado no Brasil: **R$ 600 a R$ 850/mês** para franquia de **75 a 150 chamados humanos/mês**, equivalente ao lucro de ~6 camisetas/mês), operando no Painel com **Senha Convidado Nível 1**.
        *   Documentado em [`docs/REUNIAO/04_DIVISAO_MARKETING_E_TERCEIRIZACAO_SAC.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/04_DIVISAO_MARKETING_E_TERCEIRIZACAO_SAC.md) e indexado em [`docs/REUNIAO/INDEX.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/INDEX.md).

---

## 1.1. Histórico Imediato Anterior (21/11/2026)

*   **⚖️ INTELIGÊNCIA FISCAL REFORMA TRIBUTÁRIA (RTC — LC 214/2025 · CBS & IBS NO SIMPLES NACIONAL) (`/admin/juridico` & `Dr. Lex`) ✅:**
    *   **Auditoria do Motor Oficial da Receita Federal (`ReceitaFederal/calculadora-rtc-simples-nacional` v1.0.2):** Decisão arquitetural de **não instalar o container Java 25 / Spring Boot na VPS Contabo** (0% overhead de JVM, pois a montagem e validação do grupo XML `<IBSCBS>` na NF-e 55 são executadas nativamente na camada do **Bling ERP v3**).
    *   **Trava Fiscal `REG-011` (`NCM × cClassTrib`):** Adicionado o item #15 ao Checklist Fiscal do Bling ERP e painel visual em [`/admin/juridico`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/juridico/page.tsx) orientando o vínculo obrigatório do NCM `6109.10.00` (vestuário de algodão) com o código `cClassTrib` e `CST` de IBS/CBS na virada 2026 ➔ 2027.
    *   **Estratégia Híbrida B2C (Pelo DAS) vs. B2B (Crédito Integral):** Incorporada ao consultor **Dr. Lex** e à documentação do Bling ([`docs/INTEGRACOES/HUB_ERP_BLING/README.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/HUB_ERP_BLING/README.md)) a distinção da LC 214/2025 entre o recolhimento por dentro do DAS (Anexo I reduzido para o varejo B2C) e a opção pelo regime regular para transferência de crédito integral de CBS/IBS em grandes contratos B2B corporativos (Uniformes Reserva INK).

*   **📐 REBATISMO DO DEPTO 03 · ARQUITETURA & TI E ELIMINAÇÃO DO RELATÓRIO DE PONTO ✅:**
    *   **Identidade e Titularidade:** Depto 03 oficialmente renomeado de *Engenharia & TI* para **`Depto 03 · Arquitetura & TI`** em todo o sistema (`AdminHeader.tsx`, `AdminCockpitClient.tsx`, `/admin/diretoria` e `/admin/engenharia`), homenageando a formação acadêmica do Armando em Arquitetura e a arquitetura estrutural da AVA.
    *   **Eliminação do Risco de Desgaste Societário:** O bloco de monitoramento de expediente (tabela de entradas, saídas, tempo de permanência e IPs dos sócios) foi **100% removido** do Depto 03. Sócios não batem ponto e a presença não fica exposta no departamento do titular de TI.
    *   **Cultura de Reuniões da Mesa Redonda:** A Diretoria Executiva (`/admin/diretoria`) recebeu a nova seção institucional para alinhamento periódico (semanal/quinzenal) e governança madura via Urna de Votação 4/4, preservando apenas o LED sutil (🟢 Conectado / ⚪ Desconectado) na barra de comando.

*   **📊 3 MATRIZES ESPECÍFICAS DE DEPARTAMENTOS X DADOS DE API (DIMONA, PRINTFUL E RESERVA INK) ✅:**
    *   **Anti-Ruído Operacional:** Criadas 3 matrizes individuais e hiper-específicas para que nenhum sócio confunda recursos exclusivos de um fornecedor cobrando de outro (ex: Tripoint cobrando Mockups Realistas da Dimona ou Flávio cobrando estampa nas costas da Reserva INK).
    *   **Arquivos Gerados (Markdown + Planilha CSV):**
        1. **Dimona Dropsimples:**
           * MD: [`docs/INTEGRACOES/FORNECEDORES/DIMONA/MATRIZ_DEPTOS_API.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/DIMONA/MATRIZ_DEPTOS_API.md)
           * CSV: [`docs/INTEGRACOES/FORNECEDORES/DIMONA/matriz_deptos_api_dimona.csv`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/DIMONA/matriz_deptos_api_dimona.csv)
           * *Foco:* Silk HD Kornit (frente+costas), NF-e Olist com link Danfe e chave 44 dígitos, J&T Express. *Aviso:* Não possui Mockup Generator automático nem Bordado 3D.
        2. **Printful Brasil:**
           * MD: [`docs/INTEGRACOES/FORNECEDORES/PRINTFUL/MATRIZ_DEPTOS_API.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/PRINTFUL/MATRIZ_DEPTOS_API.md)
           * CSV: [`docs/INTEGRACOES/FORNECEDORES/PRINTFUL/matriz_deptos_api_printful.csv`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/PRINTFUL/matriz_deptos_api_printful.csv)
           * *Foco:* Mockup Generator de estúdio com modelos reais, Bordado 3D Puff com 15 cores de linhas, Packing Slip personalizado na caixa, estimativa prévia de custos. *Aviso:* Painel web em inglês e custo voltado a produtos de alto luxo.
        3. **Reserva INK:**
           * MD: [`docs/INTEGRACOES/FORNECEDORES/RESERVA_INK/MATRIZ_DEPTOS_API.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/RESERVA_INK/MATRIZ_DEPTOS_API.md)
           * CSV: [`docs/INTEGRACOES/FORNECEDORES/RESERVA_INK/matriz_deptos_api_reserva_ink.csv`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/RESERVA_INK/matriz_deptos_api_reserva_ink.csv)
           * *Foco:* Prestígio da grife para uniformes B2B corporativos e propaganda, saques e extratos via API, simulação de frete para lotes. *Aviso:* PROIBIDO solicitar estampa nas costas (apenas frente).
    *   **Validação Técnica:** `npx tsc --noEmit` validado com 0 erros.
    *   **Governança & Anti-Omissão Societária:** Criado o repositório soberano para evitar "salamada de informações" e garantir que nenhum dos 4 sócios fique bloqueado fora de nenhum departamento.
    *   **Separação Técnica vs. Mídias:** Documentações técnicas, Swagger OpenAPI, credenciais e gabaritos separados das artes de vestuário.
    *   **Diretórios e Manuais Criados:**
        1. [`docs/INTEGRACOES/INDEX.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/INDEX.md): Mapa geral das 3 camadas (Canais ➔ Bling Hub ➔ Fornecedores PoD).
        2. [`docs/INTEGRACOES/FORNECEDORES/DIMONA/README.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/DIMONA/README.md): API REST v2, Chave `.env`, Webhook `https://www.ava-vitoria.com.br/api/webhooks/dimona`, catálogo de 975 SKUs e planilha de pedidos em lote.
        3. [`docs/INTEGRACOES/FORNECEDORES/PRINTFUL/README.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/PRINTFUL/README.md): Bearer Token homologado, análise do `openapi.json` (41 endpoints), Boné High Profile com Bordado 3D (Custo R$ 100 / Venda R$ 229 / Lucro R$ 129).
        4. [`docs/INTEGRACOES/FORNECEDORES/RESERVA_INK/README.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/FORNECEDORES/RESERVA_INK/README.md): Especificação OpenAPI `api-1.yaml`, tabelas de custos e diretriz B2B Corporativa (Uniformes empresariais/escolares com estampa frontal e prestígio da marca Reserva).
        5. [`docs/INTEGRACOES/HUB_ERP_BLING/README.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/HUB_ERP_BLING/README.md): O integrador fiscal e operacional central que conecta as 10 vitrines à SEFAZ (NF-e 55) e aos fornecedores PoD.
        6. [`docs/INTEGRACOES/CANAIS_DE_VENDA/README.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/INTEGRACOES/CANAIS_DE_VENDA/README.md): Matriz comparativa das 10 vitrines (Amazon, ML, Shopee, Site Próprio, etc.), taxas, prazos de repasse e padrão de ficha cadastral.
    *   **Compilação & Validação:** Next.js 16 (Turbopack) compilado com **100% de sucesso em 9.0s (`npm run build`)** com 0 erros de tipagem TypeScript.

*   **🏭 NOVO COCKPIT INDUSTRIAL DE PRODUÇÃO & 3 FORNECEDORES POD (`/admin/producao`) ✅:**
    *   **Menu Polimórfico de 3 Fornecedores:**
        1. `[ 🏭 Dimona Dropsimples ]` (Silk HD Kornit, 6 amostras em Aguardando Coleta, NF-e #114273 e J&T Express).
        2. `[ 🌐 Printful Brasil ]` (Token Bearer 200 OK, Bordado 3D em Bonés High Profile Mescla/Preto e Malhas Ring-Spun).
        3. `[ 👔 Reserva INK ]` (Estratégia B2B Corporativo: Uniformes para empresas/escolas com estampa frontal e simulador de lotes).
        4. `[ 📋 Kanban PoD ]` (5 etapas industriais unificadas com card vivo em Expedição/Rastreio).
    *   **Implementação das 6 Melhorias do Genera:**
        *   **Campo Quantidade (`Qtd`):** Tabela de amostras e pedidos agora com coluna explícita de unidades (`1 un`), multiplicador de custo unitário e somatório total (6 un · R$ 408,60).
        *   **Stepper Visual de Ciclo de Vida:** Barra de progresso de 5 etapas (`Pedido/PIX` ➔ `Silk HD` ➔ `Controle Qualidade` ➔ `Aguardando Coleta` ➔ `Despacho`).
        *   **Gabinete de Transbordo Executivo:** Botões funcionais para transbordar a Danfe para o Flávio (Financeiro) e o rastreio J&T para o Gustavo (SAC).
        *   **Terminal de Auditoria JSON:** Gavetas retráteis `{ } Inspecionar JSON API` para inspecionar os payloads brutos da Dimona e da Printful.
    *   **Nova Rota Printful:** `/api/production/printful/status` ativa com leitura em tempo real dos 6 escopos aprovados.
    *   **Validação Completa:** `npx tsc --noEmit` aprovado com 0 erros e `npm run build` compilado com 100% de sucesso em 9.3s!

*   **🌐 HOMOLOGAÇÃO DA PRINTFUL BRASIL API (TOKEN REST FULL ACCESS) (`.env` & `developers.printful.com`) ✅:**
    *   **Chave Homologada no `.env`:** Inserida `PRINTFUL_API_KEY="ur14bwJFkkx2g7gUOImFKeIDKkgWn7uxAbEI5Jb3"` e `PRINTFUL_API_URL="https://api.printful.com"`.
    *   **Teste de Conexão em Tempo Real:** Executada requisição autenticada via Bearer Token ao endpoint `/oauth/scopes` e `/products`, retornando **HTTP 200 OK** com acesso total a `orders`, `stores_list`, `sync_products`, `file_library`, `webhooks` e `product_templates`.
    *   **Estratégia Confirmada:** Printful oficializada como segundo fornecedor estratégico da AVA (focado em bonés estruturados de luxo com bordado 3D e peças ring-spun internacionais, R$ 0 de mensalidade fixa e sem intermediação opaca da Zoop).

*   **🚚 INTEGRAÇÃO EM TEMPO REAL DA DIMONA API V2 & RASTREAMENTO DO PEDIDO #755-460-927 (`/admin/producao` & `/api/production/samples`) ✅:**
    *   **Chave Homologada no `.env`:** Inserida `DIMONA_API_KEY="49b5a2a652ec0f60cef407983cd8f84c"` e `DIMONA_API_URL="https://admin.camisadimona.com.br/api/v2"`.
    *   **Mudança de Status Detectada & Persistida:** O status do lote oficial das 6 amostras físicas avançou de `Em Fabricação` para **`Aguardando Coleta`** (Status ID 23) em apenas 3 dias de produção da fábrica em Silk HD.
    *   **Dados Capturados em Tempo Real:**
        *   **Transportadora:** J&T Express (`shipping_method_name: "J&T"`).
        *   **Link Direto de Rastreamento:** `http://status.ondeestameupedido.com/tracking/1168/755460927`.
        *   **Nota Fiscal Eletrônica Emitida:** NF-e nº `114273` (Série 1), Chave `33261129349123000114550010001142731588011596` e link Danfe direto da Olist ERP.
    *   **Nova Rota de Backend (`/api/production/samples`):** Conecta à Dimona API via `fetch` autenticado no cabeçalho `api-key`, sincroniza e persiste o lote e laudos na tabela `site_settings` do PostgreSQL (`dimona_samples_755460927`).
    *   **Atualização do Painel de Produção (`/admin/producao`):**
        *   Aba **Amostras Físicas:** Cabeçalho com badge vivo `🔵 Aguardando Coleta`, botão de sincronização manual `[🔄 Sincronizar com Dimona API]`, ribbon com dados da J&T, link da NF-e e tabela das 6 peças atualizada.
        *   Aba **Kanban PoD:** Pedido `#755-460-927` posicionado dinamicamente na coluna `4. Expedição / Rastreio`.
    *   **Validação Completa:** `npx tsc --noEmit` aprovado com 0 erros e `npm run build` compilado com 100% de sucesso em 12.5s.

*   **🔑 LOGIN SOCIETÁRIO SEM FRICÇÃO, TROCA E RECUPERAÇÃO DE SENHA (`ensureUsers.ts` & `AdminHeader.tsx`) ✅:**
    *   **5 Contas Individuais Provisionadas:** Usuários `admin`, `armando`, `flavio`, `tripoint`, `gustavo` criados automaticamente via script de auto-provisionamento com bcrypt e senha inicial `admin123`.
    *   **Autonomia do Sócio:** Botão **`🔑 Senha`** integrado ao `AdminHeader` permitindo que cada sócio logado altere sua própria senha no banco PostgreSQL.
    *   **Recuperação Discreta:** Gaveta "Esqueci minha senha" na tela `/admin/login` com validação de chave mestra ou e-mail, impedindo que qualquer sócio fique bloqueado fora do painel.

*   **🟢 MONITORAMENTO DE PRESENÇA EM TEMPO REAL & AUDITORIA EXCLUSIVA DO SENTINELA (`/admin/engenharia`) ✅:**
    *   **Desacoplamento de Votação:** Indicadores de presença em tempo real (🟢 Conectado / ⚪ Desconectado) na faixa da Diretoria Executiva em `/admin`, operando estritamente como monitoramento de presença operacional sem interferência nos crachás de votação deliberativa.
    *   **Persistência Heartbeat:** Nova tabela `UserSessionLog` no PostgreSQL (`schema.prisma`), registrando pings automáticos a cada 45 segundos via `/api/presence/ping`.
    *   **Painel Exclusivo do Sentinel Security:** Os relatórios diários de frequência (horário de entrada, última saída, tempo total conectado) e a trilha de auditoria recente foram alocados estritamente dentro do departamento do **Sentinel Security** (`/admin/engenharia`), com botão de atualização manual e timer de 30s.

*   **📦 MATRIZ DE ASSINATURAS, APIS E CUSTOS FIXOS DOS 23 AGENTES (`/admin/financeiro/assinaturas`) ✅:**
    *   **Página e API Operacionais:** Novo módulo `/admin/financeiro/assinaturas` (com API `/api/financeiro/subscriptions` e biblioteca `src/lib/subscriptionsData.ts`), desenhado 100% no padrão palha tone-on-tone (`#DFCFA8` / `#EFE4CC`).
    *   **Mapeamento dos 23 Agentes:** As 14 ferramentas e APIs do ecossistema foram detalhadamente mapeadas com seus agentes dependentes diretos, sócios responsáveis e o impacto severo caso o plano não seja pago.
    *   **Custo Fixo Mensal:**
        *   *Cenário Enxuto / Validação (MEI Ativo):* **~R$ 489,91 / mês**.
        *   *Cenário com Magnific AI (em teste por Tripoint):* **~R$ 604,91 a R$ 714,91 / mês**.
        *   *Cenário Multi-Hub (com Reserva INK R$ 159/mês):* **~R$ 912,91 / mês**.
    *   **Mapeamento de Titularidade (Ressarcimento de Armando):** Identificados **R$ 209,33/mês** atualmente pagos no cartão pessoal de Armando (Contabo VPS, Google AI Studio/Gemini, Registro.br), com recomendação de transição para a conta PJ da AVA e ressarcimento contábil após os primeiros recebimentos.
    *   **Tabela de Lojista na Dimona:** Mapeado que a Dimona Dropsimples é R$ 0 de mensalidade fixa mas cobra preço de consumidor final sem CNPJ. Para destravar o **custo de fábrica real de R$ 38 a R$ 58**, deve-se homologar o **CNPJ e a Inscrição Estadual ativa (já existentes)** no canal B2B Corporate.
    *   **Convocação de Votação 4/4 na Urna:** Modal integrado que permite ao Financeiro (Flávio) ou qualquer sócio convocar deliberação de nova assinatura com cobrança direta na Urna.

*   **⚖️ NEUTRALIDADE INSTITUCIONAL & FLEXIBILIZAÇÃO DE CRONOGRAMA ✅:**
    *   **Neutralidade Societária:** Removidas menções explícitas e prematuras a porcentagens societárias ("25% cada", "divisão em 4 cotas") antes da formalização do Contrato Social em reunião presencial. Substituídas por termos de governança institucional ("Diretoria Executiva · Voto Deliberativo", "Minuta do Contrato Social").
    *   **Flexibilização de Prazos:** Substituídos prazos rígidos ("01 de Dezembro" / "Natal 2026") por termos neutros ("Drop Inaugural / Lançamento"), respeitando o tempo de desenvolvimento da coleção do Tripoint.
    *   **Novo Documento de Reunião:** Criado [`docs/REUNIAO/03_PLANO_CUSTOS_FIXOS_ASSINATURAS_E_MEI.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/03_PLANO_CUSTOS_FIXOS_ASSINATURAS_E_MEI.md).

*   **🏛️ REESTRUTURAÇÃO DE GOVERNANÇA SOBERANA, 8 DEPTOS SIMÉTRICOS (2 POR SÓCIO) & URNA DE VOTAÇÃO 4/4 ✅:**
    *   **Camada Soberana — Diretoria Executiva (`/admin/diretoria`):**
        *   A **Diretoria Executiva** foi separada conceitualmente e visualmente da camada operacional, subindo para a **Camada Soberana de Comando** (botão dourado `🏛️ Diretoria` ao lado da Logo Selo Branca no [`AdminHeader.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminHeader.tsx) e faixa soberana no topo do [`AdminCockpitClient.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminCockpitClient.tsx)).
        *   Formalizada a igualdade societária dos **4 Sócios (25% cada)** com divisão simétrica exata de **2 Departamentos Operacionais por Sócio** conforme vocação:
            *   **Armando (*Genera*):** `02 · Engenharia & TI` + `03 · Produção & Fornecedores`
            *   **Flávio:** `01 · Jurídico & Compliance` + `08 · Financeiro, Fiscal & ERP`
            *   **Tripoint:** `06 · Marketing & Branding` + `07 · Atelier Criativo & Mídias`
            *   **Gustavo:** `04 · Atendimento & SAC` + `05 · Vendas & Canais`
    *   **Criação do Novo `Depto 05 · Vendas, Tráfego & Canais Comerciais` ([`/admin/vendas`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/vendas/page.tsx) — Titular: Gustavo):**
        *   Desmembrado de Marketing para focar em performance comercial: Termômetro Preço vs. Conversão, Simulador de Impulsionamento & Tráfego Pago (ROAS / Visitas / Pedidos) e Painel de Relacionamento e Taxas dos **10 Canais de Vendas Nacionais**.
    *   **🗳️ Urna de Votação Societária 4/4 & Cobrador Automático (WhatsApp + E-mail):**
        *   Inspirada na Lei de Precificação do Genera (*"Se o preço estiver baixo, você nada e morre na praia; se estiver alto, você não sai do lugar e morre ali mesmo"*), toda decisão estratégica ou alteração de Margem/Precificação ([`/admin/financeiro`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/financeiro/page.tsx)) passa pela **Urna de Votação dos 4 Sócios**.
        *   Cada card na **Fila de Decisões Executivas** exibe os **4 Crachás Interativos de Voto** (`Armando`, `Flávio`, `Tripoint`, `Gustavo` — 🟢 `Aprovou`, 🟡 `Pendente`, 🔴 `Revisão`) e o botão **"📲 Cobrar WhatsApp/E-mail"** para cobrar nominalmente os sócios pendentes.
    *   **🤖 Telemetria Ativa & Dossiê Interativo dos 23 Agentes de IA ([`agentDossierData.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/agentDossierData.ts) & [`AgentDossierModal.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AgentDossierModal.tsx)):**
        *   Sinalização luminosa aeronáutica: **🟡 Amarelo Âmbar (Em Prontidão / Stand-by)** por padrão e **🟢 Verde Esmeralda (Em Atividade)**.
        *   Clique em qualquer agente abre o Modal de Ajuda Societária com 4 seções didáticas: **1. O que faz**, **2. Por que faz**, **3. Como faz** (reescrito em linguagem analógica simples, sem jargões pesados de TI) e **4. Economia** (tempo, estresse e dinheiro economizados).
        *   Adicionados: **Sentinel Security** (Segurança Cibernética & Portaria Digital), **Cobrador de Consenso 4/4** (Urna & WhatsApp/E-mail), **Analista de Tráfego & ROAS** e **Gestor dos 10 Canais**.
    *   **🔗 Unificação Total do `AdminHeader.tsx` em 100% das Telas do Painel:**
        *   Substituído o cabeçalho antigo legado nas páginas [`/admin/design-system`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/page.tsx), [`/admin/grid-manager`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/grid-manager/page.tsx), [`/admin/media`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/media/page.tsx) e [`/admin/stock`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/stock/page.tsx) pelo `AdminHeader` unificado (com Logo Selo Branca Home `/admin`, botão `🏛️ Diretoria` e barra `01` a `08`).

*   **✨ REFINAMENTO VISUAL & UX DO COCKPIT ADMIN & HEADER ([`AdminHeader.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminHeader.tsx) & [`AdminCockpitClient.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminCockpitClient.tsx)) ✅:**
    *   **Inversão Estratégica de Seções:** Os **Departamentos Operacionais da Empresa** agora assumem o topo da página principal `/admin`, seguidos da **Fila de Decisões Executivas** e da **Telemetria dos Agentes de IA da Mesa Redonda** no rodapé.
    *   **Logo Selo Ampliada e Barra Imponente:** Aumentada a altura do menu para `min-height: 80px` (com `padding: 16px 28px`), expandindo a **Logo Selo Branca** para **52px**, garantindo presença marcante e elegância como botão de retorno à Home (`/admin`).
    *   **Eliminação do Card Informativo do Topo:** Removido o banner redundante *"Cockpit Central — Ambiente de comando executivo..."*, dando foco imediato às operações da loja.
    *   **Título Sucinto da Fila:** Ajustado para **"Fila de Decisões Executivas"** (sem redundâncias).
    *   **Validação Completa:** `npx tsc --noEmit` aprovado com 0 erros e `npm run build` compilado com sucesso!

*   **🏆 IMPLEMENTAÇÃO DO PACOTE 3 CONCLUÍDA — ARQUITETURA COMPLETA DOS 8 DEPARTAMENTOS HOMOLOGADA! ✅:**
    *   **Depto 07 — Atelier Criativo & Mídias (`/admin/atelier`):**
        *   Unificação do estúdio em 3 abas operacionais:
            *   *Aba 1 (Projetos & Coleções):* Gerenciador de Coleções e Vitrine Oficial, com o botão **`[★ Vitrine Ativa da Loja]`** e acesso direto ao Grid Manager da vitrine Balenciaga.
            *   *Aba 2 (Biblioteca Geral de Mídias):* Grid uniforme de 9 colunas com Lightbox, uploads por coleção e visualizador de alta resolução.
            *   *Aba 3 (Artes Matrizes 300 DPI & Prompts):* Catálogo de matrizes de alta resolução (Dimona `3435×4680` e Reserva INK `4200×4800`), registro de autoria SHA-256 e inspetor de prompts MDV (26 chaves).
    *   **Depto 04 — Produção & Fornecedores (`/admin/producao`):**
        *   4 abas: Gestão de Amostras Físicas Dimona (**Pedido `#755-460-927` de 6 peças pago via PIX**), Hub Multi-Supplier com botão interativo para auditoria preventiva de custos a cada 2h (`POST /api/production/suppliers/sync-prices`), Kanban PoD de 5 etapas e aba integrada com o Estoque Físico (`/admin/stock`).
    *   **Depto 05 — Atendimento & SAC Anti-Omissão (`/admin/atendimento`):**
        *   Fila operacional de trocas com o **Agente Discriminador** separando Arrependimento (CDC Art. 49) de Defeito de Fabricação PoD, aprovação de 1-clique para logística reversa e motor de transbordo aos 4 sócios via simulação de WhatsApp sob a **"Filosofia do Zagueiro-Artilheiro"**.
    *   **Depto 08 — Financeiro & Precificação Dinâmica (`/admin/financeiro`):**
        *   Painel de caixinhas numéricas de margem por categoria com salvamento e reindexação em lote em tempo real, **Chave Seletora de 2 Posições** (`INDEXADO` vs `DESINDEXAR NA BAIXA / RETER LUCRO EXTRA` com religamento automático ao superar o `cost_baseline`), calculadora de Unit Economics de lucro líquido real e Conector Bling ERP v3 (OAuth 1-clique).
    *   **Validação Completa:** `npx tsc --noEmit` aprovado com 0 erros e `npm run build` compilado com sucesso em 8.9s!

*   **🏛️ IMPLEMENTAÇÃO DO PACOTE 2 CONCLUÍDA COM SUCESSO (COCKPIT ADMIN & DEPTOS 01, 02, 03 E 06) ✅:**
    *   **Folha de Estilos Unificada (`src/app/admin/admin-cockpit.module.css`):**
        *   100% CSS Modules nativos com Estética da Subtração, fundo escuro premium de luxo (`#0C0D0E`), linhas divisórias de 1px (`rgba(255,255,255,0.08)`), tipografia leve e responsiva.
    *   **Barra de Navegação dos 8 Departamentos (`AdminHeader.tsx`):**
        *   Atalho universal presente em todas as páginas `/admin/*` permitindo alternar instantaneamente entre o Cockpit HUB e os 8 Departamentos, com link direto de volta à vitrine da loja.
    *   **Novo Cockpit Central Panorâmico (`/admin` via `AdminCockpitClient.tsx`):**
        *   **Fila de Decisões Executivas dos 4 Sócios (Human-in-the-Loop):** Alertas de amostras físicas Dimona, telemetria 2h de preços multi-supplier e status da transição fiscal com ações de 1-clique.
        *   **Cards Panorâmicos dos 8 Departamentos:** Visão integrada com status e métricas ao vivo de cada área.
        *   **Telemetria dos 19 Agentes de IA da Mesa Redonda:** Painel com o status operacional dos 19 agentes sob a regência do Maestro Lincoln.
    *   **Depto 01 — Diretoria Executiva (`/admin/diretoria`):**
        *   Quadro dos 4 Sócios com distribuição de 25% de cota social, simulador interativo de inauguração de Natal (unidades, ticket médio, faturamento bruto e margem líquida de 58%) e parecer estratégico do Maestro Lincoln.
    *   **Depto 02 — Jurídico & Compliance (`/admin/juridico`):**
        *   Diagnóstico do teto de 38 peças/mês do MEI vs LTDA Simples Nacional, checklist interativo com os 14 documentos fiscais para o Bling ERP e módulo de consultoria legal interativa com a IA **Dr. Lex**.
    *   **Depto 03 — Engenharia & TI (`/admin/engenharia`):**
        *   Telemetria em tempo real da VPS Contabo (`31.220.102.2`), HTTPS Certbot, processo PM2 `ava-vitoria` (porta 3000), integridade PostgreSQL/Prisma, rota `/llms.txt` e atalhos diretos para o Design System Dinâmico e Portaria da Loja (`SiteLock`).
    *   **Depto 06 — Marketing & Growth (`/admin/marketing`):**
        *   Diretriz de postagem no Instagram em **Trios 3x3 (Balenciaga)** espelhando a vitrine 9:16 do site, status do feed XML Meta Commerce Catalog (`/api/catalog/meta`) e simulador interativo da campanha viral **"EU TENHO CUPOM!"** com validação de senhas prefixadas de `1...` a `5...` (10% a 50% OFF).
    *   **Validação Completa:** `npx tsc --noEmit` aprovado com 0 erros e `npm run build` compilado com sucesso em 8.4s!

*   **🚀 IMPLEMENTAÇÃO DO PACOTE 1 CONCLUÍDA COM SUCESSO (FUNDAÇÃO & LOJA PÚBLICA) ✅:**
    *   **Evolução Aditiva do Banco de Dados (`schema.prisma`):**
        *   Model `Product` expandido com os campos de PoD/Matriz Canônica (`sku_master`, `product_category`, `supplier_provider`, `cost_price`, `cost_baseline`, `target_margin_percent`, `is_price_indexed`, `dimensions`, gabaritos `print_file_front_url`/`back_url`, e relação com `Artwork`).
        *   Novos models criados e sincronizados no PostgreSQL via `npx prisma db push`: `Artwork` (matrizes 300 DPI e MDV 26 chaves), `CategoryMarginRule` (caixinhas de margem e chave de 2 posições) e `SupplierCatalogItem` (telemetria 2h).
    *   **Motor Multi-Supplier & Precificação Inteligente (`src/lib/`):**
        *   `src/lib/suppliers.ts`: catálogo homologado completo (Dimona, Reserva INK, Montink, Hotprinti, Private Label e Estoque AVA).
        *   `src/lib/pricingEngine.ts`: regras de margem dinâmica, cálculo de preço e lógica da Chave de 2 Posições (`INDEXED` vs `HOLD_ON_DROP` com gatilho de reindexação automática ao superar o `cost_baseline`).
        *   Rotas de API criadas: `/api/categories/margins` (reindexação imediata), `/api/production/suppliers/sync-prices` (auditoria 2h de custos) e `/llms.txt` (manifesto para indexação IA/GEO).
    *   **Incrementos na Loja Pública (100% CSS Modules e Vitrine Balenciaga Intacta):**
        *   **Textura Halftone de Tela:** adicionado overlay sutil de pontilhado tátil de galeria (`body::before` com `radial-gradient` de opacidade 0.07) sobre o marfim `#FEFCF5` em `src/app/globals.css`.
        *   **Seção dos 10 Canais de Venda:** componente `SalesChannelsSection.tsx` + `SalesChannelsSection.module.css` posicionado no final da página inicial, antes do rodapé, conferindo autoridade nacional (Mercado Livre, Amazon, Google Shopping, SHEIN, Dafiti, TikTok Shop, Reserva, Instagram Shopping, Meta, Shopee).
        *   **Central do Cliente (`/atendimento` & `/trocas`):** botão "Atendimento" integrado ao cabeçalho global (`Header.tsx`) levando para a central com **Concierge IA 24/7**, **Portal de Trocas e Devoluções** (com triagem CDC Art. 49 vs Garantia PoD) e **Dúvidas & Políticas Legais**.
    *   **Validação Completa:** `npx tsc --noEmit` com 0 erros e `npm run build` do Next.js compilado com sucesso em 13.2s!

*   **🎉 ENCOMENDA OFICIAL DE AMOSTRAS FÍSICAS REALIZADA (DIMONA) ✅:**
    *   **NÚMERO DO PEDIDO DIMONA:** `# 755-460-927`
    *   **Data/Hora do Pedido:** 17/11/2026 às 02:11:53 (Horário de Brasília)
    *   **Valor Pago (PIX Instantâneo):** `R$ 472,80` (Frete 100% Grátis para Vitória/ES - Black Friday)
    *   **Comprovante de Pagamento:** ID `E18236120202611170513s108f56a00b` (Nu Pagamentos -> Dimona Silk E Malhas Ltda)
    *   **Lote Completo (Cenário 3 - 6 Peças):**
        1. Camiseta Oversized 220g (Preta - Tam G): Frente Cubista + Costas Selo AVA Branco 16cm
        2. T-Shirt Prime 180g (Branca - Tam G): Frente Coruja + Costas Selo AVA Preto 16cm
        3. Camiseta Estonada 30.1 (Cinza Chumbo - Tam GG): Frente Peito Siga Fazendo o Bem + Costas Pôster Siga Fazendo o Bem
        4. Camiseta Quality 30.1 (Vinho - Tam GG): Frente Cubista + Costas Selo AVA Preto 16cm
        5. Boné Prime (Preto - Fivela): Frente Selo AVA Branco Circular (1100px)
        6. Boné Americano (Branco - Snapback): Frente "Sem Limites AVA" Preto Orgânico
    *   **Documento Completo de Registro:** [`docs/Fornecedores/REGISTRO_PEDIDO_AMOSTRAS_DIMONA.md`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/REGISTRO_PEDIDO_AMOSTRAS_DIMONA.md)
*   **Status Reserva INK:** 2 camisetas cadastradas (Oversized e Algodão Peruano) e verificação de identidade/CIN protocolada com Sucesso, aguardando análise de compliance da Zoop.

*   **Migração Completa para a VPS Contabo (`31.220.102.2`) ✅:**
    *   **Banco de Dados PostgreSQL:** Instalamos e ativamos o PostgreSQL nativo na VPS. Criamos o banco `ava_vitoria_prod` e usuário `ava_vitoria_user` com a senha secreta do projeto.
    *   **Sincronização e Seed:** Rodamos o Prisma Migrations para criar a estrutura e semeamos o banco (`npx tsx prisma/seed.ts` via tsx) gerando o administrador padrão, Design System padrão, produtos, coleções e variantes.
    *   **Redefinição de Mídias:** Atualizamos as imagens dos produtos da coleção da vitrine para lerem a pasta local `/imagens/VITRINE/SemLimites/...` na VPS.
*   **Domínio e HTTPS (SSL) Ativados ✅:**
    *   O domínio `ava-vitoria.com.br` e o subdomínio `www.ava-vitoria.com.br` foram apontados no Registro.br para o IP da VPS (`31.220.102.2`).
    *   Instalamos o certificado SSL gratuito via **Certbot (Let's Encrypt)** na VPS, configurando o Nginx para forçar todo o tráfego a rodar sobre HTTPS de forma nativa e segura.
    *   **NEXTAUTH_URL:** A URL de segurança da sessão de login administrativa foi devidamente atualizada para o domínio seguro `https://www.ava-vitoria.com.br` no `.env` de produção.
*   **Automação e Atalho do Deploy ✅:**
    *   **Script de Deploy:** O script local [deploy.sh](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/scripts/deploy.sh) commita e dá push no GitHub, acessa a VPS via SSH (usando `sshpass` com a senha segura em `.env`), atualiza o código, instala pacotes, sincroniza o banco, builda o Next.js e reinicia o processo PM2 (`ava-vitoria`) recarregando as variáveis com `--update-env`.
    *   **Atalho de Área de Trabalho:** Criamos o atalho executável [Deploy-AVA.desktop](file:///home/artz/%C3%81rea%20de%20trabalho/Deploy-AVA.desktop) na Área de Trabalho com a logomarca da AVA Vitória. Ao clicar duas vezes, ele abre um terminal interativo executando todo o deploy e abrindo a página no Firefox ao final.
*   **Aprimoramento Visual & UX da Vitrine (Design Balenciaga & Inspeção Ativa) ✅:**
    *   **Espaçamento entre Colunas (24px):** Adicionado `gap: 24px` na vitrine de 3 colunas no [page.module.css](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/page.module.css), ajustando o enquadramento vertical dos cards 9:16 em telas de notebook (1366x768).
    *   **Eliminação de Poluição no Hover Passivo:** O simples passar de mouse não dispara mais setas nem escurecimentos. A navegação de scroll permanece 100% limpa e focada no catálogo.
    *   **Gatilho de Inspeção por 1º Clique:** O 1º clique no card ativa o modo de inspeção:
        1. Desenha a **borda preta marcada de 1px** contornando a célula inteira (imagem + nome + preço) com overlay `z-index: 99`.
        2. Exibe as **setas de navegação** e **bolinhas** do carrossel no card selecionado.
        3. Aplica a película de **Vidro Branco Leitoso** (`rgba(255, 255, 255, 0.78)` com `backdrop-filter: blur(16px)`) sobre os cards vizinhos.
    *   **Cobertura Perfeita dos 8 Vizinhos (`rowDiff <= 1`):** Refatorado a matriz no [ProductGrid.tsx](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/components/ProductGrid.tsx) para cobrir com o vidro leitoso exatamente os 8 vizinhos do bloco 3x3 (3 acima, 2 na mesma linha, 3 abaixo), sem falhas quando a peça ativa está na extremidade (esquerda/direita).
*   **Aprimoramento de Tom de Cor & Design System (#FEFCF5) ✅:**
    *   **Fundo Off-White Marfim (`#FEFCF5`):** Alterado o fundo de todos os cards da vitrine ([ProductCard.module.css](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/components/ProductCard.module.css)), slots vazios de alinhamento e molduras da página de produto ([product-details.module.css](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/produtos/[slug]/product-details.module.css)) de `#FFFFFF` para `#FEFCF5`.
    *   **Fusão Perfeita de Imagens (`mix-blend-mode: multiply`):** Adicionada a propriedade `mix-blend-mode: multiply` nas imagens dos produtos e miniaturas do carrinho, fundindo o fundo branco nativo das fotos com o tom `#FEFCF5`.
*   **Correção de Navegação & Formulário de Contato ✅:**
    *   **Remoção de Header Duplicado:** Eliminados os cabeçalhos pretos locais das páginas `/contato` e `/sobre-nos`, centralizando toda a navegação no Header prateado global de `layout.tsx`.
    *   **Formulário de Contato de Alta Legibilidade:** O card de contato (`.formCard`) passou a ter fundo `#FEFCF5` com todos os campos, rótulos e botões em preto sólido (`#000000`) para 100% de contraste.
*   **Grid Unificado de Produto & Linhas Divisórias de 1px ✅:**
    *   **Estrutura `.unifiedGrid`:** Refatorada a página de detalhes para integrar Linha 1 (Foto + Detalhes) e Linhas 2+ (Fotos Adicionais) em uma matriz única com `gap: 1px` e fundo `rgba(0, 0, 0, 0.12)`, dividindo todas as células por uma única linha vertical e horizontal compartilhada de 1px sem vãos intermediários.
    *   **Respiro Simétrico em Relação ao Header:** Ajustado o container da página de produto para `padding: 65px 20px 40px 20px`, mantendo as margens de 20px e afastando o topo dos cards com equilíbrio visual da barra sticky do menu.
*   **Aprimoramento Mobile & Ícones da Interface (Sessão de Julho/2026) ✅:**
    *   **Hero Mobile em Formato Card (`CapaCelular.png`):** Configurada a exibição responsiva da imagem de capa [`CapaCelular.png`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/public/imagens/CAPA/CapaCelular.png) (1080x1920) exclusivamente para telas de celular ($\le$ 768px), em uma moldura de card (`.heroCardMobile`) com fundo marfim `#FEFCF5`, borda sutil de 1px, `padding: 0` e `object-fit: cover` preenchendo o card de ponta a ponta sem barras internas.
    *   **Ícone de Sacola Instagram no Header:** Substituído o texto `"COMPRAS"` no [Header.tsx](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/components/Header.tsx) por um ícone vetorial SVG no estilo oficial do Instagram Shopping, alinhado centralizadamente com o menu hamburger no celular e badge de contagem no topo superior direito.
    *   **Ocultação Cirúrgica de Slots Vazios no Mobile:** Implementada a classe `.emptyGridItem` no [ProductCard.module.css](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/components/ProductCard.module.css) e [ProductGrid.tsx](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/components/ProductGrid.tsx) com `display: none !important` no celular ($\le$ 768px). O catálogo de 13 peças agora encerra perfeitamente no último produto no celular (sem os 2 cards em branco gigantes que pareciam erro), preservando os slots de alinhamento em 3 colunas Balenciaga no desktop.
*   **Operação Print on Demand (PoD), Extração de Artes 300 DPI (`ALTA.ai`) & Migração para Dimona / Dropsimples (Sessão de Novembro/2026) ✅:**
    *   **Extração de Alta Resolução do Ilustrator (`ALTA.ai` — 130.45 MB):** Decodificado o stream PostScript privado `/AIPrivateData2` do arquivo [ALTA.ai](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/ReservaINK/Artes/ALTA.ai), extraindo a fotografia original sem perda (`3472 × 4647 px`, `300 DPI`), os 4 quadros vetoriais (`ESCORPIÃO`, `BICICLETA`, `SHARK ATTACK`, `CHAPA`), a assinatura `MOVIMENTO ava® SEM LIMITES` e o selo circular `PASSA A BOLA - ALTINHA ADDICT`.
    *   **Descarte da Reserva INK (Limitação Técnica de Costas):** Identificado na Central de Ajuda oficial da Reserva INK que a plataforma **não realiza impressão nas costas** (apenas na frente) e restringe cores de regata a preto e branco. O Genera solicitará o reembolso integral da assinatura (`R$ 80,00`) dentro do prazo legal de 7 dias (Art. 49 do CDC).
    *   **Pesquisa Comparativa (Dimona vs. Montink vs. Hotprinti) & Escolha da Dimona (`Dropsimples`):**
        *   Constatado que a fábrica por trás da Montink é a própria **Dimona** (e que a Hotprinti possui reputação ruim ~5.5 no Reclame Aqui e foca em DTF).
        *   Obtido e salvo o catálogo oficial de 49 páginas de custos de lojista do **Dropsimples da Dimona** em [Catalogo_Oficial_Dropsimples_Dimona.pdf](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Catalogo_Oficial_Dropsimples_Dimona.pdf) (isento de mensalidade fixa, ativado via conta Dimona em `camisadimona.com.br/conta/pedidos` $\rightarrow$ Avançado $\rightarrow$ Chave de API).
        *   **Regra de Qualidade Definida pelo Genera:** **DTF proibido em camisetas/regatas** (somente **Silk HD / DTG** direto na fibra) e permitido apenas nos **Bonés** (`Boné Americano` a `R$ 33,00` e `Boné Prime Trucker/Confort` a `R$ 72,90`).
        *   **Custos Oficiais Dropsimples em Silk HD (Frente + Costas, já somando o adicional de `+R$ 18,00` da 2ª estampa):**
            *   **T-Shirt Quality (100% Algodão Penteado 30.1, 165g — 12 cores):** `R$ 41,90` (1 estampa) | **`R$ 59,90` (Frente + Costas)**
            *   **Regata Masculina Quality (100% Algodão Penteado 30.1, 165g):** `R$ 41,90` (1 estampa) | **`R$ 59,90` (Frente + Costas)**
            *   **T-Shirt PRIME (100% Algodão Penteado 26.1, 180g, acabamento lixado "Pele de Pêssego" — 9 cores incl. Offwhite/Branco/Preto):** `R$ 49,90` (1 estampa) | **`R$ 67,90` (Frente + Costas)** *(Substitui com vantagem a linha Pima, pois a Pima da Dimona leva 3% elastano e usa DTF).*
            *   **T-Shirt Estonada (100% Algodão Penteado 30.1, 170g, não encolhe):** `R$ 55,00` (1 estampa) | **`R$ 73,00` (Frente + Costas)**
            *   **T-Shirt Oversized (100% Algodão Premium 20.1, 220g pesada):** `R$ 83,90` (1 estampa) | **`R$ 101,90` (Frente + Costas)**
    *   **Gabaritos Finais Padronizados para o Studio 3D da Dimona (`3435 × 4680 px`, `300 DPI`, Zero Margem / Encaixe Automático no Tracejado):**
        *   [Dimona_Frente_Arte_FundoEscuro_SemMargem_300dpi.png](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Dimona_Frente_Arte_FundoEscuro_SemMargem_300dpi.png) (Selo pré-posicionado no limite superior direito do tracejado para peças escuras)
        *   [Dimona_Frente_Arte_FundoClaro_SemMargem_300dpi.png](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Dimona_Frente_Arte_FundoClaro_SemMargem_300dpi.png) (Selo pré-posicionado no limite superior direito do tracejado para peças claras)
        *   [Dimona_Costas_Arte_FundoEscuro_SemMargem_300dpi.png](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Dimona_Costas_Arte_FundoEscuro_SemMargem_300dpi.png) (Pôster costas ocupando 100% da área útil para peças escuras)
        *   [Dimona_Costas_Arte_FundoClaro_SemMargem_300dpi.png](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Dimona_Costas_Arte_FundoClaro_SemMargem_300dpi.png) (Pôster costas ocupando 100% da área útil para peças claras)
        *   [Dimona_Selo_Bola_FundoEscuro_SemMargem_300dpi.png](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Dimona_Selo_Bola_FundoEscuro_SemMargem_300dpi.png) & [Dimona_Selo_Bola_FundoClaro_SemMargem_300dpi.png](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/Fornecedores/Dimona/Dimona_Selo_Bola_FundoClaro_SemMargem_300dpi.png) (Selo isolado `2400 × 2400 px` para aplicação em Bonés)
*   **Refatoração da Biblioteca de Mídias & Grid Uniforme de 9 Colunas ✅:**
    *   **Barra Superior Unificada:** Eliminado o select redundante de uploads; agora a **Coleção Ativa** comanda a exibição e os uploads diretamente.
    *   **Grid de 9 Colunas Balenciaga:** Ajustado o grid com `minmax(0, 1fr)` e `min-width: 0`, garantindo 9 cards de tamanho 100% uniforme por linha, sem cortes na lateral direita.
    *   **Lupa de Inspeção por Clique (Lightbox):** Adicionado botão de zoom discreto no topo de cada card que abre a imagem em tamanho original via modal, sem disparar ao simples passar de mouse (`hover`).
*   **Ocultação do Header da Loja no Painel Administrativo (`/admin`) ✅:**
    *   O cabeçalho público da loja (logo da AVA e menu Loja/Sobre Nós/Contato/Sacola) agora é omitido em todas as rotas `/admin/*`.
*   **Remoção de Duplicidade da Portaria da Loja ✅:**
    *   O `<SiteLockControl />` foi retirado de *Projetos & Coleções* (`/admin`) e mantido exclusivamente em *Design System* (`/admin/design-system`).
*   **Chaveador Dinâmico de Coleção Ativa na Vitrine Oficial ✅:**
    *   Implementado mecanismo via `site_settings` para selecionar qual coleção aparece na Home (`/`), com botão **`[⚡ Publicar Coleção na Vitrine]`** e badge **`★ Vitrine Ativa da Loja`** no `/admin` e no `/admin/grid-manager`.
    *   Corrigido o card recém-criado (`+ Tipo 1`): agora nasce como um **card vazio real** (retângulo off-white `#FEFCF5`) sem carregar foto antiga hardcoded.
*   **Adequação de Mídias Balenciaga para a Coleção "Ava Nova Era" (Proporção 9:16) ✅:**
    *   Recortadas proporcionalmente as 6 fotos quadradas de modelos da pasta `public/imagens/VITRINE/Coleção_AvaNovaEra/` para proporção exata **9:16** (`393 × 700 px`), centralizadas e prontas para o Lookbook.
*   **Plano Mestre dos 8 Departamentos, Limpeza Estrutural & Pasta de Reunião Societária (Sessão de 15/Novembro/2026) ✅:**
    *   **Higienização Completa do Repositório:** Removidos arquivos legados e obsoletos da raiz, de `docs/` (antigo VTON, tarefas antigas `TASKS/` e `DONE/`, `GuiaPrompts`) e os 27 scripts temporários de `scripts/` (preservando exclusivamente [scripts/deploy.sh](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/scripts/deploy.sh) e mantendo a pasta `public/` 100% intacta). Deploy realizado e validado em produção pelo Genera sem nenhuma perda.
    *   **Dossiê Executivo para os Sócios (`docs/REUNIAO/`):**
        *   [INDEX.md](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/INDEX.md): Pauta executiva da reunião societária.
        *   [01_ESTRATEGIA_EU_TENHO_CUPOM_E_INAUGURACAO.md](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/01_ESTRATEGIA_EU_TENHO_CUPOM_E_INAUGURACAO.md): Estratégia condicional de inauguração em **01/Dezembro** com a Nova Coleção PoD na vitrine principal, postagem no Instagram em **Trios 3x3 (Padrão Balenciaga)** e Campanha Viral **`"EU TENHO CUPOM!"`** com **Senha Única Prefixada (`1...` = 10% a `5...` = 50% OFF)** para escoar o estoque físico atual em uma Vitrine Secreta.
        *   [02_CHECKLIST_DOCUMENTACAO_BLING_E_10_CANAIS.md](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/REUNIAO/02_CHECKLIST_DOCUMENTACAO_BLING_E_10_CANAIS.md): Diagnóstico MEI vs. LTDA (Simples Nacional) e relação de 14 documentos fiscais, bancários e digitais para integrar o Bling ERP e os 10 Canais de Venda.

---

## 2. 🖥️ Informações do Ambiente de Produção & Acesso Societário

*   **URL da Loja:** `https://www.ava-vitoria.com.br` (em breve transição para `https://www.avasemlimites.com.br`)
*   **URL do Painel Admin:** `https://www.ava-vitoria.com.br/admin`
*   **URL de Assinaturas & Custos:** `https://www.ava-vitoria.com.br/admin/financeiro/assinaturas`
*   **Feed Meta Commerce (Instagram Shopping):** `https://www.ava-vitoria.com.br/api/catalog/meta`
*   **Credenciais Societárias Individuais (Auto-provisionadas no DB):**
    *   **Armando:** `armando` | senha inicial: `admin123`
    *   **Flávio:** `flavio` | senha inicial: `admin123`
    *   **Tripoint:** `tripoint` | senha inicial: `admin123`
    *   **Gustavo:** `gustavo` | senha inicial: `admin123`
    *   **Admin Master:** `admin` | senha inicial: `admin123`
    *   *Nota:* Cada sócio pode alterar sua própria senha clicando em `🔑 Senha` no cabeçalho do painel.
*   **Banco de Dados na VPS:** `postgresql://ava_vitoria_user:AvaVitoriaSecretPass!@localhost:5432/ava_vitoria_prod?schema=public`
*   **Next.js PM2 Process Name:** `ava-vitoria` (porta 3000)

---

## 3. Próximos Passos Imediatos & Backlog Agendado

1.  **🔧 Correções Gerais & Bateria de Testes no Painel Admin (Prioridade Imediata):**
    *   Executar as correções pontuais levantadas pelo Genera antes do início da bateria completa de testes funcionais no Painel (`/admin`).
    *   Simular os **4 Sócios Conectados Concomitantemente** (`armando`, `flavio`, `tripoint`, `gustavo` com senha `admin123`) e validar a Sala de Reuniões (`🟢 CONECTADOS (4/4)`), criação de pautas travadas e envio de documentos.
2.  **📦 Backlog Agendado — Resíduo Técnico da `Star-Ink` (Trazer no Momento Oportuno):**
    *   **[ ] 2.1. Conector OAuth 2.0 do Bling ERP API v3 (`/api/auth/bling/authorize` & `/api/auth/bling/callback`):**
        *   *Origem pronta:* `/home/artz/Documentos/Antigravity/Star-Ink/src/app/api/auth/bling/`.
        *   *Quando trazer:* No momento em que formos realizar a integração oficial com a conta do Bling ERP da AVA.
    *   **[ ] 2.2. Páginas Legais Públicas Obrigatórias p/ Meta Ads & Google Shopping (`/politica-de-privacidade`, `/politica-de-devolucao`, `/termos-e-condicoes`, `/duvidas-frequentes`):**
        *   *Origem pronta:* `/home/artz/Documentos/Antigravity/Star-Ink/src/app/politica-de-privacidade`, `politica-de-devolucao`, `termos-e-condicoes`, `duvidas-frequentes`.
        *   *Quando trazer:* Antes da submissão da Sacolinha do Instagram (Meta Commerce) e Google Merchant Center.
    *   **[ ] 2.3. Endpoints de Chat Ao Vivo do `Dr. Lex` (`/api/dr-lex/chat`) e `Concierge IA` (`/api/concierge/chat`) + Tríade de Contexto (`src/lib/brandContext.ts`):**
        *   *Origem pronta:* `/home/artz/Documentos/Antigravity/Star-Ink/src/app/api/dr-lex/chat/route.ts`, `src/app/api/concierge/chat/route.ts` e `src/lib/brandContext.ts`.
3.  **🚚 Rastreio do Pedido de Amostras Dimona (`#755-460-927` — Já na Filial Vitória/ES):**
    *   Acompanhar a última milha da **J&T Express** pela nova Torre Logística em **`/admin/atendimento`** (pacote chegou à filial Vitória/ES em `24/11 às 15:45`, com previsão oficial de entrega até `27/11/2026`).
4.  **👑 Acompanhamento da Parceria Fábrica King (`docs/KING/`):**
    *   Monitorar o retorno da mensagem enviada no WhatsApp (`11 95360-5184` - Anderson/Adriane) para iniciar a PoC do **King Connect Gateway**.
5.  **Reuniões Presenciais com os Sócios & Fornecedores PoD:**
    *   **Tripoint:** Apresentar a Matriz Canônica de 26 Chaves e o Compilador *Prompt to Image* em `/admin/atelier`.
    *   **Flávio (Financeiro & Jurídico):** Módulo de Assinaturas e ressarcimento dos R$ 209,33/mês adiantados por Armando.
    *   **Gustavo (SAC & Marketing de Vendas):** Apresentar a Torre Logística J&T/Intelipost em `/admin/atendimento` e solicitar o estorno Reserva INK (R$ 159,00 — CDC Art. 49).
    *   Homologar CNPJ/IE no canal B2B da Dimona para destravar tabela de atacado (R$ 38 a R$ 58).
---

## 🏛️ ESTILIZAÇÃO CANÔNICA DO COCKPIT ADMIN (APROVADA PELO GENERA ARMANDO — 25/11/2026) ✅

*   **Identidade Visual "Galeria Minimalista / Subtração Brutalista":**
    *   **Fundo Root da Página (`.adminLayout`):**
        *   Mantido o gradiente metálico prateado acetinado original do site:
        *   `background: linear-gradient(180deg, #E2E2E4 0%, #C0C0C5 100%);`
    *   **Cards "Containers" (Bandejas Arquitetônicas Lado-a-Lado):**
        *   Cor calibrada para um **cinza claro luminoso (`#EEEEF2`)**, visivelmente mais claro e brilhante que o prata de fundo (`#E2E2E4`), criando profundidade e elevação arquitetônica:
        *   `.headerRow1Card`: Container superior que abriga a logo, botões executivos e presença dos sócios.
        *   `.headerRow2Card`: Container do menu que abriga os botões dos 8 departamentos + Diretoria.
        *   `.executiveCommandStrip`: Container da Diretoria Executiva que abriga o botão `[CONVOCAR REUNIÃO / NOVA PAUTA]`.
        *   `.deptsPanel`: Container dos 8 Departamentos Operacionais.
        *   `.decisionQueueSection` e `.agentsPanel`: Containers de deliberações e telemetria.
        *   `.deptModuleHeader` e `.moduleCard`: Containers de módulos e seções internas.
        *   Barras de navegação por abas em Produção, Atendimento (SAC), Atelier e Assinaturas.
    *   **Cards e Botões Internos (Elementos Flutuantes):**
        *   Cor de Fundo: **Branco Puro (`#FFFFFF`)**.
        *   Borda Canônica: **`1px solid #000000` (Preto Sólido de 1px)**, replicando exatamente a estética aclamada da tela de bloqueio (`SiteLockGate`).
        *   Aplicado em: Todos os 8 cards de departamentos (`.deptCard`), botões do menu (`.deptNavLink`), botões de ação do topo (`.actionCardBtn`, `.executiveHeaderBtn`, `.storeLink`), chips de presença (`.connectedPartnersCard`, `.partnerPresencePill`), cards de decisão (`.decisionCard`), crachás dos 23 agentes (`.agentBadge`) e sub-cards de métricas em todas as 8 páginas departamentais.
    *   **Limpezas de Layout Aprovadas:**
        *   Removida a telemetria redundante do card da Diretoria Executiva (já acessível via botão `🤖 AGENTES`).
        *   Removida a duplicidade de presença dos 4 sócios (mantida apenas na barra do topo).
        *   Logo `SEM LIMITES PRETO` recortada de dead-padding transparente (`LOGO_SEM_LIMITES_PRETO_TRIMMED.png`) e dimensionada em `101x44px`.
    *   **Build de Produção:** Next.js Turbopack (`npm run build`) e checagem de tipos (`npx tsc --noEmit`) 100% aprovados com 0 erros.

---

## 2. Próximos Passos Imediatos (Para a Próxima Sessão)

1.  **🧪 Realizar Testes Integrados no Painel Admin (`/admin`):**
    *   Testar fluxos de ponta a ponta: navegação pelos 8 departamentos, simulações de DRE, geração de prompt-to-image no Atelier, alteração de pautas e chamadas de API.
2.  **⚡ Integração com o Bling ERP v3 (Transplante da Star-Ink):**
    *   Conectar o hub fiscal, espelhamento de pedidos e controle de estoque centralizado aproveitando toda a base já desenhada e validada na Star-Ink.
3.  **🚚 Monitoramento da Última Milha do Pedido Dimona (`#755-460-927`):**
    *   Acompanhar a chegada física das 6 amostras na filial da J&T Express em Vitória/ES via `/admin/atendimento` (previsão oficial de entrega: 27/11/2026).
4.  **👑 Acompanhamento da Parceria Fábrica King (`docs/KING/`):**
    *   Aguardar retorno do Anderson e Adriane pelo WhatsApp para dar início ao King Connect Gateway.
