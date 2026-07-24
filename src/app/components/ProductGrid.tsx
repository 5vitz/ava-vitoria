"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "../page.module.css";
import cardStyles from "./ProductCard.module.css";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{
      image_url: string;
    }>;
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeInspectIndex, setActiveInspectIndex] = useState<number | null>(null);

  const handleInspect = (index: number) => {
    setActiveInspectIndex(index);
  };

  const handleStopInspect = () => {
    setActiveInspectIndex(null);
  };

  // Calcula os slots vazios necessários para sempre fechar a linha com 3 colunas completas
  const remainder = products.length % 3;
  const emptySlotsCount = remainder === 0 ? 0 : 3 - remainder;
  const emptySlots = Array.from({ length: emptySlotsCount });

  return (
    <div className={styles.grid}>
      {products.map((product, idx) => {
        let isMilky = false;
        const isInspected = activeInspectIndex === idx;

        if (activeInspectIndex !== null && !isInspected) {
          const activeRow = Math.floor(activeInspectIndex / 3);
          const currRow = Math.floor(idx / 3);
          const rowDiff = Math.abs(currRow - activeRow);

          // Aplica o vidro leitoso aos 8 cards das 3 linhas adjacentes (3 acima, 2 na mesma linha, 3 abaixo)
          if (rowDiff <= 1) {
            isMilky = true;
          }
        }

        return (
          <div key={product.id} className={styles.gridItem}>
            <ProductCard
              product={product}
              images={product.images}
              onInspect={() => handleInspect(idx)}
              onStopInspect={handleStopInspect}
              isInspected={isInspected}
              isMilky={isMilky}
            />
          </div>
        );
      })}

      {/* Slots em branco automáticos para manter as 4 linhas verticais limpas com fundo branco */}
      {emptySlots.map((_, emptyIdx) => (
        <div key={`empty-${emptyIdx}`} className={styles.gridItem}>
          <div className={cardStyles.emptyCard} />
        </div>
      ))}
    </div>
  );
}
