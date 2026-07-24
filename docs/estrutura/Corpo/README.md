# 📐 O Corpo da AVA Vitória (Arquitetura de Telas & UX/UI)

Esta camada define a estrutura de telas, a jornada visual do usuário, os componentes React (Next.js) e as micro-interações do e-commerce.

---

## 1. Grid da Vitrine (Página de Catálogo)

Inspirado na estética da **Balenciaga**, o e-commerce prioriza mídias de grande escala e proporções marcantes.

*   **Grade de 3 Colunas & Espaçamento de 24px:** Vitrine exibindo **3 produtos por linha** em desktop (com `gap: 24px`), 2 colunas em tablets e 1 coluna em mobile. O espaçamento refinado reduz a dimensão horizontal e vertical dos cards 9:16, garantindo o enquadramento completo do card (imagem + título + preço) em notebooks de resolução standard (1366x768).
*   **Proporção de Mídia Vertical (9:16):** Todas as fotos do catálogo obedecem à proporção de aspecto **9:16** (Stories/Reels do Instagram).

---

## 2. Card de Produto Inteligente (Inspeção Ativa & Vidro Leitoso)

O card de produto na vitrine possui um comportamento interativo avançado e focado no usuário para evitar poluição visual durante o scroll.

```
+---------------------------+
|          [ 9:16 ]         |
|                           |
|        FOTO CAPA          |
|                           |
| <                       > |  <-- Setas e bolinhas surgem APENAS no 1º Clique
|                           |
+---------------------------+
| Nome do Produto           |  <-- Contornados por Borda Preta 1px no 1º Clique
| R$ 299,90                 |
+---------------------------+
```

### 2.1. Comportamento Detalhado
1.  **Navegação Passiva (Hover Limpo):** Passar o mouse sobre qualquer card **não dispara setas nem altera o catálogo**. A página permanece 100% limpa e estável durante a rolagem.
2.  **Modo de Inspeção Ativa (Gatilho do 1º Clique):**
    *   Ao dar o **1º Clique** em um card:
        1.  É desenhada uma **borda preta de 1px** contornando a célula inteira (imagem 9:16 + nome + preço) com overlay `z-index: 99`.
        2.  Surgem as **setas laterais** (`<` e `>`) e as **bolinhas de navegação** no card selecionado.
        3.  É aplicada a película de **Vidro Branco Leitoso** (`rgba(255, 255, 255, 0.78)` com `backdrop-filter: blur(16px)`) sobre os **8 cards vizinhos** (bloco de 3x3: 3 na linha superior, 2 nas laterais e 3 na linha inferior, `rowDiff <= 1`).
    *   **Navegação no Carrossel:** O usuário clica nas setas e folheia as fotos em loop infinito diretamente no card ativo.
    *   **Saída da Inspeção:** Ao mover o mouse para fora do card ativo, a inspeção se encerra e o vidro leitoso se dissolve suavemente de volta ao catálogo normal.
3.  **Redirecionamento para a PDP:** O **Duplo Clique** (ou clique no nome/preço) direciona o usuário para a página de detalhes do produto (`/produtos/[slug]`).

### 2.2. Arquitetura do Componente React (`ProductCard.tsx`)

Para garantir performance máxima (Core Web Vitals) e evitar carregamento desnecessário de imagens pesadas no carregamento inicial da página, utilizaremos a seguinte estratégia no Next.js:

*   **Estratégia de Lazy Loading no Hover:** Apenas a primeira imagem (`images[0]`) é carregada no HTML inicial. As demais imagens do carrossel só começam a ser baixadas pelo navegador quando o usuário passa o mouse sobre o card pela primeira vez (`onMouseEnter`).

```typescript
// Exemplo conceitual do Componente Next.js (Client Component)
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  name: string;
  price: number;
  images: string[]; // Lista dinâmica de URLs de imagens (sem limite rígido, proporção 9:16)
  slug: string;
}

export default function ProductCard({ name, price, images, slug }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede de abrir a página do produto ao clicar na seta
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0); // Reseta para a foto de capa ao tirar o mouse
      }}
    >
      {/* Container da Imagem com Proporção 9:16 */}
      <div className={styles.imageContainer}>
        <Image
          src={images[currentIndex]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={styles.image}
          priority={currentIndex === 0} // Carrega a capa com prioridade alta
        />

        {/* Pré-carrega as imagens adicionais em segundo plano no Hover */}
        {isHovered && images.slice(1).map((url, idx) => (
          <link key={idx} rel="prefetch" href={url} />
        ))}

        {/* Controles do Carrossel (Visíveis apenas no Hover e se houver > 1 imagem) */}
        {isHovered && images.length > 1 && (
          <>
            <button onClick={handlePrev} className={`${styles.arrow} ${styles.arrowLeft}`}>
              ‹
            </button>
            <button onClick={handleNext} className={`${styles.arrow} ${styles.arrowRight}`}>
              ›
            </button>
            
            {/* Indicadores de bolinhas no rodapé da imagem */}
            <div className={styles.indicators}>
              {images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Informações do Produto */}
      <a href={`/produtos/${slug}`} className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>R$ {price.toFixed(2)}</p>
      </a>
    </div>
  );
}
```

### 2.3. Estilização CSS Módulo (`ProductCard.module.css`)

Estilização seguindo estritamente as regras de **Estética da Subtração**:

```css
.card {
  display: flex;
  flex-direction: column;
  background: transparent;
  border: 1px solid var(--color-border);
  transition: border-color 0.3s ease;
  overflow: hidden;
}

.card:hover {
  border-color: var(--color-accent); /* Borda fica dourada no hover */
}

.imageContainer {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16; /* Proporção estrita Balenciaga */
  background: #000;
  overflow: hidden;
}

.image {
  object-fit: cover;
  transition: transform 0.5s ease;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(31, 8, 15, 0.4); /* Fundo Vinho translúcido */
  backdrop-filter: blur(var(--backdrop-blur)); /* Efeito glassmorphic dinâmico */
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.arrow:hover {
  background: var(--color-accent);
  color: var(--color-bg);
  border-color: var(--color-accent);
}

.arrowLeft { left: 10px; }
.arrowRight { right: 10px; }

.indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.dotActive {
  background: var(--color-accent);
  transform: scale(1.2);
}

.info {
  padding: 15px;
  text-decoration: none;
}

.name {
  font-family: var(--font-title);
  font-size: 1rem;
  color: var(--color-text-primary);
  margin: 0 0 5px 0;
  text-transform: uppercase;
}

.price {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-accent);
  margin: 0;
}
```

---

## 3. Mapeamento de Telas Inicial
*   `TELA-01: Home / Vitrine` — Grid 3 colunas com fotos 9:16 e Hover Carrossel.
*   `TELA-02: Detalhe do Produto (PDP)` — Foco total em mídia vertical em alta resolução, seletor de variantes (tamanhos) e botão de adicionar à sacola.
*   `TELA-03: Drawer da Sacola` — Painel lateral deslizante (*slide-over*) para gerenciar itens adicionados e link para checkout.
*   `TELA-04: Painel Administrativo` — Painel protegido para cadastro de produtos, gerenciamento de estoque e edição rápida das variáveis de estilo do Design System.
