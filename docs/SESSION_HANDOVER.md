# 📍 Protocolo de Passagem de Bastão (Handover) — AVA Sem Limites

Este documento é a nossa âncora de persistência para as sessões de planejamento e codificação. Ele deve ser lido no início de cada sessão e atualizado ao final.

---

## 1. O que realizamos nesta sessão (Estado Atual)

*   **✨ REFINAMENTO VISUAL & UX DO COCKPIT ADMIN & HEADER ([`AdminHeader.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminHeader.tsx) & [`AdminCockpitClient.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminCockpitClient.tsx)) ✅:**
    *   **Inversão Estratégica de Seções:** Os **Departamentos Operacionais da Empresa** agora assumem o topo da página principal `/admin`, seguidos da **Fila de Decisões Executivas** e da **Telemetria dos 19 Agentes de IA da Mesa Redonda** no rodapé.
    *   **Logo Selo Ampliada e Barra Imponente:** Aumentada a altura do menu para `min-height: 80px` (com `padding: 16px 28px`), expandindo a **Logo Selo Branca** para **52px**, garantindo presença marcante e elegância como botão de retorno à Home (`/admin`).
    *   **Eliminação do Card Informativo do Topo:** Removido o banner redundante *"Cockpit Central — Ambiente de comando executivo..."*, dando foco imediato às operações da loja.
    *   **Título Sucinto da Fila:** Ajustado para **"Fila de Decisões Executivas"** (sem redundâncias).
    *   **Validação Completa:** `npx tsc --noEmit` aprovado com 0 erros e `npm run build` compilado com sucesso em 8.9s!

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

## 2. 🖥️ Informações do Ambiente de Produção

*   **URL da Loja:** `https://www.ava-vitoria.com.br` (em breve transição para `https://www.avasemlimites.com.br`)
*   **URL do Painel Admin:** `https://www.ava-vitoria.com.br/admin`
*   **Feed Meta Commerce (Instagram Shopping):** `https://www.ava-vitoria.com.br/api/catalog/meta`
*   **Credenciais Padrão:**
    *   **Usuário:** `admin`
    *   **Senha:** `admin123`
*   **Banco de Dados na VPS:** `postgresql://ava_vitoria_user:AvaVitoriaSecretPass!@localhost:5432/ava_vitoria_prod?schema=public`
*   **Next.js PM2 Process Name:** `ava-vitoria` (porta 3000)

---

## 3. Próximos Passos Imediatos (Para a Sessão de Amanhã)

1.  **Iniciar a Implementação dos 8 Departamentos ([PLANO_IMPLEMENTACAO_8_DEPARTAMENTOS_AVA.md](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/PLANO_IMPLEMENTACAO_8_DEPARTAMENTOS_AVA.md)) — Fases 1 a 5:**
    *   **Fase 1:** Evolução do `schema.prisma`, Catálogo Multi-Supplier (`suppliers.ts`), Motor de Precificação Dinâmica com inspeção de 2h e Chave de 2 Posições (`pricingEngine.ts`) e rotas de API.
    *   **Fase 2:** Incrementos na Loja Pública (Textura Halftone, Seção dos 10 Canais de Venda e Central `/atendimento` + `/trocas`).
    *   **Fases 3, 4 e 5:** Cockpit Central `/admin` + os 8 Departamentos Operacionais em 100% CSS Modules (`.module.css`).
2.  **Retorno do Sócio de Marketing (Fase Extra Condicional):**
    *   Assim que o sócio de Marketing aprovar a estratégia enviada hoje, implementar o módulo **`[ 🔑 EU TENHO CUPOM! ]`** com Senha Única Prefixada (`1` a `5` = `10%` a `50% OFF`) e a Vitrine Secreta do Estoque Físico.



