# 📍 Protocolo de Passagem de Bastão (Handover) — AVA Sem Limites

Este documento é a nossa âncora de persistência para as sessões de planejamento e codificação. Ele deve ser lido no início de cada sessão e atualizado ao final.

---

## 1. O que realizamos nesta sessão (Estado Atual)

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
*   **Plano Estratégico da Matriz Canônica Multicanal ✅:**
    *   Criado o documento [docs/PLANO_MATRIZ_CANONICA_MULTICANAL.md](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/PLANO_MATRIZ_CANONICA_MULTICANAL.md) detalhando a integração entre Cadastro Único, Vitrine 9:16, Meta Commerce (`/api/catalog/meta`), Bling ERP (API v3) e Produção PoD (Dimona Dropsimples).

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

1.  **Implementação da Matriz Canônica (conforme [PLANO_MATRIZ_CANONICA_MULTICANAL.md](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/PLANO_MATRIZ_CANONICA_MULTICANAL.md)):**
    *   Adicionar campos fiscais e logísticos no banco (`sku_master`, `cost_price`, `ncm`, `weight_grams`, `dimensions`).
    *   Dividir o editor de produto no `/admin/grid-manager` em 4 abas limpas (Visual, Estoque, Fiscal/Custo e Multicanal).
    *   Enriquecer o feed XML do Meta Commerce (`/api/catalog/meta`).
    *   Importar os conectores da API v3 do Bling ERP desenvolvidos no Star-Ink.
2.  **Preparação Final para a Reunião com os Sócios (Quinta-feira 13:30):**
    *   Apresentação da Vitrine Balenciaga rodando sobre a nova coleção.
    *   Demonstração do fluxo operacional de cadastro canônico e publicação em 1 clique.


