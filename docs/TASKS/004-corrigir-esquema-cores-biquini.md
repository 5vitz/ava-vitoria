# TASK-004: Corrigir Esquema de Cores do Biquíni (Manchas e Iluminação)

## 📋 Status
*   **Status:** Pendente / Backlog (Aguardando Retorno do Desenvolvedor)
*   **Prioridade:** Alta (Qualidade Visual & UX)
*   **Data de Criação:** 2026-06-12
*   **Autor:** Genera (Armando)
*   **Responsável:** BackendArchitect

---

## 🔍 Descrição da Necessidade

A colorização do biquíni 001 nas variantes Preto, Verde e Amarelo ainda apresenta manchas visuais indesejadas (mesmo utilizando a abordagem de cor sólida com volume de 12%). Isso ocorre porque o tecido branco original da foto possui imperfeições de alta frequência, granulação e reflexos dourados da areia da praia que distorcem a luminância local de forma irregular.

É necessário encontrar uma solução definitiva que proporcione cores totalmente limpas, homogêneas e de padrão comercial para as imagens da loja de detalhes (cropped).

---

## 💡 Sugestões de Solução a Investigar:

1.  **Isolamento de Máscara de Luminância com High-Pass/Bilateral Filter:**
    *   No script Python, aplicar um filtro bilateral ou desfoque inteligente na área do tecido antes de extrair as sombras. Isso removerá as granulações de areia e ruído de alta frequência, mantendo apenas os gradientes suaves de dobra/relevo.
2.  **Canal Alfa com Separador de Camada no Frontend:**
    *   Gerar uma imagem com a modelo contendo um "recorte transparente" (buraco) na área do biquíni e a logo flutuando.
    *   Ajustar a arquitetura da página de detalhes do produto no Next.js para renderizar um SVG ou um elemento colorido posicionado perfeitamente por trás do "buraco" do biquíni.
3.  **Geração de Máscara de Relevo Neutro (Grayscale Displacement/Heightmap):**
    *   Criar uma textura puramente em escala de cinza e normalizada das sombras do biquíni, que possa ser multiplicada ou mesclada dinamicamente via filtros de frontend sobre qualquer cor sólida.
