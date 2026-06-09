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
  --color-bg: #1F080F;       /* Vinho Escuro (Cor de fundo principal) */
  --color-accent: #D4AF37;   /* Dourado (Destaques cirúrgicos: hover, preços, ativos) */
  --color-text-primary: #FFFFFF;  /* Branco puro */
  --color-text-secondary: #A0A0A0; /* Cinza claro para descrições */
  --color-border: rgba(255, 255, 255, 0.1); /* Bordas finas de 1px */
  --color-card-bg: rgba(31, 8, 15, 0.5); /* Vinho translúcido para cards */
}
```

### 2.2. Tipografia
*   **Títulos:** `Outfit` ou `Syne` (Google Fonts). Devem ser carregados em pesos bold/black para criar contraste dramático, similar a editoriais de moda de luxo.
*   **Corpo & UI:** `Plus Jakarta Sans` (Google Fonts). Deve ser utilizado em pesos finos (`200` ou `300`) para transmitir elegância e sofisticação tipográfica.

### 2.3. Estética da Subtração (Regras Visuais)
*   **Bordas:** Usar estritamente `1px solid var(--color-border)`. Sem bordas grossas ou arredondamentos excessivos.
*   **Sombras:** Evitar sombras pesadas ou coloridas. Preferir o uso de contrastes secos ou efeitos de transparência (*glassmorphism* com `backdrop-filter`).
*   **Espaçamento:** Layouts limpos com bastante respiro (padding e margin generosos).
