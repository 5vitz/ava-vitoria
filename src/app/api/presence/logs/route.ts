import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PARTNERS_CONFIG = [
  { username: "flavio", name: "Flávio", role: "01 · Jurídico & 02 · Financeiro" },
  { username: "armando", name: "Armando (Genera)", role: "03 · Engenharia & 04 · Produção" },
  { username: "gustavo", name: "Gustavo", role: "05 · Atendimento & 06 · Vendas" },
  { username: "tripoint", name: "Tripoint", role: "07 · Marketing & 08 · Atelier" },
];

const ONLINE_THRESHOLD_MS = 90 * 1000;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
}

function formatDuration(start: Date, end: Date): string {
  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}min`;
  return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
}

export async function GET() {
  try {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - ONLINE_THRESHOLD_MS);

    // Início do dia de hoje (00:00:00 no fuso de Brasília)
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Buscar todos os logs de hoje
    const todayLogs = await prisma.userSessionLog.findMany({
      where: {
        login_at: { gte: todayStart }
      },
      orderBy: { login_at: "asc" }
    });

    // Buscar as últimas 25 sessões gerais para a trilha de auditoria
    const recentLogs = await prisma.userSessionLog.findMany({
      take: 25,
      orderBy: { login_at: "desc" }
    });

    // Identificar quem está online agora
    const activeLogs = await prisma.userSessionLog.findMany({
      where: {
        last_ping_at: { gte: thresholdDate },
        logout_at: null
      },
      select: { username: true }
    });
    const onlineSet = new Set(activeLogs.map((l) => l.username.toLowerCase()));

    // Compilar resumo do dia para cada um dos 4 sócios
    const dailyReport = PARTNERS_CONFIG.map((partner) => {
      const isOnline = onlineSet.has(partner.username) || (partner.username === "armando" && onlineSet.has("admin"));
      const pLogs = todayLogs.filter(
        (l) => l.username.toLowerCase() === partner.username || (partner.username === "armando" && l.username.toLowerCase() === "admin")
      );

      if (pLogs.length === 0) {
        return {
          username: partner.username,
          name: partner.name,
          role: partner.role,
          isOnline,
          enteredToday: false,
          firstEntry: null,
          lastExit: null,
          totalDuration: null,
          statusText: "Não entrou hoje",
          sessionCount: 0
        };
      }

      const firstSession = pLogs[0];
      const lastSession = pLogs[pLogs.length - 1];

      const firstEntryTime = formatTime(new Date(firstSession.login_at));
      let lastExitText = "";

      if (isOnline) {
        lastExitText = "Conectado agora";
      } else {
        const exitDate = lastSession.logout_at ? new Date(lastSession.logout_at) : new Date(lastSession.last_ping_at);
        lastExitText = `Saiu às ${formatTime(exitDate)}`;
      }

      // Calcular tempo total somado de todas as sessões de hoje
      let totalMinutes = 0;
      for (const s of pLogs) {
        const start = new Date(s.login_at).getTime();
        const end = s.logout_at ? new Date(s.logout_at).getTime() : new Date(s.last_ping_at).getTime();
        totalMinutes += Math.max(1, Math.floor((end - start) / 60000));
      }
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      const durationStr = h > 0 ? `${h}h ${m.toString().padStart(2, "0")}min` : `${m}min`;

      return {
        username: partner.username,
        name: partner.name,
        role: partner.role,
        isOnline,
        enteredToday: true,
        firstEntry: `Entrou às ${firstEntryTime}`,
        lastExit: lastExitText,
        totalDuration: durationStr,
        statusText: isOnline ? `Conectado agora (desde às ${firstEntryTime})` : `Entrou às ${firstEntryTime} · ${lastExitText}`,
        sessionCount: pLogs.length
      };
    });

    // Formatar as sessões recentes para a tabela do Sentinela
    const formattedRecentLogs = recentLogs.map((log) => {
      const isCurrentlyOnline =
        !log.logout_at && new Date(log.last_ping_at).getTime() >= thresholdDate.getTime();
      const loginDate = new Date(log.login_at);
      const endDate = log.logout_at ? new Date(log.logout_at) : new Date(log.last_ping_at);

      return {
        id: log.id,
        username: log.username,
        dateFormatted: formatDate(loginDate),
        entryTime: formatTime(loginDate),
        exitTime: isCurrentlyOnline ? "Conectado agora" : formatTime(endDate),
        duration: formatDuration(loginDate, endDate),
        isOnline: isCurrentlyOnline,
        ip: log.ip_address || "127.0.0.1"
      };
    });

    return NextResponse.json({
      dailyReport,
      recentLogs: formattedRecentLogs,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao gerar relatório do Sentinela:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar relatório de presença" },
      { status: 500 }
    );
  }
}
