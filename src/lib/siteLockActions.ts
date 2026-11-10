"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface SiteLockConfig {
  isLocked: boolean;
  password: string;
}

const DEFAULT_LOCK_CONFIG: SiteLockConfig = {
  isLocked: true,
  password: "avanovaera!",
};

export async function getSiteLockConfig(): Promise<SiteLockConfig> {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { config_key: "site_lock" },
    });
    if (setting && setting.config_value) {
      const val = setting.config_value as Partial<SiteLockConfig>;
      return {
        isLocked: Boolean(val.isLocked),
        password: val.password || DEFAULT_LOCK_CONFIG.password,
      };
    }
  } catch (error) {
    console.error("Erro ao ler site_lock:", error);
  }
  return DEFAULT_LOCK_CONFIG;
}

export async function updateSiteLockConfig(isLocked: boolean, password: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Não autorizado.");
  }

  const cleanPassword = password.trim() || DEFAULT_LOCK_CONFIG.password;

  const newConfig: SiteLockConfig = {
    isLocked,
    password: cleanPassword,
  };

  await prisma.siteSettings.upsert({
    where: { config_key: "site_lock" },
    update: { config_value: newConfig as any },
    create: {
      config_key: "site_lock",
      config_value: newConfig as any,
    },
  });

  // Se o admin acabou de trancar o site, limpa o cookie no navegador dele para que ele possa ver/testar se quiser
  if (isLocked) {
    const cookieStore = await cookies();
    cookieStore.delete("ava_site_unlocked");
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/design-system");

  return { success: true, config: newConfig };
}

export async function verifySiteLockPassword(inputPassword: string) {
  const config = await getSiteLockConfig();

  if (inputPassword === config.password) {
    const cookieStore = await cookies();
    cookieStore.set("ava_site_unlocked", config.password, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      sameSite: "lax",
    });
    return { success: true };
  }

  return { success: false, error: "Senha incorreta." };
}
