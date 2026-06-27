"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveProductStockAndVariants } from "../grid-manager/actions";
import styles from "./stock.module.css";

interface ProductWithImages {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  is_active: boolean;
  display_order: number;
  size_chart: any;
  collection_id: string | null;
  images: {
    id: string;
    image_url: string;
    display_order: number;
  }[];
  variants: {
    id: string;
    size: string;
    color: string;
    quantity: number;
  }[];
}

interface CollectionType {
  id: string;
  name: string;
  slug: string;
  year: number;
  season: string;
}

interface StockClientProps {
  initialProducts: ProductWithImages[];
  collectionsList: CollectionType[];
  currentCollection: CollectionType;
  focusProductId: string;
}

export default function StockClient({
  initialProducts,
  collectionsList,
  currentCollection,
  focusProductId,
}: StockClientProps) {
  const router = useRouter();

  // Estados principais
  const [products, setProducts] = useState<ProductWithImages[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null);

  // Estados locais para a edição do produto selecionado
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [newColorInput, setNewColorInput] = useState("");
  const [variantsStock, setVariantsStock] = useState<{ [key: string]: number }>({});

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const sizeOptions = ["P", "M", "G", "GG", "XG"];

  // Mostrar mensagens temporárias
  const triggerFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 4000);
  };

  // 1. Inicializar focando no produto correto
  useEffect(() => {
    if (focusProductId && products.length > 0) {
      const prod = products.find((p) => p.id === focusProductId);
      if (prod) setSelectedProduct(prod);
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [focusProductId, products, selectedProduct]);

  // 2. Carregar configurações do produto no formulário de edição
  useEffect(() => {
    if (selectedProduct) {
      const chart = selectedProduct.size_chart;
      const sizes = chart?.sizes || Array.from(new Set(selectedProduct.variants.map((v) => v.size)));
      const colors = chart?.colors || Array.from(new Set(selectedProduct.variants.map((v) => v.color)));

      const stockMap: { [key: string]: number } = {};
      selectedProduct.variants.forEach((v) => {
        stockMap[`${v.size}:${v.color}`] = v.quantity;
      });

      setSelectedSizes(sizes);
      setProductColors(colors);
      setVariantsStock(stockMap);
    } else {
      setSelectedSizes([]);
      setProductColors([]);
      setVariantsStock({});
    }
  }, [selectedProduct]);

  // Alternar Coleção/Projeto
  const handleCollectionChange = (colId: string) => {
    router.push(`/admin/stock?collection=${colId}`);
  };

  // Habilitar/Desabilitar Tamanho
  const handleToggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Adicionar Cor
  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    const color = newColorInput.trim();
    if (color && !productColors.includes(color)) {
      setProductColors([...productColors, color]);
      setNewColorInput("");
    }
  };

  // Remover Cor
  const handleRemoveColor = (colorToRemove: string) => {
    setProductColors(productColors.filter((c) => c !== colorToRemove));
  };

  // Alterar Quantidade
  const handleStockChange = (size: string, color: string, val: string) => {
    const qty = parseInt(val) || 0;
    setVariantsStock({
      ...variantsStock,
      [`${size}:${color}`]: qty,
    });
  };

  // Salvar Alterações de Estoque no Banco de Dados
  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const result = await saveProductStockAndVariants(selectedProduct.id, {
        sizes: selectedSizes,
        colors: productColors,
        variantsStock: variantsStock,
      });

      if (result.success) {
        // Atualizar localmente na lista
        const updatedVariants: { id: string; size: string; color: string; quantity: number }[] = [];
        for (const size of selectedSizes) {
          for (const color of productColors) {
            const key = `${size}:${color}`;
            updatedVariants.push({
              id: `${size}-${color}-${Date.now()}`,
              size,
              color,
              quantity: variantsStock[key] || 0,
            });
          }
        }

        const updatedProducts = products.map((p) => {
          if (p.id === selectedProduct.id) {
            return {
              ...p,
              size_chart: { sizes: selectedSizes, colors: productColors },
              variants: updatedVariants,
            };
          }
          return p;
        });

        setProducts(updatedProducts);
        // Atualizar o selectedProduct para refletir a nova lista
        const newSelected = updatedProducts.find((p) => p.id === selectedProduct.id);
        if (newSelected) setSelectedProduct(newSelected);

        triggerFeedback("success", "Variações e estoque salvos com sucesso.");
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obter total de estoque de um produto
  const getProductTotalStock = (prod: ProductWithImages) => {
    return prod.variants.reduce((sum, v) => sum + v.quantity, 0);
  };

  // Verificar se o produto tem alguma variante sem estoque
  const getInventoryStatus = (prod: ProductWithImages) => {
    if (prod.variants.length === 0) return { label: "Sem Grade", class: styles.statusEmpty };
    
    const hasOutOfStock = prod.variants.some((v) => v.quantity === 0);
    const total = getProductTotalStock(prod);

    if (total === 0) return { label: "Esgotado", class: styles.statusRed };
    if (hasOutOfStock || total < 10) return { label: "Estoque Baixo", class: styles.statusYellow };
    return { label: "Estabilizado", class: styles.statusGreen };
  };

  return (
    <div className={styles.stockSplitLayout}>
      {/* COLUNA ESQUERDA: LISTAGEM DE STATUS DO INVENTÁRIO */}
      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <div className={styles.fieldGroupInline}>
            <label className={styles.filterLabel}>Coleção:</label>
            <select
              className={styles.selectSmall}
              value={currentCollection.id}
              onChange={(e) => handleCollectionChange(e.target.value)}
            >
              {collectionsList.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.year})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.productsList}>
          {products.map((prod) => {
            const isSelected = selectedProduct?.id === prod.id;
            const status = getInventoryStatus(prod);
            const totalStock = getProductTotalStock(prod);

            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className={`${styles.productItemRow} ${isSelected ? styles.rowSelected : ""}`}
              >
                <div className={styles.prodThumb}>
                  {prod.images.length > 0 ? (
                    prod.images[0].image_url.toLowerCase().endsWith(".mp4") ? (
                      <video src={prod.images[0].image_url} muted playsInline autoPlay loop />
                    ) : (
                      <img src={prod.images[0].image_url} alt={prod.name} />
                    )
                  ) : (
                    <div className={styles.emptyThumb}>—</div>
                  )}
                </div>

                <div className={styles.prodInfo}>
                  <h4 className={styles.prodName}>{prod.name}</h4>
                  <span className={styles.prodStockTotal}>
                    Total: <strong>{totalStock}</strong> un
                  </span>
                </div>

                <span className={`${styles.statusBadge} ${status.class}`}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* COLUNA DIREITA: CONFIGURAÇÕES DE ESTOQUE E VARIAÇÃO */}
      <section className={styles.editorSection}>
        {selectedProduct ? (
          <div className={styles.editorWrapper}>
            <div className={styles.editorHeader}>
              <h2 className={styles.editorTitle}>{selectedProduct.name}</h2>
              <span className={styles.editorSubtitle}>
                Defina a grade de variações e preencha as quantidades físicas no banco.
              </span>
            </div>

            <form onSubmit={handleSaveStock} className={styles.stockForm}>
              {/* Tamanhos Checkboxes */}
              <div className={styles.formGroup}>
                <h3 className={styles.formGroupTitle}>1. Grade de Tamanhos</h3>
                <div className={styles.checkboxSizesGrid}>
                  {sizeOptions.map((size) => {
                    const isChecked = selectedSizes.includes(size);
                    return (
                      <label key={size} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSize(size)}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxText}>{size}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cores Tags Input */}
              <div className={styles.formGroup}>
                <h3 className={styles.formGroupTitle}>2. Grade de Cores</h3>
                <div className={styles.colorInputRow}>
                  <input
                    type="text"
                    placeholder="Adicionar Cor (ex: Mescla, Off-White)"
                    value={newColorInput}
                    onChange={(e) => setNewColorInput(e.target.value)}
                    className={styles.textInputColor}
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className={styles.addColorBtn}
                  >
                    + Add
                  </button>
                </div>

                <div className={styles.colorsTagList}>
                  {productColors.map((color) => (
                    <span key={color} className={styles.colorTag}>
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className={styles.removeColorBtn}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {productColors.length === 0 && (
                    <span className={styles.noColorsMsg}>Nenhuma cor cadastrada.</span>
                  )}
                </div>
              </div>

              {/* Tabela de Estoque por Combinação */}
              <div className={styles.formGroup}>
                <h3 className={styles.formGroupTitle}>3. Inventário / Quantidade Física</h3>
                
                {selectedSizes.length > 0 && productColors.length > 0 ? (
                  <div className={styles.variantsStockGrid}>
                    <div className={styles.variantsHeader}>
                      <span>Combinação (Tamanho / Cor)</span>
                      <span>Status</span>
                      <span>Quantidade</span>
                    </div>

                    {selectedSizes.map((size) =>
                      productColors.map((color) => {
                        const key = `${size}:${color}`;
                        const qty = typeof variantsStock[key] === "number" ? variantsStock[key] : 0;
                        
                        // Status da variação individual
                        let statusText = "Ok";
                        let statusClass = styles.badgeOk;
                        if (qty === 0) {
                          statusText = "Esgotado";
                          statusClass = styles.badgeRed;
                        } else if (qty <= 5) {
                          statusText = "Baixo";
                          statusClass = styles.badgeYellow;
                        }

                        return (
                          <div key={key} className={styles.variantRow}>
                            <span className={styles.variantLabel}>
                              {size} / {color}
                            </span>
                            <span className={`${styles.badgeStatus} ${statusClass}`}>
                              {statusText}
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) => handleStockChange(size, color, e.target.value)}
                              className={styles.variantInput}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className={styles.emptyStockAlert}>
                    Selecione pelo menos um tamanho e cadastre uma cor acima para gerar as combinações de estoque.
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className={styles.btnRow}>
                <button
                  type="submit"
                  className={styles.saveStockBtn}
                  disabled={loading || selectedSizes.length === 0 || productColors.length === 0}
                >
                  {loading ? "Gravando..." : "Salvar Estoque e Variações"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.noSelectedWrapper}>
            <p>Selecione um produto da lista para configurar seu estoque.</p>
          </div>
        )}
      </section>

      {/* Toast Notification */}
      {feedback.message && (
        <div
          className={`${styles.feedbackToast} ${
            feedback.type === "success" ? styles.toastSuccess : styles.toastError
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
