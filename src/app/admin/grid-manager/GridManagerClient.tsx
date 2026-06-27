"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createProductCard,
  deleteProductCard,
  reorderProductCards,
  saveProductDetails,
  disassociateMediaFromProduct,
} from "./actions";
import styles from "./grid-manager.module.css";

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

interface GridManagerClientProps {
  initialProducts: ProductWithImages[];
  collectionsList: CollectionType[];
  currentCollection: CollectionType;
  initialSelectingForProduct: string;
}

export default function GridManagerClient({
  initialProducts,
  collectionsList,
  currentCollection,
  initialSelectingForProduct,
}: GridManagerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const focusProduct = searchParams.get("focusProduct");
  const newMediaAdded = searchParams.get("newMediaAdded") === "true";

  // Estados principais
  const [products, setProducts] = useState<ProductWithImages[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null);

  // Estados para inputs do formulário
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  // Estados para Variações e Estoque
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [newColorInput, setNewColorInput] = useState("");
  const [variantsStock, setVariantsStock] = useState<{ [key: string]: number }>({});

  // Controladores de UI
  const [loading, setLoading] = useState(false);
  const [playerHidden, setPlayerHidden] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  // Lista estática de tamanhos disponíveis
  const sizeOptions = ["P", "M", "G", "GG", "XG"];

  // Mostrar mensagens temporárias
  const triggerFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 4000);
  };

  // 1. Inicialização e Foco do Produto
  useEffect(() => {
    if (focusProduct && products.length > 0) {
      const prodToSelect = products.find((p) => p.id === focusProduct);
      if (prodToSelect) setSelectedProduct(prodToSelect);
    } else if (initialSelectingForProduct && products.length > 0) {
      const prodToSelect = products.find((p) => p.id === initialSelectingForProduct);
      if (prodToSelect) setSelectedProduct(prodToSelect);
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [focusProduct, initialSelectingForProduct, products, selectedProduct]);

  // 2. Carregar dados no formulário ao selecionar produto
  useEffect(() => {
    if (selectedProduct) {
      setProdName(selectedProduct.name);
      setProdPrice(selectedProduct.price.toString());
      setProdDesc(selectedProduct.description || "");

      // Carregar as variações (sizes, colors, stock)
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

      // Sincronizar imagens vinculadas
      const current = products.find((p) => p.id === selectedProduct.id);
      if (current && JSON.stringify(current.images) !== JSON.stringify(selectedProduct.images)) {
        setSelectedProduct(current);
      }
    } else {
      setProdName("");
      setProdPrice("");
      setProdDesc("");
      setSelectedSizes([]);
      setProductColors([]);
      setVariantsStock({});
    }
  }, [selectedProduct, products]);

  // 3. Esconder player ao retornar do redirect se novas mídias foram vinculadas
  useEffect(() => {
    if (newMediaAdded) {
      setPlayerHidden(true);
    }
  }, [newMediaAdded]);

  // Redirecionamento para biblioteca de mídia (fluxo de seleção de página inteira)
  const handleRedirectToMediaLibrary = () => {
    if (!selectedProduct) return;
    router.push(
      `/admin/media?selectingForProduct=${selectedProduct.id}&collection=${currentCollection.id}`
    );
  };

  // Alternar tamanho
  const handleToggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Adicionar cor
  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    const color = newColorInput.trim();
    if (color && !productColors.includes(color)) {
      setProductColors([...productColors, color]);
      setNewColorInput("");
    }
  };

  // Remover cor
  const handleRemoveColor = (colorToRemove: string) => {
    setProductColors(productColors.filter((c) => c !== colorToRemove));
  };

  // Alterar estoque de combinação
  const handleStockChange = (size: string, color: string, val: string) => {
    const qty = parseInt(val) || 0;
    setVariantsStock({
      ...variantsStock,
      [`${size}:${color}`]: qty,
    });
  };

  // Criar novo card vazio
  const handleCreateCard = async () => {
    setLoading(true);
    try {
      const result = await createProductCard(currentCollection.id);
      if (result.success && result.product) {
        const newProd: ProductWithImages = {
          ...result.product,
          price: Number(result.product.price),
          images: [],
          size_chart: null,
          variants: [],
        };
        const updated = [...products, newProd];
        setProducts(updated);
        setSelectedProduct(newProd);
        triggerFeedback("success", "Novo card criado no final do grid.");
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao criar card: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Salvar detalhes do produto (nome, preço, descrição, sizes, colors, variantsStock)
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const parsedPrice = parseFloat(prodPrice) || 0;
      const result = await saveProductDetails(selectedProduct.id, {
        name: prodName,
        price: parsedPrice,
        description: prodDesc,
        sizes: selectedSizes,
        colors: productColors,
        variantsStock: variantsStock,
      });

      if (result.success) {
        const updatedProducts = products.map((p) => {
          if (p.id === selectedProduct.id) {
            const fakeVariants = [];
            for (const size of selectedSizes) {
              for (const color of productColors) {
                const key = `${size}:${color}`;
                fakeVariants.push({
                  id: `${size}-${color}-${Date.now()}`,
                  size,
                  color,
                  quantity: variantsStock[key] || 0,
                });
              }
            }
            return {
              ...p,
              name: prodName,
              price: parsedPrice,
              description: prodDesc,
              size_chart: { sizes: selectedSizes, colors: productColors },
              variants: fakeVariants,
            };
          }
          return p;
        });
        setProducts(updatedProducts);

        // Restaura player e limpa a URL
        setPlayerHidden(false);
        router.replace(`/admin/grid-manager?collection=${currentCollection.id}`);
        triggerFeedback("success", "Variações e metadados salvos com sucesso.");
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Deletar card completo
  const handleDeleteCard = async () => {
    if (!selectedProduct) return;
    if (
      !confirm(
        `Tem certeza que deseja deletar permanentemente o produto "${selectedProduct.name}" e todas as suas imagens?`
      )
    )
      return;

    setLoading(true);
    try {
      const result = await deleteProductCard(selectedProduct.id);
      if (result.success) {
        const remaining = products.filter((p) => p.id !== selectedProduct.id);
        setProducts(remaining);
        setSelectedProduct(remaining.length > 0 ? remaining[0] : null);
        triggerFeedback("success", "Produto removido com sucesso.");
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao deletar produto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Desvincular mídia do produto
  const handleRemoveProductImage = async (imageId: string) => {
    if (!selectedProduct) return;
    try {
      const result = await disassociateMediaFromProduct(imageId);
      if (result.success) {
        const updated = products.map((p) => {
          if (p.id === selectedProduct.id) {
            return {
              ...p,
              images: p.images.filter((img) => img.id !== imageId),
            };
          }
          return p;
        });
        setProducts(updated);
        triggerFeedback("success", "Imagem desvinculada.");
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao desvincular imagem: " + err.message);
    }
  };

  // --- Lógica HTML5 Drag and Drop para Reordenação de Cards ---
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const copyListItems = [...products];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);

    dragItem.current = null;
    dragOverItem.current = null;

    setProducts(copyListItems);

    try {
      const ids = copyListItems.map((p) => p.id);
      await reorderProductCards(ids);
      triggerFeedback("success", "Ordem do grid atualizada.");
    } catch (err: any) {
      triggerFeedback("error", "Erro ao reordenar: " + err.message);
    }
  };

  return (
    <div className={styles.gridManagerGrid2Panel}>
      {/* PAINEL ESQUERDO: GRID DA VITRINE (Thumbnails menores) */}
      <section className={styles.gridPreview}>
        <div className={styles.sectionHeaderFlex}>
          <div>
            <h2 className={styles.sectionTitle}>Vitrine da Coleção ({products.length} cards)</h2>
            <p className={styles.sectionSubtitle}>
              Ordene arrastando os cards. Clique para editar detalhes.
            </p>
          </div>
          <button onClick={handleCreateCard} className={styles.addCardBtn} disabled={loading}>
            + Novo Card
          </button>
        </div>

        <div className={styles.storefrontGrid}>
          {products.map((prod, index) => {
            const hasImages = prod.images.length > 0;
            const isSelected = selectedProduct?.id === prod.id;

            return (
              <div
                key={prod.id}
                className={`${styles.productCardWrapper} ${
                  isSelected ? styles.cardWrapperSelected : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => setSelectedProduct(prod)}
              >
                <div className={styles.cardImageContainer}>
                  {hasImages ? (
                    prod.images[0].image_url.toLowerCase().endsWith(".mp4") ? (
                      <video
                        src={prod.images[0].image_url}
                        className={styles.cardImage}
                        muted
                        playsInline
                        loop
                        autoPlay
                      />
                    ) : (
                      <img
                        src={prod.images[0].image_url}
                        alt={prod.name}
                        className={styles.cardImage}
                      />
                    )
                  ) : (
                    <div className={styles.emptyCardPlaceholder}>
                      <span>Card Vazio</span>
                    </div>
                  )}

                  <span className={styles.orderBadge}>{index + 1}</span>
                  {prod.images.length > 1 && (
                    <span className={styles.mediaCountBadge}>{prod.images.length} mídias</span>
                  )}
                </div>

                <div className={styles.cardDetails}>
                  <h4 className={styles.cardName}>{prod.name}</h4>
                  <p className={styles.cardPrice}>R$ {Number(prod.price).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PAINEL DIREITO: PLAYER 9:16 EDITOR (Coluna mais larga, player fixado no topo) */}
      <section className={styles.editorPanel}>
        <div className={styles.editorHeaderFlex}>
          <div>
            <h2 className={styles.sectionTitle}>Editor do Card</h2>
            <p className={styles.sectionSubtitle}>Defina metadados, variações e mídias.</p>
          </div>
          {selectedProduct && (
            <button
              type="button"
              className={styles.togglePlayerBtn}
              onClick={() => setPlayerHidden(!playerHidden)}
            >
              {playerHidden ? "🎦 Ver Player" : "🙈 Ocultar Player"}
            </button>
          )}
        </div>

        {selectedProduct ? (
          <div className={styles.editorContentFixed}>
            {/* Player Físico 9:16 (Fixo no topo da coluna) */}
            {!playerHidden && (
              <div className={styles.playerFrameFixed}>
                <div
                  className={styles.playerScreen}
                  onClick={handleRedirectToMediaLibrary}
                  title="Clique para gerenciar/vincular mídias"
                  style={{ cursor: "pointer" }}
                >
                  {selectedProduct.images.length > 0 ? (
                    selectedProduct.images[0].image_url.toLowerCase().endsWith(".mp4") ? (
                      <video
                        src={selectedProduct.images[0].image_url}
                        className={styles.playerMedia}
                        controls
                        autoPlay
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={selectedProduct.images[0].image_url}
                        alt={selectedProduct.name}
                        className={styles.playerMedia}
                      />
                    )
                  ) : (
                    <div className={styles.playerScreenEmpty}>
                      <p>Card Vazio</p>
                      <span>Clique aqui para selecionar mídia da biblioteca</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo rolável do formulário */}
            <div className={styles.editorScrollableForm}>
              {/* Botão de Substituir/Vincular Nova Mídia */}
              <div className={styles.mediaActionsRow}>
                <button
                  type="button"
                  onClick={handleRedirectToMediaLibrary}
                  className={styles.linkMediaBtn}
                >
                  {selectedProduct.images.length > 0
                    ? "➔ Biblioteca de Mídias (Substituir/Vincular)"
                    : "➔ Biblioteca de Mídias (Vincular)"}
                </button>
              </div>

              <form onSubmit={handleSaveDetails} className={styles.editorForm}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Nome da Peça</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Descrição / Manifesto</label>
                  <textarea
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                {/* Seleção de Tamanhos (Checkboxes) */}
                <div className={styles.formSection}>
                  <label className={styles.label}>Tamanhos Disponíveis</label>
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

                {/* Seleção de Cores (Tags dinâmicas) */}
                <div className={styles.formSection}>
                  <label className={styles.label}>Cores do Produto</label>
                  <div className={styles.colorInputRow}>
                    <input
                      type="text"
                      placeholder="Adicione uma cor (ex: Vinho)"
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
                      <span className={styles.noColorsMsg}>Nenhuma cor adicionada.</span>
                    )}
                  </div>
                </div>

                {/* Grade de Estoque por Combinação */}
                <div className={styles.formSection}>
                  <label className={styles.label}>Quantidade de Estoque por Combinação</label>
                  {selectedSizes.length > 0 && productColors.length > 0 ? (
                    <div className={styles.variantsStockGrid}>
                      <div className={styles.variantsHeader}>
                        <span>Variação</span>
                        <span>Estoque (unidades)</span>
                      </div>
                      {selectedSizes.map((size) =>
                        productColors.map((color) => {
                          const key = `${size}:${color}`;
                          const qty = typeof variantsStock[key] === "number" ? variantsStock[key] : 0;
                          return (
                            <div key={key} className={styles.variantRow}>
                              <span className={styles.variantLabel}>
                                {size} / {color}
                              </span>
                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) =>
                                  handleStockChange(size, color, e.target.value)
                                }
                                className={styles.variantInput}
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    <div className={styles.emptyStockAlert}>
                      Marque pelo menos um tamanho e adicione uma cor acima para habilitar o controle de estoque.
                    </div>
                  )}
                </div>

                <div className={styles.btnRow}>
                  <button type="submit" className={styles.saveBtn} disabled={loading}>
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCard}
                    className={styles.deleteBtn}
                    disabled={loading}
                  >
                    Excluir Card
                  </button>
                </div>
              </form>

              {/* Carrossel de Imagens Vinculadas */}
              <div className={styles.linkedMediaSection}>
                <h3 className={styles.subSectionTitle}>
                  Mídias Vinculadas a este Card ({selectedProduct.images.length})
                </h3>

                {selectedProduct.images.length === 0 ? (
                  <p className={styles.noLinkedMedia}>
                    Nenhuma mídia associada a este card. Clique no botão de biblioteca no topo para vincular.
                  </p>
                ) : (
                  <div className={styles.linkedMediaCarousel}>
                    {selectedProduct.images.map((img) => {
                      const isVid = img.image_url.toLowerCase().endsWith(".mp4");
                      return (
                        <div key={img.id} className={styles.carouselItem}>
                          <div className={styles.carouselThumb}>
                            {isVid ? (
                              <video src={img.image_url} muted playsInline />
                            ) : (
                              <img src={img.image_url} alt="Thumbnail vinculada" />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveProductImage(img.id)}
                              className={styles.carouselRemoveBtn}
                              title="Remover mídia deste card"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noSelectedProduct}>
            <p>Nenhum card selecionado.</p>
            <span>Selecione um card na vitrine para abrir o editor.</span>
          </div>
        )}
      </section>

      {/* Mensagens de Feedback */}
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
