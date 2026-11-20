// src/lib/subscriptionsData.ts — Mapeamento Central de Ferramentas, APIs e Custos Fixos AVA Sem Limites

export type SubscriptionCategory =
  | 'INFRAESTRUTURA'
  | 'IA_AGENTES'
  | 'ERP_FISCAL'
  | 'CRIATIVO_ATELIER'
  | 'FORNECEDOR_POD'
  | 'COMUNICACAO'
  | 'PAGAMENTOS';

export type PayerAccountType =
  | 'PESSOAL_ARMANDO'
  | 'CONTA_PJ_AVA'
  | 'PESSOAL_SOCIO'
  | 'A_DEFINIR';

export type SubscriptionStatus =
  | 'ATIVO'
  | 'EM_AVALIACAO'
  | 'STANDBY'
  | 'CONTINGENCIA';

export type CriticalityLevel = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';

export interface DependentAgentInfo {
  id: string;
  name: string;
}

export interface SubscriptionItem {
  id: string;
  serviceName: string;
  category: SubscriptionCategory;
  categoryLabel: string;
  purpose: string;
  monthlyCostBrl: number;
  originalCurrencyCost?: string;
  billingCycle: 'MENSAL' | 'ANUAL' | 'CONSUMO' | 'VARIAVEL_GRATIS';
  payerAccount: PayerAccountType;
  payerLabel: string;
  status: SubscriptionStatus;
  statusLabel: string;
  criticality: CriticalityLevel;
  impactIfUnpaid: string;
  dependentAgents: DependentAgentInfo[];
  responsiblePartner: 'Armando' | 'Flávio' | 'Tripoint' | 'Gustavo';
  supplierType: 'SOFTWARE' | 'FABRICA' | 'GATEWAY';
  notes?: string;
}

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  // 1. Contabo VPS
  {
    id: 'contabo_vps',
    serviceName: 'Contabo Cloud VPS (Alemanha/EUA)',
    category: 'INFRAESTRUTURA',
    categoryLabel: 'Infraestrutura Base',
    purpose: 'Hospedagem central do ecossistema: Docker, Next.js SSR, PostgreSQL, Nginx e Evolution API.',
    monthlyCostBrl: 48.0,
    originalCurrencyCost: '€7,50 / mês',
    billingCycle: 'MENSAL',
    payerAccount: 'PESSOAL_ARMANDO',
    payerLabel: '👤 Cartão Pessoal Armando (Migrar para PJ)',
    status: 'ATIVO',
    statusLabel: 'Ativo & Operacional',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 COLAPSO TOTAL: O site avasemlimites.com.br, o painel /admin e o banco de dados PostgreSQL saem do ar imediatamente.',
    dependentAgents: [
      { id: 'software_architect', name: 'Software Architect' },
      { id: 'security_sentinel', name: 'Security Sentinel' },
      { id: 'devops_integrator', name: 'DevOps Integrator' },
      { id: 'sprint_prioritizer', name: 'Sprint Prioritizer' },
      { id: 'governance_arbiter', name: 'Governance Arbiter' },
    ],
    responsiblePartner: 'Armando',
    supplierType: 'SOFTWARE',
    notes: 'Atualmente pago no cartão de crédito pessoal de Armando. Prioridade 1 de migração para o Cartão PJ AVA.',
  },

  // 2. Google Cloud / Gemini API
  {
    id: 'google_ai_gemini',
    serviceName: 'Google Cloud / Gemini API (Google AI Studio)',
    category: 'IA_AGENTES',
    categoryLabel: 'Inteligência Artificial',
    purpose: 'Motor de inferência LLM para a inteligência analítica dos 23 agentes autônomos.',
    monthlyCostBrl: 100.0,
    originalCurrencyCost: 'Por consumo de tokens (~US$ 18/mês)',
    billingCycle: 'CONSUMO',
    payerAccount: 'PESSOAL_ARMANDO',
    payerLabel: '👤 Cartão Pessoal Armando (Conta Google Dev)',
    status: 'ATIVO',
    statusLabel: 'Ativo & Operacional',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 PARALISIA COGNITIVA: Maestro Lincoln, Dr. Lex, Copywriter e Sofia perdem a capacidade de raciocinar e redigir.',
    dependentAgents: [
      { id: 'maestro_lincoln', name: 'Maestro Lincoln' },
      { id: 'dr_lex', name: 'Dr. Lex' },
      { id: 'copywriting_persuasion', name: 'Copywriting & Persuasion' },
      { id: 'support_concierge', name: 'Support Concierge (Sofia)' },
      { id: 'funnel_growth_hacker', name: 'Funnel & Growth Hacker' },
    ],
    responsiblePartner: 'Armando',
    supplierType: 'SOFTWARE',
    notes: 'Configurado na conta Google pessoal de Armando com Antigravity Workspace. Deve ser transferido para conta institucional da empresa.',
  },

  // 3. Bling ERP v3
  {
    id: 'bling_erp',
    serviceName: 'Bling ERP v3 (Plano Mercúrio)',
    category: 'ERP_FISCAL',
    categoryLabel: 'ERP, Fiscal & Multicanal',
    purpose: 'Emissão automática de NF-e (Modelo 55), gestão fiscal MEI, estoque central e sincronização com os 10 canais de venda.',
    monthlyCostBrl: 89.0,
    originalCurrencyCost: 'R$ 89,00 / mês',
    billingCycle: 'MENSAL',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Conta PJ AVA (Vinculado ao MEI/IE ativa)',
    status: 'ATIVO',
    statusLabel: 'Obrigatório para Vendas',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 TRAVA FISCAL & LOGÍSTICA: Bloqueia a emissão de notas fiscais, impede o envio automático de pedidos à fábrica e desativa os 10 marketplaces.',
    dependentAgents: [
      { id: 'chief_financial_officer', name: 'Chief Financial Officer' },
      { id: 'pricing_strategist', name: 'Pricing Strategist' },
      { id: 'tax_compliance_guard', name: 'Tax & Compliance Guard' },
      { id: 'omnichannel_sales_director', name: 'Omnichannel Sales Director' },
      { id: 'factory_dispatcher', name: 'Factory Dispatcher' },
    ],
    responsiblePartner: 'Flávio',
    supplierType: 'SOFTWARE',
    notes: 'Permite operar legalmente com o MEI e a Inscrição Estadual ativa já existente, emitindo NF-e eletrônica sem necessidade de aguardar a LTDA.',
  },

  // 4. Certificado Digital e-CNPJ A1
  {
    id: 'certificado_digital_a1',
    serviceName: 'Certificado Digital e-CNPJ A1 (ICP-Brasil)',
    category: 'ERP_FISCAL',
    categoryLabel: 'Fiscal & Assinatura Digital',
    purpose: 'Assinatura digital automática e comunicação criptografada com a SEFAZ para autorização de NF-e na nuvem.',
    monthlyCostBrl: 16.58,
    originalCurrencyCost: 'R$ 199,00 / ano (~R$ 16,58/mês)',
    billingCycle: 'ANUAL',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Conta PJ AVA',
    status: 'ATIVO',
    statusLabel: 'Ativo & Conectado',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 REJEIÇÃO SEFAZ: Sem o certificado válido, nenhuma nota fiscal pode ser transmitida; produção PoD é recusada pela fábrica.',
    dependentAgents: [
      { id: 'tax_compliance_guard', name: 'Tax & Compliance Guard' },
      { id: 'chief_financial_officer', name: 'Chief Financial Officer' },
    ],
    responsiblePartner: 'Flávio',
    supplierType: 'SOFTWARE',
    notes: 'Arquivo digital .PFX instalado diretamente nos servidores seguros do Bling ERP.',
  },

  // 5. Midjourney v6
  {
    id: 'midjourney',
    serviceName: 'Midjourney v6 (Plano Standard)',
    category: 'CRIATIVO_ATELIER',
    categoryLabel: 'Atelier Criativo & Estamparia',
    purpose: 'Geração estética de artes, composições visuais das novas coleções e experimentações de estampas pelo Atelier Tripoint.',
    monthlyCostBrl: 175.0,
    originalCurrencyCost: 'US$ 30,00 / mês',
    billingCycle: 'MENSAL',
    payerAccount: 'PESSOAL_SOCIO',
    payerLabel: '👤 Conta Tripoint / AVA Atelier',
    status: 'ATIVO',
    statusLabel: 'Ativo no Atelier',
    criticality: 'ALTA',
    impactIfUnpaid: '⚠️ BLOQUEIO CRIATIVO: Interrompe a criação autônoma de novos drops e mockups conceituais.',
    dependentAgents: [
      { id: 'creative_director_atelier', name: 'Creative Director (Atelier Tripoint)' },
      { id: 'mockup_studio_3d', name: 'Mockup Studio 3D' },
    ],
    responsiblePartner: 'Tripoint',
    supplierType: 'SOFTWARE',
    notes: 'Plano Standard com modo Relax ilimitado e 15h de GPU Fast. Essencial para o diretor criativo.',
  },

  // 6. Vectorizer.ai
  {
    id: 'vectorizer_ai',
    serviceName: 'Vectorizer.ai (API & Vector Engine)',
    category: 'CRIATIVO_ATELIER',
    categoryLabel: 'Atelier & Engenharia Gráfica',
    purpose: 'Conversão geométrica de bitmaps rasterizados em vetores SVG/EPS matematicamente perfeitos para matriz de Silk HD e bordado.',
    monthlyCostBrl: 58.0,
    originalCurrencyCost: 'US$ 9,99 / mês',
    billingCycle: 'MENSAL',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Conta PJ AVA / Armando',
    status: 'ATIVO',
    statusLabel: 'Ativo & Operacional',
    criticality: 'ALTA',
    impactIfUnpaid: '⚠️ PERDA DE MATRIZ VETORIAL: Artes da IA ficam pixeladas na ampliação; matriz da Dimona pode acusar erro de resolução (abaixo de 300 DPI).',
    dependentAgents: [
      { id: 'mockup_studio_3d', name: 'Mockup Studio 3D' },
      { id: 'creative_director_atelier', name: 'Creative Director' },
      { id: 'factory_dispatcher', name: 'Factory Dispatcher' },
    ],
    responsiblePartner: 'Tripoint',
    supplierType: 'SOFTWARE',
    notes: 'Garante que nenhuma estampa enviada à fábrica apresente serrilhamento ou borrões nos tecidos nobres.',
  },

  // 7. Magnific AI
  {
    id: 'magnific_ai',
    serviceName: 'Magnific AI (Upscaler Generativo & Hipertexturizador)',
    category: 'CRIATIVO_ATELIER',
    categoryLabel: 'Atelier Criativo (Em Avaliação)',
    purpose: 'Upscaling generativo até 8K e síntese de micro-texturas têxteis ultra-realistas para alta costura e estampas gigantes.',
    monthlyCostBrl: 115.0,
    originalCurrencyCost: '~US$ 20,00 / mês (Anual) ou US$ 39 / mês (Mensal)',
    billingCycle: 'MENSAL',
    payerAccount: 'A_DEFINIR',
    payerLabel: '⏳ Em Avaliação por Tripoint (Aprovação na Urna)',
    status: 'EM_AVALIACAO',
    statusLabel: 'Em Avaliação Técnica',
    criticality: 'MEDIA',
    impactIfUnpaid: '🟡 REDUÇÃO DE DETALHE: O processo criativo segue com Midjourney + Vectorizer.ai sem interrupção catastrófica.',
    dependentAgents: [
      { id: 'creative_director_atelier', name: 'Creative Director (Atelier Tripoint)' },
    ],
    responsiblePartner: 'Tripoint',
    supplierType: 'SOFTWARE',
    notes: 'Ferramenta solicitada por Tripoint para avaliação. Submeter proposta de contratação na Urna 4/4 quando o sócio concluir os testes.',
  },

  // 8. Dimona Dropsimples
  {
    id: 'dimona_dropsimples',
    serviceName: 'Dimona (Dropsimples / Fábrica Principal PoD)',
    category: 'FORNECEDOR_POD',
    categoryLabel: 'Fornecedor PoD & Confecção',
    purpose: 'Fabricação sob demanda (DTG / Silk HD), separação, embalagem e despacho direto ao consumidor final.',
    monthlyCostBrl: 0.0,
    originalCurrencyCost: 'R$ 0,00 fixo (Pay-per-sale sob demanda)',
    billingCycle: 'VARIAVEL_GRATIS',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Cadastro B2B com CNPJ / IE ativa',
    status: 'ATIVO',
    statusLabel: 'Fábrica Homologada',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 TRAVAMENTO INDUSTRIAL: Pedidos deixam de ser produzidos e despachados aos clientes da vitrine.',
    dependentAgents: [
      { id: 'factory_dispatcher', name: 'Factory Dispatcher' },
      { id: 'supply_chain_monitor', name: 'Supply Chain Monitor' },
      { id: 'quality_assurance_apparel', name: 'Quality Assurance Apparel' },
      { id: 'pricing_strategist', name: 'Pricing Strategist' },
    ],
    responsiblePartner: 'Gustavo',
    supplierType: 'FABRICA',
    notes: '⚠️ ATENÇÃO ESTRATÉGICA: A Dimona não cobra mensalidade, mas cobra preço de consumidor final se a conta for PF. Para destravar a Tabela de Lojista/Atacado (custo de fábrica real de R$ 38 a R$ 58), é fundamental homologar o CNPJ e IE ativa no contrato B2B da Dimona Corporate.',
  },

  // 9. Reserva INK
  {
    id: 'reserva_ink',
    serviceName: 'Reserva INK (Plano Essencial / Linha Nobre PoD)',
    category: 'FORNECEDOR_POD',
    categoryLabel: 'Fornecedor PoD (Contingência)',
    purpose: 'Acesso ao catálogo de malhas nobres Reserva (algodão peruano pima, modelagem própria) e fulfillment direto.',
    monthlyCostBrl: 159.0,
    originalCurrencyCost: 'R$ 159,00 / mês',
    billingCycle: 'MENSAL',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Conta PJ AVA (Sob Deliberação)',
    status: 'STANDBY',
    statusLabel: 'Em Standby / Análise',
    criticality: 'BAIXA',
    impactIfUnpaid: '🟢 NENHUM IMPACTO IMEDIATO: Pedidos seguem 100% alocados na esteira da Dimona.',
    dependentAgents: [
      { id: 'factory_dispatcher', name: 'Factory Dispatcher' },
      { id: 'supply_chain_monitor', name: 'Supply Chain Monitor' },
    ],
    responsiblePartner: 'Gustavo',
    supplierType: 'FABRICA',
    notes: 'Exige assinatura de R$ 159/mês para desbloquear a plataforma e preços atacado da Reserva. Recomendado ativar apenas se aprovado na Urna 4/4.',
  },

  // 10. Montink
  {
    id: 'montink',
    serviceName: 'Montink (Plano Pro Multi-Hub)',
    category: 'FORNECEDOR_POD',
    categoryLabel: 'Fornecedor PoD (Contingência)',
    purpose: 'Hub secundário para distribuição de acessórios, ecobags e contingência caso a Dimona enfrente gargalos.',
    monthlyCostBrl: 149.0,
    originalCurrencyCost: 'R$ 149,00 / mês',
    billingCycle: 'MENSAL',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Conta PJ AVA',
    status: 'CONTINGENCIA',
    statusLabel: 'Contingência Cadastrada',
    criticality: 'BAIXA',
    impactIfUnpaid: '🟢 NENHUM IMPACTO: Não há pedidos vinculados ativamente a este hub no momento.',
    dependentAgents: [
      { id: 'factory_dispatcher', name: 'Factory Dispatcher' },
    ],
    responsiblePartner: 'Gustavo',
    supplierType: 'FABRICA',
    notes: 'Manter como plano de contingência para picos de final de ano se a produção principal saturar.',
  },

  // 11. Evolution API (WhatsApp)
  {
    id: 'evolution_api_whatsapp',
    serviceName: 'Evolution API (WhatsApp Gateway & Urna 4/4)',
    category: 'COMUNICACAO',
    categoryLabel: 'Comunicação & Urna WhatsApp',
    purpose: 'Disparos de cobrança de votos 4/4 para Armando, Flávio, Tripoint e Gustavo, alertas de vendas e SAC Sofia.',
    monthlyCostBrl: 0.0,
    originalCurrencyCost: 'R$ 0,00 (Auto-hospedado na VPS Contabo)',
    billingCycle: 'VARIAVEL_GRATIS',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Infraestrutura Própria AVA',
    status: 'ATIVO',
    statusLabel: 'Ativo & Operacional',
    criticality: 'ALTA',
    impactIfUnpaid: '⚠️ INTERRUPÇÃO DA URNA: Sócios param de receber lembretes de votação no WhatsApp; Sofia fica sem canal com clientes.',
    dependentAgents: [
      { id: 'governance_arbiter', name: 'Governance Arbiter' },
      { id: 'support_concierge', name: 'Support Concierge (Sofia)' },
      { id: 'b2b_wholesale_lead', name: 'B2B Wholesale Lead' },
    ],
    responsiblePartner: 'Armando',
    supplierType: 'SOFTWARE',
    notes: 'Rodando como container Docker dentro da Contabo VPS de Armando sem custo mensal adicional de terceiros (como Z-API que custaria R$ 79/mês).',
  },

  // 12. Registro.br
  {
    id: 'registro_br',
    serviceName: 'Registro.br (Domínio avasemlimites.com.br)',
    category: 'INFRAESTRUTURA',
    categoryLabel: 'Infraestrutura Base',
    purpose: 'Titularidade do domínio oficial da marca no Registro.br com DNS autoritativo.',
    monthlyCostBrl: 3.33,
    originalCurrencyCost: 'R$ 40,00 / ano (~R$ 3,33/mês)',
    billingCycle: 'ANUAL',
    payerAccount: 'PESSOAL_ARMANDO',
    payerLabel: '👤 Cartão Pessoal Armando',
    status: 'ATIVO',
    statusLabel: 'Ativo & Operacional',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 APAGÃO GERAL: O domínio congela e todos os links, e-mails e acessos públicos param de resolver.',
    dependentAgents: [
      { id: 'software_architect', name: 'Software Architect' },
    ],
    responsiblePartner: 'Armando',
    supplierType: 'SOFTWARE',
    notes: 'Renovação anual. Titularidade registrada por Armando. Deve ser transferido para o CNPJ assim que formalizado.',
  },

  // 13. Cloudflare
  {
    id: 'cloudflare',
    serviceName: 'Cloudflare (DNS, SSL, CDN & Edge Shield)',
    category: 'INFRAESTRUTURA',
    categoryLabel: 'Segurança & CDN Edge',
    purpose: 'Criptografia SSL Universal, cache de imagens de alta resolução na borda e proteção DDoS contra ataques.',
    monthlyCostBrl: 0.0,
    originalCurrencyCost: 'Plano Free (R$ 0,00)',
    billingCycle: 'VARIAVEL_GRATIS',
    payerAccount: 'PESSOAL_ARMANDO',
    payerLabel: '👤 Conta Armando / AVA',
    status: 'ATIVO',
    statusLabel: 'Ativo & Protegido',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 INTERRUPÇÃO DE TRÁFEGO: Perda de certificados SSL e navegação insegura com aviso no navegador.',
    dependentAgents: [
      { id: 'software_architect', name: 'Software Architect' },
      { id: 'security_sentinel', name: 'Security Sentinel' },
    ],
    responsiblePartner: 'Armando',
    supplierType: 'SOFTWARE',
    notes: 'Plano Free suficiente para até 1 milhão de requisições por mês com excelente segurança.',
  },

  // 14. Gateways de Pagamento
  {
    id: 'gateways_pagamento',
    serviceName: 'Gateways de Pagamento (Asaas & Mercado Pago)',
    category: 'PAGAMENTOS',
    categoryLabel: 'Checkout & Meios de Pagamento',
    purpose: 'Processamento de Pix instantâneo com conciliação automática e cartão de crédito parcelado.',
    monthlyCostBrl: 0.0,
    originalCurrencyCost: 'R$ 0,00 fixo (Taxas: 0,99% Pix / 2,99% - 3,49% Cartão)',
    billingCycle: 'VARIAVEL_GRATIS',
    payerAccount: 'CONTA_PJ_AVA',
    payerLabel: '🏢 Conta Digital PJ AVA',
    status: 'ATIVO',
    statusLabel: 'Ativo no Checkout',
    criticality: 'CRITICA',
    impactIfUnpaid: '🚨 TRAVA FINANCEIRA: Ninguém consegue pagar no site; perda de 100% das conversões.',
    dependentAgents: [
      { id: 'chief_financial_officer', name: 'Chief Financial Officer' },
    ],
    responsiblePartner: 'Flávio',
    supplierType: 'GATEWAY',
    notes: 'Sem mensalidade fixa. Desconto percentual retido na liquidação de cada pedido aprovado.',
  },
];
