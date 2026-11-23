import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pautaId = searchParams.get("pautaId");

    if (!pautaId) {
      return NextResponse.json(
        { error: "pautaId é obrigatório" },
        { status: 400 }
      );
    }

    const messages = await prisma.boardChatMessage.findMany({
      where: { pauta_id: pautaId },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Erro ao listar mensagens da Sala de Reuniões:", error);
    return NextResponse.json(
      { error: "Erro ao carregar mensagens" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const pautaId = (body.pautaId || "").trim();
    const subject = (body.subject || "").trim();
    const content = (body.content || "").trim();
    const recipients: string[] = Array.isArray(body.recipients) && body.recipients.length > 0
      ? body.recipients
      : ["TODOS"];
    const copySender = body.copySender !== false;

    const attachmentName = body.attachmentName || null;
    const attachmentUrl = body.attachmentUrl || null;
    const attachmentSize = typeof body.attachmentSize === "number" ? body.attachmentSize : null;
    const attachmentMime = body.attachmentMime || null;

    if (!pautaId || !subject) {
      return NextResponse.json(
        { error: "Pauta e Assunto são obrigatórios." },
        { status: 400 }
      );
    }

    if (!content && !attachmentName) {
      return NextResponse.json(
        { error: "Informe uma mensagem ou anexe um documento." },
        { status: 400 }
      );
    }

    const authorUsername =
      ((session?.user as any)?.username || session?.user?.name || body.authorUsername || "armando")
        .toString()
        .toLowerCase();
    const authorName =
      body.authorName || session?.user?.name || "Armando (03 · Arquitetura & 04 · Produção)";

    const userMessage = await prisma.boardChatMessage.create({
      data: {
        pauta_id: pautaId,
        author_username: authorUsername,
        author_name: authorName,
        subject,
        content: content || null,
        recipients,
        copy_sender: copySender,
        attachment_name: attachmentName,
        attachment_url: attachmentUrl,
        attachment_size: attachmentSize,
        attachment_mime: attachmentMime,
        is_system_porteiro: false,
      },
    });

    // Agente Porteiro do Conselho (Arauto Societário) registra protocolo imediato
    const destLabel = recipients.includes("TODOS")
      ? "TODOS os Sócios"
      : recipients.join(", ");
    const senderShort = authorName.split(" ")[0];
    const copyNote = copySender ? ` + [Cópia para ${senderShort}]` : "";
    const fileNotice = attachmentName
      ? `o documento "${attachmentName}"`
      : "uma mensagem";

    const porteiroMessage = await prisma.boardChatMessage.create({
      data: {
        pauta_id: pautaId,
        author_username: "porteiro_ia",
        author_name: "🤖 Agente Porteiro do Conselho (Arauto Societário)",
        subject,
        content: `✅ Agente Porteiro notificou [${destLabel}]${copyNote}: Enviado alerta via WhatsApp/E-mail sobre ${fileNotice} com Assunto: "${subject}".`,
        recipients,
        copy_sender: copySender,
        is_system_porteiro: true,
      },
    });

    return NextResponse.json({
      message: userMessage,
      porteiroMessage,
    });
  } catch (error) {
    console.error("Erro ao gravar mensagem na Sala de Reuniões:", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}
