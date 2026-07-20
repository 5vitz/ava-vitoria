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
  images: Array<{
    image_url: string;
  }>;
}

export default function ProductCard({ product, images }: ProductCardProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = images && images.length > 0
    ? images.map((img) => img.image_url)
    : ["/imagens/COLECAO/01.jpg"];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleSingleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    router.push(`/produtos/${product.slug}`);
  };

  const handleMouseLeave = () => {
    setCurrentIndex(0); // Retorna automaticamente para a 1ª imagem (capa da frente)
  };

  const isLookbook = Number(product.price) === 0;

  const currentImgUrl = imageList[currentIndex] || imageList[0];

  const carouselContent = (
    <div className={styles.carouselContainer}>
      {/* Imagem Ativa do Carrossel */}
      <Image
        src={currentImgUrl}
        alt={`${product.name} - Imagem ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.image}
        priority={currentIndex === 0}
      />

      {/* Setas de Navegação Lateral (se houver mais de 1 imagem) */}
      {imageList.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={handlePrev}
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={handleNext}
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}

      {/* Indicadores em Bolinhas (Dots estilo Instagram) */}
      {imageList.length > 1 && (
        <div className={styles.dotsContainer}>
          {imageList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ""}`}
              onClick={(e) => handleDotClick(e, idx)}
              aria-label={`Ir para imagem ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (isLookbook) {
    return (
      <div className={styles.card} onMouseLeave={handleMouseLeave}>
        {carouselContent}
      </div>
    );
  }

  return (
    <Link 
      href={`/produtos/${product.slug}`}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onMouseLeave={handleMouseLeave}
      className={styles.card}
    >
      {carouselContent}

      {/* Informações Estáticas na parte inferior do Card */}
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>
          R$ {Number(product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
