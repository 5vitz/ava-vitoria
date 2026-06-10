"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: {
      image_url: string;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Registrar listener no document para resetar o estado hover no celular ao tocar fora
  React.useEffect(() => {
    if (!isHovered) return;

    const handleOutsideClick = () => {
      setIsHovered(false);
      setCurrentIndex(0);
    };

    const timer = setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isHovered]);

  const handleImageClick = (e: React.MouseEvent) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      // Se ainda não estiver em modo hover, ativa o modo hover e muda a imagem, impedindo a navegação imediata
      if (!isHovered) {
        e.preventDefault();
        e.stopPropagation();
        setIsHovered(true);
        if (images.length > 1) {
          setCurrentIndex(1);
        }
      }
      // Se já estiver em modo hover, o clique prossegue normalmente abrindo a página de detalhes
    }
  };

  const images = product.images.length > 0 
    ? product.images.map((img) => img.image_url) 
    : ["/imagens/COLECAO/01.jpg"]; // Fallback de imagem de coleção

  // Navegar para o próximo slide
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o clique no botão navegue para a PDP
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // Navegar para o slide anterior
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Lógica de Swipe Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    // Se o arraste de tela foi maior que 50 pixels
    if (Math.abs(diffX) > 50) {
      setIsHovered(true); // Exibe setas/indicadores ao interagir por swipe no celular
      if (diffX > 0) {
        // Swipe para a esquerda (próximo slide)
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe para a direita (slide anterior)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    
    touchStartX.current = null;
  };

  return (
    <div 
      className={`${styles.card} ${isHovered ? styles.cardHovered : ""}`}
      onMouseEnter={() => {
        setIsHovered(true);
        // Ao colocar o mouse, muda para a segunda foto se houver mais de uma
        if (images.length > 1 && currentIndex === 0) {
          setCurrentIndex(1);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        // Reseta para a imagem de capa ao tirar o mouse
        setCurrentIndex(0);
      }}
    >
      <Link href={`/produtos/${product.slug}`} className="contents">
        
        {/* Container da Imagem 9:16 com Touch e Hover */}
        <div 
          className={styles.imageContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleImageClick}
        >
          <Image
            src={images[currentIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            priority={currentIndex === 0}
            loading={currentIndex === 0 ? undefined : "lazy"}
          />

          {/* Pré-carrega as imagens adicionais em segundo plano no Hover do Desktop */}
          {isHovered && images.slice(1).map((url, idx) => (
            <link key={idx} rel="prefetch" href={url} />
          ))}

          {/* Controles de Seta (Desktop Hover) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev} 
                className={`${styles.arrow} ${styles.arrowLeft}`}
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button 
                onClick={handleNext} 
                className={`${styles.arrow} ${styles.arrowRight}`}
                aria-label="Próxima foto"
              >
                ›
              </button>
            </>
          )}

          {/* Indicadores de bolinhas no rodapé da imagem */}
          {images.length > 1 && (
            <div className={styles.indicators}>
              {images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ""}`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Informações do Produto (Nome e Preço) */}
        <div className={styles.info}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>
            R$ {Number(product.price).toFixed(2)}
          </span>
        </div>

      </Link>
    </div>
  );
}
