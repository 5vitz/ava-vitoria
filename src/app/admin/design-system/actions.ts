"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveDesignSystem(config: {
  colors: {
    bg: string;
    accent: string;
    text_primary: string;
    text_secondary: string;
    border: string;
  };
  fonts: {
    title_family: string;
    body_family: string;
    title_weight: string;
    body_weight: string;
  };
  effects: {
    border_width: string;
    backdrop_blur: string;
  };
}) {
  // 1. Validar se o usuário está autenticado
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar logado.");
  }

  // 2. Salvar as configurações no banco de dados PostgreSQL
  await prisma.siteSettings.upsert({
    where: {
      config_key: "design_system",
    },
    update: {
      config_value: config as any,
      updated_at: new Date(),
    },
    create: {
      config_key: "design_system",
      config_value: config as any,
    },
  });

  // 3. Revalidar rotas afetadas para que as novas cores apareçam imediatamente
  revalidatePath("/");
  revalidatePath("/admin/design-system");

  return { success: true };
}
