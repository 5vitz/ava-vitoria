# 🎨 Guia de Engenharia Reversa de Artes & Meta-Prompts — STAR INK

> **Website Oficial:** `www.star-ink.com.br`  
> **Arquitetura Base:** MetaPrompt-Studio (Fluxo ASK ➔ PLAN ➔ ARTWORK)  
> **Filosofia de Design:** Estética da Subtração (*"A arte está pronta quando não se pode retirar mais nada"*)  
> **Última Atualização:** 5 de Agosto de 2026  

---

## 🏛️ 1. Visão Geral da Metodologia (Alma & Corpo)

A geração de artes autorais para as coleções da **STAR INK** utiliza uma pipeline de Meta-Prompts dividida em duas dimensões complementares:

* **ALMA (Style Fingerprint):** A essência gráfica da imagem de referência (traço 1px hairline, gravura fine-line, chiaroscuro, peso das sombras, geometria e composição).
* **CORPO (New Subject & Narrative):** A nova história autoral da STAR INK (novo personagem/sujeito, elementos da cena, iluminação e cores HEX sobre fundo preto puro `#000000` em grade A3).

---

## ⚡ 2. A Esteira dos 3 Agentes de Meta-Prompt

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ AGENTE 1: ASK (Nexus / Visão Computacional & Leitor de Alma)           │
 │ • Recebe o link/imagem do Pinterest ou Fine Art.                         │
 │ • Extrai o DNA visual da ALMA: técnica de traço, iluminação e linhas.    │
 └────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ AGENTE 2: PLAN (Arquiteto de Narrativa & Estética da Subtração)         │
 │ • Projeta o novo CORPO: sujeito, símbolos e enquadramento.               │
 │ • Aplica a regra inegociável da Estética da Subtração (remove excessos).│
 └────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ AGENTE 3: ARTWORK EXECUTION (Compilador JSON Schema Mestre A3)          │
 │ • Compila a especificação técnica pronta para Nano Banana 2 / Midjourney.│
 │ • Resolução A3: 3508 x 4960 pixels (300 DPI / 30x40cm).                  │
 └──────────────────────────────────────────────────────────────────────────┘
```

---

## 📜 3. Especificação dos Meta-Prompts

### 🤖 AGENTE 1: ASK (Leitor de Alma Visual)
```markdown
Você é o Agente ASK (Nexus) da STAR INK. Sua única missão é analisar uma imagem de referência e extrair a ALMA visual (DNA gráfico):
1. **Linguagem de Traço:** Espessura (1px hairline / 3px fine-line), hachuras, pontilhismo ou vetor limpo.
2. **Iluminação & Contraste:** Chiaroscuro de alto contraste, sombras profundas, luz direcionada.
3. **Geometria & Composição:** Ancoragem central, triangulação, simetria sagrada ou assimetria calculada.
4. **Paleta Dominante:** Monocromático, duotone ou códigos HEX principais.

Saída obrigatória em formato JSON simples: `alma_fingerprint`.
```

### 🧠 AGENTE 2: PLAN (Arquiteto de Narrativa STAR INK)
```markdown
Você é o Agente PLAN da STAR INK. Você recebe a `alma_fingerprint` do Agente 1 e a ideia de novo conceito do Genera:
1. Mantém 100% da ALMA (técnica e linguagem de traço).
2. Substitui o CORPO (cria novo personagem/objeto e simbologia autoral).
3. Aplica o FILTRO DA SUBTRAÇÃO: Elimina qualquer elemento secundário poluído. Se o elemento não soma à mensagem principal, remova-o.
4. Ancoragem A3: Fundo `#000000` (Preto absoluto) ou transparente, traço `#ffffff` (Branco puro).
```

### ⚙️ AGENTE 3: ARTWORK EXECUTION (JSON Schema A3)
```markdown
Você é o Agente ARCHITECT da STAR INK. Você gera o prompt final compilado no formato `master_prompt_schema.json`:
- Resolução: 3508 x 4960px (300 DPI)
- Aspect Ratio: 3:4 (Grade A3 30x40cm)
- Ancoragem: x_percent=50%, y_percent=45%
- Tonalidade: Monochrome High Contrast DTG Ready
```

---

## 📸 4. Trilho B: Lookbooks & Fotografias de Modelos (9:16)

Para a geração de mídias de campanha (Reels, Instagram e Vitrine 9:16):

* **Enquadramento:** Proporção 9:16 (1080 x 1920px).
* **Modelos:** Modelos humanos autênticos em cenários urbanos minimalistas (arquitetura brutalista, concreto aparente, iluminação natural em penumbra).
* **Foco no Produto:** A peça vestida (camisas, moletons, regatas) exibe fielmente a estampa gerada no Trilho A com caimento impecável (*oversized fit*).

---

## 📌 Registros de Documentação no Projeto:
* **Plano Mestre de Produção:** [docs/ESTRATEGIA_DE_PRODUCAO_E_STARTUP.md](file:///home/artz/Documentos/Antigravity/Star-Ink/docs/ESTRATEGIA_DE_PRODUCAO_E_STARTUP.md)
* **Schema Mestre de Imagem A3:** [public/imagens/master_prompt_schema.json](file:///home/artz/Documentos/Antigravity/Star-Ink/public/imagens/master_prompt_schema.json)
* **Arte 02 (A Fada - Aprovada):** [public/imagens/Arte02/prompt_schema_fada.json](file:///home/artz/Documentos/Antigravity/Star-Ink/public/imagens/Arte02/prompt_schema_fada.json)
