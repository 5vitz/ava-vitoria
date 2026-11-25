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

  // Alternar Registrado? Sim / Não no banco
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
    } catch (err) {
      alert('Erro ao alternar registro da matriz.');
    }
  };

  // Atualizar valor de uma das 26 chaves no estado da arte selecionada
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

  // Salvar alterações da Arte Matriz + 26 Chaves + Recalcular SHA-256 no PostgreSQL
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
    } catch (err) {
      alert('Erro de conexão ao salvar matriz.');
    } finally {
      setSavingArtwork(false);
    }
  };

  // Criar Nova Arte Matriz com Template Canônico de 26 Chaves
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
    } catch (err) {
      alert('Erro ao criar nova arte matriz.');
    } finally {
      setSavingArtwork(false);
    }
  };

  // Copiar Prompt to Image compilado
  const handleCopyCompiledPrompt = () => {
    if (!selectedArtwork) return;
    const compiled = compilePromptFromMatrix26(selectedArtwork.writing_matrix_26, selectedArtwork.title);
    navigator.clipboard.writeText(compiled);
    triggerFeedback(`📋 Prompt to Image compilado das 26 Chaves copiado para a área de transferência!`);
  };

  // Baixar JSON de Escrita (26 Chaves + COA SHA-256)
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
    } catch (err) {
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
    } catch (err) {
      alert('Erro ao criar coleção.');
    }
  };

  const activeOrFirstColId = activeCollectionId || collections[0]?.id || '';

  // Pastas-projeto únicas disponíveis
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href="/PDF/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
              style={{ fontSize: '11px', padding: '6px 12px', textDecoration: 'none' }}
            >
              📄 PDF Matriz Canônica (24/26 Chaves) ↗
            </a>
            <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
              👤 Titular: Tripoint
            </span>
          </div>
        </div>

        {feedbackMsg && (
          <div
            style={{
              padding: '12px 16px',
              marginBottom: '18px',
              background: '#FEFCF5',
              border: '2px solid #047857',
              color: '#065F46',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {feedbackMsg}
          </div>
        )}

        {/* Seletor de Abas do Atelier */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.14)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('artworks')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'artworks' ? '#000000' : '#F4F4F6',
              color: activeTab === 'artworks' ? '#E4E4E7' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'artworks' ? '#000000' : 'rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            🎨 Prompt to Image · Matriz Canônica (26 Chaves &amp; 300 DPI)
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'collections' ? '#000000' : '#F4F4F6',
              color: activeTab === 'collections' ? '#E4E4E7' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'collections' ? '#000000' : 'rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            ★ Projetos &amp; Coleções (Vitrine Ativa)
          </button>

          <button
            onClick={() => setActiveTab('media')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'media' ? '#000000' : '#F4F4F6',
              color: activeTab === 'media' ? '#E4E4E7' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'media' ? '#000000' : 'rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            🖼️ Biblioteca Geral de Mídias (9 Colunas)
          </button>
        </div>

        {/* ABA PRINCIPAL: PROMPT TO IMAGE & MATRIZ CANÔNICA DE 26 CHAVES */}
        {activeTab === 'artworks' && (
          <div>
            {/* Barra de Arquitetura MDV & Ações */}
            <div className={styles.moduleCard} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 className={styles.cardHeading}>
                    Esteira Prompt to Image — Motor de Decomposição Visual (MDV) &amp; Matriz Canônica de 26 Chaves
                  </h2>
                  <p style={{ fontSize: '12px', color: '#374151', maxWidth: '880px', lineHeight: '1.5' }}>
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
                  style={{ fontSize: '11px', padding: '10px 16px' }}
                >
                  {showCreateArtModal ? '✕ Fechar Cadastro' : '+ Nova Arte Matriz (26 Chaves)'}
                </button>
              </div>

              {/* Resumo dos 3 Estágios do MDV */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '14px' }}>
                <div style={{ padding: '10px 12px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.14)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4B5563' }}>
                    Estágio 1 · Scanner Matemático (Python)
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                    scripts/mdv_scanner.py
                  </div>
                  <div style={{ fontSize: '11px', color: '#374151', marginTop: '2px' }}>
                    Mede % espaço negativo (60-70%), espessura de traço (1px-3px), vetores de Sobel (45° vs 90°) e entropia 3x3.
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.14)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#92400E' }}>
                    Estágio 2 · Desvinculação Autoral (≥ 7 Chaves)
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                    🔴 Zona 1 (≥4) + 🟡 Zona 2 (≥3) + 🟢 Zona 3
                  </div>
                  <div style={{ fontSize: '11px', color: '#374151', marginTop: '2px' }}>
                    Muta sujeito e ângulo óptico (ex: Escorço 3D 75° no Eixo Z) mantendo a física do estilo.
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.14)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#065F46' }}>
                    Estágio 3 · Prompt to Image &amp; COA SHA-256
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                    Compilador 26 Chaves + Gabarito 300 DPI
                  </div>
                  <div style={{ fontSize: '11px', color: '#374151', marginTop: '2px' }}>
                    Dimona Silk HD (3435×4680px zero margem) e Reserva INK (4200×4800px PNG).
                  </div>
                </div>
              </div>

              {/* Modal Inline de Criação de Nova Arte Matriz */}
              {showCreateArtModal && (
                <form
                  onSubmit={handleCreateNewArtwork}
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: '#E4E4E7',
                    border: '1px solid rgba(0,0,0,0.25)',
                  }}
                >
                  <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', color: '#000000' }}>
                    + Cadastrar Nova Arte Matriz na Matriz Canônica (26 Chaves)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Código da Obra *
                      </label>
                      <input
                        type="text"
                        required
                        value={newArtCode}
                        onChange={(e) => setNewArtCode(e.target.value)}
                        placeholder="Ex: AVA-TEST-003"
                        style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Título da Obra *
                      </label>
                      <input
                        type="text"
                        required
                        value={newArtTitle}
                        onChange={(e) => setNewArtTitle(e.target.value)}
                        placeholder="Ex: Vórtice Op-Art Gravitacional"
                        style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Pasta-Projeto
                      </label>
                      <input
                        type="text"
                        value={newArtFolder}
                        onChange={(e) => setNewArtFolder(e.target.value)}
                        placeholder="Ex: Testes ou Coleção Sem Limites"
                        style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Fornecedor Padrão
                      </label>
                      <select
                        value={newArtSupplier}
                        onChange={(e) => setNewArtSupplier(e.target.value)}
                        style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                      >
                        <option value="DIMONA">DIMONA (Silk HD 3435×4680)</option>
                        <option value="RESERVA_INK">RESERVA INK (DTG 4200×4800)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Conceito Filosófico / Tese da Obra
                      </label>
                      <input
                        type="text"
                        value={newArtConcept}
                        onChange={(e) => setNewArtConcept(e.target.value)}
                        placeholder="Descreva a essência autoral..."
                        style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        URL da Imagem Preview (Opcional)
                      </label>
                      <input
                        type="text"
                        value={newArtPreviewUrl}
                        onChange={(e) => setNewArtPreviewUrl(e.target.value)}
                        placeholder="/imagens/projetos/Testes/..."
                        style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingArtwork}
                    className={styles.btnPrimary}
                    style={{ marginTop: '12px', fontSize: '11px', padding: '8px 16px' }}
                  >
                    {savingArtwork ? 'Gravando no PostgreSQL...' : 'Gravar Obra & Inicializar 26 Chaves Canônicas'}
                  </button>
                </form>
              )}

              {/* Filtro por Pasta-Projeto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#374151' }}>
                  📁 Pasta-Projeto:
                </span>
                {projectFolders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setFolderFilter(folder)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: folderFilter === folder ? '#000000' : '#FEFCF5',
                      color: folderFilter === folder ? '#E4E4E7' : '#18181B',
                      border: '1px solid rgba(0,0,0,0.2)',
                    }}
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
                  <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#4B5563' }}>
                    Carregando matrizes do PostgreSQL...
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredArtworks.map((art) => {
                      const isSelected = selectedArtwork?.id === art.id;
                      return (
                        <div
                          key={art.id}
                          onClick={() => setSelectedArtwork(art)}
                          style={{
                            padding: '12px',
                            background: isSelected ? '#FEFCF5' : '#F4F4F6',
                            border: isSelected ? '2px solid #000000' : '1px solid rgba(0,0,0,0.14)',
                            boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                          }}
                        >
                          {art.preview_image_url && (
                            <div
                              style={{
                                width: '64px',
                                height: '64px',
                                flexShrink: 0,
                                background: '#E4E4E7',
                                border: '1px solid rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={art.preview_image_url}
                                alt={art.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 700, color: '#000000', fontSize: '13px' }}>{art.title}</span>
                              <button
                                type="button"
                                onClick={(e) => handleToggleRegistered(art, e)}
                                title="Clique para alternar o status Registrado (Sim / Não)"
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  cursor: 'pointer',
                                  background: art.is_registered ? 'rgba(4,120,87,0.14)' : 'rgba(146,64,14,0.14)',
                                  color: art.is_registered ? '#047857' : '#92400E',
                                  border: `1px solid ${art.is_registered ? 'rgba(4,120,87,0.35)' : 'rgba(146,64,14,0.35)'}`,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {art.is_registered ? '✓ Registrado: SIM' : '○ Registrado: NÃO'}
                              </button>
                            </div>

                            <div style={{ fontSize: '11px', color: '#374151', marginBottom: '4px' }}>
                              <strong>{art.code}</strong> · Pasta: <strong>{art.project_folder}</strong> · {art.default_supplier}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: art.mutated_keys_count >= 7 ? '#065F46' : '#991B1B',
                                }}
                              >
                                🧬 {art.mutated_keys_count}/26 Chaves Mutadas {art.mutated_keys_count >= 7 ? '(✓ Blindada)' : '(⚠️ Mín. 7)'}
                              </span>
                              <span style={{ fontFamily: 'monospace', color: '#4B5563' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <h2 className={styles.cardHeading} style={{ margin: 0 }}>
                      Matriz Canônica: {selectedArtwork.code}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleDownloadMatrixJson}
                        className={styles.btnSecondary}
                        style={{ fontSize: '11px', padding: '6px 10px' }}
                      >
                        ⬇️ Exportar JSON (26 Chaves)
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSelectedArtwork}
                        disabled={savingArtwork}
                        className={styles.btnPrimary}
                        style={{ fontSize: '11px', padding: '6px 12px' }}
                      >
                        {savingArtwork ? 'Salvando...' : '💾 Salvar Matriz & Recalcular SHA-256'}
                      </button>
                    </div>
                  </div>

                  {/* Cabeçalho Visual + Metadados Principais */}
                  <div style={{ display: 'grid', gridTemplateColumns: selectedArtwork.preview_image_url ? '140px 1fr' : '1fr', gap: '14px', marginBottom: '16px', padding: '12px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.14)' }}>
                    {selectedArtwork.preview_image_url && (
                      <div style={{ width: '140px', height: '140px', background: '#E4E4E7', border: '1px solid rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                        <img
                          src={selectedArtwork.preview_image_url}
                          alt={selectedArtwork.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4B5563' }}>Título da Obra</label>
                          <input
                            type="text"
                            value={selectedArtwork.title}
                            onChange={(e) => setSelectedArtwork({ ...selectedArtwork, title: e.target.value })}
                            style={{ width: '100%', padding: '6px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px', fontWeight: 700 }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '6px' }}>
                          <div>
                            <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4B5563' }}>Pasta-Projeto</label>
                            <input
                              type="text"
                              value={selectedArtwork.project_folder}
                              onChange={(e) => setSelectedArtwork({ ...selectedArtwork, project_folder: e.target.value })}
                              style={{ width: '100%', padding: '6px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4B5563' }}>Mutadas</label>
                            <input
                              type="number"
                              min={0}
                              max={26}
                              value={selectedArtwork.mutated_keys_count}
                              onChange={(e) => setSelectedArtwork({ ...selectedArtwork, mutated_keys_count: Number(e.target.value) })}
                              style={{ width: '100%', padding: '6px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.2)', fontSize: '12px', fontWeight: 700 }}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4B5563' }}>Conceito &amp; Linhagem MDV</label>
                        <textarea
                          rows={2}
                          value={selectedArtwork.concept}
                          onChange={(e) => setSelectedArtwork({ ...selectedArtwork, concept: e.target.value })}
                          style={{ width: '100%', padding: '6px', background: '#FEFCF5', border: '1px solid rgba(0,0,0,0.2)', fontSize: '11px' }}
                        />
                      </div>

                      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#065F46', background: '#FEFCF5', padding: '6px 8px', border: '1px solid rgba(4,120,87,0.3)', wordBreak: 'break-all' }}>
                        <strong>COA SHA-256 (JSON de Escrita):</strong> {selectedArtwork.coa_hash_sha256}
                      </div>
                    </div>
                  </div>

                  {/* COMPILADOR PROMPT TO IMAGE AO VIVO */}
                  <div style={{ marginBottom: '16px', padding: '12px', background: '#FEFCF5', border: '2px solid #000000' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000' }}>
                        ⚡ Prompt to Image Compilado (Síntese Automática das 26 Chaves)
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCompiledPrompt}
                        className={styles.btnPrimary}
                        style={{ fontSize: '10px', padding: '4px 10px' }}
                      >
                        📋 Copiar Prompt to Image
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '10px',
                        background: '#F4F4F6',
                        border: '1px solid rgba(0,0,0,0.15)',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.45',
                        color: '#18181B',
                        maxHeight: '170px',
                        overflowY: 'auto',
                      }}
                    >
                      {compiledPromptPreview}
                    </pre>
                  </div>

                  {/* SELETOR DE EIXOS DAS 26 CHAVES CANÔNICAS */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', color: '#000000' }}>
                      🔬 Editor Interativo das 26 Chaves Estruturais (JSON de Escrita Autoral):
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                          style={{
                            padding: '4px 10px',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: axisFilter === ax.id ? '#000000' : '#F4F4F6',
                            color: axisFilter === ax.id ? '#E4E4E7' : '#18181B',
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                        >
                          {ax.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LISTA EDITÁVEL DAS 26 CHAVES */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      maxHeight: '520px',
                      overflowY: 'auto',
                      paddingRight: '4px',
                    }}
                  >
                    {filteredKeysMetadata.map((meta) => {
                      const val = selectedArtwork.writing_matrix_26?.[meta.key] || '';
                      return (
                        <div
                          key={meta.key}
                          style={{
                            padding: '10px',
                            background: '#F4F4F6',
                            border: '1px solid rgba(0,0,0,0.14)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>
                              #{meta.number} · {meta.label}{' '}
                              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4B5563', fontWeight: 500 }}>
                                ({meta.key})
                              </span>
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                background: '#FEFCF5',
                                border: '1px solid rgba(0,0,0,0.16)',
                              }}
                            >
                              {meta.mutationZoneLabel}
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: '#4B5563', marginBottom: '6px' }}>
                            {meta.description}
                          </div>
                          <textarea
                            rows={2}
                            value={val}
                            onChange={(e) => handleMatrixKeyChange(meta.key, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              background: '#FEFCF5',
                              border: '1px solid rgba(0,0,0,0.22)',
                              fontSize: '11px',
                              color: '#000000',
                              lineHeight: '1.4',
                            }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className={styles.cardHeading}>Gerenciador de Coleções &amp; Vitrine Oficial</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Acesse o painel completo de ordenação do grid de 3 colunas, slots vazios e publicação da coleção ativa na Home.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateCol(!showCreateCol)}
                  className={styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '8px 14px' }}
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

            {/* Formulário de Criação de Coleção */}
            {showCreateCol && (
              <form onSubmit={handleCreateCollection} style={{ marginTop: '20px', padding: '16px', background: '#E4E4E7', border: '1px solid rgba(0,0,0,0.18)', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', color: '#000000' }}>
                  + Cadastrar Nova Coleção
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: '#374151' }}>Nome da Coleção</label>
                    <input
                      type="text"
                      placeholder="Ex: Coleção Inverno 2026"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', color: '#000000', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: '#374151' }}>Ano</label>
                    <input
                      type="number"
                      value={newColYear}
                      onChange={(e) => setNewColYear(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', color: '#000000', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: '#374151' }}>Estação</label>
                    <select
                      value={newColSeason}
                      onChange={(e) => setNewColSeason(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', color: '#000000', fontSize: '13px' }}
                    >
                      <option value="Outono">Outono</option>
                      <option value="Inverno">Inverno</option>
                      <option value="Primavera">Primavera</option>
                      <option value="Verão">Verão</option>
                      <option value="Especial">Especial (Colab/Cápsula)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  style={{ marginTop: '14px', fontSize: '11px', padding: '8px 16px' }}
                >
                  Gravar e Iniciar Coleção
                </button>
              </form>
            )}

            {/* Grid de Coleções do Banco */}
            {loadingCols ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#52525B', fontSize: '13px' }}>
                Carregando coleções do catálogo...
              </div>
            ) : collections.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#52525B', fontSize: '13px' }}>
                Nenhuma coleção cadastrada. Clique em "+ Nova Coleção" para começar.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {collections.map((col) => {
                  const isStoreActive = col.isActiveStorefront || col.id === activeCollectionId;

                  return (
                    <div
                      key={col.id}
                      style={{
                        padding: '16px',
                        background: isStoreActive ? '#FEFCF5' : '#F4F4F6',
                        border: isStoreActive ? '2px solid #000000' : '1px solid rgba(0,0,0,0.14)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#000000', fontSize: '15px' }}>{col.name}</span>
                          {isStoreActive ? (
                            <span style={{ fontSize: '10px', background: 'rgba(5,150,105,0.14)', color: '#065F46', border: '1px solid rgba(5,150,105,0.3)', padding: '2px 6px', fontWeight: 700 }}>
                              ★ Vitrine Ativa da Loja
                            </span>
                          ) : (
                            <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.18)', color: '#4B5563', padding: '2px 6px', fontWeight: 600 }}>
                              {col.season} · {col.year}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: '#374151', marginBottom: '14px' }}>
                          {col.productsCount} {col.productsCount === 1 ? 'produto cadastrado' : 'produtos cadastrados'} nesta coleção.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        <Link
                          href={`/admin/grid-manager?collection=${col.id}`}
                          className={styles.btnSecondary}
                          style={{ display: 'block', textAlign: 'center', fontSize: '11px', textDecoration: 'none' }}
                        >
                          Editar Grid &amp; Produtos ↗
                        </Link>
                        {!isStoreActive && (
                          <button
                            type="button"
                            onClick={() => handleSetActiveStorefront(col.id)}
                            style={{
                              padding: '6px 10px',
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px',
                              background: '#FFFFFF',
                              border: '1px solid rgba(0,0,0,0.22)',
                              color: '#000000',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Biblioteca Geral de Mídias (Grid Uniforme de 9 Colunas)</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Visualizador de imagens de alta resolução com Lightbox, ordenação e uploads vinculados à coleção ativa.
                </p>
              </div>
              <Link href="/admin/media" className={styles.btnPrimary}>
                Abrir Biblioteca em Tela Cheia ↗
              </Link>
            </div>

            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', marginTop: '16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                Biblioteca Integrada Ativa
              </div>
              <p style={{ fontSize: '12px', color: '#374151', maxWidth: '450px', margin: '0 auto 16px auto' }}>
                Para fazer novos uploads, inspecionar fotos em tamanho original com a lupa ou organizar mídias por coleção, abra o visualizador dedicado.
              </p>
              <Link href="/admin/media" className={styles.btnPrimary}>
                Gerenciar Mídias da Coleção ↗
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
