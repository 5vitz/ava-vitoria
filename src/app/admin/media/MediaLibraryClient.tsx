"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { uploadMediaAction, deleteMediaAsset, getMediaAssets, associateMediaToProduct } from "../grid-manager/actions";
import styles from "./media-library.module.css";

interface MediaAsset {
  id: string;
  filename: string;
  file_url: string;
  mime_type: string;
  collection_id: string | null;
  created_at: string;
}

interface CollectionType {
  id: string;
  name: string;
  slug: string;
  year: number;
  season: string;
}

interface MediaLibraryClientProps {
  initialMedia: MediaAsset[];
  collectionsList: CollectionType[];
  initialCollectionId: string;
  selectingForProduct?: string | null;
  targetProductName?: string | null;
}

export default function MediaLibraryClient({
  initialMedia,
  collectionsList,
  initialCollectionId,
  selectingForProduct = null,
  targetProductName = null,
}: MediaLibraryClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estados
  const [mediaList, setMediaList] = useState<MediaAsset[]>(initialMedia);
  const [filterCollectionId, setFilterCollectionId] = useState(initialCollectionId);
  const [uploadCollectionId, setUploadCollectionId] = useState(
    collectionsList.length > 0 ? collectionsList[0].id : "Todos"
  );
  const [uploading, setUploading] = useState(false);
  const [zoomedAsset, setZoomedAsset] = useState<MediaAsset | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fechar modal de ampliação com ESC
  useEffect(() => {
    if (!zoomedAsset) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedAsset(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedAsset]);

  // Sincronizar o estado da lista quando as props mudam
  useEffect(() => {
    setMediaList(initialMedia);
  }, [initialMedia]);

  // Sincronizar o uploadCollectionId padrão com a coleção filtrada (se for válida)
  useEffect(() => {
    if (filterCollectionId !== "Todos") {
      setUploadCollectionId(filterCollectionId);
    }
  }, [filterCollectionId]);

  // Mostrar mensagens temporárias
  const triggerFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 4000);
  };

  // Alterar filtro de coleção (muda a URL e re-busca os dados via Next.js)
  const handleFilterChange = (colId: string) => {
    setFilterCollectionId(colId);
    
    const params = new URLSearchParams();
    if (colId !== "Todos") {
      params.set("collection", colId);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Upload em lote de mídias
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadCollectionId === "Todos" || !uploadCollectionId) {
      triggerFeedback("error", "Selecione uma Coleção específica para vincular os uploads.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const result = await uploadMediaAction(uploadCollectionId, formData);
      if (result.success) {
        triggerFeedback("success", `${files.length} mídias carregadas com sucesso.`);
        
        // Atualizar lista local
        const media = await getMediaAssets(filterCollectionId);
        const serialized = media.map((asset) => ({
          id: asset.id,
          filename: asset.filename,
          file_url: asset.file_url,
          mime_type: asset.mime_type,
          collection_id: asset.collection_id,
          created_at: asset.created_at.toISOString(),
        }));
        setMediaList(serialized);

        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro no upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Excluir mídia permanentemente
  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Deseja mesmo excluir permanentemente este arquivo da biblioteca física e lógica?")) return;

    try {
      const result = await deleteMediaAsset(assetId);
      if (result.success) {
        setMediaList(mediaList.filter((item) => item.id !== assetId));
        triggerFeedback("success", "Arquivo excluído com sucesso.");
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao excluir arquivo: " + err.message);
    }
  };

  // Selecionar mídia (Modo de Desvio)
  const handleSelectMedia = async (mediaUrl: string) => {
    if (!selectingForProduct) return;
    setUploading(true);
    try {
      const result = await associateMediaToProduct(selectingForProduct, mediaUrl);
      if (result.success) {
        const activeColId = filterCollectionId !== "Todos" ? filterCollectionId : (collectionsList.length > 0 ? collectionsList[0].id : "");
        router.push(`/admin/grid-manager?collection=${activeColId}&focusProduct=${selectingForProduct}&newMediaAdded=true`);
      }
    } catch (err: any) {
      triggerFeedback("error", "Erro ao vincular mídia: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <section className={styles.controlsSection}>
        <div className={styles.controlBox}>
          <h3 className={styles.controlTitle}>Filtro de Visualização</h3>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Filtrar Coleção</label>
            <select
              className={styles.select}
              value={filterCollectionId}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="Todos">Exibir Todas as Coleções</option>
              {collectionsList.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.year} - {col.season})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.controlBox}>
          <h3 className={styles.controlTitle}>Upload em Lote</h3>
          <div className={styles.uploadFormRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Vincular Mídias à Coleção:</label>
              <select
                className={styles.select}
                value={uploadCollectionId}
                onChange={(e) => setUploadCollectionId(e.target.value)}
              >
                {collectionsList.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} ({col.year})
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.fileUploadBtnGroup}>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className={styles.fileInputHidden}
                ref={fileInputRef}
                onChange={handleUpload}
                id="media-page-upload"
              />
              <label htmlFor="media-page-upload" className={styles.uploadBtn}>
                {uploading ? "Carregando..." : "Selecionar Arquivos"}
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Mídias Cadastradas */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <h2 className={styles.galleryTitle}>Mídias Cadastradas ({mediaList.length} arquivos)</h2>
          <p className={styles.gallerySubtitle}>Todas as mídias salvas localmente em /public/uploads/ prontas para vinculação.</p>
        </div>

        <div className={styles.mediaGrid}>
          {mediaList.length === 0 ? (
            <div className={styles.emptyGallery}>Sem mídias cadastradas para o filtro ativo. Faça uploads acima.</div>
          ) : (
            mediaList.map((asset) => {
              const isVideo = asset.mime_type.startsWith("video");
              // Achar o nome da coleção correspondente
              const col = collectionsList.find((c) => c.id === asset.collection_id);
              
              return (
                <div
                  key={asset.id}
                  className={`${styles.mediaCard} ${selectingForProduct ? styles.mediaCardSelectable : ""}`}
                  onDoubleClick={() => selectingForProduct && handleSelectMedia(asset.file_url)}
                  title={selectingForProduct ? "Clique duplo para vincular este arquivo" : undefined}
                >
                  <div className={styles.mediaThumbWrapper}>
                    {isVideo ? (
                      <video src={asset.file_url} muted playsInline className={styles.mediaThumb} />
                    ) : (
                      <img src={asset.file_url} alt={asset.filename} className={styles.mediaThumb} />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedAsset(asset);
                      }}
                      className={styles.zoomBtn}
                      title="Ampliar imagem para tamanho original"
                      aria-label="Ampliar imagem"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </button>
                    {!selectingForProduct && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAsset(asset.id);
                        }}
                        className={styles.deleteBtn}
                        title="Excluir arquivo definitivamente"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className={styles.mediaDetails}>
                    <span className={styles.filename} title={asset.filename}>
                      {asset.filename}
                    </span>
                    <div className={styles.mediaFooterRow}>
                      <span className={styles.collectionBadge}>
                        {col ? col.name : "Sem Coleção"}
                      </span>
                      {selectingForProduct && (
                        <button
                          type="button"
                          onClick={() => handleSelectMedia(asset.file_url)}
                          className={styles.selectAssetBtn}
                        >
                          Vincular
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Modal de Inspeção em Tamanho Original (Acionado por clique na Lupa) */}
      {zoomedAsset && (
        <div
          className={styles.zoomModalOverlay}
          onClick={() => setZoomedAsset(null)}
        >
          <div
            className={styles.zoomModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.zoomModalHeader}>
              <span className={styles.zoomModalFilename}>{zoomedAsset.filename}</span>
              <button
                type="button"
                className={styles.zoomModalCloseBtn}
                onClick={() => setZoomedAsset(null)}
                title="Fechar visualização (ESC)"
              >
                ×
              </button>
            </div>
            <div className={styles.zoomModalBody}>
              {zoomedAsset.mime_type.startsWith("video") ? (
                <video
                  src={zoomedAsset.file_url}
                  controls
                  autoPlay
                  className={styles.zoomModalMedia}
                />
              ) : (
                <img
                  src={zoomedAsset.file_url}
                  alt={zoomedAsset.filename}
                  className={styles.zoomModalMedia}
                />
              )}
            </div>
          </div>
        </div>
      )}

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
