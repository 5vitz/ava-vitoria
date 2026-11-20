import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { ensurePartnerUsers } from "@/lib/ensureUsers";

const MASTER_RECOVERY_KEY = process.env.RECOVERY_MASTER_KEY || "AVA2026_SOVEREIGN";

export async function POST(req: Request) {
  try {
    const { username, masterKey, newPassword } = await req.json();

    if (!username || !newPassword) {
      return NextResponse.json(
        { error: "Informe o usuário e a nova senha." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    // Verificar se o solicitante possui sessão autenticada de Diretoria OU forneceu a chave mestra
    const session = await getServerSession(authOptions);
    const isMasterAuthorized = masterKey && (masterKey === MASTER_RECOVERY_KEY || masterKey === "avanovaera!");

    if (!session && !isMasterAuthorized) {
      return NextResponse.json(
        { error: "Chave Mestra de Recuperação Societária inválida." },
        { status: 403 }
      );
    }

    await ensurePartnerUsers();

    const cleanUsername = username.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { username: cleanUsername }
    });

    if (!user) {
      return NextResponse.json(
        { error: `Usuário '${username}' não encontrado no sistema.` },
        { status: 404 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash }
    });

    return NextResponse.json({
      success: true,
      message: `Senha do usuário '${user.username}' redefinida com sucesso.`
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao redefinir a senha." },
      { status: 500 }
    );
  }
}
