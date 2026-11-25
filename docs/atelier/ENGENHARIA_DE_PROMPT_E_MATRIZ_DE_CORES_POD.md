# 🎨 Especificação Técnica: Engenharia de Prompt JSON, Matriz de Cores & Renderização de Mockups PoD 2.0

> **Website Oficial:** `www.star-ink.com.br`  
> **Arquitetura Base:** Single Source of Truth & Curadoria Autoral de Estampas e Tecidos  
> **Finalidade:** Guia mestre de Engenharia de Prompt (JSON), curadoria de contraste de tecidos e renderização realista de mockups têxteis 9:16.  
> **Última Atualização:** Agosto de 2026  

---

## 🏛️ 1. Visão Geral da Arquitetura

O modelo de negócios da **Star-Ink** opera como uma marca autoral de *Luxury Streetwear*. Cada estampa é uma obra de arte única que exige **harmonia visual entre a cor da estampa e a cor do tecido**, além de renderização realista com luz, sombra e dobras no e-commerce D2C.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. ANÁLISE VISION DA IMAGEM REFERÊNCIA DE ARTE                             │
│ Extração de Prompt, Sementes (Seeds), Traço Hairline 1px e Paleta de Cores  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. ARQUIVO MESTRE DE ENGENHARIA DE PROMPT (prompt_autoral.json)             │
│ Contém os parâmetros de 300 DPI (Produção PoD) e 92 DPI (WebP 9:16 Vitrine) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. CURADORIA ADMIN DE CONTRASTE & SELEÇÃO DE CORES DA MARCA                │
│ O lojista define quais cores de tecido (ex: Preta, Vinho, Marinho) estão     │
│ ATIVAS para cada estampa, bloqueando combinações sem contraste (ex: Branca) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. RENDERIZAÇÃO REALISTA DE MOCKUPS (Modos de Mesclagem Têxtil)             │
│ Aplicação de Multiply / Multiply & Screen com mapas de luz, sombra e dobras │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎛️ 2. Curadoria de Cores no Painel Admin (`availableColors`)

Embora o fornecedor industrial (Reserva INK) disponibilize até 6 cores na linha de Algodão Peruano, a **Star-Ink possui controle soberano de curadoria**:

* **Curadoria por Estampa:** No cadastro do produto em `/admin/catalogo`, o administrador seleciona exatamente **quais das 6 cores de tecido estão homologadas para aquela estampa**.
* **Controle de Iluminação e Legibilidade:**
  * Estampas com traço predominantemente claro (`#ffffff`) ➔ Ativadas para tecidos escuros (`Preta`, `Azul Marinho`, `Vinho`, `Verde Militar`).
  * Estampas com traço predominantemente escuro (`#000000`) ➔ Ativadas para tecidos claros (`Off-White/Branca`, `Cinza Mescla`).

---

## 👕 3. Visualização Dinâmica no Mini Card (Troca de Cor do Mockup)

No Mini Card da Vitrine 9:16 (`ProductCard.tsx`):

1. **Indicador de Cor Ativa:**
   * A cor selecionada pelo cliente no Mini Card ganha um **anel indicador de destaque (ring / border-black scale-125)**, dando feedback imediato ao usuário.
2. **Troca Dinâmica da Imagem do Mockup:**
   * Ao clicar na bolinha da cor **Vinho** ou **Off-White**, a imagem do card alterna em tempo real para o mockup da camiseta naquela cor específica, proporcionando um atendimento visual sedutor e inteligente.

---

## 📜 4. Estrutura do Arquivo `prompt_autoral.json` (Engenharia de Prompt Mestre)

Cada estampa possui o seu arquivo JSON mestre de especificação técnica:

```json
{
  "artwork_id": "ARTE_02_A_FADA",
  "title": "A Fada — Arcano do Tarô",
  "drop": "Drop 01 — Tarô Negro",
  "vision_analysis": {
    "style": "Hairline Vector Geometry / Sacred Geometry 1px",
    "primary_stroke_color": "#FFFFFF",
    "secondary_accent_color": "#38BDF8",
    "recommended_bg_fabrics": ["black", "navy", "wine", "military_green"],
    "incompatible_bg_fabrics": ["white"]
  },
  "print_production_specs": {
    "dpi": 300,
    "dimensions_px": "4200x4800",
    "format": "PNG-32 (Transparent Background)",
    "stroke_thickness_min_px": 1.5,
    "print_file_dark_fabric": "/catalog/drop-01/ARTE_02/PRINT/fada_white_stroke_300dpi.png",
    "print_file_light_fabric": "/catalog/drop-01/ARTE_02/PRINT/fada_black_stroke_300dpi.png"
  },
  "web_showcase_specs": {
    "dpi": 92,
    "format": "WebP 9:16",
    "blending_mode": "Multiply",
    "mockups_by_color": {
      "black": "/catalog/drop-01/ARTE_02/MOCKUPS/fada_black_9x16.webp",
      "white": "/catalog/drop-01/ARTE_02/MOCKUPS/fada_white_9x16.webp",
      "navy": "/catalog/drop-01/ARTE_02/MOCKUPS/fada_navy_9x16.webp",
      "wine": "/catalog/drop-01/ARTE_02/MOCKUPS/fada_wine_9x16.webp"
    }
  }
}
```

---

## 🖌️ 5. Mesclagem Têxtil Realista (Luz, Sombra & Dobras da Malha)

Para evitar o aspecto sintético de "adesivo colar por cima":
1. **Mapa de Sombras (Displacement Map / Multiply Layer):**
   * A camada da estampa em PNG transparente recebe a textura e o mapa de dobras da malha de algodão peruano através do modo de mesclagem `Multiply` (em tecidos claros) e `Screen / Linear Dodge` (em traços claros sobre tecidos escuros).
2. **Respeito ao Caimento Têxtil:**
   * A iluminação ambiente e os vincos da camiseta passam através do traço da estampa, criando o efeito de impressão DTG industrial de alta qualidade.

---

## 📌 Próximos Passos de Desenvolvimento:

1. **Curadoria de Cores no Admin:** Adicionar o seletor de cores ativas por produto na Divisão 2 do Admin (`ShowcaseCatalogModule.tsx`).
2. **Troca Dinâmica de Mockup por Cor:** Atualizar `ProductCard.tsx` para alternar a imagem exibida conforme a cor clicada pelo usuário no Mini Card.
3. **Análise de Prompts com IA Vision:** Estruturar o fluxo de recepção dos arquivos JSON gerados pela IA Vision para refinamento e homologação.
