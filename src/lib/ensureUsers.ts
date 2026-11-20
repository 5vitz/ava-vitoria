import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const PARTNER_ACCOUNTS = [
  { username: "admin", displayName: "Administrador Geral", depto: "Diretoria" },
  { username: "armando", displayName: "Armando (Genera)", depto: "03 · Engenharia & 04 · Produção" },
  { username: "flavio", displayName: "Flávio", depto: "01 · Jurídico & 02 · Financeiro" },
  { username: "tripoint", displayName: "Tripoint", depto: "07 · Marketing & 08 · Atelier" },
  { username: "gustavo", displayName: "Gustavo", depto: "05 · Atendimento & 06 · Vendas" },
];

const DEFAULT_INITIAL_PASSWORD = "admin123";

let usersEnsured = false;

/**
 * Garante que as contas individuais dos sócios e o admin geral existam no banco de dados
 * com a senha inicial padrão, sem sobrescrever senhas que os sócios já tenham alterado.
 */
export async function ensurePartnerUsers() {
  if (usersEnsured) return;

  try {
    const existingUsers = await prisma.user.findMany({
      select: { username: true }
    });
    const existingSet = new Set(existingUsers.map(u => u.username.toLowerCase()));

    const defaultHash = await bcrypt.hash(DEFAULT_INITIAL_PASSWORD, 10);

    for (const partner of PARTNER_ACCOUNTS) {
      if (!existingSet.has(partner.username.toLowerCase())) {
        await prisma.user.create({
          data: {
            username: partner.username.toLowerCase(),
            password: defaultHash,
          }
        });
      }
    }

    usersEnsured = true;
  } catch (err) {
    console.error("Erro ao verificar/garantir usuários societários:", err);
  }
}

export function getPartnerDisplayName(username: string): string {
  const normalized = username.toLowerCase().trim();
  const found = PARTNER_ACCOUNTS.find(p => p.username === normalized);
  return found ? found.displayName : username;
}
