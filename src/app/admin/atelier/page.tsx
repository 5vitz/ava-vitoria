'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import {
  ArtworkRecord,
  WritingMatrix26,
  MATRIX_26_KEYS_METADATA,
  DEFAULT_MATRIX_JAZZ_3D,
  compilePromptFromMatrix26,
} from '@/lib/artworks';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  year: number;
  season: string;
  productsCount: number;
  isActiveStorefront: boolean;
}

export default function AtelierPage() {
  const [activeTab, setActiveTab] = useState<'artworks' | 'collections' | 'media'>('artworks');

  // Estado das Artes Matrizes & Matriz Canônica (26 Chaves)
  const [artworks, setArtworks] = useState<ArtworkRecord[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkRecord | null>(null);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [savingArtwork, setSavingArtwork] = useState(false);
  const [folderFilter, setFolderFilter] = useState<string>('Todas');
  const [axisFilter, setAxisFilter] = useState<string>('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Estado para criação de Nova Arte Matriz
  const [showCreateArtModal, setShowCreateArtModal] = useState(false);
  const [newArtCode, setNewArtCode] = useState('');
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtFolder, setNewArtFolder] = useState('Testes');
  const [newArtSupplier, setNewArtSupplier] = useState('DIMONA');
  const [newArtConcept, setNewArtConcept] = useState('');
  const [newArtPreviewUrl, setNewArtPreviewUrl] = useState('');

  // Coleções reais do banco de dados
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [loadingCols, setLoadingCols] = useState(false);
  const [showCreateCol, setShowCreateCol] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColYear, setNewColYear] = useState(new Date().getFullYear().toString());
  const [newColSeason, setNewColSeason] = useState('Outono');

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const fetchArtworks = async (selectCode?: string) => {
    setLoadingArtworks(true);
    try {
      const res = await fetch('/api/artworks');
      const data = await res.json();
      if (data.success && Array.isArray(data.artworks)) {
        setArtworks(data.artworks);
        if (selectCode) {
          const found = data.artworks.find((a: ArtworkRecord) => a.code === selectCode);
          if (found) setSelectedArtwork(found);
        } else if (!selectedArtwork && data.artworks.length > 0) {
          setSelectedArtwork(data.artworks[0]);
        } else if (selectedArtwork) {
          const updated = data.artworks.find((a: ArtworkRecord) => a.id === selectedArtwork.id);
          if (updated) setSelectedArtwork(updated);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar artes matrizes:', err);
    } finally {
      setLoadingArtworks(false);
    }
  };

  const fetchCollections = async () => {
    setLoadingCols(true);
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
        setActiveCollectionId(data.activeCollectionId);
      }
    } catch (err) {
      console.error('Erro ao buscar coleções:', err);
    } finally {
      setLoadingCols(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
    fetchCollections();
  }, []);

  const handleToggleRegistered = async (art: ArtworkRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch('/api/artworks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: art.id,
          is_registered: !art.is_registered,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerFeedback(
          `✓ Status de registro de "${art.code}" atualizado para: ${!art.is_registered ? 'REGISTRADO (SIM)' : 'NÃO REGISTRADO'}`
        );
        fetchArtworks(art.code);
      }
    } catch {
      alert('Erro ao alternar registro da matriz.');
    }
  };

  const handleMatrixKeyChange = (key: keyof WritingMatrix26, value: string) => {
    if (!selectedArtwork) return;
    setSelectedArtwork({
      ...selectedArtwork,
      writing_matrix_26: {
        ...selectedArtwork.writing_matrix_26,
        [key]: value,
      },
    });
  };

  const handleSaveSelectedArtwork = async () => {
    if (!selectedArtwork) return;
    setSavingArtwork(true);
    try {
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedArtwork),
      });
      const data = await res.json();
      if (data.success) {
        triggerFeedback(
          `★ Matriz Canônica (26 Chaves) de "${selectedArtwork.code}" salva no PostgreSQL e Hash SHA-256 recalculado!`
        );
        fetchArtworks(selectedArtwork.code);
      } else {
        alert(data.error || 'Erro ao salvar matriz.');
      }
    } catch {
      alert('Erro de conexão ao salvar matriz.');
    } finally {
      setSavingArtwork(false);
    }
  };

  const handleCreateNewArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtCode.trim() || !newArtTitle.trim()) return;
    setSavingArtwork(true);

    try {
      const customMatrix: WritingMatrix26 = {
        ...DEFAULT_MATRIX_JAZZ_3D,
        '01_ontological_essence': newArtConcept || DEFAULT_MATRIX_JAZZ_3D['01_ontological_essence'],
        '04_primary_subject': newArtTitle,
      };

      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newArtCode.trim().toUpperCase(),
          title: newArtTitle.trim(),
          concept: newArtConcept.trim(),
          project_folder: newArtFolder.trim() || 'Testes',
          default_supplier: newArtSupplier,
          is_registered: false,
          mutated_keys_count: 8,
          preview_image_url: newArtPreviewUrl.trim(),
          writing_matrix_26: customMatrix,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateArtModal(false);
        setNewArtCode('');
        setNewArtTitle('');
        setNewArtConcept('');
        setNewArtPreviewUrl('');
        triggerFeedback(`★ Nova Arte Matriz "${data.artwork.code}" criada com 26 Chaves Canônicas!`);
        fetchArtworks(data.artwork.code);
      } else {
        alert(data.error || 'Erro ao criar arte matriz.');
      }
    } catch {
      alert('Erro ao criar nova arte matriz.');
    } finally {
      setSavingArtwork(false);
    }
  };

  const handleCopyCompiledPrompt = () => {
    if (!selectedArtwork) return;
    const compiled = compilePromptFromMatrix26(selectedArtwork.writing_matrix_26, selectedArtwork.title);
    navigator.clipboard.writeText(compiled);
    triggerFeedback(`📋 Prompt to Image compilado das 26 Chaves copiado para a área de transferência!`);
  };

  const handleDownloadMatrixJson = () => {
    if (!selectedArtwork) return;
    const payload = {
      $schema: 'https://ava-vitoria.com.br/schemas/mdv_writing_matrix.v26.json',
      artwork_code: selectedArtwork.code,
      title: selectedArtwork.title,
      project_folder: selectedArtwork.project_folder,
      is_registered: selectedArtwork.is_registered,
      coa_hash_sha256: selectedArtwork.coa_hash_sha256,
      mutated_keys_count: selectedArtwork.mutated_keys_count,
      compiled_prompt_to_image: compilePromptFromMatrix26(
        selectedArtwork.writing_matrix_26,
        selectedArtwork.title
      ),
      writing_matrix_26: selectedArtwork.writing_matrix_26,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedArtwork.code}_writing_matrix26.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSetActiveStorefront = async (collectionId: string) => {
    try {
      const res = await fetch('/api/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveCollectionId(collectionId);
        setCollections((prev) =>
          prev.map((c) => ({
            ...c,
            isActiveStorefront: c.id === collectionId,
          }))
        );
      }
    } catch {
      alert('Erro ao ativar coleção na vitrine.');
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newColName,
          year: newColYear,
          season: newColSeason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewColName('');
        setShowCreateCol(false);
        fetchCollections();
      }
    } catch {
      alert('Erro ao criar coleção.');
    }
  };

  const activeOrFirstColId = activeCollectionId || collections[0]?.id || '';

  const projectFolders = Array.from(
    new Set(['Todas', 'Testes', 'Coleção Sem Limites', 'Op-Art Reload', ...artworks.map((a) => a.project_folder)])
  );

  const filteredArtworks = artworks.filter(
    (a) => folderFilter === 'Todas' || a.project_folder === folderFilter
  );

  const filteredKeysMetadata = MATRIX_26_KEYS_METADATA.filter(
    (m) => axisFilter === 'ALL' || m.axis === axisFilter
  );

  const compiledPromptPreview = selectedArtwork
    ? compilePromptFromMatrix26(selectedArtwork.writing_matrix_26, selectedArtwork.title)
    : '';

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 08 · Atelier Criativo, Prompt to Image &amp; Mídias</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Tripoint</strong> · Motor de Decomposição Visual (MDV), Matriz Canônica de 26 Chaves, Matrizes 300 DPI e Coleções da Vitrine
            </p>
          </div>
          <div className={styles.flexRowStart}>
            <a
              href="/PDF/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              📄 PDF Matriz Canônica (24/26 Chaves) ↗
            </a>
            <span className={styles.partnerOwnerBadge}>
              👤 Titular: Tripoint
            </span>
          </div>
        </div>

        {feedbackMsg && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {feedbackMsg}
          </div>
        )}

        {/* Seletor de Abas do Atelier Unificado */}
        <div className={styles.tabStripContainer}>
          <button
            onClick={() => setActiveTab('artworks')}
            className={`${styles.tabBtn} ${activeTab === 'artworks' ? styles.tabBtnActive : ''}`}
          >
            🎨 Prompt to Image · Matriz Canônica (26 Chaves &amp; 300 DPI)
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`${styles.tabBtn} ${activeTab === 'collections' ? styles.tabBtnActive : ''}`}
          >
            ★ Projetos &amp; Coleções (Vitrine Ativa)
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`${styles.tabBtn} ${activeTab === 'media' ? styles.tabBtnActive : ''}`}
          >
            🖼️ Biblioteca Geral de Mídias (9 Colunas)
          </button>
        </div>

        {/* ABA PRINCIPAL: PROMPT TO IMAGE & MATRIZ CANÔNICA DE 26 CHAVES */}
        {activeTab === 'artworks' && (
          <div>
            <div className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div className={styles.flexRowBetween}>
                <div>
                  <h2 className={styles.cardHeadingNoBorder}>
                    Esteira Prompt to Image — Motor de Decomposição Visual (MDV) &amp; Matriz Canônica de 26 Chaves
                  </h2>
                  <p className={styles.textBodySmall}>
                    <strong>Regra de Ouro da Blindagem Autoral:</strong> O banco de dados e o Certificado COA gravam <strong>exclusivamente o JSON de Escrita (26 Chaves Autorais)</strong> após o <em>Subprocesso Obrigatório de Desvinculação Autoral</em> (mínimo de <strong>7 chaves mutadas</strong> entre 🔴 Zona 1 Identidade e 🟡 Zona 2 Geometria/Escorço 3D, preservando a 🟢 Zona 3 Física Estética).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextNum = artworks.length + 1;
                    setNewArtCode(`AVA-ART-${String(nextNum).padStart(3, '0')}`);
                    setShowCreateArtModal(!showCreateArtModal);
                  }}
                  className={styles.btnPrimary}
                >
                  {showCreateArtModal ? '✕ Fechar Cadastro' : '+ Nova Arte Matriz (26 Chaves)'}
                </button>
              </div>

              {/* Resumo dos 3 Estágios do MDV */}
              <div className={styles.autoGridCards}>
                <div className={styles.innerCardCompact}>
                  <div className={styles.kpiLabel}>Estágio 1 · Scanner Matemático (Python)</div>
                  <div className={styles.decisionTitle}>scripts/mdv_scanner.py</div>
                  <div className={styles.textBodySmall}>
                    Mede % espaço negativo (60-70%), espessura de traço (1px-3px), vetores de Sobel (45° vs 90°) e entropia 3x3.
                  </div>
                </div>

                <div className={styles.innerCardCompact}>
                  <div className={`${styles.kpiLabel} ${styles.textWarning}`}>
                    Estágio 2 · Desvinculação Autoral (≥ 7 Chaves)
                  </div>
                  <div className={styles.decisionTitle}>🔴 Zona 1 (≥4) + 🟡 Zona 2 (≥3) + 🟢 Zona 3</div>
                  <div className={styles.textBodySmall}>
                    Muta sujeito e ângulo óptico (ex: Escorço 3D 75° no Eixo Z) mantendo a física do estilo.
                  </div>
                </div>

                <div className={styles.innerCardCompact}>
                  <div className={`${styles.kpiLabel} ${styles.textSuccess}`}>
                    Estágio 3 · Prompt to Image &amp; COA SHA-256
                  </div>
                  <div className={styles.decisionTitle}>Compilador 26 Chaves + Gabarito 300 DPI</div>
                  <div className={styles.textBodySmall}>
                    Dimona Silk HD (3435×4680px zero margem) e Reserva INK (4200×4800px PNG).
                  </div>
                </div>
              </div>

              {/* Modal Inline de Criação de Nova Arte Matriz */}
              {showCreateArtModal && (
                <form onSubmit={handleCreateNewArtwork} className={`${styles.innerCard} ${styles.flexColStack}`}>
                  <h3 className={styles.decisionTitle}>
                    + Cadastrar Nova Arte Matriz na Matriz Canônica (26 Chaves)
                  </h3>
                  <div className={styles.autoGridSmall}>
                    <div>
                      <label className={styles.formLabel}>Código da Obra *</label>
                      <input
                        type="text"
                        required
                        value={newArtCode}
                        onChange={(e) => setNewArtCode(e.target.value)}
                        placeholder="Ex: AVA-TEST-003"
                        className={styles.formInput}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Título da Obra *</label>
                      <input
                        type="text"
                        required
                        value={newArtTitle}
                        onChange={(e) => setNewArtTitle(e.target.value)}
                        placeholder="Ex: Vórtice Op-Art Gravitacional"
                        className={styles.formInput}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Pasta-Projeto</label>
                      <input
                        type="text"
                        value={newArtFolder}
                        onChange={(e) => setNewArtFolder(e.target.value)}
                        placeholder="Ex: Testes ou Coleção Sem Limites"
                        className={styles.formInput}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Fornecedor Padrão</label>
                      <select
                        value={newArtSupplier}
                        onChange={(e) => setNewArtSupplier(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="DIMONA">DIMONA (Silk HD 3435×4680)</option>
                        <option value="RESERVA_INK">RESERVA INK (DTG 4200×4800)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.moduleGrid2Cols}>
                    <div>
                      <label className={styles.formLabel}>Conceito Filosófico / Tese da Obra</label>
                      <input
                        type="text"
                        value={newArtConcept}
                        onChange={(e) => setNewArtConcept(e.target.value)}
                        placeholder="Descreva a essência autoral..."
                        className={styles.formInput}
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>URL da Imagem Preview (Opcional)</label>
                      <input
                        type="text"
                        value={newArtPreviewUrl}
                        onChange={(e) => setNewArtPreviewUrl(e.target.value)}
                        placeholder="/imagens/projetos/Testes/..."
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={savingArtwork}
                      className={styles.btnPrimary}
                    >
                      {savingArtwork ? 'Gravando no PostgreSQL...' : 'Gravar Obra & Inicializar 26 Chaves Canônicas'}
                    </button>
                  </div>
                </form>
              )}

              {/* Filtro por Pasta-Projeto */}
              <div className={styles.flexRowStart}>
                <span className={styles.kpiLabel}>📁 Pasta-Projeto:</span>
                {projectFolders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setFolderFilter(folder)}
                    className={`${styles.executiveHeaderBtn} ${
                      folderFilter === folder ? styles.executiveHeaderBtnActive : ''
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.moduleGrid2Cols}>
              {/* COLUNA ESQUERDA: LISTA DE ARTES MATRIZES */}
              <div className={styles.moduleCard}>
                <h2 className={styles.cardHeading}>
                  Acervo de Matrizes ({filteredArtworks.length})
                </h2>

                {loadingArtworks ? (
                  <div className={styles.textMutedSmall}>
                    Carregando matrizes do PostgreSQL...
                  </div>
                ) : (
                  <div className={styles.flexColStack}>
                    {filteredArtworks.map((art) => {
                      const isSelected = selectedArtwork?.id === art.id;
                      return (
                        <div
                          key={art.id}
                          onClick={() => setSelectedArtwork(art)}
                          className={`${styles.innerCardInteractive} ${styles.flexRowStart} ${
                            isSelected ? styles.innerCardSelected : ''
                          }`}
                        >
                          {art.preview_image_url && (
                            <img
                              src={art.preview_image_url}
                              alt={art.title}
                              width={64}
                              height={64}
                              className={styles.innerCardCompact}
                            />
                          )}

                          <div className={styles.flexColTight}>
                            <div className={styles.flexRowBetween}>
                              <span className={styles.decisionTitle}>{art.title}</span>
                              <button
                                type="button"
                                onClick={(e) => handleToggleRegistered(art, e)}
                                title="Clique para alternar o status Registrado (Sim / Não)"
                                className={`${styles.statusPill} ${
                                  art.is_registered ? styles.statusPillSuccess : styles.statusPillWarning
                                }`}
                              >
                                {art.is_registered ? '✓ Registrado: SIM' : '○ Registrado: NÃO'}
                              </button>
                            </div>

                            <div className={styles.textBodySmall}>
                              <strong>{art.code}</strong> · Pasta: <strong>{art.project_folder}</strong> · {art.default_supplier}
                            </div>

                            <div className={styles.flexRowBetween}>
                              <span
                                className={`${styles.textPrimaryBold} ${
                                  art.mutated_keys_count >= 7 ? styles.textSuccess : styles.textDanger
                                }`}
                              >
                                🧬 {art.mutated_keys_count}/26 Chaves Mutadas {art.mutated_keys_count >= 7 ? '(✓ Blindada)' : '(⚠️ Mín. 7)'}
                              </span>
                              <span className={styles.textMutedSmall}>
                                SHA-256: {art.coa_hash_sha256?.slice(0, 12)}...
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA: INSPETOR/EDITOR DAS 26 CHAVES & COMPILADOR PROMPT TO IMAGE */}
              {selectedArtwork && (
                <div className={styles.moduleCard}>
                  <div className={styles.flexRowBetween}>
                    <h2 className={styles.cardHeadingNoBorder}>
                      Matriz Canônica: {selectedArtwork.code}
                    </h2>
                    <div className={styles.flexRowStart}>
                      <button
                        type="button"
                        onClick={handleDownloadMatrixJson}
                        className={styles.btnSecondary}
                      >
                        ⬇️ Exportar JSON (26 Chaves)
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSelectedArtwork}
                        disabled={savingArtwork}
                        className={styles.btnPrimary}
                      >
                        {savingArtwork ? 'Salvando...' : '💾 Salvar Matriz & Recalcular SHA-256'}
                      </button>
                    </div>
                  </div>

                  {/* Cabeçalho Visual + Metadados Principais */}
                  <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                    <div className={styles.flexRowStart}>
                      {selectedArtwork.preview_image_url && (
                        <img
                          src={selectedArtwork.preview_image_url}
                          alt={selectedArtwork.title}
                          width={120}
                          height={120}
                          className={styles.innerCardCompact}
                        />
                      )}

                      <div className={styles.flexColStack}>
                        <div className={styles.autoGridSmall}>
                          <div>
                            <label className={styles.formLabel}>Título da Obra</label>
                            <input
                              type="text"
                              value={selectedArtwork.title}
                              onChange={(e) => setSelectedArtwork({ ...selectedArtwork, title: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                          <div>
                            <label className={styles.formLabel}>Pasta-Projeto</label>
                            <input
                              type="text"
                              value={selectedArtwork.project_folder}
                              onChange={(e) => setSelectedArtwork({ ...selectedArtwork, project_folder: e.target.value })}
                              className={styles.formInput}
                            />
                          </div>
                          <div>
                            <label className={styles.formLabel}>Chaves Mutadas</label>
                            <input
                              type="number"
                              min={0}
                              max={26}
                              value={selectedArtwork.mutated_keys_count}
                              onChange={(e) => setSelectedArtwork({ ...selectedArtwork, mutated_keys_count: Number(e.target.value) })}
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={styles.formLabel}>Conceito &amp; Linhagem MDV</label>
                          <textarea
                            rows={2}
                            value={selectedArtwork.concept}
                            onChange={(e) => setSelectedArtwork({ ...selectedArtwork, concept: e.target.value })}
                            className={styles.formTextarea}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.innerCardCompact} ${styles.innerCardSuccess} ${styles.textSuccess}`}>
                      <strong>COA SHA-256 (JSON de Escrita):</strong> {selectedArtwork.coa_hash_sha256}
                    </div>
                  </div>

                  {/* COMPILADOR PROMPT TO IMAGE AO VIVO */}
                  <div className={`${styles.innerCard} ${styles.flexColTight}`}>
                    <div className={styles.flexRowBetween}>
                      <span className={styles.decisionTitle}>
                        ⚡ Prompt to Image Compilado (Síntese Automática das 26 Chaves)
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCompiledPrompt}
                        className={styles.btnPrimary}
                      >
                        📋 Copiar Prompt to Image
                      </button>
                    </div>
                    <pre className={styles.innerCardCompact}>
                      {compiledPromptPreview}
                    </pre>
                  </div>

                  {/* SELETOR DE EIXOS DAS 26 CHAVES CANÔNICAS */}
                  <div className={styles.flexColTight}>
                    <div className={styles.decisionTitle}>
                      🔬 Editor Interativo das 26 Chaves Estruturais (JSON de Escrita Autoral):
                    </div>
                    <div className={styles.flexRowStart}>
                      {[
                        { id: 'ALL', label: 'Todas as 26 Chaves' },
                        { id: 'I_ONTOLOGICO', label: 'I. Ontológico (01–07)' },
                        { id: 'II_EPISTEMOLOGICO', label: 'II. Epistemológico (08–16)' },
                        { id: 'III_METODOLOGICO', label: 'III. Metodológico (17–24)' },
                        { id: 'IV_EXTENSAO_MDV', label: 'IV. Extensão MDV (25–26)' },
                      ].map((ax) => (
                        <button
                          key={ax.id}
                          type="button"
                          onClick={() => setAxisFilter(ax.id)}
                          className={`${styles.executiveHeaderBtn} ${
                            axisFilter === ax.id ? styles.executiveHeaderBtnActive : ''
                          }`}
                        >
                          {ax.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LISTA EDITÁVEL DAS 26 CHAVES */}
                  <div className={styles.flexColStack}>
                    {filteredKeysMetadata.map((meta) => {
                      const val = selectedArtwork.writing_matrix_26?.[meta.key] || '';
                      return (
                        <div key={meta.key} className={`${styles.innerCardCompact} ${styles.flexColTight}`}>
                          <div className={styles.flexRowBetween}>
                            <span className={styles.decisionTitle}>
                              #{meta.number} · {meta.label}{' '}
                              <span className={styles.textMutedSmall}>({meta.key})</span>
                            </span>
                            <span className={styles.statusPill}>
                              {meta.mutationZoneLabel}
                            </span>
                          </div>
                          <div className={styles.textMutedSmall}>{meta.description}</div>
                          <textarea
                            rows={2}
                            value={val}
                            onChange={(e) => handleMatrixKeyChange(meta.key, e.target.value)}
                            className={styles.formTextarea}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 2: PROJETOS E COLEÇÕES (VITRINE ATIVA) */}
        {activeTab === 'collections' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>Gerenciador de Coleções &amp; Vitrine Oficial</h2>
                <p className={styles.moduleSubtitle}>
                  Acesse o painel completo de ordenação do grid de 3 colunas, slots vazios e publicação da coleção ativa na Home.
                </p>
              </div>
              <div className={styles.flexRowStart}>
                <button
                  type="button"
                  onClick={() => setShowCreateCol(!showCreateCol)}
                  className={styles.btnSecondary}
                >
                  {showCreateCol ? '✕ Fechar Formulário' : '+ Nova Coleção'}
                </button>
                <Link
                  href={activeOrFirstColId ? `/admin/grid-manager?collection=${activeOrFirstColId}` : '/admin/grid-manager'}
                  className={styles.btnPrimary}
                >
                  Abrir Grid Manager da Vitrine ↗
                </Link>
                <Link href="/" target="_blank" className={styles.btnSecondary}>
                  Ver Loja Pública ↗
                </Link>
              </div>
            </div>

            {showCreateCol && (
              <form onSubmit={handleCreateCollection} className={`${styles.innerCard} ${styles.flexColStack}`}>
                <h3 className={styles.decisionTitle}>+ Cadastrar Nova Coleção</h3>
                <div className={styles.autoGridSmall}>
                  <div>
                    <label className={styles.formLabel}>Nome da Coleção</label>
                    <input
                      type="text"
                      placeholder="Ex: Coleção Inverno 2026"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      required
                      className={styles.formInput}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Ano</label>
                    <input
                      type="number"
                      value={newColYear}
                      onChange={(e) => setNewColYear(e.target.value)}
                      required
                      className={styles.formInput}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Estação</label>
                    <select
                      value={newColSeason}
                      onChange={(e) => setNewColSeason(e.target.value)}
                      className={styles.formSelect}
                    >
                      <option value="Outono">Outono</option>
                      <option value="Inverno">Inverno</option>
                      <option value="Primavera">Primavera</option>
                      <option value="Verão">Verão</option>
                      <option value="Especial">Especial (Colab/Cápsula)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <button type="submit" className={styles.btnPrimary}>
                    Gravar e Iniciar Coleção
                  </button>
                </div>
              </form>
            )}

            {loadingCols ? (
              <div className={styles.textMutedSmall}>Carregando coleções do catálogo...</div>
            ) : collections.length === 0 ? (
              <div className={styles.textMutedSmall}>
                Nenhuma coleção cadastrada. Clique em &quot;+ Nova Coleção&quot; para começar.
              </div>
            ) : (
              <div className={styles.autoGridCards}>
                {collections.map((col) => {
                  const isStoreActive = col.isActiveStorefront || col.id === activeCollectionId;

                  return (
                    <div
                      key={col.id}
                      className={`${styles.innerCard} ${styles.flexColStack} ${
                        isStoreActive ? styles.innerCardSelected : ''
                      }`}
                    >
                      <div>
                        <div className={styles.flexRowBetween}>
                          <span className={styles.decisionTitle}>{col.name}</span>
                          {isStoreActive ? (
                            <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                              ★ Vitrine Ativa da Loja
                            </span>
                          ) : (
                            <span className={styles.statusPill}>
                              {col.season} · {col.year}
                            </span>
                          )}
                        </div>
                        <p className={styles.textBodySmall}>
                          {col.productsCount} {col.productsCount === 1 ? 'produto cadastrado' : 'produtos cadastrados'} nesta coleção.
                        </p>
                      </div>

                      <div className={styles.flexColTight}>
                        <Link
                          href={`/admin/grid-manager?collection=${col.id}`}
                          className={styles.btnSecondary}
                        >
                          Editar Grid &amp; Produtos ↗
                        </Link>
                        {!isStoreActive && (
                          <button
                            type="button"
                            onClick={() => handleSetActiveStorefront(col.id)}
                            className={styles.btnPrimary}
                          >
                            ⚡ Definir como Vitrine Ativa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABA 3: BIBLIOTECA GERAL DE MÍDIAS (9 COLUNAS) */}
        {activeTab === 'media' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>Biblioteca Geral de Mídias (Grid Uniforme de 9 Colunas)</h2>
                <p className={styles.moduleSubtitle}>
                  Visualizador de imagens de alta resolução com Lightbox, ordenação e uploads vinculados à coleção ativa.
                </p>
              </div>
              <Link href="/admin/media" className={styles.btnPrimary}>
                Abrir Biblioteca em Tela Cheia ↗
              </Link>
            </div>

            <div className={`${styles.innerCard} ${styles.flexColStack}`}>
              <div className={styles.decisionTitle}>🖼️ Biblioteca Integrada Ativa</div>
              <p className={styles.textBodySmall}>
                Para fazer novos uploads, inspecionar fotos em tamanho original com a lupa ou organizar mídias por coleção, abra o visualizador dedicado.
              </p>
              <div>
                <Link href="/admin/media" className={styles.btnPrimary}>
                  Gerenciar Mídias da Coleção ↗
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
