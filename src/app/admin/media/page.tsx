import React from "react";
import { prisma } from "@/lib/db";
import { getMediaAssets } from "../grid-manager/actions";
import MediaLibraryClient from "./MediaLibraryClient";
import Link from "next/link";
import styles from "./media-library.module.css";
import LogoutButton from "../design-system/LogoutButton";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MediaLibraryPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const collectionId = (resolvedSearchParams.collection as string) || "Todos";
  const selectingForProduct = (resolvedSearchParams.selectingForProduct as string) || null;

  // 1. Buscar todas as mídias da coleção selecionada (ou todas)
  const rawMedia = await getMediaAssets(collectionId);

  // 2. Buscar todas as coleções para preencher o filtro e upload dropdowns
  const rawCollections = await prisma.collection.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  // 3. Buscar nome do produto alvo se estiver em modo de seleção
  let targetProductName: string | null = null;
  if (selectingForProduct) {
    const prod = await prisma.product.findUnique({
      where: { id: selectingForProduct },
      select: { name: true },
    });
    if (prod) {
      targetProductName = prod.name;
    }
  }

  // Serialização dos objetos Prisma (Decimal/Date -> Plain Objects)
  const mediaList = rawMedia.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    file_url: asset.file_url,
    mime_type: asset.mime_type,
    collection_id: asset.collection_id,
    created_at: asset.created_at.toISOString(),
  }));

  const collections = rawCollections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    year: c.year,
    season: c.season,
  }));

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.adminTitle}>AVA Vitória</h1>
          <span className={styles.adminBadge}>Biblioteca de Mídias</span>
        </div>
        <nav className={styles.adminNav}>
          <Link href="/admin" className={styles.navLink}>
            ➔ Projetos
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
        <MediaLibraryClient
          initialMedia={mediaList}
          collectionsList={collections}
          initialCollectionId={collectionId}
          selectingForProduct={selectingForProduct}
          targetProductName={targetProductName}
        />
      </main>
    </div>
  );
}
