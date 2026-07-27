"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { useRouter } from "next/navigation";
import styles from "./components.module.css";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Estados do checkout local
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Gerenciamento de ciclo de abertura/fechamento
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsCheckoutMode(false);
        setErrorMessage(null);
        setOrderId(null);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setOrderId(null);
      setIsCheckoutMode(false);
    }
  }, [isOpen]);

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

  // Enviar os dados do checkout para a API
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items: cart.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Ocorreu um erro ao processar o pedido.");
      }

      setOrderId(data.orderId);
      clearCart(); // Limpar a sacola local
      setCustomerName("");
      setCustomerEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "Não foi possível realizar o checkout. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {orderId
              ? "Pedido Confirmado"
              : isCheckoutMode
              ? "Dados de Entrega"
              : "Compras"}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className={styles.closeButton}
            aria-label="Fechar compras"
          >
            ×
          </button>
        </div>

        {/* Lista de Itens, Formulário ou Sucesso */}
        <div className={styles.cartList}>
          {orderId ? (
            /* Tela de Sucesso */
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Reserva Concluída</h3>
              <p className={styles.successMessage}>
                Seu pedido foi registrado no sistema e o estoque correspondente foi reservado com segurança.
              </p>
              <div>
                <span className={styles.formLabel}>Código do Pedido</span>
                <br />
                <div className={styles.orderIdHighlight}>{orderId}</div>
              </div>
              <button
                onClick={() => {
                  setOrderId(null);
                  setIsCheckoutMode(false);
                  setCartOpen(false);
                  router.push("/");
                }}
                className={styles.emptyStateButton}
              >
                Voltar ao Catálogo
              </button>
            </div>
          ) : isCheckoutMode ? (
            /* Formulário de Checkout */
            <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
              <button
                type="button"
                onClick={() => setIsCheckoutMode(false)}
                className={styles.backToCartBtn}
              >
                ← Voltar para as Compras
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0" }}>
                <span className={styles.formLabel}>Total do Pedido</span>
                <span className={styles.totalValue}>R$ {cartTotal.toFixed(2)}</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome Completo</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  className={styles.formInput}
                  placeholder="Seu nome completo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>E-mail de Contato</label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  className={styles.formInput}
                  placeholder="exemplo@dominio.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.checkoutButton}
                style={{ marginTop: "10px" }}
              >
                {isSubmitting ? "Processando..." : "Confirmar e Reservar"}
              </button>
            </form>
          ) : (
            /* Lista de Itens */
            cart.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateMessage}>Sua sacola está vazia.</p>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/");
                  }}
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
            )
          )}
        </div>

        {/* Rodapé do Carrinho com Totais e Botão de Ação */}
        {cart.length > 0 && !isCheckoutMode && !orderId && (
          <div className={styles.drawerFooter}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal</span>
              <span className={styles.totalValue}>
                R$ {cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setIsCheckoutMode(true)}
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
