import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Sessão expirada ou não autenticado. Faça login novamente." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Informe a senha atual e a nova senha." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;
    const username = (session.user as any).username;

    // Localizar o usuário no PostgreSQL
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && username) {
      user = await prisma.user.findUnique({ where: { username } });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não localizado no banco de dados." },
        { status: 404 }
      );
    }

    // Validar a senha atual com bcrypt
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "A senha atual informada está incorreta." },
        { status: 400 }
      );
    }

    // Criptografar a nova senha e atualizar no PostgreSQL
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash }
    });

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso no banco de dados."
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao atualizar a senha." },
      { status: 500 }
    );
  }
}
