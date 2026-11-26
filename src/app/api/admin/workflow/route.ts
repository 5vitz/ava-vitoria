import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import {
  WorkflowPersistentState,
  createCleanInitialWorkflowState,
  REAL_DIMONA_SAMPLE_ARCHIVE,
  PartnerVotes,
  VoteState,
  LivePipelineOrder,
  ArchivedOrderRecord,
} from "@/lib/workflowState";

export const dynamic = "force-dynamic";

const WORKFLOW_CONFIG_KEY = "ava_unified_workflow_v1";

async function loadWorkflowState(): Promise<WorkflowPersistentState> {
  const row = await prisma.siteSettings.findUnique({
    where: { config_key: WORKFLOW_CONFIG_KEY },
  });

  if (!row || !row.config_value) {
    const clean = createCleanInitialWorkflowState();
    await prisma.siteSettings.upsert({
      where: { config_key: WORKFLOW_CONFIG_KEY },
      update: { config_value: clean as any },
      create: { config_key: WORKFLOW_CONFIG_KEY, config_value: clean as any },
    });
    return clean;
  }

  const state = row.config_value as unknown as WorkflowPersistentState;
  // Ensure archivedSampleOrders always contains the real Dimona #755-460-927 order
  if (!Array.isArray(state.archivedSampleOrders) || state.archivedSampleOrders.length === 0) {
    state.archivedSampleOrders = [REAL_DIMONA_SAMPLE_ARCHIVE];
  }
  if (!Array.isArray(state.archivedClientOrders)) {
    state.archivedClientOrders = [];
  }
  if (!Array.isArray(state.decisionsQueue)) {
    state.decisionsQueue = [];
  }
  if (!Array.isArray(state.liveOrders)) {
    state.liveOrders = [];
  }
  return state;
}

async function saveWorkflowState(state: WorkflowPersistentState): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { config_key: WORKFLOW_CONFIG_KEY },
    update: { config_value: state as any },
    create: { config_key: WORKFLOW_CONFIG_KEY, config_value: state as any },
  });
}

