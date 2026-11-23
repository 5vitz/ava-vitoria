# ⚡ HUB CENTRAL ERP — BLING ERP v3
**Departamentos Responsáveis:**  
* Depto 08 · Financeiro & Fiscal (Flávio) — Emissão de NF-e, Tributos & Conciliação  
* Depto 04 · Produção & Logística (Armando / Genera) — Roteamento de Pedidos & Etiquetas  
**Status da Integração:** 🛠️ Estruturado para Conexão Multi-Canal (API v3 OAuth 2.0)

---

## 🎯 1. O Papel Estratégico do Bling no Modelo AVA

O Bling não é um fornecedor nem um canal de venda: **ele é o Cérebro Operacional e Fiscal (Hub Central)** que conecta as três pontas do negócio:

```
[ 10 Vitrines / Canais ]  --> (Venda Aprovada) --> [ BLING ERP v3 ]
                                                           |
       +---------------------------------------------------+-----------------------------------+
       |                                                   |                                   |
[ Emite NF-e 55 SEFAZ ]                        [ Roteia Pedido PoD ]               [ Notifica E-commerce ]
(Depto 08 - Flávio)                            (Dimona / Printful / Reserva)        (Rastreio & Status)
```

1. **Unificação Fiscal:** O Flávio (Depto 08) não precisa emitir notas manuais em 10 painéis diferentes. O Bling emite a NF-e Modelo 55 na SEFAZ de forma 100% automatizada.
2. **Distribuição para Fornecedores:** O pedido pago cai no Bling, que gera a etiqueta de envio e dispara o XML fiscal para o fornecedor PoD imprimir e colar na caixa.
3. **Sincronização em Tempo Real:** Conecta a vitrine própria ([`ava-vitoria.com.br`](https://www.ava-vitoria.com.br)) e os marketplaces (Amazon, ML, Shopee) para que uma venda não gere duplicidade.

---

## 🔑 2. Dados Cadastrais & Credenciais Institucionais

| Parâmetro | Detalhes |
| :--- | :--- |
| **Plataforma** | Bling ERP (Locaweb Company) |
| **Painel de Acesso** | [https://www.bling.com.br](https://www.bling.com.br) |
| **Titular Fiscal** | Flávio (Depto 08 · Financeiro & Contábil) |
| **Titular Operacional** | Armando Sinkovitz (Genera) |
| **Protocolo de Integração** | API v3 (OAuth 2.0 com Client ID, Client Secret e Bearer Token) |
| **Certificado Digital** | Certificado Digital A1 do CNPJ da empresa instalado no Bling |

---

## 📡 3. Arquitetura da API v3 do Bling

* **Documentação Oficial:** [https://developer.bling.com.br](https://developer.bling.com.br)
* **Base URL:** `https://api.bling.com.br/v3`
* **Autenticação:** Tokens renovados automaticamente via Refresh Token.

### Módulos Integrados:
1. **`/pedidos/vendas`**:
   Recebe pedidos da loja virtual e dos marketplaces com dados do comprador, endereço, itens e valor de frete.
2. **`/nfe`**:
   Gera, autoriza e baixa o XML e o PDF do DANFE da Nota Fiscal Eletrônica.
3. **`/produtos` & `/estoques`**:
   Cadastro unificado dos 975 SKUs com códigos de barras EAN/GTIN e regras fiscais (NCM de vestuário `6109.10.00`).
4. **`/logisticas`**:
   Emissão de etiquetas J&T Express, Correios, Jadlog e Mercado Envios.

---

## 🔒 4. Protocolo de Governança da Mesa Redonda

Para garantir que nenhum sócio fique no escuro:
* As credenciais de acesso da conta principal e subcontas de operadores devem constar neste repositório.
* Todas as notas fiscais emitidas disparam automaticamente uma cópia em PDF para a pasta compartilhada do Depto 08 (Flávio).
* O status de transporte de cada envio é refletido automaticamente no painel `/admin/producao` para o Depto 04 (Armando e Gustavo).

---

## ⚖️ 5. Inteligência Fiscal: Reforma Tributária do Consumo (RTC — LC 214/2025 · CBS & IBS)

Referência técnica auditada: [`ReceitaFederal/calculadora-rtc-simples-nacional`](https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional) (v1.0.2 / Release 15).

1. **Delegação do Motor Java ao Bling ERP (Zero Overhead na VPS Contabo):**
   * O motor oficial da Receita Federal (Java 25 + Spring Boot 4.1.2 + SQLite) é voltado aos provedores de ERP/emissores de DFe. Na arquitetura da AVA, o **Bling ERP v3** processa nativamente o grupo XML `<IBSCBS>` da NF-e Modelo 55, mantendo nossa VPS Contabo 100% enxuta sem necessidade de rodar uma JVM local.
2. **Vínculo Obrigatório `NCM × cClassTrib` (Prevenção do Erro `REG-011`):**
   * Na parametrização de natureza de operação para 2027 no Bling ERP, o NCM padrão de vestuário (`6109.10.00` — camisetas e regatas de malha de algodão) deve estar vinculado ao código **`cClassTrib`** e **`CST`** de IBS/CBS correspondentes, evitando rejeição HTTP 422 / `REG-011` (*"NCM não vinculada à Classificação Tributária"*).
3. **Estratégia Híbrida Simples Nacional (B2C vs. B2B):**
   * **Varejo B2C (Loja Oficial + Marketplaces):** Recolhimento de CBS e IBS **por dentro do DAS** (Anexo I do Simples Nacional com alíquota reduzida).
   * **Contratos Corporativos B2B (Uniformes Reserva INK):** A LC 214/2025 permite avaliar a opção pelo **regime regular de IBS/CBS** quando uma grande empresa compradora exigir destaque e transferência de **crédito tributário integral** na NF-e.

