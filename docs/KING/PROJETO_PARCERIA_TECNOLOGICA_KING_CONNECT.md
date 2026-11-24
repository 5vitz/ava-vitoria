# 👑 Projeto King Connect — Parceria Tecnológica & Permuta Operacional (AVA × Fábrica King)

> **Status:** Planejamento Estratégico Homologado pelo Genera (23/11/2026)  
> **Classificação:** Próxima Tarefa Ninja — Expansão Multi-Supplier & Criação de Novo Fornecedor Próprio em SP  
> **Objetivo:** Desenvolver e implantar a camada de API e esteira automatizada de arquivos online para a Fábrica King em troca de créditos de produção/peças confeccionadas para as coleções da AVA Sem Limites.

---

## 1. Contexto & Diagnóstico da Oportunidade

Em prospecção comercial realizada em 23/11/2026 com o atendimento da Fábrica King (`Fábrica King Comércio de Roupas Ltda` — CNPJ `51.044.465/0001-85`, Sapopemba, São Paulo/SP), foi constatado o gargalo crítico que limita a escala da maioria das confecções físicas no Brasil:

1. **O Gargalo Operacional do E-mail e WhatsApp:**
   - O atendimento reportou sobrecarga (*"Lamento a demora, estamos com uma grande demanda no atendimento"*).
   - O processo de recebimento de pedidos e arquivos ainda é manual: *"formaliza o pedido pelo nosso email atendimento@fabricaking.com.br"*.
2. **O Limite de Escala do Modelo Analógico:**
   - Baixar arquivos manualmente de caixas de entrada, conferir gabaritos/resoluções, cadastrar SKUs manualmente e digitar rastreios no WhatsApp consome horas diárias da equipe interna.
   - A fábrica gasta energia operacional valiosa no balcão de atendimento em vez de focar no maquinário rodando.

---

## 2. A Tese Estratégica da AVA: "Criar um Fornecedor Nível Ninja"

Em vez de apenas sermos mais um cliente na fila do e-mail, **a AVA Sem Limites assume o papel de parceira tecnológica**:
- Capacitamos a King com uma **API de envio e esteira automatizada**, transformando a confecção analógica em um **Hub Moderno de Print on Demand**.
- **Hedge Estratégico:** Reduzimos a dependência industrial quase monopólica do eixo Dimona/Reserva no Rio de Janeiro, criando um parceiro industrial forte e ágil em São Paulo.

---

## 3. A Mecânica da Permuta ("Software por Malha")

Para fábricas e confecções, contratar software houses tradicionais é caro (R$ 30.000 a R$ 60.000 em caixa líquido) e arriscado. A permuta operacional elimina a barreira financeira:

| Para a Fábrica King | Para a AVA Sem Limites |
| :--- | :--- |
| **Custo Quase Zero de Caixa:** Paga o desenvolvimento utilizando capacidade ociosa de produção e insumos a preço de custo fabril (tecido + tinta). | **Estoque & Coleções a Custo Zero de Caixa:** Financiamos nossos drops e reposições sem queimar o caixa dos sócios. |
| **Gargalo Eliminado:** Atendimento automatizado 24/7 recebendo pedidos com validação prévia de arte e metadados. | **Canal VIP de Produção:** Prioridade fabril e relacionamento direto com a diretoria da fábrica em SP. |
| **Escalabilidade Imediata:** A King pode abrir a mesma API para outras marcas e criadores, multiplicando seu faturamento. | **Independência Industrial:** Base física em SP para despachos mais rápidos para o Sudeste/Sul. |

---

## 4. Auditoria Crítica da Interface Atual & Oportunidades Identificadas

A análise do fluxo de entrada do site (`fabricaking.com.br/enviar-arte` e tela inicial) evidenciou uma arquitetura extremamente rudimentar e frágil:

1. **Campos Manuais em Texto Livre ("Idade da Pedra"):**
   - O campo *"Tamanhos e divisão das peças"* é um simples `input` de texto solto com placeholder `Ex.: 2 P, 3 M, 5 G`. Exige que um operador humano leia, interprete e some mentalmente se bate com a *"Quantidade total"*.
2. **Medição Arcaica em Régua Física (cm):**
   - Exige que o cliente digite *"Largura da estampa (cm)"* e *"Altura da estampa (cm)"* em caixas numéricas (`20` e `25`), em vez de oferecer um canvas/mockup interativo ou gabarito pré-calibrado por modelagem.
3. **Gargalo Crítico de Upload (Limite de 5 MB):**
   - O formulário impõe teto de *"até 5 MB"*, inviabilizando artes profissionais em 300 DPI com canal alfa (que pesam entre 15 MB e 50 MB) e forçando o cliente a degradar a qualidade do arquivo.