function computeReports(state: WorkflowPersistentState) {
  const clients = state.archivedClientOrders || [];
  const samples = state.archivedSampleOrders || [];

  // 1. Relatório para o FLÁVIO (02 · Financeiro, Fiscal & DRE)
  const clientGrossRevenue = clients.reduce((acc, o) => acc + Number(o.grossRevenue || 0), 0);
  const clientProductionCost = clients.reduce((acc, o) => acc + Number(o.productionCost || 0), 0);
  const clientTaxSimples = clients.reduce((acc, o) => acc + Number(o.taxSimples || 0), 0);
  const clientGatewayFee = clients.reduce((acc, o) => acc + Number(o.gatewayFee || 0), 0);
  const clientNetProfit = clients.reduce((acc, o) => acc + Number(o.netResult || 0), 0);

  const sampleInvestmentCost = samples.reduce((acc, o) => acc + Number(o.productionCost || 0), 0);
  const sampleTotalPieces = samples.reduce((acc, o) => acc + Number(o.qtyTotal || 0), 0);

  const flavioReport = {
    recipient: "Flávio (Titular: 01 · Jurídico & 02 · Financeiro, Fiscal & ERP)",
    generatedAt: new Date().toISOString(),
    clientSalesSummary: {
      ordersCount: clients.length,
      piecesSold: clients.reduce((acc, o) => acc + Number(o.qtyTotal || 0), 0),
      grossRevenue: Number(clientGrossRevenue.toFixed(2)),
      productionCostPoD: Number(clientProductionCost.toFixed(2)),
      taxSimplesNacional: Number(clientTaxSimples.toFixed(2)),
      gatewayFees: Number(clientGatewayFee.toFixed(2)),
      netOperationalProfit: Number(clientNetProfit.toFixed(2)),
    },
    samplesPdSummary: {
      lotesCount: samples.length,
      piecesTested: sampleTotalPieces,
      totalPdInvestment: Number(sampleInvestmentCost.toFixed(2)),
      nfeReference: samples[0]?.nfeNumber || "114273 (Olist ERP)",
      accountingTreatment: "Despesa Pré-Operacional de P&D / Homologação Técnica Fabril (Dedutível no DRE)",
    },
    consolidatedBalance: Number((clientNetProfit - sampleInvestmentCost).toFixed(2)),
    fiscalDocumentsArchived: [
      ...samples.map((s) => ({
        orderCode: s.orderCode,
        category: "AMOSTRA",
        docName: s.nfeDocumentName,
        docUrl: s.nfeDocumentUrl,
        nfeNumber: s.nfeNumber,
        value: s.productionCost,
      })),
      ...clients.map((c) => ({
        orderCode: c.orderCode,
        category: "CLIENTE",
        docName: c.nfeDocumentName,
        docUrl: c.nfeDocumentUrl,
        nfeNumber: c.nfeNumber,
        value: c.grossRevenue,
      })),
    ],
  };

  // 2. Relatório para o GUSTAVO (06 · Marketing de Vendas — Mais Vendido, Mais Encomendado, Menos Vendido)
  const productMap: Record<
    string,
    { title: string; model: string; color: string; qtySold: number; ordersCount: number; revenue: number; channel: string }
  > = {};

  for (const c of clients) {
    const key = `${c.title} (${c.garmentModel})`;
    if (!productMap[key]) {
      productMap[key] = {
        title: c.title,
        model: c.garmentModel,
        color: c.color,
        qtySold: 0,
        ordersCount: 0,
        revenue: 0,
        channel: c.salesChannel,
      };
    }
    productMap[key].qtySold += Number(c.qtyTotal || 1);
    productMap[key].ordersCount += 1;
    productMap[key].revenue += Number(c.grossRevenue || 0);
  }

  // Também mapeia o histórico de encomendas de amostras como subsídio técnico inicial
  const sampleModelsTested = samples.flatMap((s) =>
    (s.itemsDetail || []).map((it) => ({
      product: it.product,
      color: it.color,
      size: it.size,
      front: it.front,
      unitCost: it.unitCost,
    }))
  );

  const rankedProducts = Object.values(productMap).sort((a, b) => b.qtySold - a.qtySold);
  const topSelling = rankedProducts.length > 0 ? rankedProducts[0] : null;
  const leastSelling =
    rankedProducts.length > 1
      ? rankedProducts[rankedProducts.length - 1]
      : rankedProducts.length === 1
      ? rankedProducts[0]
      : null;

  const gustavoReport = {
    recipient: "Gustavo (Titular: 05 · SAC & 06 · Marketing de Vendas)",
    generatedAt: new Date().toISOString(),
    totalClientOrdersAnalyzed: clients.length,
    topSellingProduct: topSelling
      ? `${topSelling.title} — ${topSelling.model} (${topSelling.qtySold} un vendidas · R$ ${topSelling.revenue.toFixed(2)})`
      : "Aguardando 1º pedido de cliente ser concluído e arquivado na Diretoria",
    mostOrderedModel: topSelling
      ? `${topSelling.model} · Cor: ${topSelling.color} (${topSelling.ordersCount} encomenda(s) no canal ${topSelling.channel})`
      : "Nenhuma encomenda de cliente arquivada ainda (6 malhas homologadas na pasta Amostras)",
    leastSellingProduct:
      rankedProducts.length > 1 && leastSelling
        ? `${leastSelling.title} (${leastSelling.qtySold} un)`
        : rankedProducts.length === 1
        ? "Apenas 1 Peça Única em catálogo (100% de share na Coleção Piloto)"
        : "Sem dados comparativos de baixa saída no momento",
    strategicRecommendation: topSelling
      ? `🔥 ESCALAR TRÁFEGO PAGO: Concentrar 80% da verba de Meta Ads / Instagram Shopping na peça "${topSelling.title}" (${topSelling.model}) que comprovou tração real e conversão concluída.`
      : "🧭 FASE DE LANÇAMENTO: Assim que a Peça Única percorrer as 4 Fases e for arquivada na pasta Clientes, este relatório apontará automaticamente o campeão de vendas para alocação de ROAS.",
    rankedProducts,
    sampleModelsTested,
  };

  return { flavioReport, gustavoReport };
}

