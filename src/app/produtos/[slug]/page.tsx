import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductDetailsClient, { ScrollToTopButton } from "./ProductDetailsClient";
import styles from "./product-details.module.css";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Buscar o produto com suas imagens e variantes de estoque no PostgreSQL
  const product = await prisma.product.findUnique({
    where: {
      slug,
      is_active: true,
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

  if (!product) {
    notFound();
  }

  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    size_chart: product.size_chart,
    images: product.images.map((img) => ({
      image_url: img.image_url,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      quantity: v.quantity,
    })),
  };

  const images = product.images.length > 0
    ? product.images.map((img) => img.image_url)
    : ["/imagens/COLECAO/01.jpg"];

  const firstImage = images[0];
  const remainingImages = images.slice(1);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Linha 1: 2 colunas divididas igualmente (50% / 50%) */}
        <div className={styles.rowGrid}>
          <div className={styles.imageCard}>
            <Image
              src={firstImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.productImage}
              priority
            />
          </div>
          <ProductDetailsClient product={serializedProduct} />
        </div>

        {/* Linhas seguintes: Imagens adicionais lado a lado (2 por linha) */}
        {remainingImages.length > 0 && (
          <div className={styles.imagesGrid}>
            {remainingImages.map((imageUrl, idx) => (
              <div key={idx} className={styles.imageCard}>
                <Image
                  src={imageUrl}
                  alt={`${product.name} - foto ${idx + 2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.productImage}
                />
              </div>
            ))}
          </div>
        )}

        {/* Botão Voltar ao Topo */}
        <ScrollToTopButton />
      </div>
    </div>
  );
}
