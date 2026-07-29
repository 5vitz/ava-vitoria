"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import styles from "./components.module.css";

export default function Header() {
  const { toggleCart, cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === "/#vitrine") {
      const vitrine = document.getElementById("vitrine");
      if (vitrine) {
        vitrine.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#vitrine";
      }
    }
  };

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
        {/* Menu Desktop Inline */}
        <nav className={styles.headerMenu}>
          <button
            onClick={() => handleNavClick("/#vitrine")}
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

        {/* Botão de Compras (Sacola estilo Instagram) */}
        <button onClick={toggleCart} className={styles.cartButton} aria-label="Abrir carrinho de compras">
          <span className={styles.cartIcon}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.shoppingBagSvg}
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          {cartCount > 0 && (
            <span className={styles.cartCountBadge}>
              {cartCount}
            </span>
          )}
        </button>

        {/* Botão Hamburger para Mobile */}
        <button
          onClick={toggleMobileMenu}
          className={styles.hamburgerBtn}
          aria-label="Abrir menu principal"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu Dropdown/Overlay Mobile */}
      {mobileMenuOpen && (
        <div className={styles.mobileNavMenu}>
          <button
            onClick={() => handleNavClick("/#vitrine")}
            className={styles.mobileMenuLink}
          >
            Loja
          </button>
          <Link
            href="/sobre-nos"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileMenuLink}
          >
            Sobre Nós
          </Link>
          <Link
            href="/contato"
            onClick={() => setMobileMenuOpen(false)}
            className={styles.mobileMenuLink}
          >
            Contato
          </Link>
        </div>
      )}
    </header>
  );
}
