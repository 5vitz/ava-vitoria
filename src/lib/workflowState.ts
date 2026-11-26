export type VoteState = "APPROVED" | "PENDING" | "REJECTED";

export interface PartnerVotes {
  Armando: VoteState;
  Flavio: VoteState;
  Tripoint: VoteState;
  Gustavo: VoteState;
}

export interface DecisionQueueItem {
  id: string;
  depto: string;
  tag: string;
  title: string;
  description: string;
  actionPrimary: string;
  timeAgo: string;
  votes: PartnerVotes;
  lastNudge?: string;
  decisionType: "COLLECTION_CONCEPT" | "PIECE_PRICING" | "TRAFFIC_BUDGET" | "GENERAL";
  payload?: any;
  resolvedAt?: string;
}

export interface CollectionCharter {
  id: string;
  name: string;             // 1. Um Nome
  season: string;           // Estação
  year: number;             // Ano
  themeTrend: string;       // 2. Um Tema - Uma Tendência
  aesthetic: string;        // 3. Uma Estética
  brandMessage: string;     // 4. Uma Mensagem Clara e Bem Definida (Valores A·V·A)
  proposedBy: string;       // Tripoint
  status: "EM_VOTACAO_URNA" | "HOMOLOGADA_4_4";
  decisionId?: string;
  collectionDbId?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface PilotArtworkFlow {
  id: string;
  code: string;
  title: string;
  collectionName: string;
  themeTrend: string;
  aesthetic: string;
  brandMessage: string;
  previewImageUrl: string;
  supplier: string;
  garmentModel: string;     // Ex: "T-Shirt Prime 180g (Pele de Pêssego)"
  garmentColor: string;     // Ex: "Preta"
  garmentSize: string;      // Ex: "G"
  baseCost: number;         // Ex: 67.90
  sha256: string;
  mutatedKeysCount: number;
  status:
    | "APPROVED_PENDING_BLOCKCHAIN"
    | "REGISTERED_ON_BLOCKCHAIN"
    | "PRICING_IN_URNA"
    | "PRICE_APPROVED"
    | "PUBLISHED_IN_STOREFRONT";
  otsReceipt?: string;
  blockchainTxId?: string;
  blockchainRegisteredAt?: string;
  proposedMarginPercent?: number;
  approvedSalePrice?: number;
  approvedNetProfit?: number;
  storefrontPublishedAt?: string;
}

export interface LivePipelineOrder {
  id: string;
  orderCode: string;
  category: "CLIENTE" | "AMOSTRA";
  customerName: string;
  customerEmail: string;
  salesChannel: string;
  collectionName: string;
  artworkCode: string;
  productTitle: string;
  garmentModel: string;
  color: string;
  size: string;
  qty: number;
  unitCost: number;
  totalCost: number;
  salePrice: number;
  taxSimples: number;
  gatewayFee: number;
  netProfit: number;
  nfeDocumentName: string | null; // Ex: "Vale_uma_NFe_AVA.pdf"
  nfeDocumentUrl: string | null;  // Ex: "/PDF/Vale_uma_NFe_AVA.pdf"
  nfeNumber: string | null;
  nfeAttachedInBoardroom: boolean;
  productionStep:
    | "1_AGUARDANDO_NFE"
    | "2_SILK_HD_PRODUCAO"
    | "3_CONTROLE_QUALIDADE"
    | "4_PRONTO_NA_DOCA"
    | "5_COLETADO_SAC"
    | "6_ENTREGUE_ARQUIVADO";
  sacTrackingStatus:
    | "AGUARDANDO_COLETA_DOCA"
    | "COLETADO_TRANSPORTADORA"
    | "EM_TRANSITO_FILIAL"
    | "ENTREGUE_AO_CLIENTE";
  carrierName: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ArchivedSampleItem {
  item: string;
  qty: number;
  product: string;
  color: string;
  size: string;
  front: string;
  back: string;
  unitCost: number;
  totalCost: number;
}

export interface ArchivedOrderRecord {
  id: string;
  orderCode: string;
  category: "CLIENTE" | "AMOSTRA";
  title: string;
  customerOrTarget: string;
  salesChannel: string;
  supplier: string;
  collectionName: string;
  garmentModel: string;
  color: string;
  size: string;
  qtyTotal: number;
  grossRevenue: number;      // R$ 0 para Amostras, salePrice para Clientes
  productionCost: number;    // R$ 472.80 para Amostras Dimona, unitCost para Clientes
  taxSimples: number;
  gatewayFee: number;
  netResult: number;         // Lucro Líquido (Clientes) ou Investimento P&D (-472.80 Amostras)
  nfeNumber: string;
  nfeDocumentName: string;
  nfeDocumentUrl: string;
  carrierName: string;
  deliveredAt: string;
  archivedAt: string;
  itemsDetail?: ArchivedSampleItem[];
}

export interface WorkflowPersistentState {
  initializedCleanAt: string;
  // Fase 0: Os 4 Pilares da Coleção (Depto 07 -> Urna 4/4)
  activeCharter: CollectionCharter | null;
  // Fila de Decisões / Urna 4/4 (Começa 100% VAZIA: [])
  decisionsQueue: DecisionQueueItem[];
  // Fase 1 e 2: Peça Única transitando do Atelier (08) -> Jurídico Blockchain (01) -> Financeiro (02) -> Vitrine (07)
  pilotPiece: PilotArtworkFlow | null;
  // Fase 3 e 4: Esteira Viva de Pedidos de Clientes (Começa 100% VAZIA: [])
  liveOrders: LivePipelineOrder[];
  // Diretoria Executiva: Arquivo Central de Pedidos (Gaveta 1: Clientes = [] | Gaveta 2: Amostras = [#755-460-927])
  archivedClientOrders: ArchivedOrderRecord[];
  archivedSampleOrders: ArchivedOrderRecord[];
}

export const REAL_DIMONA_SAMPLE_ARCHIVE: ArchivedOrderRecord = {
  id: "arch-dimona-755460927",
  orderCode: "#755-460-927",
  category: "AMOSTRA",
  title: "Lote Piloto Oficial de 6 Amostras Físicas Dimona (Silk HD & Bonés)",
  customerOrTarget: "Diretoria AVA Sem Limites (Amostragem & Homologação Fabril)",
  salesChannel: "Encomenda Interna P&D (Dimona Dropsimples)",
  supplier: "Dimona Silk E Malhas Ltda",
  collectionName: "Homologação Têxtil Pré-Operacional",
  garmentModel: "Mix 6 Peças (Oversized 220g, Prime 180g, Estonada, Quality e 2 Bonés)",
  color: "Preto / Branco / Cinza Chumbo / Vinho",
  size: "G / GG / Único",
  qtyTotal: 6,
  grossRevenue: 0,
  productionCost: 472.80,
  taxSimples: 0,
  gatewayFee: 0,
  netResult: -472.80,
  nfeNumber: "114273 (Série 1 — Olist ERP)",
  nfeDocumentName: "DANFE_Olist_NFe_114273_Dimona.pdf",
  nfeDocumentUrl: "https://erp.olist.com/doc.view?id=00058e6fe6e2a08458ab5e155887c864",
  carrierName: "J&T Express (Entregue em Vitória/ES)",
  deliveredAt: "25/11/2026",
  archivedAt: "25/11/2026",
  itemsDetail: [
    {
      item: "01",
      qty: 1,
      product: "Camiseta Dimona Oversized (220g)",
      color: "Preto",
      size: "G",
      front: "Arte Cubista (3435x4680)",
      back: "Selo AVA Branco 16cm (Nuca)",
      unitCost: 116.46,
      totalCost: 116.46,
    },
    {
      item: "02",
      qty: 1,
      product: "T-Shirt Prime 180g (Pele de Pêssego)",
      color: "Branco",
      size: "G",
      front: "Arte Coruja (3435x4680)",
      back: "Selo AVA Preto 16cm (Nuca)",
      unitCost: 90.54,
      totalCost: 90.54,
    },
    {
      item: "03",
      qty: 1,
      product: "Camiseta Estonada Vintage 30.1",
      color: "Cinza Chumbo",
      size: "GG",
      front: "Peito: Siga Fazendo o Bem",
      back: "Pôster: Siga Fazendo o Bem",
      unitCost: 92.46,
      totalCost: 92.46,
    },
    {
      item: "04",
      qty: 1,
      product: "Camiseta Quality 30.1",
      color: "Vinho",
      size: "GG",
      front: "Arte Cubista (3435x4680)",
      back: "Selo AVA Preto 16cm (Nuca)",
      unitCost: 72.46,
      totalCost: 72.46,
    },
    {
      item: "05",
      qty: 1,
      product: "Boné Prime Comfort (Fivela de Metal)",
      color: "Preto",
      size: "Único",
      front: "Selo AVA Branco Circular (1100px)",
      back: "Liso",
      unitCost: 68.14,
      totalCost: 68.14,
    },
    {
      item: "06",
      qty: 1,
      product: "Boné Americano / Trucker (Snapback)",
      color: "Branco",
      size: "Único",
      front: "Sem Limites AVA Preto Orgânico",
      back: "Liso",
      unitCost: 32.14,
      totalCost: 32.14,
    },
  ],
};

export function createCleanInitialWorkflowState(): WorkflowPersistentState {
  return {
    initializedCleanAt: new Date().toISOString(),
    activeCharter: null,
    decisionsQueue: [],
    pilotPiece: null,
    liveOrders: [],
    archivedClientOrders: [],
    archivedSampleOrders: [REAL_DIMONA_SAMPLE_ARCHIVE],
  };
}
