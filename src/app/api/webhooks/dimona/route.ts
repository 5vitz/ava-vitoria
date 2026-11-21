import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('⚡ Webhook Dimona recebido em tempo real:', JSON.stringify(payload));

    const orderId = payload.dimona_id || payload.order_id || payload.id;
    const newStatus = payload.status || payload.status_name;
    const trackingUrl = payload.tracking_url;
    const trackingCode = payload.tracking_code;

    // 1. Se for o pedido oficial de amostras #755-460-927
    if (orderId && (orderId.includes('755-460-927') || orderId === '755-460-927' || orderId === '755460927')) {
      const setting = await prisma.siteSettings.findUnique({
        where: { config_key: 'dimona_samples_755460927' },
      });

      if (setting && setting.config_value) {
        const currentData = setting.config_value as any;
        const currentSamples = currentData.samples || [];

        const updatedSamples = currentSamples.map((s: any) => ({
          ...s,
          status: newStatus || s.status,
        }));

        await prisma.siteSettings.update({
          where: { config_key: 'dimona_samples_755460927' },
          data: {
            config_value: {
              ...currentData,
              samples: updatedSamples,
              dimonaOrder: {
                ...(currentData.dimonaOrder || {}),
                status: newStatus || currentData.dimonaOrder?.status,
                tracking_url: trackingUrl || currentData.dimonaOrder?.tracking_url,
                tracking_code: trackingCode || currentData.dimonaOrder?.tracking_code,
              },
              lastWebhookAt: new Date().toISOString(),
            },
          },
        });
      }
    }

    // 2. Registra o evento de log histórico no PostgreSQL
    try {
      const logKey = `dimona_webhook_log_${Date.now()}`;
      await prisma.siteSettings.create({
        data: {
          config_key: logKey,
          config_value: {
            received_at: new Date().toISOString(),
            payload,
          },
        },
      });
    } catch (logErr) {
      console.warn('Erro ao salvar log histórico do webhook:', logErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook da Dimona processado com sucesso!',
      orderId,
      status: newStatus,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao processar Webhook Dimona:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: 'Webhook Oficial Dimona Dropsimples — AVA Sem Limites',
    methods: ['POST'],
    timestamp: new Date().toISOString(),
  });
}
