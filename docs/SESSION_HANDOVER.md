# 📍 Protocolo de Passagem de Bastão (Handover) — AVA Sem Limites

Este documento é a nossa âncora de persistência para as sessões de planejamento e codificação. Ele deve ser lido no início de cada sessão e atualizado ao final.

---

## 1. O que realizamos nesta sessão (Estado Atual — 23/11/2026)

*   **🏛️ PLANEJAMENTO & PROTÓTIPO HOMOLOGADO DA SALA DE REUNIÕES E COMPARTILHAMENTOS (`AVA BOARDROOM`) (`docs/CHAT/`) ✅:**
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

## 3. Próximos Passos Imediatos (Para a Reunião Presencial e Próxima Sessão)

1.  **Reuniões Presenciais com os Sócios (Alinhamento & Credenciamento):**
    *   **Tripoint (Domingo, 24/Nov, presencial):** Apresentar o Cockpit `/admin`, orientar o login individual (`tripoint` / `admin123`), avaliar as matrizes no Atelier Criativo (`/admin/atelier`) e definir o cronograma da Nova Coleção PoD. Coletar a impressão do Tripoint sobre o teste do **Magnific AI** (~US$ 20/mês).
    *   **Flávio (Financeiro & Jurídico):** Apresentar o módulo de **Assinaturas & Custos Fixos** (`/admin/financeiro/assinaturas`), a sistemática de ressarcimento das despesas adiantadas por Armando (R$ 209,33/mês) e o plano de validação inicial emitindo NF-e 55 no **Bling ERP através do MEI com Inscrição Estadual ativa já existente**.
2.  **Operação e Fornecedores PoD:**
    *   **Estorno Reserva INK (R$ 159,00):** Orientar Gustavo a solicitar o reembolso integral dos R$ 159,00 pagos no cartão de crédito via painel/suporte da Reserva INK (Art. 49 do CDC / garantia de 7 dias), eliminando cobranças fixas desnecessárias.
    *   Homologar o cadastro do CNPJ/IE ativo no canal B2B Corporate da **Dimona Dropsimples** para destravar a **Tabela de Lojista/Atacado (R$ 38 a R$ 58)** e eliminar a cobrança a preço de consumidor final.
    *   Operar a **Printful Brasil** (API v1/v2 com token Bearer gratuito) para Bonés com Bordado 3D Puff e maquetes fotorealistas de estúdio.
3.  **GEO & Arquitetura de IA (`/llms.txt`):**
    *   Atualizar [`src/app/llms.txt/route.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/llms.txt/route.ts) adicionando a seção de **Experiência do Cliente & Suporte 24/7 (Concierge Digital)**, garantindo pontuação máxima de confiança (E-E-A-T) nas respostas do ChatGPT, Gemini e Perplexity.
4.  **Campanha "EU TENHO CUPOM!" & Vitrine Secreta:**
    *   Assim que o conselho definir a data do Drop Inaugural, ativar o módulo com senha prefixada (`1...` a `5...` para 10% a 50% OFF) para escoar o estoque físico já confeccionado em paralelo à Nova Coleção PoD.



