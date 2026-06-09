import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductDetailsClient from "./ProductDetailsClient";
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
    ...product,
    price: Number(product.price),
  };

  return (
    <div className={styles.container}>
      {/* Coluna da Esquerda: Fotos da peça empilhadas (Estilo Balenciaga) */}
      <div className={styles.mediaColumn}>
        {product.images.length > 0 ? (
          product.images.map((img) => (
            <div key={img.id} className={styles.imageWrapper}>
              <Image
                src={img.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className={styles.productImage}
                priority
              />
            </div>
          ))
        ) : (
          <div className={styles.imageWrapper}>
            <Image
              src="/imagens/COLECAO/01.jpg"
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className={styles.productImage}
              priority
            />
          </div>
        )}
      </div>

      {/* Coluna da Direita: Detalhes, Seletores e Compra (Client Component) */}
      <ProductDetailsClient product={serializedProduct} />
    </div>
  );
}
