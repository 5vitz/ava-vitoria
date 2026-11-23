import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DEFAULT_SAMPLES = [
  { item: '01', product: 'Camiseta Oversized Street 20.1 (220g)', color: 'Preto', size: 'G', front: 'Arte Cubista', back: 'Selo AVA Branco 16cm', status: 'Pedido Enviado', unitCost: 116.46, totalCost: 116.46, gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '02', product: 'T-Shirt Prime 26.1 (180g Pele de Pêssego)', color: 'Branco', size: 'G', front: 'Arte Coruja', back: 'Selo AVA Preto 16cm', status: 'Pedido Enviado', unitCost: 90.54, totalCost: 90.54, gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '03', product: 'T-Shirt Estonada Vintage 30.1 (170g)', color: 'Cinza Chumbo', size: 'GG', front: 'Peito: Siga Fazendo o Bem', back: 'Pôster: Siga Fazendo o Bem', status: 'Pedido Enviado', unitCost: 92.46, totalCost: 92.46, gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '04', product: 'T-Shirt Quality 30.1 (165g)', color: 'Vinho', size: 'GG', front: 'Arte Cubista', back: 'Selo AVA Preto 16cm', status: 'Pedido Enviado', unitCost: 72.46, totalCost: 72.46, gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '05', product: 'Boné Prime Fivela de Metal Confort', color: 'Preto', size: 'Único', front: 'Selo AVA Branco Circular', back: 'Liso', status: 'Pedido Enviado', unitCost: 68.14, totalCost: 68.14, gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '06', product: 'Boné Americano / Trucker Snapback', color: 'Branco', size: 'Único', front: 'Sem Limites AVA Preto', back: 'Liso', status: 'Pedido Enviado', unitCost: 32.14, totalCost: 32.14, gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
];

export async function GET() {
  try {
    let dimonaLiveOrder: any = null;
    const apiKey = process.env.DIMONA_API_KEY;

    // 1. Consulta em tempo real na Dimona API se a chave estiver configurada
    if (apiKey) {
      try {
        const dimonaRes = await fetch('https://admin.camisadimona.com.br/api/v2/order/755-460-927', {
          method: 'GET',
          headers: {
            'api-key': apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (dimonaRes.ok) {
          dimonaLiveOrder = await dimonaRes.json();
        }
      } catch (apiErr) {
        console.warn('Não foi possível conectar à API Dimona neste instante:', apiErr);
      }
    }

    // 2. Busca histórico ou laudos persistidos no banco
    let setting = null;
    try {
      setting = await prisma.siteSettings.findUnique({
        where: { config_key: 'dimona_samples_755460927' },
      });
    } catch (dbErr) {
      console.warn('Banco local em repouso ou tabela site_settings indisponível:', dbErr);
    }

    let samples = DEFAULT_SAMPLES;
    if (setting && setting.config_value) {
      const parsed = setting.config_value as any;
      if (Array.isArray(parsed.samples)) {
        samples = parsed.samples;
      }
    }

    // 3. Atualiza status dos itens caso a Dimona tenha retornado novo status
    const currentStatus = dimonaLiveOrder?.status || 'Pedido Enviado';
    samples = samples.map(s => ({
      ...s,
      status: currentStatus,
    }));

    // 4. Salva persistência atualizada no banco
    if (setting) {
      try {
        await prisma.siteSettings.update({
          where: { config_key: 'dimona_samples_755460927' },
          data: {
            config_value: {
              samples,
              dimonaOrder: dimonaLiveOrder || (setting.config_value as any)?.dimonaOrder,
              lastSync: new Date().toISOString(),
            },
          },
        });
      } catch (updateErr) {
        console.warn('Erro ao atualizar site_settings:', updateErr);
      }
    } else {
      try {
        await prisma.siteSettings.create({
          data: {
            config_key: 'dimona_samples_755460927',
            config_value: {
              samples,
              dimonaOrder: dimonaLiveOrder,
              lastSync: new Date().toISOString(),
            },
          },
        });
      } catch (createErr) {
        console.warn('Erro ao criar site_settings:', createErr);
      }
    }

    return NextResponse.json({
      success: true,
      currentStatus,
      dimonaOrder: dimonaLiveOrder || {
        dimona_id: '755-460-927',
        status: 'Pedido Enviado',
        status_id: 26,
        shipping_method_name: 'J&T Express',
        tracking_url: 'http://status.ondeestameupedido.com/tracking/1168/755460927',
        estimated_delivery: '26/11/2026',
        shipped_at: '2026-11-23T17:24:00-03:00',
        nfe_number: '114273',
        nfe_link: 'https://erp.olist.com/doc.view?id=00058e6fe6e2a08458ab5e155887c864',
        total_value: 472.80,
      },
      samples,
      lastSync: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erro na rota de amostras Dimona:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      currentStatus: 'Aguardando Coleta',
      samples: DEFAULT_SAMPLES,
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { samples, notes } = body;

    const setting = await prisma.siteSettings.findUnique({
      where: { config_key: 'dimona_samples_755460927' },
    });

    const previousValue = setting?.config_value ? (setting.config_value as any) : {};
    const updatedValue = {
      ...previousValue,
      samples: samples || previousValue.samples || DEFAULT_SAMPLES,
      notes: notes !== undefined ? notes : previousValue.notes,
      updated_at: new Date().toISOString(),
    };

    if (setting) {
      await prisma.siteSettings.update({
        where: { config_key: 'dimona_samples_755460927' },
        data: { config_value: updatedValue },
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          config_key: 'dimona_samples_755460927',
          config_value: updatedValue,
        },
      });
    }

    return NextResponse.json({ success: true, updatedValue });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
