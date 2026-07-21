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

  return (
    <div className={styles.grid}>
      {products.map((product, idx) => {
        let isSmoked = false;
        if (activeInspectIndex !== null && activeInspectIndex !== idx) {
          const activeRow = Math.floor(activeInspectIndex / 3);
          const activeCol = activeInspectIndex % 3;
          const currRow = Math.floor(idx / 3);
          const currCol = idx % 3;

          const rowDiff = Math.abs(currRow - activeRow);
          const colDiff = Math.abs(currCol - activeCol);

          // Escurece os 8 vizinhos imediatos (linha acima, linha abaixo, e laterais)
          if (rowDiff <= 1 && colDiff <= 1) {
            isSmoked = true;
          }
        }

        return (
          <div
            key={product.id}
            className={`${styles.gridItem} ${isSmoked ? cardStyles.smokedGlass : ""}`}
          >
            <ProductCard
              product={product}
              images={product.images}
              onInspect={() => handleInspect(idx)}
              onStopInspect={handleStopInspect}
              isInspected={activeInspectIndex === idx}
            />
          </div>
        );
      })}
    </div>
  );
}
