"use client";

import React from "react";
import { useCart } from "@/lib/cartContext";
import styles from "@/app/page.module.css";

export default function CartStatus() {
  const { toggleCart, cartCount } = useCart();

  const getStatusText = () => {
    if (cartCount === 0) return "SACOLA VAZIA";
    if (cartCount === 1) return "SACOLA: 1 ITEM";
    return `SACOLA: ${cartCount} ITENS`;
  };

  return (
    <button 
      onClick={toggleCart} 
      className={styles.sectionCountBtn}
      aria-label="Abrir sacola de compras"
    >
      {getStatusText()}
    </button>
  );
}
