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
  card_type: number;
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
  const [prodCardType, setProdCardType] = useState<number>(1);

  // Controladores de UI
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

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
      setProdCardType(selectedProduct.card_type || 1);

      // Sincronizar imagens vinculadas
      const current = products.find((p) => p.id === selectedProduct.id);
      if (current && JSON.stringify(current.images) !== JSON.stringify(selectedProduct.images)) {
        setSelectedProduct(current);
      }
    } else {
      setProdName("");
      setProdPrice("");
      setProdDesc("");
    }
  }, [selectedProduct, products]);

  // Redirecionamento para biblioteca de mídia (fluxo de seleção de página inteira)
  const handleRedirectToMediaLibrary = () => {
    if (!selectedProduct) return;
    router.push(
      `/admin/media?selectingForProduct=${selectedProduct.id}&collection=${currentCollection.id}`
    );
  };

  // Criar novo card vazio
  const handleCreateCard = async (cardType = 1) => {
    setLoading(true);
    try {
      const result = await createProductCard(currentCollection.id, cardType);
      if (result.success && result.product) {
        const newProd: ProductWithImages = {
          ...result.product,
          price: Number(result.product.price),
          card_type: result.product.card_type,
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

  // Salvar detalhes do produto (apenas metadados de apresentação)
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
        cardType: prodCardType,
      });

      if (result.success) {
        const updatedProducts = products.map((p) => {
          if (p.id === selectedProduct.id) {
            return {
              ...p,
              name: prodName,
              price: parsedPrice,
              description: prodDesc,
              card_type: prodCardType,
            };
          }
          return p;
        });
        setProducts(updatedProducts);

        // Direcionar imediatamente para a página de estoque focando este produto
        router.push(`/admin/stock?collection=${currentCollection.id}&focusProduct=${selectedProduct.id}`);
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
      <section className={styles.gridPreview}>
        <div className={styles.sectionHeaderFlex}>
          <div>
            <h2 className={styles.sectionTitle}>Vitrine da Coleção ({products.length} cards)</h2>
            <p className={styles.sectionSubtitle}>
              Ordene arrastando os cards. Clique para editar detalhes.
            </p>
          </div>
          <div className={styles.createCardControls}>
            <button onClick={() => handleCreateCard(1)} className={styles.addCardBtnGroup} disabled={loading}>
              + Tipo 1
            </button>
            <button onClick={() => handleCreateCard(2)} className={styles.addCardBtnGroup} disabled={loading}>
              + Tipo 2
            </button>
            <button onClick={() => handleCreateCard(3)} className={styles.addCardBtnGroup} disabled={loading}>
              + Tipo 3
            </button>
          </div>
        </div>

        <div className={styles.storefrontGrid}>
          {products.map((prod, index) => {
            const hasImages = prod.images.length > 0;
            const isSelected = selectedProduct?.id === prod.id;

            const cardTypeClass = prod.card_type === 2 
              ? styles.cardTipo2 
              : prod.card_type === 3 
              ? styles.cardTipo3 
              : styles.cardTipo1;

            return (
              <div
                key={prod.id}
                className={`${styles.productCardWrapper} ${cardTypeClass} ${
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
        {selectedProduct ? (
          <div className={styles.editorContentFixed}>
            {/* Player Físico Adaptável (Fixo no topo da coluna) */}
            <div className={prodCardType === 2 
              ? styles.playerFrameFixedTipo2 
              : prodCardType === 3 
              ? styles.playerFrameFixedTipo3 
              : styles.playerFrameFixedTipo1
            }>
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
                  <input
                    type="text"
                    placeholder="Nome da Peça"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço (R$)"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <textarea
                    placeholder="Descrição / Manifesto"
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tamanho / Tipo do Card</label>
                  <div className={styles.typeSelectorGroup}>
                    <button
                      type="button"
                      onClick={() => setProdCardType(1)}
                      className={`${styles.typeBtn} ${prodCardType === 1 ? styles.typeBtnActive : ""}`}
                    >
                      Tipo 1 (360x640)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdCardType(2)}
                      className={`${styles.typeBtn} ${prodCardType === 2 ? styles.typeBtnActive : ""}`}
                    >
                      Tipo 2 (744x640)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdCardType(3)}
                      className={`${styles.typeBtn} ${prodCardType === 3 ? styles.typeBtnActive : ""}`}
                    >
                      Tipo 3 (1128x640)
                    </button>
                  </div>
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
