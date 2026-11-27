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

interface MagnificResourceItem {
  id: string;
  title: string;
  previewUrl: string;
  type: string;
  orientation: string;
  author: string;
  license: string;
}

export default function AtelierPage() {
  const [activeTab, setActiveTab] = useState<'artworks' | 'collections' | 'media'>('artworks');

  // Controle de Accordions para enxugar altura vertical
  const [openStep1Magnific, setOpenStep1Magnific] = useState(true);
  const [openStep2MatrixEditor, setOpenStep2MatrixEditor] = useState(true);
  const [openSubKeysList, setOpenSubKeysList] = useState(false);
  const [openStep3ApproveBlockchain, setOpenStep3ApproveBlockchain] = useState(true);

  // Estado da Janela Buscadora Magnific / Freepik Stock API & Decompositor MDV
  const [stockSearchTerm, setStockSearchTerm] = useState('op art geometric 3d minimalism');
  const [stockContentType, setStockContentType] = useState('all');
  const [stockResources, setStockResources] = useState<MagnificResourceItem[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockApiSource, setStockApiSource] = useState<string>('MAGNIFIC_LIVE_API');
  const [stockApiNotice, setStockApiNotice] = useState<string | null>(null);
  const [selectedRefImage, setSelectedRefImage] = useState<MagnificResourceItem>({
    id: 'AVA-REF-001',
    title: 'Bailarina de Jazz em Salto 3D — 75° Escorço Eixo Z (Obra Inaugural)',
    previewUrl: '/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg',
    type: 'vector',
    orientation: 'vertical',
    author: 'AVA Atelier / MDV 26',
    license: 'Propriedade Autoral AVA',
  });
  const [customRefUrlInput, setCustomRefUrlInput] = useState('');
  const [customSubjectMutation, setCustomSubjectMutation] = useState(
    'Bailarina de Jazz / Streetwear Cinético em Salto Gravitacional 3D'
  );
  const [customAngleMutation, setCustomAngleMutation] = useState(
    'Escorço dramático de 75° projetado no Eixo Z (75-degree Z-axis foreshortening) emergindo da malha'
  );
  const [decomposingRef, setDecomposingRef] = useState(false);
  const [lastScannerMetrics, setLastScannerMetrics] = useState<any>(null);

  // Estado do Gerador Mystic & Upscaler 300 DPI (Magnific API)
  const [mysticGenerating, setMysticGenerating] = useState(false);
  const [upscaling300Dpi, setUpscaling300Dpi] = useState(false);
  const [activeMagnificTask, setActiveMagnificTask] = useState<{
    taskId: string;
    endpointType: 'mystic' | 'image-upscaler';
    status: string;
    resultUrl?: string | null;
  } | null>(null);

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

  // Fluxo Unificado Fase 0 & Fase 1 (Carta Conceitual dos 4 Pilares + Aprovação Bipartite p/ Blockchain)
  const [wfState, setWfState] = useState<any>(null);
  const [garmentModel, setGarmentModel] = useState('T-Shirt Prime 180g (Pele de Pêssego)');
  const [garmentColor, setGarmentColor] = useState('Preta');
  const [garmentSize, setGarmentSize] = useState('G');
  const [approvingFlow, setApprovingFlow] = useState(false);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 6500);
  };

  const fetchWorkflow = async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
      }
    } catch (err) {
      console.error('Erro ao buscar workflow no Atelier:', err);
    }
  };

  const handleSearchMagnificStock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStockLoading(true);
    setStockApiNotice(null);
    try {
      const params = new URLSearchParams({
        action: 'search',
        term: stockSearchTerm,
        type: stockContentType,
        limit: '8',
      });
      const res = await fetch(`/api/atelier/magnific?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setStockResources(data.resources || []);
        setStockApiSource(data.source || 'MAGNIFIC_LIVE_API');
        if (data.apiNotice) setStockApiNotice(data.apiNotice);
      }
    } catch (err) {
      console.error('Erro ao consultar Magnific Stock API:', err);
    } finally {
      setStockLoading(false);
    }
  };

  const handleDecomposeReferenceToJson26 = async () => {
    const refUrl = customRefUrlInput.trim() || selectedRefImage.previewUrl;
    const refTitle = customRefUrlInput.trim()
      ? 'Referência Customizada AVA'
      : selectedRefImage.title;

    if (!refUrl) return;
    setDecomposingRef(true);
    try {
      const res = await fetch('/api/atelier/magnific', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DECOMPOSE_REFERENCE_TO_MATRIX26',
          referenceUrl: refUrl,
          referenceTitle: refTitle,
          collectionCharter: wfState?.activeCharter || null,
          customSubjectMutation,
          customAngleMutation,
        }),
      });
      const data = await res.json();
      if (data.success && data.writingMatrix26) {
        setLastScannerMetrics(data.scannerMetrics);
        if (selectedArtwork) {
          setSelectedArtwork({
            ...selectedArtwork,
            preview_image_url: refUrl,
            mutated_keys_count: data.mutatedKeysCount || 9,
            writing_matrix_26: data.writingMatrix26,
          });
        }
        setOpenStep2MatrixEditor(true);
        triggerFeedback(data.message);
      } else {
        triggerFeedback(data.error || 'Erro ao decompor imagem de referência.');
      }
    } catch {
      triggerFeedback('Erro de conexão ao decompor imagem de referência.');
    } finally {
      setDecomposingRef(false);
    }
  };

  const handleGenerateMysticFromPrompt = async () => {
    if (!selectedArtwork) return;
    const prompt = compilePromptFromMatrix26(
      selectedArtwork.writing_matrix_26,
      selectedArtwork.title
    );
    setMysticGenerating(true);
    try {
      const res = await fetch('/api/atelier/magnific', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'GENERATE_MYSTIC_IMAGE',
          prompt,
          aspectRatio: 'traditional_3_4',
          resolution: '2k',
          model: 'realism',
        }),
      });
      const data = await res.json();
      if (data.success && data.taskId) {
        setActiveMagnificTask({
          taskId: data.taskId,
          endpointType: 'mystic',
          status: data.status || 'IN_PROGRESS',
        });
        triggerFeedback(data.message);
      } else {
        triggerFeedback(
          `⚠️ Magnific Mystic API: ${data.error || 'Verifique os créditos ou parâmetros da chave.'}`
        );
      }
    } catch {
      triggerFeedback('Erro ao disparar geração Mystic na Magnific API.');
    } finally {
      setMysticGenerating(false);
    }
  };

  const handleUpscale300DpiMagnific = async () => {
    if (!selectedArtwork) return;
    const imageUrl =
      selectedArtwork.preview_image_url ||
      '/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg';
    const prompt = compilePromptFromMatrix26(
      selectedArtwork.writing_matrix_26,
      selectedArtwork.title
    );
    setUpscaling300Dpi(true);
    try {
      const res = await fetch('/api/atelier/magnific', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPSCALE_IMAGE_300DPI',
          imageUrl,
          prompt,
          scaleFactor: '2x',
          optimizedFor: 'art_n_illustration',
        }),
      });
      const data = await res.json();
      if (data.success && data.taskId) {
        setActiveMagnificTask({
          taskId: data.taskId,
          endpointType: 'image-upscaler',
          status: data.status || 'IN_PROGRESS',
        });
        triggerFeedback(data.message);
      } else {
        triggerFeedback(
          `⚠️ Magnific Upscaler API: ${data.error || 'Verifique os parâmetros da imagem.'}`
        );
      }
    } catch {
      triggerFeedback('Erro ao iniciar Upscale 300 DPI na Magnific API.');
    } finally {
      setUpscaling300Dpi(false);
    }
  };

  const handleCheckMagnificTaskStatus = async () => {
    if (!activeMagnificTask) return;
    try {
      const params = new URLSearchParams({
        action: 'task_status',
        taskId: activeMagnificTask.taskId,
        endpointType: activeMagnificTask.endpointType,
      });
      const res = await fetch(`/api/atelier/magnific?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setActiveMagnificTask({
          ...activeMagnificTask,
          status: data.status,
          resultUrl: data.savedLocalUrl || null,
        });
        if (data.status === 'COMPLETED' && data.savedLocalUrl && selectedArtwork) {
          setSelectedArtwork({
            ...selectedArtwork,
            preview_image_url: data.savedLocalUrl,
          });
          triggerFeedback(
            `★ Imagem renderizada pela Magnific API e arquivada localmente em ${data.savedLocalUrl}!`
          );
        } else {
          triggerFeedback(`Status da Tarefa Magnific (${activeMagnificTask.taskId.slice(0, 8)}): ${data.status}`);
        }
      }
    } catch {
      triggerFeedback('Erro ao consultar status da tarefa na Magnific API.');
    }
  };

  const handleApproveForCollectionBlockchain = async () => {
    if (!selectedArtwork) return;
    setApprovingFlow(true);
    try {
      const baseCostMap: Record<string, number> = {
        'T-Shirt Prime 180g (Pele de Pêssego)': 67.9,
        'Camiseta Oversized Heavy 220g': 101.9,
        'Camiseta Estonada Vintage 30.1': 73.0,
        'T-Shirt Quality 30.1 (165g)': 59.9,
      };
      const baseCost = baseCostMap[garmentModel] || 67.9;

      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_ARTWORK_FOR_COLLECTION',
          code: selectedArtwork.code,
          title: `${selectedArtwork.title} (${garmentModel})`,
          previewImageUrl:
            selectedArtwork.preview_image_url ||
            '/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg',
          supplier: selectedArtwork.default_supplier || 'DIMONA',
          garmentModel,
          garmentColor,
          garmentSize,
          baseCost,
          sha256: selectedArtwork.coa_hash_sha256,
          mutatedKeysCount: selectedArtwork.mutated_keys_count,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        triggerFeedback(data.message);
      }
    } finally {
      setApprovingFlow(false);
    }
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
    fetchWorkflow();
    handleSearchMagnificStock();
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
          `✓ Status de registro de "${art.code}" atualizado para: ${
            !art.is_registered ? 'REGISTRADO (SIM)' : 'NÃO REGISTRADO'
          }`
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
        '01_ontological_essence':
          newArtConcept || DEFAULT_MATRIX_JAZZ_3D['01_ontological_essence'],
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
        triggerFeedback(
          `★ Nova Arte Matriz "${data.artwork.code}" criada com 26 Chaves Canônicas!`
        );
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
    const compiled = compilePromptFromMatrix26(
      selectedArtwork.writing_matrix_26,
      selectedArtwork.title
    );
    navigator.clipboard.writeText(compiled);
    triggerFeedback(
      `📋 Prompt to Image compilado das 26 Chaves copiado para a área de transferência!`
    );
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
    new Set([
      'Todas',
      'Testes',
      'Coleção Sem Limites',
      'Op-Art Reload',
      ...artworks.map((a) => a.project_folder),
    ])
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
            <h1 className={styles.moduleTitle}>
              Depto 08 · Atelier Criativo, Magnific API &amp; Matriz Canônica (26 Chaves)
            </h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Tripoint</strong> · Entrada de Imagem de Referência (Magnific/Freepik Stock API) ➔ Decomposição no JSON de 26 Chaves ➔ Geração Mystic &amp; Upscale 300 DPI
            </p>
          </div>
          <div className={styles.flexRowStart}>
            <Link href="/admin/marketing" className={styles.btnSecondary}>
              🧭 Ver Fase 0 (4 Pilares no Depto 07)
            </Link>
            <a
              href="/PDF/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              📄 PDF Matriz 26 Chaves ↗
            </a>
            <span className={styles.partnerOwnerBadge}>👤 Titular: Tripoint</span>
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
            🎨 Esteira Tecno-Criativa · Magnific API &amp; Matriz 26 Chaves
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`${styles.tabBtn} ${
              activeTab === 'collections' ? styles.tabBtnActive : ''
            }`}
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

        {/* ABA PRINCIPAL: ESTEIRA TECNO-CRIATIVA EM 3 ACCORDIONS SEQUENCIAIS */}
        {activeTab === 'artworks' && (
          <div className={styles.flexColStack}>
            {/* =================================================================== */}
            {/* ACCORDION 1 · PONTO DE PARTIDA DO ATELIER: IMAGEM DE REFERÊNCIA     */}
            {/* =================================================================== */}
            <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div
                className={styles.accordionHeaderBar}
                onClick={() => setOpenStep1Magnific(!openStep1Magnific)}
              >
                <div className={styles.accordionTitleGroup}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🔍 PASSO 1 (Início do Atelier): Entrada da Imagem de Referência (Magnific / Freepik API) ➔ Decomposição no JSON de 26 Chaves
                  </h2>
                  <p className={styles.textBodySmall}>
                    {wfState?.activeCharter ? (
                      <>
                        <strong>Guiado pela Fase 0 Homologada (4/4):</strong> {wfState.activeCharter.name} · <strong>Tema:</strong> {wfState.activeCharter.themeTrend}
                      </>
                    ) : (
                      <>
                        Busque uma referência no acervo de <strong>250M+ imagens da Magnific/Freepik API</strong> (ou informe uma imagem local) para o <strong>Scanner MDV Python</strong> extrair os pixels e preencher automaticamente o JSON de 26 Chaves.
                      </>
                    )}
                  </p>
                </div>

                <div className={styles.accordionRightGroup}>
                  <span
                    className={`${styles.statusPill} ${
                      stockApiSource === 'MAGNIFIC_LIVE_API'
                        ? styles.statusPillSuccess
                        : styles.statusPillInfo
                    }`}
                  >
                    {stockApiSource === 'MAGNIFIC_LIVE_API'
                      ? '🟢 Magnific API Conectada (20K Créditos)'
                      : '🔵 Acervo Híbrido AVA + Magnific'}
                  </span>
                  <button
                    type="button"
                    className={`${styles.accordionToggleBtn} ${
                      openStep1Magnific ? styles.accordionToggleBtnOpen : ''
                    }`}
                  >
                    {openStep1Magnific ? '▲ Recolher Passo 1' : '▼ Expandir Busca & Decomposição'}
                  </button>
                </div>
              </div>

              {openStep1Magnific && (
                <div className={styles.accordionBody}>
                  {/* Barra de Busca na Janela Magnific / Freepik Stock API */}
                  <form onSubmit={handleSearchMagnificStock} className={styles.innerCard}>
                    <div className={styles.flexRowBetween}>
                      <div className={styles.decisionTitle}>
                        🌐 Janela Visual: Acervo Magnific / Freepik Stock Content API (GET /v1/resources)
                      </div>
                      <span className={styles.textMutedSmall}>
                        Chave Ativa no .env: <code>MSe933d5...41bcf</code>
                      </span>
                    </div>

                    <div className={`${styles.autoGridSmall} ${styles.moduleCardTopSpaced}`}>
                      <div>
                        <label className={styles.formLabel}>Termo de Busca (Inglês ou Português)</label>
                        <input
                          type="text"
                          value={stockSearchTerm}
                          onChange={(e) => setStockSearchTerm(e.target.value)}
                          placeholder="Ex: op art geometric 3d, jazz dancer vector, streetwear graphic..."
                          className={styles.formInput}
                        />
                      </div>

                      <div>
                        <label className={styles.formLabel}>Filtro de Formato</label>
                        <select
                          value={stockContentType}
                          onChange={(e) => setStockContentType(e.target.value)}
                          className={styles.formSelect}
                        >
                          <option value="all">Todos (Vetores + Fotos + PSDs)</option>
                          <option value="vector">Apenas Vetores (Ilustrações / Linhas)</option>
                          <option value="photo">Apenas Fotografias / Editorial</option>
                          <option value="psd">Apenas Mockups / PSD</option>
                        </select>
                      </div>

                      <div className={styles.flexRowStart}>
                        <button
                          type="submit"
                          disabled={stockLoading}
                          className={styles.btnPrimary}
                        >
                          {stockLoading
                            ? 'Buscando na Magnific API...'
                            : '🔎 Buscar Imagens de Referência na API'}
                        </button>
                      </div>
                    </div>

                    {stockApiNotice && (
                      <div className={styles.textMutedSmall}>{stockApiNotice}</div>
                    )}

                    {/* Grade Visual de Miniaturas dentro do Painel */}
                    <div className={styles.autoGridSmall}>
                      {stockResources.map((item) => {
                        const isChosen =
                          !customRefUrlInput && selectedRefImage.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedRefImage(item);
                              setCustomRefUrlInput('');
                            }}
                            className={`${styles.innerCardInteractive} ${styles.flexColTight} ${
                              isChosen ? styles.innerCardSelected : ''
                            }`}
                          >
                            <img
                              src={item.previewUrl}
                              alt={item.title}
                              width={140}
                              height={140}
                              className={styles.innerCardCompact}
                            />
                            <div className={styles.decisionTitle}>{item.title}</div>
                            <div className={styles.textMutedSmall}>
                              Tipo: <strong>{item.type.toUpperCase()}</strong> · {item.author}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRefImage(item);
                                setCustomRefUrlInput('');
                              }}
                              className={isChosen ? styles.btnPrimary : styles.btnSecondary}
                            >
                              {isChosen ? '✓ Referência Selecionada' : '🎯 Usar como Referência'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </form>

                  {/* Painel de Decomposição Visual (Imagem Selecionada -> Scanner MDV -> 26 Chaves JSON) */}
                  <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                    <div className={styles.flexRowBetween}>
                      <div>
                        <div className={styles.decisionTitle}>
                          🧬 Motor de Decomposição Visual (MDV Python Scanner ➔ Matriz JSON de 26 Chaves)
                        </div>
                        <p className={styles.textBodySmall}>
                          A imagem de referência selecionada abaixo terá seus pixels escaneados (<code>scripts/mdv_scanner.py</code>) para preservar a <strong>🟢 Zona 3 (Física Estética: % Espaço Negativo e Traço)</strong> enquanto mutamos a <strong>🔴 Zona 1 (Sujeito)</strong> e a <strong>🟡 Zona 2 (Ângulo/Escorço 3D)</strong> para garantir <strong>≥ 7 chaves mutadas (Desvinculação Autoral)</strong>.
                        </p>
                      </div>
                      <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                        Referência Ativa: {customRefUrlInput ? 'URL Customizada' : selectedRefImage.id}
                      </span>
                    </div>

                    <div className={styles.autoGridSmall}>
                      <div>
                        <label className={styles.formLabel}>
                          Imagem de Referência Selecionada (ou cole URL/caminho local)
                        </label>
                        <input
                          type="text"
                          value={customRefUrlInput || selectedRefImage.previewUrl}
                          onChange={(e) => setCustomRefUrlInput(e.target.value)}
                          placeholder="/imagens/projetos/Testes/..."
                          className={styles.formInput}
                        />
                      </div>

                      <div>
                        <label className={styles.formLabel}>
                          🔴 Mutação Zona 1 (Novo Sujeito Autoral da Obra AVA)
                        </label>
                        <input
                          type="text"
                          value={customSubjectMutation}
                          onChange={(e) => setCustomSubjectMutation(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>

                      <div>
                        <label className={styles.formLabel}>
                          🟡 Mutação Zona 2 (Novo Ângulo Óptico / Escorço 3D no Eixo Z)
                        </label>
                        <input
                          type="text"
                          value={customAngleMutation}
                          onChange={(e) => setCustomAngleMutation(e.target.value)}
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <div className={styles.flexRowBetween}>
                      <button
                        type="button"
                        onClick={handleDecomposeReferenceToJson26}
                        disabled={decomposingRef}
                        className={styles.btnPrimary}
                      >
                        {decomposingRef
                          ? '🔬 Escaneando Pixels & Decompondo 26 Chaves...'
                          : '⚡ 1. Decompor Imagem de Referência ➔ Preencher JSON de 26 Chaves & Prompt to Image'}
                      </button>

                      {lastScannerMetrics && (
                        <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                          ✓ Scanner MDV: {lastScannerMetrics.negative_space_percent}% Espaço Negativo · Traço {lastScannerMetrics.estimated_stroke_px}px · 9/26 Chaves Mutadas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* =================================================================== */}
            {/* ACCORDION 2 · MATRIZ CANÔNICA (26 CHAVES) & GERADOR MAGNIFIC MYSTIC */}
            {/* =================================================================== */}
            <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div
                className={styles.accordionHeaderBar}
                onClick={() => setOpenStep2MatrixEditor(!openStep2MatrixEditor)}
              >
                <div className={styles.accordionTitleGroup}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🎨 PASSO 2: Matriz Canônica (JSON de 26 Chaves) ➔ Compilador Prompt to Image &amp; Geração via Magnific API
                  </h2>
                  <p className={styles.textBodySmall}>
                    Inspecione o JSON de Escrita de 26 Chaves gerado na decomposição, copie o Prompt Compilado ou dispare a geração direta no motor <strong>Magnific Mystic API</strong> e o <strong>Upscale 300 DPI</strong>.
                  </p>
                </div>

                <div className={styles.accordionRightGroup}>
                  {selectedArtwork && (
                    <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                      Obra Ativa: {selectedArtwork.code} ({selectedArtwork.mutated_keys_count}/26 mutadas)
                    </span>
                  )}
                  <button
                    type="button"
                    className={`${styles.accordionToggleBtn} ${
                      openStep2MatrixEditor ? styles.accordionToggleBtnOpen : ''
                    }`}
                  >
                    {openStep2MatrixEditor ? '▲ Recolher Passo 2' : '▼ Expandir Matriz 26 Chaves'}
                  </button>
                </div>
              </div>

              {openStep2MatrixEditor && (
                <div className={styles.accordionBody}>
                  <div className={styles.flexRowBetween}>
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

                    <button
                      type="button"
                      onClick={() => {
                        const nextNum = artworks.length + 1;
                        setNewArtCode(`AVA-ART-${String(nextNum).padStart(3, '0')}`);
                        setShowCreateArtModal(!showCreateArtModal);
                      }}
                      className={styles.btnSecondary}
                    >
                      {showCreateArtModal ? '✕ Fechar Cadastro' : '+ Nova Arte Matriz (26 Chaves)'}
                    </button>
                  </div>

                  {showCreateArtModal && (
                    <form
                      onSubmit={handleCreateNewArtwork}
                      className={`${styles.innerCard} ${styles.flexColStack}`}
                    >
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
                          <label className={styles.formLabel}>
                            Conceito Filosófico / Tese da Obra
                          </label>
                          <input
                            type="text"
                            value={newArtConcept}
                            onChange={(e) => setNewArtConcept(e.target.value)}
                            placeholder="Descreva a essência autoral..."
                            className={styles.formInput}
                          />
                        </div>
                        <div>
                          <label className={styles.formLabel}>
                            URL da Imagem Preview (Opcional)
                          </label>
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
                          {savingArtwork
                            ? 'Gravando no PostgreSQL...'
                            : 'Gravar Obra & Inicializar 26 Chaves Canônicas'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className={styles.moduleGrid2Cols}>
                    {/* COLUNA ESQUERDA: LISTA DE ARTES MATRIZES */}
                    <div className={styles.innerCard}>
                      <h3 className={styles.cardHeading}>
                        Acervo de Matrizes ({filteredArtworks.length})
                      </h3>

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
                                      className={`${styles.statusPill} ${
                                        art.is_registered
                                          ? styles.statusPillSuccess
                                          : styles.statusPillWarning
                                      }`}
                                    >
                                      {art.is_registered
                                        ? '✓ Registrado: SIM'
                                        : '○ Registrado: NÃO'}
                                    </button>
                                  </div>

                                  <div className={styles.textBodySmall}>
                                    <strong>{art.code}</strong> · Pasta:{' '}
                                    <strong>{art.project_folder}</strong> · {art.default_supplier}
                                  </div>

                                  <div className={styles.flexRowBetween}>
                                    <span
                                      className={`${styles.textPrimaryBold} ${
                                        art.mutated_keys_count >= 7
                                          ? styles.textSuccess
                                          : styles.textDanger
                                      }`}
                                    >
                                      🧬 {art.mutated_keys_count}/26 Chaves Mutadas{' '}
                                      {art.mutated_keys_count >= 7 ? '(✓ Blindada)' : '(⚠️ Mín. 7)'}
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

                    {/* COLUNA DIREITA: COMPILADOR PROMPT TO IMAGE + DISPARO MAGNIFIC MYSTIC & UPSCALER */}
                    {selectedArtwork && (
                      <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                        <div className={styles.flexRowBetween}>
                          <h3 className={styles.cardHeadingNoBorder}>
                            Matriz Ativa: {selectedArtwork.code}
                          </h3>
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
                              {savingArtwork
                                ? 'Salvando...'
                                : '💾 Salvar Matriz & Recalcular SHA-256'}
                            </button>
                          </div>
                        </div>

                        <div className={styles.flexRowStart}>
                          {selectedArtwork.preview_image_url && (
                            <img
                              src={selectedArtwork.preview_image_url}
                              alt={selectedArtwork.title}
                              width={110}
                              height={110}
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
                                  onChange={(e) =>
                                    setSelectedArtwork({
                                      ...selectedArtwork,
                                      title: e.target.value,
                                    })
                                  }
                                  className={styles.formInput}
                                />
                              </div>
                              <div>
                                <label className={styles.formLabel}>Pasta-Projeto</label>
                                <input
                                  type="text"
                                  value={selectedArtwork.project_folder}
                                  onChange={(e) =>
                                    setSelectedArtwork({
                                      ...selectedArtwork,
                                      project_folder: e.target.value,
                                    })
                                  }
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
                                  onChange={(e) =>
                                    setSelectedArtwork({
                                      ...selectedArtwork,
                                      mutated_keys_count: Number(e.target.value),
                                    })
                                  }
                                  className={styles.formInput}
                                />
                              </div>
                            </div>
                            <div className={`${styles.innerCardCompact} ${styles.innerCardSuccess} ${styles.textSuccess}`}>
                              <strong>COA SHA-256 (JSON 26 Chaves):</strong>{' '}
                              {selectedArtwork.coa_hash_sha256}
                            </div>
                          </div>
                        </div>

                        {/* COMPILADOR PROMPT TO IMAGE + BOTÕES DE EXECUÇÃO MAGNIFIC API */}
                        <div className={`${styles.innerCardCompact} ${styles.flexColTight}`}>
                          <div className={styles.flexRowBetween}>
                            <span className={styles.decisionTitle}>
                              ⚡ Prompt to Image Compilado (Síntese das 26 Chaves ➔ Magnific Mystic API)
                            </span>
                            <div className={styles.flexRowStart}>
                              <button
                                type="button"
                                onClick={handleCopyCompiledPrompt}
                                className={styles.btnSecondary}
                              >
                                📋 Copiar Prompt
                              </button>
                              <button
                                type="button"
                                onClick={handleGenerateMysticFromPrompt}
                                disabled={mysticGenerating}
                                className={styles.btnPrimary}
                              >
                                {mysticGenerating
                                  ? 'Disparando Mystic...'
                                  : '🎨 Gerar Arte via Magnific Mystic API'}
                              </button>
                              <button
                                type="button"
                                onClick={handleUpscale300DpiMagnific}
                                disabled={upscaling300Dpi}
                                className={styles.btnSuccess}
                              >
                                {upscaling300Dpi
                                  ? 'Iniciando Upscale...'
                                  : '🔬 Upscale 300 DPI (Magnific Sparkle)'}
                              </button>
                            </div>
                          </div>

                          <pre className={styles.innerCardCompact}>{compiledPromptPreview}</pre>

                          {activeMagnificTask && (
                            <div className={styles.innerRowItem}>
                              <div>
                                <strong>
                                  Tarefa Magnific ({activeMagnificTask.endpointType}):
                                </strong>{' '}
                                <code>{activeMagnificTask.taskId}</code> · Status:{' '}
                                <span className={styles.statusPill}>
                                  {activeMagnificTask.status}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCheckMagnificTaskStatus}
                                className={styles.btnPrimary}
                              >
                                🔄 Atualizar Status &amp; Baixar Imagem
                              </button>
                            </div>
                          )}
                        </div>

                        {/* SUB-ACCORDION PARA AS 26 CAIXAS DE TEXTO DO JSON (EVITA ROLAGEM INFINITA) */}
                        <div className={styles.subAccordionBox}>
                          <div
                            className={styles.subAccordionHeader}
                            onClick={() => setOpenSubKeysList(!openSubKeysList)}
                          >
                            <span>
                              🔬 Editor Detalhado das 26 Chaves Estruturais do JSON (4 Eixos Canônicos)
                            </span>
                            <span className={styles.accordionToggleBtn}>
                              {openSubKeysList
                                ? '▲ Recolher 26 Chaves'
                                : '▼ Abrir Editor das 26 Chaves'}
                            </span>
                          </div>

                          {openSubKeysList && (
                            <div className={styles.subAccordionContent}>
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

                              <div className={`${styles.flexColStack} ${styles.moduleCardTopSpaced}`}>
                                {filteredKeysMetadata.map((meta) => {
                                  const val =
                                    selectedArtwork.writing_matrix_26?.[meta.key] || '';
                                  return (
                                    <div
                                      key={meta.key}
                                      className={`${styles.innerCardCompact} ${styles.flexColTight}`}
                                    >
                                      <div className={styles.flexRowBetween}>
                                        <span className={styles.decisionTitle}>
                                          #{meta.number} · {meta.label}{' '}
                                          <span className={styles.textMutedSmall}>
                                            ({meta.key})
                                          </span>
                                        </span>
                                        <span className={styles.statusPill}>
                                          {meta.mutationZoneLabel}
                                        </span>
                                      </div>
                                      <div className={styles.textMutedSmall}>
                                        {meta.description}
                                      </div>
                                      <textarea
                                        rows={2}
                                        value={val}
                                        onChange={(e) =>
                                          handleMatrixKeyChange(meta.key, e.target.value)
                                        }
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
                  </div>
                </div>
              )}
            </section>

            {/* =================================================================== */}
            {/* ACCORDION 3 · APROVAÇÃO BIPARTITE PARA COLEÇÃO -> BLOCKCHAIN (01)   */}
            {/* =================================================================== */}
            <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div
                className={styles.accordionHeaderBar}
                onClick={() =>
                  setOpenStep3ApproveBlockchain(!openStep3ApproveBlockchain)
                }
              >
                <div className={styles.accordionTitleGroup}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🔐 PASSO 3 (Fechamento da Fase 1 no Atelier): Aprovar Arte p/ Coleção ➔ Enviar ao Jurídico (Flávio · Registro Blockchain)
                  </h2>
                  <p className={styles.textBodySmall}>
                    Seleciona a modelagem física (Prime 180g / Oversized 220g), congela o Hash Criptográfico <strong>SHA-256</strong> do JSON de 26 Chaves e despacha para a bandeja de Blockchain do <strong>Depto 01 · Jurídico</strong>.
                  </p>
                </div>

                <div className={styles.accordionRightGroup}>
                  {wfState?.pilotPiece ? (
                    <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                      Status: {wfState.pilotPiece.status}
                    </span>
                  ) : (
                    <span className={styles.statusPill}>Aguardando Aprovação</span>
                  )}

                  <button
                    type="button"
                    className={`${styles.accordionToggleBtn} ${
                      openStep3ApproveBlockchain ? styles.accordionToggleBtnOpen : ''
                    }`}
                  >
                    {openStep3ApproveBlockchain
                      ? '▲ Recolher Passo 3'
                      : '▼ Expandir Aprovação'}
                  </button>
                </div>
              </div>

              {openStep3ApproveBlockchain && (
                <div className={styles.accordionBody}>
                  <div className={styles.autoGridSmall}>
                    <div>
                      <label className={styles.formLabel}>
                        Arte Matriz Selecionada (26 Chaves)
                      </label>
                      <div className={styles.innerCardCompact}>
                        <strong className={styles.textPrimaryBold}>
                          {selectedArtwork
                            ? `${selectedArtwork.code} — ${selectedArtwork.title}`
                            : 'Selecione no Passo 2 acima'}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <label className={styles.formLabel}>
                        Modelagem da Camiseta Única (Dimona Silk HD)
                      </label>
                      <select
                        value={garmentModel}
                        onChange={(e) => setGarmentModel(e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="T-Shirt Prime 180g (Pele de Pêssego)">
                          T-Shirt Prime 180g (Pele de Pêssego) — Custo R$ 67,90
                        </option>
                        <option value="Camiseta Oversized Heavy 220g">
                          Camiseta Oversized Heavy 220g — Custo R$ 101,90
                        </option>
                        <option value="Camiseta Estonada Vintage 30.1">
                          Camiseta Estonada Vintage 30.1 — Custo R$ 73,00
                        </option>
                        <option value="T-Shirt Quality 30.1 (165g)">
                          T-Shirt Quality 30.1 (165g) — Custo R$ 59,90
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={styles.formLabel}>Cor Homologada &amp; Tamanho</label>
                      <div className={styles.flexRowStart}>
                        <select
                          value={garmentColor}
                          onChange={(e) => setGarmentColor(e.target.value)}
                          className={styles.formSelect}
                        >
                          <option value="Preta">Preta</option>
                          <option value="Branca / Off-White">Branca / Off-White</option>
                          <option value="Cinza Chumbo">Cinza Chumbo</option>
                          <option value="Vinho">Vinho</option>
                        </select>
                        <select
                          value={garmentSize}
                          onChange={(e) => setGarmentSize(e.target.value)}
                          className={styles.formSelect}
                        >
                          <option value="P">P</option>
                          <option value="M">M</option>
                          <option value="G">G</option>
                          <option value="GG">GG</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.flexRowBetween}>
                    <div className={styles.flexRowStart}>
                      <button
                        type="button"
                        onClick={handleApproveForCollectionBlockchain}
                        disabled={approvingFlow || !selectedArtwork}
                        className={styles.btnPrimary}
                      >
                        ✅ Aprovar Arte para Coleção (Congelar JSON 26 Chaves &amp; Enviar ao Jurídico)
                      </button>

                      {wfState?.pilotPiece && (
                        <Link href="/admin/juridico" className={styles.btnSuccess}>
                          ⛓️ Avançar para Etapa 2: Registrar JSON na Blockchain (Depto 01 · Flávio) ➔
                        </Link>
                      )}
                    </div>

                    {selectedArtwork?.coa_hash_sha256 && (
                      <span className={styles.textMutedSmall}>
                        Hash SHA-256:{' '}
                        <code>{selectedArtwork.coa_hash_sha256.slice(0, 20)}...</code>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ABA 2: PROJETOS E COLEÇÕES (VITRINE ATIVA) */}
        {activeTab === 'collections' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>
                  Gerenciador de Coleções &amp; Vitrine Oficial
                </h2>
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
                  href={
                    activeOrFirstColId
                      ? `/admin/grid-manager?collection=${activeOrFirstColId}`
                      : '/admin/grid-manager'
                  }
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
              <form
                onSubmit={handleCreateCollection}
                className={`${styles.innerCard} ${styles.flexColStack}`}
              >
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
                  const isStoreActive =
                    col.isActiveStorefront || col.id === activeCollectionId;

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
                            <span
                              className={`${styles.statusPill} ${styles.statusPillSuccess}`}
                            >
                              ★ Vitrine Ativa da Loja
                            </span>
                          ) : (
                            <span className={styles.statusPill}>
                              {col.season} · {col.year}
                            </span>
                          )}
                        </div>
                        <p className={styles.textBodySmall}>
                          {col.productsCount}{' '}
                          {col.productsCount === 1
                            ? 'produto cadastrado'
                            : 'produtos cadastrados'}{' '}
                          nesta coleção.
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
                <h2 className={styles.cardHeadingNoBorder}>
                  Biblioteca Geral de Mídias (Grid Uniforme de 9 Colunas)
                </h2>
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
