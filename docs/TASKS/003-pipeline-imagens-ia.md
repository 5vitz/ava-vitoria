# TASK-003: Pipeline de Produção de Imagens de Vitrine por IA

## 📋 Status
*   **Status:** Pendente / Backlog
*   **Prioridade:** Média (Fluxo de Mídia)
*   **Data de Criação:** 2026-06-11
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Estabelecer as diretrizes e o fluxo operacional para a criação de imagens artísticas da vitrine/lookbook do e-commerce **AVA Sem Limites** utilizando Inteligência Artificial (Midjourney). O objetivo é produzir fotos de modelos realistas em cenários urbanos ricos sem a necessidade de um ensaio fotográfico físico de alta complexidade de locação e orçamento.

---

## ⚡ Fluxo de Trabalho (Pipeline de Produção)

O processo de criação das ~54 fotos necessárias para as 16 a 18 peças atuais será estruturado nos seguintes passos:

1.  **Assinatura e Preparação (Midjourney):**
    *   Assinar o plano *Standard* do Midjourney (US$ 30) para ter acesso às 15 horas rápidas de GPU e gerações ilimitadas no modo *Relax*.
2.  **Construção dos Prompts de Identidade Visual:**
    *   Definir um vocabulário de prompts padrão no Midjourney alinhado com o DNA de ultra-luxo urbano da AVA Sem Limites.
    *   Incluir variáveis de estilo: iluminação cinematográfica, tons da marca (vinho `#1F080F`, reflexos dourados `#D4AF37`), cenários urbanos realistas com grafites, profundidade de campo profissional e caimento oversized.
    *   Testar diversidade de modelos (etnias, poses de streetwear e feições naturais).
3.  **Geração e Seleção de Modelos/Cenários:**
    *   Gerar as imagens de base no Midjourney (com o modelo vestindo camisas ou moletons brancos/neutros).
    *   Fazer uma curadoria rígida (selecionando as imagens com anatomia perfeita, mãos realistas e enquadramento ideal).
4.  **Provador Virtual e Projeção do Produto Real (Inpainting/VTON):**
    *   Utilizar ferramentas de **Provador Virtual Dedicado (VTON)** ou inpainting (ex: preenchimento generativo do Photoshop AI ou Stable Diffusion) para aplicar as estampas, logotipos e texturas reais das roupas físicas sobre os modelos e cenários gerados pela IA.
    *   Isso garante que o produto exposto na foto da vitrine seja matematicamente idêntico ao produto real que o cliente irá comprar, sem "alucinação" de texto ou logos.
5.  **Exportação e Otimização de Mídia:**
    *   Exportar as imagens no formato **9:16 vertical** com compressão WebP de alta qualidade para garantir carregamento ultra-rápido no site.
