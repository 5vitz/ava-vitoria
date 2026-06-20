# TASK-002: Seletor de Cores Dinâmico via Filtros SVG

## 📋 Status
*   **Status:** Em Planejamento (Machado Afiado)
*   **Prioridade:** Alta (Decisão de Arquitetura & UX)
*   **Data de Criação:** 2026-06-11 (Atualizado em 2026-06-12)
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Implementar a funcionalidade de troca dinâmica de cores na página de detalhes do produto do e-commerce **AVA Sem Limites**. 

Para manter o realismo e a sofisticação da marca, a colorização será aplicada dinamicamente via código sobre uma imagem base na cor **branca** recortada em formato PNG transparente (a "Máscara"). Isso garante que a textura, costuras e sombras do tecido original sejam preservadas, enquanto a cor é alterada instantaneamente pelo navegador.

---

## ⚡ Especificações de Negócio & Design (Alinhadas)

### 1. Visualização em 4 Ângulos Sinuosos (Personalidade AVA)
Em vez das tradicionais visualizações chapadas de e-commerce, o visualizador do produto oferecerá **4 ângulos de câmera** para valorizar o caimento e os detalhes:
*   **De Frente:** Visão frontal para destacar o caimento e estampas principais.
*   **De Costas:** Visão traseira (obrigatória para peças com estampas grandes nas costas).
*   **De Cima para Baixo (High-Angle / Plongée):** Visão sutil do alto, destacando a caída dos ombros oversized e gola nas camisas, e a arte superior da aba nos bonés.
*   **De Baixo para Cima (Low-Angle / Contra-Plongée):** Visão sutil de baixo, conferindo uma postura imponente e rebelde aos modelos, e revelando detalhes de baixo relevo e a cor inferior da aba dos bonés.

### 2. Paleta de Cores Dinâmica (Padrão `Nome|#Hex`)
As cores não serão estáticas. O administrador cadastrará as cores de cada produto no Painel Administrativo. 
*   **Formato de Armazenamento:** As variantes no banco de dados (`stock_variants.color`) utilizarão a notação combinada `Nome da Cor|#Hexadecimal` (ex: `Salmão|#FA8072`, `Vinho Escuro|#1F080F`, `Preto Matte|#0A0A0A`).
*   **Comportamento no Frontend:** O código Next.js separará a string no caractere `|`. Ele renderizará botões circulares coloridos na interface com a cor exata (`background-color: #Hexadecimal`) e usará o `Nome` para acessibilidade, tooltips e carrinho.

### 3. Expansão de Categoria (Beachwear de Luxo)
A vitrine demo incluirá vestimentas de praia estilizadas com a logo da AVA para demonstrar a viabilidade desse mercado em Vitória:
*   **Biquínis Femininos** (Design minimalista e elegante).
*   **Sungas Masculinas** (Modelagem anatômica).
*   *Nota de Design:* As fotos do catálogo geral da vitrine mostrarão modelos reais/virtuais na praia, enquanto o seletor utilizará a foto do modelo em pose neutra (braços abertos/mãos no bolso) permitindo o recorte limpo da camisa/peça para a máscara de cor.

---

## 🛠️ Requisitos Técnicos de Implementação

*   **Imagens de Suporte (Templates):**
    *   Para cada produto cadastrado, teremos 4 imagens base brancas (PNG transparente), correspondentes aos 4 ângulos.
    *   Podem ser obtidas de bancos de mockups gratuitos da web ou geradas por IA (utilizando prompts de câmera como *"high-angle shot"* e *"low-angle shot"* no Flux).
*   **Mecanismo de Tintura (SVG Dinâmico & CSS):**
    *   O Next.js aplicará um filtro de cor ou propriedades CSS (como `mix-blend-mode: multiply` ou filtros SVG `<feColorMatrix>`) sobre a máscara branca ativa.
    *   Isso garante que ao clicar no círculo da cor, o template selecionado mude de cor sem perder sombreamento e sem recarregar a tela.
*   **Estampagem por Automação (Script de Apoio):**
    *   Para aplicar as estampas/logotipos de forma idêntica e profissional sobre os templates brancos sem trabalho manual no Photoshop, utilizaremos um script em Python (`apply_logo.py`) localizado no diretório de scratch.
    *   **Orquestração/Delegação:** O subagente **[BackendArchitect](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/agentes/engineering-backend-architect.md)** será responsável pelo desenvolvimento, teste e execução deste script local.
    *   **Funcionamento do Script:** O script utilizará a biblioteca Pillow (Python) para ler as imagens base do Flux, aplicar uma transformação de perspectiva/distorção sutil para acompanhar a curvatura do tecido em cada ângulo, e mesclar o PNG do logotipo/arte usando o modo `multiply` (multiplicação de canais), gerando as imagens finais prontas para a vitrine.

