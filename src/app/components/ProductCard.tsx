"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
  onInspect?: () => void;
  onStopInspect?: () => void;
  isInspected?: boolean;
  isMilky?: boolean;
}

export default function ProductCard({
  product,
  images,
  onInspect,
  onStopInspect,
  isInspected,
  isMilky,
}: ProductCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisibleInViewport, setIsVisibleInViewport] = useState(false);
  const cardRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Quando o card atinge 50% ou mais de visibilidade no celular/viewport
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setIsVisibleInViewport(true);
          } else {
            setIsVisibleInViewport(false);
          }
        });
      },
      {
        threshold: 0.5, // >50% de visibilidade
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const imageList = images && images.length > 0
    ? images.map((img) => img.image_url)
    : ["/imagens/COLECAO/01.jpg"];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInspect?.();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInspect?.();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    onInspect?.();
    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    setCurrentIndex(0); // Retorna automaticamente para a 1ª imagem (capa da frente)
    onStopInspect?.();
  };

  const isLookbook = Number(product.price) === 0;

  const currentImgUrl = imageList[currentIndex] || imageList[0];

  const cardClassName = `${styles.card} ${isInspected ? styles.activeBorder : ""} ${
    isMilky ? styles.milkyGlass : ""
  } ${isVisibleInViewport ? styles.inViewport : ""}`;

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
      <div ref={cardRef} className={cardClassName} onMouseLeave={handleMouseLeave}>
        {carouselContent}
      </div>
    );
  }

  return (
    <Link 
      ref={cardRef}
      href={`/produtos/${product.slug}`}
      onMouseLeave={handleMouseLeave}
      className={cardClassName}
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
