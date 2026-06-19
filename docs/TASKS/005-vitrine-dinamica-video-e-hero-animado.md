# TASK-005: Vitrine Dinâmica via Vídeo Loop e Hero do Skatista Animado

## 📋 Status
*   **Status:** Em Desenvolvimento (Parte 1: Hero Concluído / Parte 2: Vitrine Pendente)
*   **Prioridade:** Alta (Inovação de UX & Apelo Visual)
*   **Data de Criação:** 2026-06-13
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Substituir o modelo estático tradicional por uma vitrine interativa "viva" e cinematográfica que valorize a cultura do skate e do streetwear urbano de luxo. 

Esta tarefa divide-se em duas grandes frentes conceituais:
1.  **O Hero do Skatista Animado:** Adicionar movimento ao banner principal (Hero) do site, substituindo o skatista estático por um vídeo em loop ou animação de alto impacto.
2.  **A Vitrine Dinâmica em Vídeo Loop (360°):** Substituir a renderização 3D por clipes de vídeo curtos em loop de modelos girando em uma plataforma circular física (*turntable*), com controle de hover (tocar/girar) e clique (pausar/inspecionar).

---

## 📐 1. O Hero do Skatista Animado (Seção Principal) — [CONCLUÍDO]

*   **Conceito:** O banner principal (Hero) que recebe o usuário ao abrir a loja deve transmitir imediatamente o DNA dinâmico e urbano da marca AVA Sem Limites.
*   **Implementação Realizada:**
    *   Substituição do banner de imagem estática pelo componente modular e encapsulado `HeroVideo.tsx` (Client Component) localizado em `src/app/components/HeroVideo.tsx`, importado pelo layout mestre da página inicial.
    *   **Especificações Técnicas:** Reprodução automática de vídeo sem som (`muted`, `autoPlay`, `playsinline`), com carregamento de imagem poster inicial e responsividade voltada para dispositivos móveis (`object-position` focado em manter o skatista em evidência em telas verticais).
    *   **Congelamento Experimental:** Implementado monitoramento de eventos `timeupdate` em tempo real para congelar/pausar a animação precisamente em um delta de tempo ajustável experimentalmente (`duration - interruptDelta`), pausando o vídeo no frame exato para evitar repetição ou frames finais indesejados. (Delta padrão configurado em `0.25`s).

---

## 📹 2. A Vitrine Dinâmica em Vídeo Loop (360°)

Em vez de malhas 3D complexas no navegador, utilizaremos um workflow híbrido focado em realismo fotográfico e performance extrema:

### 2.1. O Processo de Captura Físico (Estúdio do Diretor)
*   O proprietário da AVA (Diretor de Vídeo) construirá uma plataforma circular giratória baixa sobre rolamentos (*turntable*).
*   Os modelos subirão na plataforma vestindo as peças da coleção. A câmera permanecerá parada gravando a rotação de 360 graus do modelo.
*   **Cenário:** Fundo de estúdio limpo (ciclorama infinito, parede de concreto ou cinza neutro) para garantir que a IA de vídeo (ou o próprio editor) consiga manter a consistência da iluminação e do foco, evidenciando 100% o tecido e o caimento da roupa.

### 2.2. A Coreografia de Interação no Frontend (`ProductCard.tsx`)
*   **Capa Estática:** O card exibe o vídeo pausado exatamente no primeiro frame (foto frontal).
*   **Hover do Mouse (`onMouseEnter`):** O vídeo inicia o play em velocidade suave (slow-motion). O modelo começa a girar.
*   **Clique para Inspecionar (`onClick`):** O vídeo pausa imediatamente no ângulo em que o usuário clicou. Um ícone sutil de lupa/inspeção surge na tela e um botão minimalista dourado desliza para cima permitindo acessar a página do produto (`[ VER PRODUTO ]`).
*   **Saída do Mouse (`onMouseLeave`):** O vídeo retorna de forma suave para o frame inicial e pausa.

---

## 🛠️ Requisitos Técnicos de Desenvolvimento

*   **Otimização de Mídia (Core Web Vitals):**
    *   Vídeos com compressão agressiva e alta qualidade de imagem (usando codecs WebM/VP9).
    *   Uso do atributo `preload="metadata"` na tag `<video>` para carregar apenas a capa inicial do produto, baixando o restante do clipe assincronamente.
*   **Acessibilidade e Fallbacks:**
    *   No mobile, os vídeos poderão rodar em slow-motion contínuo de forma leve através de um `Intersection Observer` (quando entrarem no campo de visão do usuário), com opção de pausa ao toque.
