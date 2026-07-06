# AVA SEM LIMITES | GUIA DE INTEGRAÇÃO COM TIKTOK

# Passo a Passo: Habilitar Catálogo e Anúncios de Compras no TikTok
*Projeto AVA Sem Limites - Guia de Providências Comerciais e Técnicas*

---

Este documento serve como um guia prático para a reunião de alinhamento com o cliente (Tripoint Ava). Ele detalha as etapas comerciais e as configurações técnicas necessárias para conectar a **AVA Sem Limites** ao ecossistema de anúncios de compras do TikTok, permitindo alcançar o público de forma viral e integrada ao e-commerce.

---

## Etapa 1: Requisitos da Conta Comercial

Para anunciar e sincronizar produtos no TikTok, a marca precisa de uma estrutura corporativa oficial na plataforma:

1. **Converter para Conta Corporativa:** O perfil do TikTok da AVA deve ser convertido de pessoal para conta "Corporativa" (gratuito, feito diretamente nas configurações do aplicativo no celular).
2. **Criar o TikTok Business Center:** Acessar [business.tiktok.com](https://business.tiktok.com/) e criar o gerenciador de negócios da marca. Ele funciona de forma similar ao Meta Business Manager.
3. **Vincular a Conta de Anúncios (Ads Manager):** Criar uma conta de anúncios no TikTok Ads Manager e associá-la ao Business Center criado.

---

## Etapa 2: Instalação do TikTok Pixel (Mapeamento do E-commerce)

O Pixel é o código que permite ao TikTok entender o comportamento dos usuários no nosso site para otimizar os anúncios.

1. **Gerar o Pixel:** No painel do *TikTok Ads Manager*, acessar "Ativos" -> "Eventos" -> "Eventos de Web" e clicar em "Criar Pixel".
2. **Implementação Técnica (Next.js):** 
   * As IAs do projeto integram o código do Pixel no arquivo raiz `/app/layout.tsx` do Next.js.
   * O código rastreará automaticamente três eventos cruciais da jornada de compra:
     * `ViewContent` (quando o usuário visualiza um card ou página de produto).
     * `AddToCart` (quando adiciona um item à sacola).
     * `CompletePayment` (quando conclui a compra via PIX ou cartão).

---

## Etapa 3: Sincronização do Catálogo de Produtos

Assim como no Instagram, o catálogo do TikTok lerá as informações de produtos (fotos 9:16, preços, variantes de estoque) em tempo real a partir da nossa API.

1. **Acessar o Catalog Manager:** No gerenciador de anúncios do TikTok, ir em "Ativos" -> "Catálogos".
2. **Adicionar Produtos via Data Feed:**
   * Selecionar "Adicionar Produtos" -> "Data Feed".
   * Configurar como **Carregamento Agendado (Scheduled Feed)**.
3. **Inserir a URL do Catálogo:**
   * Utilizar a mesma URL de feed estruturada que desenvolvemos para a Meta:
     `https://www.avasemlimites.com.br/api/catalog/meta`
   * O TikTok aceita a formatação XML RSS 2.0 padrão da Meta nativamente.
4. **Frequência de Atualização:** Definir a sincronização como "Diária" para garantir que novos estoques e preços de drops estejam sempre atualizados.

---

## Etapa 4: Execução dos Anúncios de Vídeo de Compras (Video Shopping Ads)

Com o pixel e o catálogo integrados, a marca está pronta para rodar as campanhas de atração nacional:

1. **Formatos de Anúncio:** Criação de campanhas de conversão usando o formato de *Video Shopping Ads* (onde os produtos do catálogo aparecem como cards clicáveis na base dos vídeos orgânicos).
2. **Storytelling Dirigido:** Utilização de vídeos curtos, transições rápidas e sequências de storyboard dirigidas pelo sócio-diretor da AVA como criativos dos anúncios. 
3. **Funil de Conversão:** O algoritmo do TikTok cruza o comportamento dos usuários com os dados do pixel para entregar o anúncio exato do produto para o público com maior intenção de compra instantânea.

---

## 📈 Conectando com a Meta de 3 Anos (ROI e Escala)
* **Gatilho de Tendências:** O TikTok é o canal mais rápido do mundo para viralizar um produto (efeito "TikTok Made Me Buy It"). Um único vídeo que viralize organicamente na plataforma pode esgotar o estoque de um drop em poucas horas, encurtando o ciclo de crescimento financeiro projetado.
