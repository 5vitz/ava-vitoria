// src/app/api/financeiro/subscriptions/route.ts — API de Gestão de Assinaturas, APIs e Custos Fixos AVA

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { INITIAL_SUBSCRIPTIONS, SubscriptionItem } from '@/lib/subscriptionsData';

const CONFIG_KEY = 'system_subscriptions';

function calculateMetrics(items: SubscriptionItem[]) {
  const activeItems = items.filter((i) => i.status === 'ATIVO');
  const totalMonthlyActiveBrl = activeItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const underEvalItems = items.filter((i) => i.status === 'EM_AVALIACAO');
  const totalUnderEvalBrl = underEvalItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const personalArmandoItems = activeItems.filter((i) => i.payerAccount === 'PESSOAL_ARMANDO');
  const totalPersonalArmandoBrl = personalArmandoItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const companyPjItems = activeItems.filter((i) => i.payerAccount === 'CONTA_PJ_AVA');
  const totalCompanyPjBrl = companyPjItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const criticalCount = activeItems.filter((i) => i.criticality === 'CRITICA').length;

  return {
    totalMonthlyActiveBrl,
    totalMonthlyWithUnderEvalBrl: totalMonthlyActiveBrl + totalUnderEvalBrl,
    totalPersonalArmandoBrl,
    totalCompanyPjBrl,
    totalActiveCount: activeItems.length,
    totalServicesCount: items.length,
    criticalCount,
    personalArmandoCount: personalArmandoItems.length,
    underEvalCount: underEvalItems.length,
  };
}

export async function GET() {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { config_key: CONFIG_KEY },
    });

    let items: SubscriptionItem[] = INITIAL_SUBSCRIPTIONS;

    if (setting?.config_value && Array.isArray(setting.config_value)) {
      items = setting.config_value as unknown as SubscriptionItem[];
    }

    const metrics = calculateMetrics(items);

    return NextResponse.json({
      success: true,
      items,
      metrics,
    });
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    // Em caso de fallback se DB estiver indisponível, devolve o catálogo inicial
    const metrics = calculateMetrics(INITIAL_SUBSCRIPTIONS);
    return NextResponse.json({
      success: true,
      items: INITIAL_SUBSCRIPTIONS,
      metrics,
      fallback: true,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, item, items: updatedItems, proposal } = body;

    // Ação 1: Salvar lista completa atualizada
    if (action === 'SAVE_ALL' && Array.isArray(updatedItems)) {
      await prisma.siteSettings.upsert({
        where: { config_key: CONFIG_KEY },
        update: {
          config_value: updatedItems as any,
          updated_at: new Date(),
        },
        create: {
          config_key: CONFIG_KEY,
          config_value: updatedItems as any,
        },
      });

      const metrics = calculateMetrics(updatedItems);
      return NextResponse.json({
        success: true,
        message: 'Catálogo de assinaturas atualizado com sucesso.',
        metrics,
      });
    }

    // Ação 2: Submeter proposta de nova assinatura para a Urna da Diretoria (Votação 4/4)
    if (action === 'PROPOSE_TO_URNA') {
      // Registra a proposta formal na configuração de propostas
      const urnaKey = 'urna_subscription_proposals';
      const existing = await prisma.siteSettings.findUnique({
        where: { config_key: urnaKey },
      });

      const proposals = Array.isArray(existing?.config_value) ? existing.config_value : [];
      const newProposal = {
        id: `prop_${Date.now()}`,
        serviceName: proposal.serviceName,
        category: proposal.category,
        monthlyCostBrl: proposal.monthlyCostBrl,
        justification: proposal.justification,
        proposer: proposal.proposer || 'Flávio (Financeiro)',
        proposed_at: new Date().toISOString(),
        status: 'PENDENTE_VOTACAO',
        votesRequired: 4,
        votesApproved: 1, // Proponente aprova de largada
        voters: [
          { name: proposal.proposer || 'Flávio', vote: 'APROVADO' },
          { name: 'Armando', vote: 'PENDENTE' },
          { name: 'Tripoint', vote: 'PENDENTE' },
          { name: 'Gustavo', vote: 'PENDENTE' },
        ],
      };

      await prisma.siteSettings.upsert({
        where: { config_key: urnaKey },
        update: {
          config_value: [...proposals, newProposal] as any,
          updated_at: new Date(),
        },
        create: {
          config_key: urnaKey,
          config_value: [newProposal] as any,
        },
      });

      return NextResponse.json({
        success: true,
        message: `🗳️ Proposta de contratação de "${proposal.serviceName}" enviada para a Urna da Diretoria! Cobrança de votação 4/4 disparada aos sócios.`,
        proposal: newProposal,
      });
    }

    return NextResponse.json({ success: false, error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (error) {
    console.error('Erro ao processar assinatura:', error);
    return NextResponse.json({ success: false, error: 'Erro interno ao processar assinatura.' }, { status: 500 });
  }
}