4. **Falsa Integração no Rodapé:**
   - O site exibe um infográfico de 4 etapas (*"Sua loja vende ➔ Você autoriza ➔ A King produz"*), mas confessa textualmente no rodapé: *"Nenhuma integração é ativada automaticamente"*.

---

## 5. Estratégia "Raio-X de Elite": Engenharia Reversa com MCP REA

Para transformar a abordagem comercial em uma demonstração de superioridade técnica inquestionável, executaremos a **Engenharia Reversa da Aplicação da King utilizando o MCP REA**:

1. **Mapeamento da Stack Tecnológica Real:**
   - Inspeção dos bundles JavaScript, bibliotecas frontend, CMS/backend em uso e rotas de envio de formulário (identificando se usam WordPress, webhooks terceirizados ou endpoints legados).
   - Diagnóstico da infraestrutura de hospedagem e armazenamento de arquivos (desvendando a razão da trava de 5 MB).
2. **Reconstrução / Prova de Conceito (PoC Modernizada):**
   - Com as rotas mapeadas pelo REA, prototipamos uma versão limpa e moderna do fluxo:
     - Seleção visual de peças por catálogo e SKU.
     - Grade inteligente com contadores numéricos (P, M, G, GG, XG).
     - Upload direto para storage em nuvem (S3/GCS) com suporte a matrizes de 50+ MB em 300 DPI.
     - Mockup preview em tempo real.
3. **Alavancagem no Pitch:**
   - Chegamos à reunião não apenas com uma ideia teórica, mas com um **Dossiê de Auditoria Técnica e uma Solução Funcional Pronta**, comprovando que dominamos a arquitetura deles melhor do que seus desenvolvedores atuais.

---

## 6. Escopo Técnico da Solução (`King Connect Gateway`)

A solução desenvolvida pela engenharia da AVA contemplará:

1. **API REST / Webhooks Seguros:**
   - Endpoint autenticado para submissão de pedidos em lote ou unitários (`POST /api/v1/orders`).
   - Recepção de URLs diretas de matrizes 300 DPI pré-validadas (frente, costas, mangas).
   - Webhooks de atualização de status fabril (`EM_PRODUCAO`, `EXPEDIDO`, `RASTREIO_GERADO`).
2. **Dashboard Operacional de Chão de Fábrica (PCD / Painel do Operador):**
   - Tela limpa para o operador das impressoras DTG/Silk: vê a fila de artes prontas para envio à máquina com um clique, sem abrir e-mail.
3. **Validador Automático de Gabaritos:**
   - Checagem automática de dimensões mínimas em pixels e formato (PNG transparente / 300 DPI) antes de enviar para o operador, eliminando retrabalho de suporte.

---

## 7. Mensagem Executiva Enviada (Disparada em 23/11/2026 às 23:26 via WhatsApp)

A mensagem foi enviada diretamente pelo Genera Armando para o WhatsApp oficial de atendimento da Fábrica King (`11 95360-5184` — Adriane / Anderson):

```text
Anderson e Adriane, bom dia!

Estivemos olhando com calma o site e o atendimento de vocês. Dá para ver de longe que vocês têm uma fábrica de verdade, costura boa e capacidade produtiva de respeito, em São Paulo.
Mas também vimos o outro lado da moeda: a equipe de vocês está atolada no WhatsApp, a correria do dia a dia da fábrica engole tudo, e uma solução que desafogue, nunca chega...
Para fins de referência, entrem no site da Dimona, de estamparia sob demanda. Vejam como eles montam o pedido de modo super automático:
https://www.camisadimona.com.br/estudio/
Essa é a solução que gostaríamos de oferecer a vocês.
Como temos e-commerce próprio nesse ramo, temos interesse em estudar um modelo baseado em permuta: seus produtos pelo nosso sistema.
Se fizer sentido para vocês, damos prosseguimento a essa ideia
```

---

## 8. Dossiê de Auditoria Técnica de Apoio (REA)

Os detalhes técnicos das tecnologias identificadas, os códigos decompilados da King, as travas de 5 MB e a estrutura de banco de dados no Glide estão arquivados no documento:
- [`AUDITORIA_ENGENHARIA_REVERSA_REA_FABRICA_KING.md`](./AUDITORIA_ENGENHARIA_REVERSA_REA_FABRICA_KING.md)

---

## 9. Próximos Passos (Aguardando Retorno do Anderson/Adriane)

1. Aguardar retorno do WhatsApp oficial da Fábrica King.
2. Com a resposta positiva, agendar alinhamento rápido de 10 a 15 minutos em vídeo (Google Meet) para apresentar a proposta da PoC do Gateway.
3. Prosseguir com os testes de homologação do chat multiusuário e presença dos 4 sócios da AVA enquanto a King avalia a proposta.


