"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cartContext";
import styles from "./product-details.module.css";
import Link from "next/link";

interface Variant {
  id: string;
  size: string;
  color: string;
  quantity: number;
}

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string | null;
    size_chart?: any;
    images: {
      image_url: string;
    }[];
    variants: Variant[];
  };
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  
  // Extrair tamanhos e cores únicos disponíveis nas variantes
  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));

  // Estados locais para a seleção do usuário
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Encontrar a variante exata com base na seleção
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  // Verificar se há estoque disponível para a variante selecionada
  const isOutOfStock = selectedVariant ? selectedVariant.quantity <= 0 : false;

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || !selectedVariant) return;

    const imageUrl = product.images.length > 0 ? product.images[0].image_url : "/imagens/COLECAO/01.jpg";

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: Number(product.price),
      image: imageUrl,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });
  };

  // Desabilitar o botão se tamanho/cor não foram selecionados ou se está sem estoque
  const isButtonDisabled = !mounted || !selectedSize || !selectedColor || isOutOfStock;

  return (
    <div className={styles.detailsColumn}>
      {/* Link para Voltar */}
      <Link href="/" className={styles.backLink}>
        ← Voltar ao catálogo
      </Link>

      {/* Informações Principais */}
      <h1 className={styles.name}>{product.name}</h1>
      <span className={styles.price}>
        {Number(product.price) > 0 
          ? `R$ ${Number(product.price).toFixed(2)}` 
          : "No Price"}
      </span>

      <hr className={styles.divider} />

      {/* Descrição do Produto */}
      <p className={styles.description}>
        {product.description || "Sem descrição disponível."}
      </p>

      <hr className={styles.divider} />

      {/* Opções de Compra */}
      {Number(product.price) > 0 ? (
        <div className={styles.optionsSection}>
          
          {/* Seletor de Cores */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>Cor</span>
            <div className={styles.selectorGrid}>
              {availableColors.map((color) => {
                // Verificar se a cor tem alguma variante em estoque (opcional, para usabilidade)
                const hasColorInStock = product.variants.some(
                  (v) => v.color === color && v.quantity > 0
                );
                
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`${styles.colorButton} ${selectedColor === color ? styles.colorButtonActive : ""}`}
                  >
                    {color} {!hasColorInStock && "(Esgotado)"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seletor de Tamanhos */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>Tamanho</span>
            <div className={styles.selectorGrid}>
              {availableSizes.map((size) => {
                // Verificar se este tamanho está disponível na cor selecionada
                const variantForSize = product.variants.find(
                  (v) => v.size === size && (selectedColor ? v.color === selectedColor : true)
                );
                const isSizeDisabled = variantForSize ? variantForSize.quantity <= 0 : true;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={selectedColor ? isSizeDisabled : false}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ""}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alerta de Estoque Insuficiente */}
          {selectedSize && selectedColor && isOutOfStock && (
            <span className={styles.stockAlert}>
              Esta combinação de tamanho e cor encontra-se indisponível no momento.
            </span>
          )}

          {/* Botão de Adicionar ao Carrinho */}
          <button
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
            className={styles.addToCartButton}
          >
            {isButtonDisabled 
              ? (!selectedSize || !selectedColor ? "Selecione tamanho & cor" : "Indisponível") 
              : "Adicionar às Compras"
            }
          </button>
        </div>
      ) : (
        <div style={{ padding: "15px 0", fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
          Peça de exibição (Costas). Para adquirir este produto, selecione a versão correspondente no catálogo.
        </div>
      )}
    </div>
  );
}

export function ScrollToTopButton() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.scrollToTopContainer}>
      <button onClick={handleScrollTop} className={styles.scrollToTopBtn}>
        ↑ Voltar ao Topo
      </button>
    </div>
  );
}
