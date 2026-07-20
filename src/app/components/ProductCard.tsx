"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";

interface ProductPairCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
  };
  frontImage: string;
  frontHoverImage?: string;
  backImage: string;
  backHoverImage?: string;
}

export default function ProductCard({
  product,
  frontImage,
  frontHoverImage,
  backImage,
  backHoverImage,
}: ProductPairCardProps) {
  const router = useRouter();
  const [isHoveredFront, setIsHoveredFront] = useState(false);
  const [isHoveredBack, setIsHoveredBack] = useState(false);

  const handleSingleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    router.push(`/produtos/${product.slug}`);
  };

  const isLookbook = Number(product.price) === 0;

  const hasFrontHover = !!(frontHoverImage && frontHoverImage !== frontImage);
  const hasBackHover = !!(backHoverImage && backHoverImage !== backImage);

  const imagesContent = (
    <div className={styles.imagesRow}>
      {/* Card 1: Visão da Frente */}
      <div 
        className={styles.imageContainer}
        onMouseEnter={() => setIsHoveredFront(true)}
        onMouseLeave={() => setIsHoveredFront(false)}
      >
        <Image
          src={frontImage}
          alt={`${product.name} Frente`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className={`${styles.image} ${hasFrontHover && isHoveredFront ? styles.imageHidden : ""}`}
          priority
        />
        {hasFrontHover && (
          <Image
            src={frontHoverImage!}
            alt={`${product.name} Frente Zoom`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className={`${styles.image} ${styles.hoverImage} ${isHoveredFront ? styles.imageVisible : ""}`}
          />
        )}
      </div>

      {/* Card 2: Visão das Costas */}
      <div 
        className={styles.imageContainer}
        onMouseEnter={() => setIsHoveredBack(true)}
        onMouseLeave={() => setIsHoveredBack(false)}
      >
        <Image
          src={backImage}
          alt={`${product.name} Costas`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className={`${styles.image} ${hasBackHover && isHoveredBack ? styles.imageHidden : ""}`}
          priority
        />
        {hasBackHover && (
          <Image
            src={backHoverImage!}
            alt={`${product.name} Costas Zoom`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className={`${styles.image} ${styles.hoverImage} ${isHoveredBack ? styles.imageVisible : ""}`}
          />
        )}
      </div>
    </div>
  );

  if (isLookbook) {
    return (
      <div className={styles.pairCard}>
        {imagesContent}
      </div>
    );
  }

  return (
    <Link 
      href={`/produtos/${product.slug}`}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      className={styles.pairCard}
    >
      {imagesContent}

      {/* Informações do Produto (Nome e Preço centralizados abaixo do par de cards) */}
      <div className={styles.pairInfo}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>
          R$ {Number(product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
