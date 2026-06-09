"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import styles from "./components.module.css";

export default function Header() {
  const { toggleCart, cartCount } = useCart();

  return (
    <header className={styles.header}>
      {/* Logotipo da AVA Vitória */}
      <div className={styles.logoContainer}>
        <Image
          src="/imagens/LOGO/logo_black.png"
          alt="AVA Vitória Logo"
          width={120}
          height={35}
          className={styles.logoImage}
          priority
        />
      </div>

      {/* Botão de Sacola Reativa */}
      <button onClick={toggleCart} className={styles.cartButton} aria-label="Abrir sacola de compras">
        <span className={styles.cartIcon}>SACOLA</span>
        {cartCount > 0 && (
          <span className={styles.cartCountBadge}>
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
