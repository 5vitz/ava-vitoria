import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const credentials = await prisma.guestAccessCredential.findMany({
      where: { active: true },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ credentials });
  } catch (error) {
    console.error("Erro ao consultar credenciais de convidados:", error);
    return NextResponse.json({ credentials: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const guestName = (body.guestName || "Contador (Contabilidade)").trim();
    const accessCode = (body.accessCode || "AVA-N2-CONTADOR-2026").trim();
    const accessLevel = Number(body.accessLevel) === 1 ? 1 : 2;
    const pautaId = body.pautaId || null;

    const createdBy =
      ((session?.user as any)?.username || session?.user?.name || "armando")
        .toString()
        .toLowerCase();

    const credential = await prisma.guestAccessCredential.upsert({
      where: { access_code: accessCode },
      update: {
        guest_name: guestName,
        access_level: accessLevel,
        active: true,
        created_by: createdBy,
      },
      create: {
        guest_name: guestName,
        access_code: accessCode,
        access_level: accessLevel,
        active: true,
        created_by: createdBy,
      },
    });

    if (accessLevel === 2 && pautaId) {
      await prisma.boardChatMessage.create({
        data: {
          pauta_id: pautaId,
          author_username: "porteiro_ia",
          author_name: "🤖 Agente Porteiro do Conselho (Arauto Societário)",
          subject: `Credenciamento Convidado Nível 2 · ${guestName}`,
          content: `🔑 Acesso Convidado Nível 2 Liberado: ${guestName} recebeu credencial Nível 2 (${accessCode}), entrou na barra de Conectados e já está disponível no seletor "ANEXAR / ENVIAR PARA" e na Sala de Vídeo.`,
          recipients: ["TODOS"],
          copy_sender: true,
          is_system_porteiro: true,
        },
      });
    }

    return NextResponse.json({ credential });
  } catch (error) {
    console.error("Erro ao emitir senha de convidado:", error);
    return NextResponse.json(
      { error: "Erro ao ativar senha de convidado." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.guestAccessCredential.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao revogar credencial de convidado:", error);
    return NextResponse.json(
      { error: "Erro ao revogar credencial" },
      { status: 500 }
    );
  }
}
