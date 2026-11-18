/**
 * Catálogo Homologado Multi-Supplier — AVA Sem Limites
 * Define os fornecedores cadastrados, gabaritos de arte (300 DPI) e especificações técnicas de confecção.
 */

export interface SupplierSpecification {
  code: string;
  name: string;
  tradeName: string;
  specialty: string;
  recommendedPrintTech: string; // Ex: "Silk HD (DTG Kornit)"
  disallowedPrintTech?: string; // Ex: "DTF em camisetas/regatas"
  artworks: {
    frontPosterPx?: string;
    backPosterPx?: string;
    sealCapPx?: string;
    dpi: number;
    notes: string;
  };
  baseCostsReference: {
    itemLabel: string;
    costSinglePrint: number;
    costFrontBack: number;
  }[];
  active: boolean;
}

export const SUPPLIERS_CATALOG: Record<string, SupplierSpecification> = {
  DIMONA: {
    code: "DIMONA",
    name: "Dimona Silk E Malhas Ltda (Dropsimples)",
    tradeName: "Dimona Dropsimples",
    specialty: "Peças com Frente + Costas, Linha Prime 180g (Pele de Pêssego), Oversized 220g, Estonadas, Regatas e Bonés",
    recommendedPrintTech: "Silk HD (DTG direto na fibra têxtil)",
    disallowedPrintTech: "DTF em camisetas/regatas (permitido apenas em bonés)",
    artworks: {
      frontPosterPx: "3435 × 4680 px",
      backPosterPx: "3435 × 4680 px",
      sealCapPx: "2400 × 2400 px",
      dpi: 300,
      notes: "Gabarito sem margens com encaixe automático no tracejado do Studio 3D da Dimona."
    },
    baseCostsReference: [
      { itemLabel: "T-Shirt Quality 30.1 (165g)", costSinglePrint: 41.90, costFrontBack: 59.90 },
      { itemLabel: "Regata Masculina Quality (165g)", costSinglePrint: 41.90, costFrontBack: 59.90 },
      { itemLabel: "T-Shirt Prime 26.1 (180g Pele de Pêssego)", costSinglePrint: 49.90, costFrontBack: 67.90 },
      { itemLabel: "T-Shirt Estonada Vintage 30.1 (170g)", costSinglePrint: 55.00, costFrontBack: 73.00 },
      { itemLabel: "T-Shirt Oversized Street 20.1 (220g)", costSinglePrint: 83.90, costFrontBack: 101.90 },
      { itemLabel: "Boné Americano / Trucker Snapback", costSinglePrint: 33.00, costFrontBack: 33.00 },
      { itemLabel: "Boné Prime Fivela de Metal Confort", costSinglePrint: 72.90, costFrontBack: 72.90 }
    ],
    active: true
  },
  RESERVA_INK: {
    code: "RESERVA_INK",
    name: "Reserva INK (Grupo AR&Co)",
    tradeName: "Reserva INK",
    specialty: "Peças exclusivas com estampa na Frente, Algodão Peruano (Pima), Linha Classic e Moletons",
    recommendedPrintTech: "DTG Kornit Digital",
    disallowedPrintTech: "Não realiza impressão nas costas (apenas frente)",
    artworks: {
      frontPosterPx: "4200 × 4800 px",
      dpi: 300,
      notes: "PNG transparente sem margem."
    },
    baseCostsReference: [
      { itemLabel: "Camiseta Classic", costSinglePrint: 54.90, costFrontBack: 54.90 },
      { itemLabel: "Camiseta Algodão Peruano (Pima)", costSinglePrint: 89.90, costFrontBack: 89.90 },
      { itemLabel: "Moletom Canguru", costSinglePrint: 149.90, costFrontBack: 149.90 }
    ],
    active: true
  },
  MONTINK: {
    code: "MONTINK",
    name: "Montink Print on Demand",
    tradeName: "Montink",
    specialty: "Linhas complementares e comparativos de malha",
    recommendedPrintTech: "Silk HD / DTG",
    artworks: {
      frontPosterPx: "4200 × 4800 px",
      dpi: 300,
      notes: "Gabarito padrão nacional 4200x4800"
    },
    baseCostsReference: [
      { itemLabel: "Camiseta Classic", costSinglePrint: 49.90, costFrontBack: 69.90 }
    ],
    active: false
  },
  HOTPRINTI: {
    code: "HOTPRINTI",
    name: "Hotprinti Soluções Gráficas",
    tradeName: "Hotprinti",
    specialty: "Papelaria Fine Art A3, Ecobags e brindes promocionais",
    recommendedPrintTech: "Offset / Digital Fine Art",
    artworks: {
      frontPosterPx: "3508 × 4960 px (A3)",
      dpi: 300,
      notes: "Área A3 fechada"
    },
    baseCostsReference: [
      { itemLabel: "Pôster Fine Art A3", costSinglePrint: 24.90, costFrontBack: 24.90 }
    ],
    active: false
  },
  PRIVATE_LABEL: {
    code: "PRIVATE_LABEL",
    name: "Private Label / Facção CMT Local (Vitória/ES)",
    tradeName: "Oficina Autoral AVA",
    specialty: "Lotes especiais autorais e serigrafia de alta tiragem local",
    recommendedPrintTech: "Silk Screen Convencional / Corrosão / Plastisol",
    artworks: {
      dpi: 300,
      notes: "Arquivos vetoriais em curvas (.ai / .pdf)"
    },
    baseCostsReference: [
      { itemLabel: "Lote Especial Sob Demanda", costSinglePrint: 45.00, costFrontBack: 55.00 }
    ],
    active: true
  },
  ESTOQUE_AVA: {
    code: "ESTOQUE_AVA",
    name: "Estoque Físico Remanescente AVA Sem Limites",
    tradeName: "Estoque Físico Próprio",
    specialty: "Peças físicas prontas para escoamento na Vitrine Secreta de Cupons (10% a 50% OFF)",
    recommendedPrintTech: "Pronta Entrega",
    artworks: {
      dpi: 300,
      notes: "Peças já produzidas e armazenadas."
    },
    baseCostsReference: [
      { itemLabel: "Peça do Estoque Físico", costSinglePrint: 35.00, costFrontBack: 35.00 }
    ],
    active: true
  }
};

export const DEFAULT_SUPPLIER_CODE = "DIMONA";
