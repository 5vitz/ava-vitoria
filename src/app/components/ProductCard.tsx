"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";

interface ProductQuadCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
  };
  frontImage: string;
  frontZoomImage: string;
  backImage: string;
  backZoomImage: string;
}

export default function ProductCard({
  product,
  frontImage,
  frontZoomImage,
  backImage,
  backZoomImage,
}: ProductQuadCardProps) {
  const router = useRouter();

  const handleSingleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    router.push(`/produtos/${product.slug}`);
  };

  const isLookbook = Number(product.price) === 0;

  const quadImages = [
    { id: "front", src: frontImage, alt: `${product.name} Frente` },
    { id: "front-zoom", src: frontZoomImage, alt: `${product.name} Detalhe Frente` },
    { id: "back", src: backImage, alt: `${product.name} Costas` },
    { id: "back-zoom", src: backZoomImage, alt: `${product.name} Detalhe Costas` },
  ];

  const imagesContent = (
    <div className={styles.quadGrid}>
      {quadImages.map((img) => (
        <div key={img.id} className={styles.imageContainer}>
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={styles.image}
            priority
          />
        </div>
      ))}
    </div>
  );

  if (isLookbook) {
    return (
      <div className={styles.quadCard}>
        {imagesContent}
      </div>
    );
  }

  return (
    <Link 
      href={`/produtos/${product.slug}`}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={styles.quadCard}
    >
      {imagesContent}

      {/* Informações do Produto (Nome e Preço centralizados abaixo dos 4 cards) */}
      <div className={styles.quadInfo}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>
          R$ {Number(product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
