# Especificação Técnica e Conceitual — AVA Vitória E-commerce

> [!IMPORTANT]
> **DIRETRIZ DE REBRAND (EM PLANEJAMENTO):** O projeto passa a se chamar oficialmente **AVA Sem Limites**, operando sob a URL **www.avasemlimites.com.br**. As menções a "AVA Vitória" na documentação legada serão substituídas progressivamente durante a execução, mas a nova marca já rege as decisões atuais.

## 1. BRANDING & IDENTIDADE VISUAL (Nossa essência)
A **AVA Vitória** é uma marca de streetwear de luxo inspirada na cultura urbana local de Vitória, mesclando a atitude das ruas com o refinamento estético do luxo.

### 1.1. Os Três Pilares (AVA)
*   **A**titude: Presença marcante, rebeldia urbana e expressão autêntica.
*   **V**alorização: Reconhecimento do talento local, do grafite e do material autoral.
*   **A**mizade: Conexão real e engajamento comunitário fiel.

### 1.2. DNA Arquetípico
*   **Explorador (Tônica):** Busca por liberdade, originalidade e novos cenários urbanos.
*   **Amante (Terça):** Apelo estético de ultra-luxo, exclusividade e texturas sensoriais.
*   **Criador (Quinta):** Construção autoral e direção criativa impecável de foto/vídeo.
*   **Rebelde (Sétima):** Quebra de paradigmas e atitude disruptiva.

### 1.3. Design System Estético
*   **Cor de Fundo Padrão (Preto):** `#000000` (customizável por variáveis CSS no Painel de Controle).
*   **Cor de Destaque (Laranja Ferrugem):** `#FF4D1C` (reservado para detalhes cirúrgicos: hovers, preços e botões ativos).
*   **Tipografia:**
    *   *Títulos:* **Outfit** ou **Syne** (Google Fonts), em pesos bold, inspirada em editoriais de moda e cartazes de rua.
    *   *Corpo & UI:* **Plus Jakarta Sans** (Google Fonts) em pesos finos (200/300) para máxima elegância e legibilidade.

---

## 2. USER EXPERIENCE (UX/UI) & ARQUITETURA DE TELAS (Como o cliente sente e navega na loja)
Experiência focada na vitrine de impacto baseada no benchmark da **Balenciaga**, priorizando mídias verticais e navegação fluida de catálogo sem recarregamentos desnecessários.

### 2.1. O Grid da Vitrine (3 Produtos por Linha)
*   Em vez das 4 colunas tradicionais que poluem e diminuem o produto, a vitrine da AVA exibirá **3 produtos por linha**.
*   Isso concede maior destaque para as proporções das peças oversized e detalhes da confecção.
*   As fotos de produtos seguirão estritamente a **proporção 9:16** (vertical alta), idênticas às mídias de Stories/Reels, integrando o e-commerce nativamente com a linguagem visual do Instagram.

### 2.2. O Card de Produto Simplificado (Foco e Contraste)
*   **Estado Estático:** Exibe apenas a imagem de capa (`images[0]`) em proporção 9:16, tratada em preto e branco (`grayscale(100%)`).
*   **Estado Hover (Mouse Sobre):** A imagem transiciona suavemente de volta para as cores originais (`grayscale(0%)`) com um leve zoom conceitual (`scale(1.02)`).
*   **Interação de Navegação:** O clique único é interceptado e ignorado na interface para evitar navegação acidental. O duplo clique (`onDoubleClick`) redireciona o usuário para a página de detalhes, enquanto a estrutura semântica de `<Link>` é mantida para garantir a indexação correta pelos motores de busca (SEO).

### 2.3. Estratégia de Imagem Híbrida (IA + Foto Real)
Para obter o máximo de conversão e impacto estético com altíssima eficiência financeira, a produção de mídias do catálogo segue uma divisão híbrida:
*   **Vitrine / Lookbook (Impacto e Sedução por IA):** Uso de tecnologia de **Provador Virtual Dedicado (VTON - Virtual Try-On)**. Embora a pesquisa acadêmica chame isso de "provador" (pensando no cliente provando a roupa), no projeto nós o adaptamos como uma ferramenta do lojista: a IA veste modelos digitais/artísticos realistas em cenários urbanos (gerados via Midjourney) com a estampa e modelagem real da peça (via técnicas de *Inpainting* e mesclagem gráfica). Isso gera editoriais conceituais sem os custos logísticos de ensaios físicos.
*   **Área de Compra / Seletor (Segurança e Confiança Real):** Exibição da foto técnica física e real da peça na cor branca (PNG transparente), permitindo a colorização dinâmica via SVG. Isso assegura ao cliente a visualização clara do caimento, relevo e material real do produto que ele irá receber.

---

## 3. ARQUITETURA TÉCNICA & INTEGRAÇÕES (Como a engrenagem do banco de dados, estoque e APIs roda por trás)
Estrutura robusta desenhada para ter escalabilidade horizontal e comunicação em tempo real com redes de venda.

### 3.1. Integração com Instagram Shopping
*   O backend da loja gerará dinamicamente um feed de produtos estruturado no formato **XML/JSON catalog** homologado pela Meta.
*   Esse catálogo será conectado ao gerenciador de comércio da Meta, alimentando o recurso "Sacolinha do Instagram" para permitir compras diretamente pelas fotos e vídeos da rede social, apontando o checkout para o site.

### 3.2. Estrutura de Banco de Dados Relacional (Proposta Inicial)
Para consistência robusta de controle de transações, faturamento e baixas de estoque:
*   Banco de dados principal: **PostgreSQL**.
*   Garante que duas compras simultâneas do último boné de estoque não gerem faturamento duplo (integridade transacional ACID).

### 3.3. Coloração Dinâmica no Catálogo (Seletor de Cores)
Para unir a liberdade conceitual artística das mídias da marca à precisão técnica do e-commerce:
*   **Separação Conceitual:** As fotos da vitrine são livres, artísticas e urbanas (modelos na rua). O seletor de cores exibe uma foto técnica recortada (estilo *flat lay* ou *ghost mannequin*) da peça na cor **branca** (PNG transparente).
*   **Tecnologia de Colorização:** Filtros SVG Dinâmicos (`<feColorMatrix>` / `<feComponentTransfer>`) aplicados sobre a imagem PNG branca em tempo real no frontend.
*   **Vantagens:** O filtro SVG preserva os canais de luminância (sombras naturais, relevo do tecido, dobras e costuras) e aceita qualquer valor hexadecimal injetado dinamicamente pelo React/Next.js a partir do banco de dados, eliminando o lag do Canvas e vazamentos de cor em fundos complexos.

