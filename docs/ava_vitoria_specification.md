# Especificação Técnica e Conceitual — AVA Vitória E-commerce

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
*   **Cor de Fundo Padrão (Vinho Escuro):** `#1F080F` (customizável por variáveis CSS no Painel de Controle).
*   **Cor de Destaque (Dourado):** `#D4AF37` (reservado para detalhes cirúrgicos: hovers, preços e botões ativos).
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

### 2.2. O Card de Produto Inteligente (Hover Carrossel)
*   **Estado Estático:** Exibe a imagem de capa do produto em 9:16.
*   **Estado Hover (Mouse Sobre):**
    *   A foto principal ganha controles sutis de setas laterais (esquerda/direita).
    *   O card se transforma em um minicarrossel interativo contendo até **4 imagens** da peça.
    *   Permite ao cliente analisar o caimento em diferentes ângulos antes de decidir clicar para abrir a página de detalhes.

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
