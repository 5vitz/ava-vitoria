"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
  };
  primaryImage: string;
  hoverImage?: string;
}

export default function ProductCard({
  product,
  primaryImage,
  hoverImage,
}: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleSingleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    router.push(`/produtos/${product.slug}`);
  };

  const isLookbook = Number(product.price) === 0;
  const hasHover = hoverImage && hoverImage !== primaryImage;

  const imageContent = (
    <div 
      className={styles.imageContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem Principal do Card */}
      <Image
        src={primaryImage}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={`${styles.image} ${hasHover && isHovered ? styles.imageHidden : ""}`}
        priority
      />

      {/* Imagem Secundária no Hover (se configurada) */}
      {hasHover && (
        <Image
          src={hoverImage}
          alt={`${product.name} Zoom`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`${styles.image} ${styles.hoverImage} ${isHovered ? styles.imageVisible : ""}`}
        />
      )}
    </div>
  );

  if (isLookbook) {
    return (
      <div className={styles.card}>
        {imageContent}
      </div>
    );
  }

  return (
    <Link 
      href={`/produtos/${product.slug}`}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={styles.card}
    >
      {imageContent}

      {/* Informações do Produto (Nome e Preço em preto sobre o fundo claro) */}
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>
          R$ {Number(product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
