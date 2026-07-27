"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import styles from "./components.module.css";

export default function Header() {
  const { toggleCart, cartCount } = useCart();

  return (
    <header className={styles.header}>
      {/* Logotipo da AVA Vitória no Canto Superior Esquerdo */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src="/imagens/LOGO/logo_ava_transparent.png"
            alt="AVA Vitória Logo"
            width={400}
            height={200}
            className={styles.logoImage}
            priority
          />
        </Link>
      </div>

      {/* Menu de Navegação e Sacola no Canto Superior Direito */}
      <div className={styles.rightNav}>
        <nav className={styles.headerMenu}>
          <button
            onClick={() => {
              const vitrine = document.getElementById("vitrine");
              if (vitrine) {
                vitrine.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#vitrine";
              }
            }}
            className={styles.menuLink}
          >
            Loja
          </button>
          <Link href="/sobre-nos" className={styles.menuLink}>
            Sobre Nós
          </Link>
          <Link href="/contato" className={styles.menuLink}>
            Contato
          </Link>
        </nav>

        {/* Botão de Sacola Reativa */}
        <button onClick={toggleCart} className={styles.cartButton} aria-label="Abrir sacola de compras">
          <span className={styles.cartIcon}>COMPRAS</span>
          {cartCount > 0 && (
            <span className={styles.cartCountBadge}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
