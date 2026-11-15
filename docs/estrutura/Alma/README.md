# 🌸 A Alma da AVA Vitória (Branding & Design System)

Esta camada define a essência conceitual, a identidade de marca e as diretrizes estéticas que guiam a interface do e-commerce.

---

## 1. Identidade de Marca

A **AVA Vitória** é uma marca de streetwear de luxo inspirada na cultura urbana local de Vitória (ES), mesclando a atitude das ruas com o refinamento estético do ultra-luxo.

### 1.1. Os Três Pilares (AVA)
*   **Atitude:** Presença marcante, rebeldia urbana e expressão autêntica.
*   **Valorização:** Reconhecimento do talento local, do grafite e do material autoral capixaba.
*   **Amizade:** Conexão real e engajamento comunitário fiel.

### 1.2. DNA Arquetípico
*   **Explorador (Tônica):** Busca por liberdade, originalidade e novos cenários urbanos.
*   **Amante (Terça):** Apelo estético de ultra-luxo, exclusividade e texturas sensoriais.
*   **Criador (Quinta):** Construção autoral e direção criativa impecável de foto/vídeo.
*   **Rebelde (Sétima):** Quebra de paradigmas e atitude disruptiva.

---

## 2. Design System Estético (Tokens)

Toda a codificação do CSS deve utilizar estritamente as variáveis declaradas no escopo global para garantir consistência e facilidade de customização pelo painel de controle.

### 2.1. Variáveis de Cor (CSS Custom Properties)
```css
:root {
  --color-bg: #FEFCF5;       /* Off-White Marfim (Fundo de galeria e cards) */
  --color-accent: #000000;   /* Preto Sólido (Destaques cirúrgicos, botões e inspeção ativa) */
  --color-text-primary: #000000;  /* Preto de alto contraste */
  --color-text-secondary: #555555; /* Cinza grafite para descrições */
  --color-border: rgba(0, 0, 0, 0.12); /* Bordas finas compartilhadas de 1px */
  --color-card-bg: #FEFCF5; /* Fundo marfim contínuo integrado com mix-blend-mode: multiply */
}
```

### 2.2. Tipografia
*   **Títulos & Navegação:** `Exotc350`, `Geostar` ou `Outfit`.
*   **Corpo & UI:** `Poppins` / `Plus Jakarta Sans` em pesos finos (`200` ou `300`) para transmitir elegância e sofisticação tipográfica.

### 2.3. Estética da Subtração (Regras Visuais)
*   **Bordas:** Usar estritamente `1px solid var(--color-border)`. Sem bordas grossas ou arredondamentos excessivos.
*   **Inspeção Ativa (Vidro Leitoso):** Película `rgba(255, 255, 255, 0.78)` com `backdrop-filter: blur(16px)` sobre os 8 cards vizinhos durante o 1º clique.
*   **Espaçamento:** Layouts limpos com respiro simétrico (`gap: 24px` no grid da vitrine e matriz `.unifiedGrid` com divisórias de `1px` na PDP).
