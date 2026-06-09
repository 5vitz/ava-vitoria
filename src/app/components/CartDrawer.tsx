"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import styles from "./components.module.css";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Fechar o drawer ao clicar na tecla Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setCartOpen]);

  return (
    <>
      {/* Overlay de fundo (esmaecimento) */}
      <div
        className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOverlayActive : ""}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Painel Deslizante do Carrinho */}
      <div
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.drawerActive : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Cabeçalho do Drawer */}
        <div className={styles.drawerHeader}>
          <h2 id="cart-title" className={styles.drawerTitle}>
            Sacola de Compras
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className={styles.closeButton}
            aria-label="Fechar sacola"
          >
            ×
          </button>
        </div>

        {/* Lista de Itens do Carrinho */}
        <div className={styles.cartList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateMessage}>Sua sacola está vazia.</p>
              <button
                onClick={() => setCartOpen(false)}
                className={styles.emptyStateButton}
              >
                Voltar à Loja
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.variantId} className={styles.cartItem}>
                {/* Imagem Vertical 9:16 */}
                <div className={styles.itemImageContainer}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="90px"
                    className={styles.itemImage}
                  />
                </div>

                {/* Detalhes do Produto */}
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <div className={styles.itemMeta}>
                    <span>
                      Tam: <strong className={styles.itemMetaLabel}>{item.size}</strong>
                    </span>
                    <span>
                      Cor: <strong className={styles.itemMetaLabel}>{item.color}</strong>
                    </span>
                  </div>
                  <span className={styles.itemPrice}>
                    R$ {item.price.toFixed(2)}
                  </span>

                  {/* Ações (Quantidade e Remoção) */}
                  <div className={styles.itemActions}>
                    <div className={styles.quantitySelector}>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className={styles.qtyButton}
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className={styles.qtyButton}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className={styles.removeButton}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé do Carrinho com Totais e Botão de Ação */}
        {cart.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal</span>
              <span className={styles.totalValue}>
                R$ {cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => alert("O checkout seguro será ativado na FASE 4.")}
              className={styles.checkoutButton}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
