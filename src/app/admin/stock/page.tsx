import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminHeader from "../AdminHeader";
import StockClient from "./StockClient";
import styles from "./stock.module.css";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StockPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  
  // 1. Resolver ID da coleção ativa
  let collectionId = resolvedSearchParams.collection as string;
  
  if (!collectionId) {
    const latestCol = await prisma.collection.findFirst({
      orderBy: { created_at: "desc" },
    });
    if (latestCol) {
      collectionId = latestCol.id;
    }
  }

  const currentCollection = collectionId
    ? await prisma.collection.findUnique({ where: { id: collectionId } })
    : null;

  if (!currentCollection) {
    redirect("/admin/atelier");
  }

  // 2. Buscar todos os produtos desta coleção com suas imagens e variantes de estoque
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

  // 3. Buscar todas as coleções para trocar de projeto na tela de estoque
  const rawCollections = await prisma.collection.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  // Serialização cirúrgica para evitar quebras do Next.js
  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
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

  const focusProduct = (resolvedSearchParams.focusProduct as string) || "";

  return (
    <div className={styles.adminContainer}>
      <AdminHeader />

      <main className={styles.adminMain}>
        <StockClient 
          initialProducts={products}
          collectionsList={collections}
          currentCollection={currentCollection}
          focusProductId={focusProduct}
        />
      </main>
    </div>
  );
}
