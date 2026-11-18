import { prisma } from "./db";
import { Prisma } from "@prisma/client";

/**
 * Motor de Precificação Dinâmica Multi-Supplier — AVA Sem Limites
 * Gerencia margens de lucro por categoria, indexação de custos e a Chave de 2 Posições.
 */

export interface CategoryMarginConfig {
  category_code: string;
  category_label: string;
  target_margin_percent: number;
  drop_indexing_mode: "INDEXED" | "HOLD_ON_DROP";
}

export const DEFAULT_CATEGORY_MARGINS: CategoryMarginConfig[] = [
  {
    category_code: "CAMISETA_QUALITY",
    category_label: "Camisetas Quality 30.1",
    target_margin_percent: 60.0,
    drop_indexing_mode: "INDEXED"
  },
  {
    category_code: "CAMISETA_PRIME",
    category_label: "Camisetas Prime 26.1 (Pele de Pêssego)",
    target_margin_percent: 60.0,
    drop_indexing_mode: "INDEXED"
  },
  {
    category_code: "CAMISETA_OVERSIZED",
    category_label: "Camisetas Oversized 20.1 (220g Street)",
    target_margin_percent: 55.0,
    drop_indexing_mode: "INDEXED"
  },
  {
    category_code: "CAMISETA_ESTONADA",
    category_label: "Camisetas Estonadas Vintage 30.1",
    target_margin_percent: 58.0,
    drop_indexing_mode: "INDEXED"
  },
  {
    category_code: "REGATA",
    category_label: "Regatas Masculinas Quality",
    target_margin_percent: 60.0,
    drop_indexing_mode: "INDEXED"
  },
  {
    category_code: "MOLETOM",
    category_label: "Moletons (Crewneck e Canguru)",
    target_margin_percent: 50.0,
    drop_indexing_mode: "INDEXED"
  },
  {
    category_code: "BONE",
    category_label: "Bonés (Americano e Prime Fivela)",
    target_margin_percent: 45.0,
    drop_indexing_mode: "INDEXED"
  }
];

/**
 * Calcula o preço de venda com base no custo e na margem bruta sobre o preço de venda.
 * Fórmula clássica de margem de contribuição: Preço = Custo / (1 - Margem%/100)
 */
export function calculateTargetPrice(cost: number, marginPercent: number): number {
  if (marginPercent >= 100 || marginPercent <= 0) {
    return cost * 2; // Fallback seguro para 100% de markup caso valor inválido
  }
  const rawPrice = cost / (1 - marginPercent / 100);
  // Arredonda para 2 casas decimais
  return Math.round(rawPrice * 100) / 100;
}

/**
 * Inicializa ou sincroniza as regras de margem padrão no banco de dados
 */
export async function ensureDefaultMarginRules() {
  for (const item of DEFAULT_CATEGORY_MARGINS) {
    await prisma.categoryMarginRule.upsert({
      where: { category_code: item.category_code },
      update: {},
      create: {
        category_code: item.category_code,
        category_label: item.category_label,
        target_margin_percent: new Prisma.Decimal(item.target_margin_percent),
        drop_indexing_mode: item.drop_indexing_mode
      }
    });
  }
}

/**
 * Avalia o impacto de uma nova cotação de custo de fornecedor sobre o produto
 * aplicando a lógica da Chave de 2 Posições (INDEXED vs HOLD_ON_DROP).
 */
export function evaluateSupplierPriceChange(params: {
  currentCost: number;
  baselineCost: number;
  newCost: number;
  currentSalePrice: number;
  marginPercent: number;
  dropIndexingMode: "INDEXED" | "HOLD_ON_DROP";
}): {
  newSalePrice: number;
  newCost: number;
  newBaselineCost: number;
  shouldAlertCouncil: boolean;
  alertReason?: string;
  reindexed: boolean;
} {
  const {
    currentCost,
    baselineCost,
    newCost,
    currentSalePrice,
    marginPercent,
    dropIndexingMode
  } = params;

  // Custo não variou
  if (Math.abs(newCost - currentCost) < 0.01) {
    return {
      newSalePrice: currentSalePrice,
      newCost: currentCost,
      newBaselineCost: baselineCost,
      shouldAlertCouncil: false,
      reindexed: false
    };
  }

  // 1. Custo SUBIU no fornecedor -> Reindexa imediatamente para não tomar prejuízo
  if (newCost > currentCost) {
    const updatedPrice = calculateTargetPrice(newCost, marginPercent);
    return {
      newSalePrice: updatedPrice,
      newCost: newCost,
      newBaselineCost: newCost, // Novo teto
      shouldAlertCouncil: true,
      alertReason: `Custo subiu de R$ ${currentCost.toFixed(2)} para R$ ${newCost.toFixed(2)}. Preço na vitrine reindexado para R$ ${updatedPrice.toFixed(2)}.`,
      reindexed: true
    };
  }

  // 2. Custo CAIU no fornecedor (Promoção do fornecedor)
  if (newCost < currentCost) {
    if (dropIndexingMode === "HOLD_ON_DROP") {
      // Posição 2: Mantém preço na vitrine e retém o lucro extra
      return {
        newSalePrice: currentSalePrice,
        newCost: newCost,
        newBaselineCost: Math.max(baselineCost, currentCost), // Preserva o teto para reindexação futura
        shouldAlertCouncil: true,
        alertReason: `Custo caiu para R$ ${newCost.toFixed(2)}. Chave em 'Reter Lucro': Preço mantido em R$ ${currentSalePrice.toFixed(2)}, aumentando margem de lucro líquido.`,
        reindexed: false
      };
    } else {
      // Posição 1 (Padrão): Repassa a baixa mantendo a margem da categoria
      const updatedPrice = calculateTargetPrice(newCost, marginPercent);
      return {
        newSalePrice: updatedPrice,
        newCost: newCost,
        newBaselineCost: newCost,
        shouldAlertCouncil: true,
        alertReason: `Custo caiu para R$ ${newCost.toFixed(2)}. Chave em 'Indexado': Preço na vitrine reduzido para R$ ${updatedPrice.toFixed(2)}.`,
        reindexed: true
      };
    }
  }

  return {
    newSalePrice: currentSalePrice,
    newCost,
    newBaselineCost: baselineCost,
    shouldAlertCouncil: false,
    reindexed: false
  };
}