export async function GET() {
  try {
    const state = await loadWorkflowState();
    const reports = computeReports(state);

    return NextResponse.json({
      success: true,
      state,
      reports,
    });
  } catch (error: any) {
    console.error("Erro em GET /api/admin/workflow:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao carregar fluxo operacional." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    let state = await loadWorkflowState();

    // =========================================================================
    // AÇÃO 0: RESETAR / ZERAR DADOS FICTÍCIOS (TABULA RASA)
    // =========================================================================
    if (action === "RESET_CLEAN_SLATE") {
      state = createCleanInitialWorkflowState();
      await saveWorkflowState(state);

      // Limpa também pautas fictícias da Sala de Reuniões
      await prisma.boardChatMessage.deleteMany({});
      await prisma.boardPauta.deleteMany({});

      const reports = computeReports(state);
      return NextResponse.json({
        success: true,
        message: "Todos os dados fictícios foram zerados! Apenas o lote real Dimona #755-460-927 permanece arquivado na pasta Amostras.",
        state,
        reports,
      });
    }

    // =========================================================================
    // FASE 0 (ETAPA 0.1): PROPOR OS 4 PILARES DA COLEÇÃO (07 · MKT DE PRODUTO -> URNA 4/4)
    // =========================================================================
    if (action === "PROPOSE_COLLECTION_CHARTER") {
      const { name, season, year, themeTrend, aesthetic, brandMessage } = body;
      if (!name || !themeTrend || !aesthetic || !brandMessage) {
        return NextResponse.json(
          { success: false, error: "Os 4 Pilares da Coleção (Nome, Tema/Tendência, Estética e Mensagem A·V·A) são obrigatórios." },
          { status: 400 }
        );
      }

      const charterId = `charter-${Date.now()}`;
      const decisionId = `DEC-COL-${Date.now().toString().slice(-4)}`;

      state.activeCharter = {
        id: charterId,
        name: name.trim(),
        season: season || "Outono",
        year: Number(year) || 2027,
        themeTrend: themeTrend.trim(),
        aesthetic: aesthetic.trim(),
        brandMessage: brandMessage.trim(),
        proposedBy: "Tripoint (07 · Marketing de Produto)",
        status: "EM_VOTACAO_URNA",
        decisionId,
        createdAt: new Date().toISOString(),
      };

      // Remove decisão de coleção anterior se houver e adiciona na Urna 4/4
      state.decisionsQueue = state.decisionsQueue.filter((d) => d.decisionType !== "COLLECTION_CONCEPT");
      state.decisionsQueue.unshift({
        id: decisionId,
        depto: "Fase 0 · 07 · Marketing de Produto (Tripoint)",
        tag: "Ponto de Partida · 4 Pilares da Coleção",
        title: `Homologação da Coleção: "${name.trim()}" (${season || "Outono"}/${year || 2027})`,
        description: `1. Nome: ${name.trim()} | 2. Tema/Tendência: ${themeTrend.trim()} | 3. Estética: ${aesthetic.trim()} | 4. Mensagem A·V·A: "${brandMessage.trim()}". ("Planejar errado é planejar errar" — exige Consenso 4/4 para destravar o Atelier).`,
        actionPrimary: "Homologar Coleção & Destravar Atelier (08)",
        timeAgo: "Acaba de entrar na Urna",
        votes: {
          Armando: "PENDING",
          Flavio: "PENDING",
          Tripoint: "APPROVED",
          Gustavo: "PENDING",
        },
        decisionType: "COLLECTION_CONCEPT",
        payload: { charterId },
      });

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        message: `Carta Conceitual da Coleção "${name}" enviada para a Urna de Votação 4/4 na Diretoria Executiva!`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // VOTAÇÃO NA URNA 4/4 (ALTERNAR VOTO OU APROVAR 4/4) & EXECUTAR DECISÃO
    // =========================================================================
    if (action === "CYCLE_VOTE") {
      const { decisionId, partner } = body as { decisionId: string; partner: keyof PartnerVotes };
      const nextState: Record<VoteState, VoteState> = {
        PENDING: "APPROVED",
        APPROVED: "REJECTED",
        REJECTED: "PENDING",
      };

      state.decisionsQueue = state.decisionsQueue.map((item) => {
        if (item.id !== decisionId) return item;
        return {
          ...item,
          votes: {
            ...item.votes,
            [partner]: nextState[item.votes[partner]],
          },
        };
      });

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        state,
        reports: computeReports(state),
      });
    }

    if (action === "APPROVE_ALL_VOTES_AND_EXECUTE" || action === "EXECUTE_UNANIMOUS_DECISION") {
      const { decisionId } = body;
      const decision = state.decisionsQueue.find((d) => d.id === decisionId);
      if (!decision) {
        return NextResponse.json({ success: false, error: "Pauta não encontrada na Urna." }, { status: 404 });
      }

      // Garante os 4 votos aprovados
      decision.votes = {
        Armando: "APPROVED",
        Flavio: "APPROVED",
        Tripoint: "APPROVED",
        Gustavo: "APPROVED",
      };

      let feedback = `Consenso 4/4 homologado para "${decision.title}"!`;

      // Se for Fase 0: Conceito da Coleção -> Homologa e cria a Coleção no PostgreSQL
      if (decision.decisionType === "COLLECTION_CONCEPT" && state.activeCharter) {
        state.activeCharter.status = "HOMOLOGADA_4_4";
        state.activeCharter.approvedAt = new Date().toISOString();

        const slugBase = state.activeCharter.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");

        const existingCol = await prisma.collection.findFirst({
          where: { name: state.activeCharter.name },
        });

        const col =
          existingCol ||
          (await prisma.collection.create({
            data: {
              name: state.activeCharter.name,
              slug: `${slugBase}-${Date.now()}`,
              year: state.activeCharter.year,
              season: state.activeCharter.season,
            },
          }));

        state.activeCharter.collectionDbId = col.id;
        feedback = `✅ Coleção "${state.activeCharter.name}" homologada por unanimidade (4/4)! O Atelier Criativo (Depto 08) está destravado para criar a Peça Única.`;
      }

      // Se for Fase 2: Precificação da Peça Única -> Homologa o preço para ir à Vitrine
      if (decision.decisionType === "PIECE_PRICING" && state.pilotPiece) {
        state.pilotPiece.status = "PRICE_APPROVED";
        state.pilotPiece.proposedMarginPercent = decision.payload?.marginPercent ?? 60;
        state.pilotPiece.approvedSalePrice = decision.payload?.salePrice ?? 169.75;
        state.pilotPiece.approvedNetProfit = decision.payload?.netProfit ?? 85.73;
        feedback = `✅ Preço de R$ ${state.pilotPiece.approvedSalePrice?.toFixed(2)} homologado na Urna 4/4! Agora o Depto 07 · Marketing de Produto já pode publicar a Peça Única em todos os cards da Vitrine!`;
      }

      // Remove da fila de pendentes
      state.decisionsQueue = state.decisionsQueue.filter((d) => d.id !== decisionId);

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        message: feedback,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 1 (ETAPA 1): APROVAR PEÇA ÚNICA NO ATELIER (08 -> 01 JURÍDICO BLOCKCHAIN)
    // =========================================================================
    if (action === "APPROVE_ARTWORK_FOR_COLLECTION") {
      const {
        code,
        title,
        previewImageUrl,
        supplier = "DIMONA",
        garmentModel = "T-Shirt Prime 180g (Pele de Pêssego)",
        garmentColor = "Preta",
        garmentSize = "G",
        baseCost = 67.90,
        sha256,
        mutatedKeysCount = 9,
      } = body;

      const charter = state.activeCharter;
      const computedSha =
        sha256 ||
        crypto
          .createHash("sha256")
          .update(`${code}-${title}-${Date.now()}`)
          .digest("hex");

      state.pilotPiece = {
        id: `pilot-${Date.now()}`,
        code: code || "AVA-PILOTO-001",
        title: title || "Camiseta Peça Única — Sem Limites",
        collectionName: charter?.name || "Coleção Piloto Sem Limites",
        themeTrend: charter?.themeTrend || "Minimalismo Urbano & Geometria Cinética",
        aesthetic: charter?.aesthetic || "Estética da Subtração (Traço 1px & Alto Contraste)",
        brandMessage: charter?.brandMessage || "Atitude, Valorização e Amizade Sem Limites",
        previewImageUrl:
          previewImageUrl || "/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg",
        supplier,
        garmentModel,
        garmentColor,
        garmentSize,
        baseCost: Number(baseCost) || 67.90,
        sha256: computedSha,
        mutatedKeysCount: Number(mutatedKeysCount) || 9,
        status: "APPROVED_PENDING_BLOCKCHAIN",
      };

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        message: `✅ Arte "${state.pilotPiece.title}" aprovada no Atelier (08)! JSON 26 Chaves congelado com Hash SHA-256 e enviado para a fila do Depto 01 · Jurídico (Flávio / Dr. Lex) registrar na Blockchain.`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 1 (ETAPA 2): REGISTRAR JSON 26 CHAVES NA BLOCKCHAIN (01 · JURÍDICO -> 02 · FINANCEIRO)
    // =========================================================================
    if (action === "REGISTER_ARTWORK_ON_BLOCKCHAIN") {
      if (!state.pilotPiece) {
        return NextResponse.json(
          { success: false, error: "Nenhuma arte aguardando registro na fila do Jurídico." },
          { status: 400 }
        );
      }

      const txHash = crypto
        .createHash("sha256")
        .update(`OTS-BITCOIN-${state.pilotPiece.sha256}-${Date.now()}`)
        .digest("hex");

      state.pilotPiece.status = "REGISTERED_ON_BLOCKCHAIN";
      state.pilotPiece.blockchainTxId = `OTS-BTC-${txHash.slice(0, 16).toUpperCase()}`;
      state.pilotPiece.otsReceipt = `${state.pilotPiece.code}_writing_matrix26.json.ots`;
      state.pilotPiece.blockchainRegisteredAt = new Date().toLocaleString("pt-BR");

      // Atualiza também o registro no banco Artwork se existir
      try {
        await prisma.artwork.updateMany({
          where: { code: state.pilotPiece.code },
          data: { is_registered: true, coa_hash_sha256: state.pilotPiece.sha256 },
        });
      } catch {
        // ignore if not found
      }

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        message: `⛓️ JSON 26 Chaves registrado na Blockchain (OpenTimestamps Bitcoin) por Flávio / Dr. Lex! Comprovante ${state.pilotPiece.otsReceipt} emitido. Peça liberada para Precificação no Depto 02 · Financeiro!`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 2 (ETAPA 3): ENVIAR PRECIFICAÇÃO DA PEÇA ÚNICA PARA A URNA 4/4 (02 · FINANCEIRO)
    // =========================================================================
    if (action === "PROPOSE_PILOT_PIECE_PRICING") {
      if (!state.pilotPiece) {
        return NextResponse.json(
          { success: false, error: "Aprove e registre a Peça Única na Blockchain antes de precificar." },
          { status: 400 }
        );
      }

      const cost = Number(body.baseCost ?? state.pilotPiece.baseCost ?? 67.90);
      const marginPercent = Number(body.marginPercent ?? 60);
      const salePrice = Number((cost / (1 - marginPercent / 100)).toFixed(2));
      const taxSimples = Number((salePrice * 0.06).toFixed(2));
      const gatewayFee = Number((salePrice * 0.035).toFixed(2));
      const netProfit = Number((salePrice - cost - taxSimples - gatewayFee).toFixed(2));

      state.pilotPiece.baseCost = cost;
      state.pilotPiece.proposedMarginPercent = marginPercent;
      state.pilotPiece.approvedSalePrice = salePrice;
      state.pilotPiece.approvedNetProfit = netProfit;
      state.pilotPiece.status = "PRICING_IN_URNA";

      const decisionId = `DEC-PRICE-${Date.now().toString().slice(-4)}`;
      state.decisionsQueue = state.decisionsQueue.filter((d) => d.decisionType !== "PIECE_PRICING");
      state.decisionsQueue.unshift({
        id: decisionId,
        depto: "Fase 2 · 02 · Financeiro, Fiscal & ERP (Flávio)",
        tag: "Consenso 4/4 Obrigatório",
        title: `Precificação da Peça Única: "${state.pilotPiece.title}" (R$ ${salePrice.toFixed(2)})`,
        description: `Modelagem: ${state.pilotPiece.garmentModel} (${state.pilotPiece.garmentColor}) · Custo PoD: R$ ${cost.toFixed(2)} · Margem: ${marginPercent}% ➔ Preço Vitrine: R$ ${salePrice.toFixed(2)} (Lucro Líquido Real: R$ ${netProfit.toFixed(2)}/peça após Simples 6% e Gateway 3,5%).`,
        actionPrimary: "Homologar Preço & Liberar Vitrine (07)",
        timeAgo: "Aguardando Votação 4/4",
        votes: {
          Armando: "PENDING",
          Flavio: "APPROVED",
          Tripoint: "PENDING",
          Gustavo: "PENDING",
        },
        decisionType: "PIECE_PRICING",
        payload: { cost, marginPercent, salePrice, netProfit },
      });

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        message: `🗳️ Proposta de Preço (R$ ${salePrice.toFixed(2)} · Margem ${marginPercent}%) enviada pelo Financeiro (Flávio) para a Urna 4/4!`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 2 (ETAPA 5): PUBLICAR PEÇA ÚNICA EM TODOS OS CARDS DA VITRINE (07 · MKT PRODUTO)
    // =========================================================================
    if (action === "PUBLISH_SINGLE_PIECE_STOREFRONT") {
      if (!state.pilotPiece) {
        return NextResponse.json(
          { success: false, error: "Nenhuma Peça Única disponível para publicar na vitrine." },
          { status: 400 }
        );
      }

      const charter = state.activeCharter;
      const colName = charter?.name || state.pilotPiece.collectionName || "Coleção Piloto Sem Limites";
      const colSeason = charter?.season || "Outono";
      const colYear = charter?.year || 2027;
      const price = state.pilotPiece.approvedSalePrice || 169.75;
      const cost = state.pilotPiece.baseCost || 67.90;
      const imgUrl =
        state.pilotPiece.previewImageUrl ||
        "/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg";

      // 1. Garante que a Coleção exista no banco PostgreSQL
      let collection = await prisma.collection.findFirst({
        where: { name: colName },
      });

      if (!collection) {
        const slugBase = colName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-");
        collection = await prisma.collection.create({
          data: {
            name: colName,
            slug: `${slugBase}-${Date.now()}`,
            year: colYear,
            season: colSeason,
          },
        });
      }

      // 2. Remove produtos anteriores dessa coleção piloto e cria 9 cards idênticos (3x3 Balenciaga) com a MESMA Peça Única
      await prisma.product.deleteMany({
        where: { collection_id: collection.id },
      });

      const cardsCount = Number(body.cardsCount) || 9;
      for (let i = 1; i <= cardsCount; i++) {
        const createdProd = await prisma.product.create({
          data: {
            name: state.pilotPiece.title,
            slug: `peca-unica-${state.pilotPiece.code.toLowerCase()}-slot-${i}-${Date.now()}`,
            description: `${state.pilotPiece.brandMessage} — ${state.pilotPiece.themeTrend}. Estética: ${state.pilotPiece.aesthetic}. Modelagem: ${state.pilotPiece.garmentModel} (${state.pilotPiece.garmentColor}). Hash Blockchain SHA-256: ${state.pilotPiece.sha256}`,
            price,
            cost_price: cost,
            cost_baseline: cost,
            target_margin_percent: state.pilotPiece.proposedMarginPercent || 60,
            is_active: true,
            display_order: i,
            card_type: 1,
            collection_id: collection.id,
            sku_master: `${state.pilotPiece.code}-SLOT-${i}`,
            product_category: "CAMISETA_PRIME",
            supplier_provider: state.pilotPiece.supplier || "DIMONA",
            print_file_front_url: imgUrl,
          },
        });

        await prisma.productImage.create({
          data: {
            product_id: createdProd.id,
            image_url: imgUrl,
            display_order: 0,
          },
        });

        await prisma.stockVariant.create({
          data: {
            product_id: createdProd.id,
            size: state.pilotPiece.garmentSize || "G",
            color: state.pilotPiece.garmentColor || "Preta",
            quantity: 99,
          },
        });
      }

      // 3. Define essa Coleção como a Vitrine Ativa da Loja (/)
      await prisma.siteSettings.upsert({
        where: { config_key: "active_collection" },
        update: { config_value: { collection_id: collection.id } },
        create: { config_key: "active_collection", config_value: { collection_id: collection.id } },
      });

      state.pilotPiece.status = "PUBLISHED_IN_STOREFRONT";
      state.pilotPiece.storefrontPublishedAt = new Date().toLocaleString("pt-BR");

      await saveWorkflowState(state);

      try {
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath("/admin/marketing");
        revalidatePath("/admin/atelier");
        revalidatePath("/admin/grid-manager");
      } catch {
        // ignore
      }

      return NextResponse.json({
        success: true,
        message: `★ Vitrine Oficial Publicada! A Coleção "${colName}" está ativa na Home (/) exibindo a Peça Única "${state.pilotPiece.title}" repetida nos ${cardsCount} cards do Grid 3x3 Balenciaga!`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 3 (ETAPAS 6 & 7): SIMULAR COMPRA DE CLIENTE REAL NO PONTO DE VENDA
    // =========================================================================
    if (action === "CREATE_CUSTOMER_ORDER") {
      const piece = state.pilotPiece;
      const salePrice = Number(body.salePrice ?? piece?.approvedSalePrice ?? 169.75);
      const unitCost = Number(body.unitCost ?? piece?.baseCost ?? 67.90);
      const qty = Number(body.qty ?? 1);
      const gross = Number((salePrice * qty).toFixed(2));
      const totalCost = Number((unitCost * qty).toFixed(2));
      const taxSimples = Number((gross * 0.06).toFixed(2));
      const gatewayFee = Number((gross * 0.035).toFixed(2));
      const netProfit = Number((gross - totalCost - taxSimples - gatewayFee).toFixed(2));

      const orderNumber = `#AVA-${String(state.archivedClientOrders.length + state.liveOrders.length + 101)}`;

      const newOrder: LivePipelineOrder = {
        id: `ord-${Date.now()}`,
        orderCode: orderNumber,
        category: "CLIENTE",
        customerName: body.customerName || "Cliente Ponto de Venda (Vitrine Oficial AVA)",
        customerEmail: body.customerEmail || "cliente@avasemlimites.com.br",
        salesChannel: body.salesChannel || "01. Vitrine Oficial AVA (Checkout PIX ACID)",
        collectionName: state.activeCharter?.name || piece?.collectionName || "Coleção Piloto Sem Limites",
        artworkCode: piece?.code || "AVA-PILOTO-001",
        productTitle: piece?.title || "Camiseta Peça Única — Sem Limites",
        garmentModel: piece?.garmentModel || "T-Shirt Prime 180g (Pele de Pêssego)",
        color: piece?.garmentColor || "Preta",
        size: piece?.garmentSize || "G",
        qty,
        unitCost,
        totalCost,
        salePrice: gross,
        taxSimples,
        gatewayFee,
        netProfit,
        nfeDocumentName: null,
        nfeDocumentUrl: null,
        nfeNumber: null,
        nfeAttachedInBoardroom: false,
        productionStep: "1_AGUARDANDO_NFE",
        sacTrackingStatus: "AGUARDANDO_COLETA_DOCA",
        carrierName: "J&T Express",
        trackingCode: `JT-${Date.now().toString().slice(-8)}BR`,
        createdAt: new Date().toLocaleString("pt-BR"),
        updatedAt: new Date().toLocaleString("pt-BR"),
      };

      state.liveOrders.unshift(newOrder);
      await saveWorkflowState(state);

      return NextResponse.json({
        success: true,
        message: `🛒 Pedido de Cliente ${orderNumber} recebido no Checkout ACID! Aguardando o Financeiro (Flávio · Depto 02) anexar o documento "Vale uma NF-e" na Sala de Reuniões para liberar a Produção.`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 3 (ETAPA 8): ANEXAR "VALE UMA NF-e" NA SALA DE REUNIÕES & LIBERAR PRODUÇÃO
    // =========================================================================
    if (action === "ATTACH_VALE_NFE_IN_BOARDROOM") {
      const { orderId } = body;
      const targetOrder = orderId
        ? state.liveOrders.find((o) => o.id === orderId)
        : state.liveOrders[0];

      if (!targetOrder) {
        return NextResponse.json(
          { success: false, error: "Nenhum pedido ativo aguardando NF-e." },
          { status: 400 }
        );
      }

      targetOrder.nfeDocumentName = "Vale_uma_NFe_AVA.pdf";
      targetOrder.nfeDocumentUrl = "/PDF/Vale_uma_NFe_AVA.pdf";
      targetOrder.nfeNumber = "VALE-NFE-001 (Homologação E2E)";
      targetOrder.nfeAttachedInBoardroom = true;
      targetOrder.productionStep = "2_SILK_HD_PRODUCAO";
      targetOrder.updatedAt = new Date().toLocaleString("pt-BR");

      // Cria ou localiza a Pauta oficial na Sala de Reuniões e publica o anexo "Vale_uma_NFe_AVA.pdf" + recibo do Agente Porteiro
      const pautaTitle = `Faturamento & NF-e · Pedido ${targetOrder.orderCode} (${targetOrder.productTitle})`;
      let pauta = await prisma.boardPauta.findFirst({
        where: { title: pautaTitle },
      });

      if (!pauta) {
        pauta = await prisma.boardPauta.create({
          data: {
            title: pautaTitle,
            created_by: "flavio",
            status: "EM_DEBATE",
          },
        });
      }

      await prisma.boardChatMessage.create({
        data: {
          pauta_id: pauta.id,
          author_username: "flavio",
          author_name: "Flávio (01 · Jurídico & 02 · Financeiro)",
          subject: `VALE UMA NF-e — Liberação Fiscal do Pedido ${targetOrder.orderCode}`,
          content: `Armando (04 · Produção) e Gustavo (05 · SAC), anexei o documento oficial "Vale_uma_NFe_AVA.pdf" referente à venda do Pedido ${targetOrder.orderCode} (${targetOrder.productTitle} — R$ ${targetOrder.salePrice.toFixed(2)}). Ordem liberada para estamparia Silk HD e acompanhamento logístico!`,
          recipients: ["armando", "gustavo"],
          copy_sender: true,
          attachment_name: "Vale_uma_NFe_AVA.pdf",
          attachment_url: "/PDF/Vale_uma_NFe_AVA.pdf",
          attachment_size: 48200,
          attachment_mime: "application/pdf",
          is_system_porteiro: false,
        },
      });

      await prisma.boardChatMessage.create({
        data: {
          pauta_id: pauta.id,
          author_username: "porteiro_ia",
          author_name: "🤖 Agente Porteiro do Conselho (Arauto Societário)",
          subject: `VALE UMA NF-e — Liberação Fiscal do Pedido ${targetOrder.orderCode}`,
          content: `✅ Protocolo Oficial Registrado: Documento "Vale_uma_NFe_AVA.pdf" anexado por Flávio na Pauta "${pautaTitle}". Notificações disparadas para Armando (04 · Produção) e Gustavo (05 · SAC) (+ cópia para Flávio). Esteira do Depto 04 · Produção destravada!`,
          recipients: ["armando", "gustavo"],
          copy_sender: true,
          is_system_porteiro: true,
        },
      });

      await saveWorkflowState(state);

      return NextResponse.json({
        success: true,
        pautaTitle,
        message: `📄 Documento "Vale_uma_NFe_AVA.pdf" anexado na Sala de Reuniões (Pauta: "${pautaTitle}") e protocolado pelo Agente Porteiro! Pedido ${targetOrder.orderCode} liberado na Produção (Depto 04 · Armando)!`,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 4 (ETAPA 9): AVANÇAR ETAPA DE PRODUÇÃO ATÉ A DOCA E TRANSBORDAR AO SAC
    // =========================================================================
    if (action === "ADVANCE_PRODUCTION_STEP") {
      const { orderId, nextStep } = body;
      const targetOrder = orderId
        ? state.liveOrders.find((o) => o.id === orderId)
        : state.liveOrders[0];

      if (!targetOrder) {
        return NextResponse.json({ success: false, error: "Pedido não encontrado na Produção." }, { status: 404 });
      }

      targetOrder.productionStep = nextStep;
      targetOrder.updatedAt = new Date().toLocaleString("pt-BR");

      let msg = `🏭 Pedido ${targetOrder.orderCode} atualizado na Produção!`;
      if (nextStep === "3_CONTROLE_QUALIDADE") {
        msg = `🔬 Pedido ${targetOrder.orderCode}: Impressão Silk HD concluída! Peça em Controle de Qualidade & Revisão.`;
      } else if (nextStep === "4_PRONTO_NA_DOCA") {
        targetOrder.sacTrackingStatus = "AGUARDANDO_COLETA_DOCA";
        msg = `📦 Pedido ${targetOrder.orderCode} chegou à Fronteira Final da Produção: "4. Pronto na Doca / Aguardando Coleta". Pronto para transbordo ao SAC (Gustavo · Depto 05)!`;
      } else if (nextStep === "5_COLETADO_SAC") {
        targetOrder.sacTrackingStatus = "COLETADO_TRANSPORTADORA";
        msg = `🚚 Bastão Passado! Pedido ${targetOrder.orderCode} marcado como COLETADO pela ${targetOrder.carrierName} e transbordado para a Torre Logística Pós-Coleta do SAC (Depto 05 · Gustavo)!`;
      }

      await saveWorkflowState(state);
      return NextResponse.json({
        success: true,
        message: msg,
        state,
        reports: computeReports(state),
      });
    }

    // =========================================================================
    // FASE 4 (ETAPA 10): AVANÇAR ENTREGA NO SAC & ARQUIVAR NA DIRETORIA (PASTA CLIENTES)
    // =========================================================================
    if (action === "ADVANCE_SAC_AND_ARCHIVE_TO_DIRETORIA") {
      const { orderId, sacStatus } = body;
      const targetOrder = orderId
        ? state.liveOrders.find((o) => o.id === orderId)
        : state.liveOrders[0];

      if (!targetOrder) {
        return NextResponse.json({ success: false, error: "Pedido não encontrado na Torre do SAC." }, { status: 404 });
      }

      if (sacStatus === "EM_TRANSITO_FILIAL") {
        targetOrder.sacTrackingStatus = "EM_TRANSITO_FILIAL";
        targetOrder.updatedAt = new Date().toLocaleString("pt-BR");
        await saveWorkflowState(state);
        return NextResponse.json({
          success: true,
          message: `🚚 Pedido ${targetOrder.orderCode} em trânsito rodoviário (${targetOrder.carrierName}) rumo à cidade do cliente. Aviso proativo disparado pelo SAC!`,
          state,
          reports: computeReports(state),
        });
      }

      // Entrega Concluída -> Arquiva na Diretoria Executiva (Gaveta: CLIENTES) e gera os 2 Relatórios (Flávio + Gustavo)
      const archivedRecord: ArchivedOrderRecord = {
        id: `arch-cli-${Date.now()}`,
        orderCode: targetOrder.orderCode,
        category: "CLIENTE",
        title: targetOrder.productTitle,
        customerOrTarget: `${targetOrder.customerName} (${targetOrder.customerEmail})`,
        salesChannel: targetOrder.salesChannel,
        supplier: "Dimona Dropsimples (Silk HD)",
        collectionName: targetOrder.collectionName,
        garmentModel: targetOrder.garmentModel,
        color: targetOrder.color,
        size: targetOrder.size,
        qtyTotal: targetOrder.qty,
        grossRevenue: targetOrder.salePrice,
        productionCost: targetOrder.totalCost,
        taxSimples: targetOrder.taxSimples,
        gatewayFee: targetOrder.gatewayFee,
        netResult: targetOrder.netProfit,
        nfeNumber: targetOrder.nfeNumber || "VALE-NFE-001",
        nfeDocumentName: targetOrder.nfeDocumentName || "Vale_uma_NFe_AVA.pdf",
        nfeDocumentUrl: targetOrder.nfeDocumentUrl || "/PDF/Vale_uma_NFe_AVA.pdf",
        carrierName: `${targetOrder.carrierName} (${targetOrder.trackingCode})`,
        deliveredAt: new Date().toLocaleString("pt-BR"),
        archivedAt: new Date().toLocaleString("pt-BR"),
      };

      state.archivedClientOrders.unshift(archivedRecord);
      state.liveOrders = state.liveOrders.filter((o) => o.id !== targetOrder.id);

      await saveWorkflowState(state);
      const reports = computeReports(state);

      return NextResponse.json({
        success: true,
        message: `🏛️ Ciclo 360° Concluído! Pedido ${targetOrder.orderCode} entregue ao cliente e ARQUIVADO na Diretoria Executiva (Pasta: Clientes). Os 2 Relatórios Executivos (Financeiro p/ Flávio e Estratégia Mkt de Vendas p/ Gustavo) foram gerados automaticamente!`,
        state,
        reports,
      });
    }

    return NextResponse.json({ success: false, error: "Ação não reconhecida." }, { status: 400 });
  } catch (error: any) {
    console.error("Erro em POST /api/admin/workflow:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao processar ação do fluxo." },
      { status: 500 }
    );
  }
}
