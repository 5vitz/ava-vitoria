import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// Limite de 90 segundos para considerar um usuário online
const ONLINE_THRESHOLD_MS = 90 * 1000;
// Limite de 15 minutos para reaproveitar a mesma sessão aberta
const SESSION_REUSE_THRESHOLD_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user) {
      const rawUsername = ((session.user as any).username || session.user.name || "").toLowerCase().trim();
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      const now = new Date();

      if (rawUsername) {
        // Buscar se existe sessão ativa nos últimos 15 minutos sem logout registrado
        const fifteenMinutesAgo = new Date(now.getTime() - SESSION_REUSE_THRESHOLD_MS);

        const openSession = await prisma.userSessionLog.findFirst({
          where: {
            username: rawUsername,
            logout_at: null,
            last_ping_at: { gte: fifteenMinutesAgo }
          },
          orderBy: { last_ping_at: "desc" }
        });

        if (openSession) {
          await prisma.userSessionLog.update({
            where: { id: openSession.id },
            data: { last_ping_at: now }
          });
        } else {
          // Nova sessão iniciada
          await prisma.userSessionLog.create({
            data: {
              username: rawUsername,
              login_at: now,
              last_ping_at: now,
              ip_address: ip
            }
          });
        }
      }
    }

    // Identificar todos os usuários ativos nos últimos 90 segundos
    const thresholdDate = new Date(Date.now() - ONLINE_THRESHOLD_MS);
    const activeLogs = await prisma.userSessionLog.findMany({
      where: {
        last_ping_at: { gte: thresholdDate },
        logout_at: null
      },
      select: { username: true }
    });

    const onlineSet = new Set(activeLogs.map((l) => l.username.toLowerCase()));

    return NextResponse.json({
      onlineUsers: Array.from(onlineSet),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro no ping de presença:", error);
    return NextResponse.json(
      { error: "Erro interno no serviço de presença" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const thresholdDate = new Date(Date.now() - ONLINE_THRESHOLD_MS);
    const activeLogs = await prisma.userSessionLog.findMany({
      where: {
        last_ping_at: { gte: thresholdDate },
        logout_at: null
      },
      select: { username: true }
    });

    const onlineSet = new Set(activeLogs.map((l) => l.username.toLowerCase()));

    return NextResponse.json({
      onlineUsers: Array.from(onlineSet),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao consultar status de presença:", error);
    return NextResponse.json({ onlineUsers: [] }, { status: 500 });
  }
}
