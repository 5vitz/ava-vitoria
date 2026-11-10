import React from "react";
import { getCollections } from "./grid-manager/actions";
import DashboardClient from "./DashboardClient";
import Link from "next/link";
import LogoutButton from "./design-system/LogoutButton";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.searchQuery as string) || "";
  const selectingForProduct = (resolvedSearchParams.selectingForProduct as string) || "";

  // Buscar coleções filtradas com busca inteligente
  const collections = await getCollections(searchQuery);

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.adminTitle}>AVA Vitória</h1>
          <span className={styles.adminBadge}>Projetos & Coleções</span>
        </div>
        <nav className={styles.adminNav}>
          <Link href="/admin/media" className={styles.navLink}>
            Biblioteca Geral
          </Link>
          <Link href="/admin/design-system" className={styles.navLink}>
            Design System
          </Link>
          <Link href="/" className={styles.navLink} target="_blank">
            Ver Loja ↗
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className={styles.adminMain}>
        <DashboardClient
          initialCollections={collections}
          initialSearchQuery={searchQuery}
          selectingForProduct={selectingForProduct}
        />
      </main>
    </div>
  );
}
