import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import GridManagerClient from "./GridManagerClient";
import { getMediaAssets } from "./actions";
import Link from "next/link";
import styles from "./grid-manager.module.css";
import LogoutButton from "../design-system/LogoutButton";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GridManagerPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const collectionId = resolvedSearchParams.collection as string;
  const selectingForProduct = (resolvedSearchParams.selectingForProduct as string) || "";

  // Se não houver coleção selecionada, redireciona para a Página de Projetos
  if (!collectionId) {
    redirect("/admin");
  }

  // Buscar a Coleção atual para confirmar existência e obter nome
  const currentCollection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });

  if (!currentCollection) {
    redirect("/admin");
  }

  // 1. Buscar produtos desta coleção ordenados por display_order com suas imagens e variantes de estoque
  const rawProducts = await prisma.product.findMany({
    where: {
      collection_id: collectionId,
    },
    orderBy: {
      display_order: "asc",
    },
    include: {
      images: {
        orderBy: {
          display_order: "asc",
        },
      },
      variants: true,
    },
  });

  // 2. Buscar todas as coleções para possibilitar troca rápida
  const rawCollections = await prisma.collection.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  // Serialização cirúrgica para evitar quebras do Next.js (Decimal/Date -> Plain Objects)
  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price), // Decimal -> number
    is_active: p.is_active,
    display_order: p.display_order,
    size_chart: p.size_chart, // JSON
    collection_id: p.collection_id,
    images: p.images.map((img) => ({
      id: img.id,
      image_url: img.image_url,
      display_order: img.display_order,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      quantity: v.quantity,
    })),
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
          <span className={styles.adminBadge}>
            Grid: {currentCollection.name} ({currentCollection.year} - {currentCollection.season})
          </span>
        </div>
        <nav className={styles.adminNav}>
          <Link href="/admin" className={styles.navLink}>
            ➔ Projetos
          </Link>
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
        <GridManagerClient 
          initialProducts={products} 
          collectionsList={collections}
          currentCollection={currentCollection}
          initialSelectingForProduct={selectingForProduct}
        />
      </main>
    </div>
  );
}
