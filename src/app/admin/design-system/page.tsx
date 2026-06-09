import React from "react";
import { prisma } from "@/lib/db";
import DesignSystemForm from "./DesignSystemForm";
import styles from "./design-system.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DesignSystemPage() {
  // Buscar configurações salvas do Design System no banco de dados
  const settings = await prisma.siteSettings.findUnique({
    where: {
      config_key: "design_system",
    },
  });

  // Configuração visual padrão (fallback caso o banco esteja vazio)
  const defaultSettings = {
    theme: "dark",
    colors: {
      bg: "#1F080F",
      accent: "#D4AF37",
      text_primary: "#FFFFFF",
      text_secondary: "#A0A0A0",
      border: "rgba(255, 255, 255, 0.1)",
    },
    fonts: {
      title_family: "Outfit",
      body_family: "Plus Jakarta Sans",
      title_weight: "700",
      body_weight: "300",
    },
    effects: {
      border_width: "1px",
      backdrop_blur: "12px",
    },
  };

  const initialData = settings
    ? (settings.config_value as typeof defaultSettings)
    : defaultSettings;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.adminTitle}>AVA Vitória</h1>
          <span className={styles.adminBadge}>Painel de Controle</span>
        </div>
        <nav className={styles.adminNav}>
          <Link href="/" className={styles.navLink} target="_blank">
            Ver Loja ↗
          </Link>
          <LogoutButton />
        </nav>
      </header>
      
      <main className={styles.adminMain}>
        <div className={styles.introCard}>
          <h2>Customização da Alma Dinâmica</h2>
          <p>
            Altere a identidade estética da vitrine em tempo real. As alterações feitas aqui afetam as variáveis CSS globais e importações do Google Fonts para todos os clientes.
          </p>
        </div>

        <DesignSystemForm initialData={initialData} />
      </main>
    </div>
  );
}

// Pequeno subcomponente cliente para lidar com o Logout sem precisar que o arquivo inteiro seja 'use client'
import LogoutButton from "./LogoutButton";
