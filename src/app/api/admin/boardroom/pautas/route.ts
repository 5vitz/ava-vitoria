import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

const DEFAULT_PAUTAS = [
  {
    title: "Pauta #03 · Custos Fixos (~R$ 489,91/mês) & Magnific AI",
    created_by: "flavio",
    status: "EM_REVISAO",
  },
  {
    title: "Pauta #02 · Documentação Fiscal Bling & MEI (REG-011)",
    created_by: "flavio",
    status: "EM_DEBATE",
  },
  {
    title: "Pauta #01 · Estratégia Eu Tenho Cupom (1AVA a 5AVA)",
    created_by: "tripoint",
    status: "HOMOLOGADA",
  },
];

async function ensureDefaultPautas() {
  const count = await prisma.boardPauta.count();
  if (count === 0) {
    for (const p of DEFAULT_PAUTAS) {
      const created = await prisma.boardPauta.create({
        data: p,
      });

      if (p.title.startsWith("Pauta #03")) {
        await prisma.boardChatMessage.create({
          data: {
            pauta_id: created.id,
            author_username: "flavio",
            author_name: "Flávio (01 · Jurídico & 02 · Financeiro)",
            subject: "Minuta de Enquadramento MEI + IE Ativa para Emissão NF-e Bling",
            content:
              "Pessoal, anexei a certidão da Inscrição Estadual ativa do MEI e o checklist fiscal da trava REG-011. Como é apenas informativo para o cadastro na Dimona B2B, não precisamos abrir reunião agora, mas qualquer dúvida me chamem aqui!",
            recipients: ["TODOS"],
            copy_sender: true,
            attachment_name: "Certidao_IE_SEFAZ_ES_e_Checklist_Bling.pdf",
            attachment_size: 1420000,
            attachment_mime: "application/pdf",
            is_system_porteiro: false,
          },
        });

        await prisma.boardChatMessage.create({
          data: {
            pauta_id: created.id,
            author_username: "porteiro_ia",
            author_name: "🤖 Agente Porteiro do Conselho (Arauto Societário)",
            subject: "Minuta de Enquadramento MEI + IE Ativa para Emissão NF-e Bling",
            content:
              '✅ Aviso de Anexo Disparado: Notifiquei Armando, Tripoint e Gustavo (mais cópia para Flávio) via WhatsApp/E-mail com o Assunto: "Minuta de Enquadramento MEI + IE Ativa para Emissão NF-e Bling".',
            recipients: ["TODOS"],
            copy_sender: true,
            is_system_porteiro: true,
          },
        });
      }
    }
  }
}

export async function GET() {
  try {
    await ensureDefaultPautas();

    const pautas = await prisma.boardPauta.findMany({
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({ pautas });
  } catch (error) {
    console.error("Erro ao listar pautas da Sala de Reuniões:", error);
    return NextResponse.json(
      { error: "Erro ao carregar pautas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const title = (body.title || "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "É obrigatório informar o Nome da Pauta antes de iniciar." },
        { status: 400 }
      );
    }

    const authorUsername =
      ((session?.user as any)?.username || session?.user?.name || body.createdBy || "armando")
        .toString()
        .toLowerCase();
    const authorDisplay = session?.user?.name || body.authorName || "Armando";

    const pauta = await prisma.boardPauta.create({
      data: {
        title,
        created_by: authorUsername,
        status: "EM_DEBATE",
      },
    });

    // O Agente Porteiro registra automaticamente o protocolo de abertura da pauta
    await prisma.boardChatMessage.create({
      data: {
        pauta_id: pauta.id,
        author_username: "porteiro_ia",
        author_name: "🤖 Agente Porteiro do Conselho (Arauto Societário)",
        subject: title,
        content: `🏛️ Nova Pauta Gravada & Reunião Convocada: "${title}" foi adicionada à lista de Pautas da Diretoria por ${authorDisplay}. Sala liberada para anexos, mensagens e vídeo.`,
        recipients: ["TODOS"],
        copy_sender: true,
        is_system_porteiro: true,
      },
    });

    return NextResponse.json({ pauta });
  } catch (error) {
    console.error("Erro ao criar nova pauta:", error);
    return NextResponse.json(
      { error: "Erro ao gravar nova pauta" },
      { status: 500 }
    );
  }
}
