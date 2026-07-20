"use client";

import React from "react";
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
    card_type: number;
    images: {
      image_url: string;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleSingleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Desativa a navegação em clique único (para humanos)
  };

  const handleDoubleClick = () => {
    router.push(`/produtos/${product.slug}`); // Navega no duplo clique
  };

  const imageUrl = product.images.length > 0 
    ? product.images[0].image_url 
    : "/imagens/COLECAO/01.jpg"; // Fallback padrão

  const isLookbook = Number(product.price) === 0;

  if (isLookbook) {
    return (
      <div className={styles.card}>
        {/* Container da Imagem 9:16 */}
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.image}
            priority
          />
        </div>
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
      {/* Container da Imagem 9:16 */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={styles.image}
          priority
        />
      </div>

      {/* Informações do Produto (Nome e Preço) */}
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>
          R$ {Number(product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
