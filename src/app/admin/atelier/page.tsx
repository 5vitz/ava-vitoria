'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { AGENTS_DOSSIER, AgentDossier } from '../agentDossierData';
import AgentDossierModal from '../AgentDossierModal';

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
  const [selectedAgentModal, setSelectedAgentModal] = useState<AgentDossier | null>(null);

  // Controle de Accordions para enxugar altura vertical
  const [openStep1Magnific, setOpenStep1Magnific] = useState(true);
  const [openStep2MatrixEditor, setOpenStep2MatrixEditor] = useState(true);
  const [openAcervoList, setOpenAcervoList] = useState(false); // Recolhido por default!
  const [openStep3ApproveBlockchain, setOpenStep3ApproveBlockchain] = useState(true);

  // Estado da Janela Buscadora Magnific / Freepik Stock API (com paginação e seletor de quantidade)
  const [stockSearchTerm, setStockSearchTerm] = useState('op art geometric 3d minimalism');
  const [stockContentType, setStockContentType] = useState('all');
  const [stockLimit, setStockLimit] = useState<number>(24);
  const [stockPage, setStockPage] = useState<number>(1);
  const [stockTotal, setStockTotal] = useState<number>(0);
  const [stockResources, setStockResources] = useState<MagnificResourceItem[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockApiSource, setStockApiSource] = useState<string>('MAGNIFIC_LIVE_API');
  const [stockApiNotice, setStockApiNotice] = useState<string | null>(null);
  const [selectedRefImage, setSelectedRefImage] = useState<MagnificResourceItem | null>(null);
  const [zoomedRefImage, setZoomedRefImage] = useState<MagnificResourceItem | null>(null);
  const [customRefUrlInput, setCustomRefUrlInput] = useState('');
  const [decomposingRef, setDecomposingRef] = useState(false);
  const [lastScannerMetrics, setLastScannerMetrics] = useState<any>(null);

  // JSON DE LEITURA (Decomposição 100% fiel da Imagem de Referência) vs JSON DE ESCRITA (Editado na Matriz Ativa)
  const [readingMatrixBaseline, setReadingMatrixBaseline] = useState<WritingMatrix26 | null>(null);
  const [readingRefTitle, setReadingRefTitle] = useState<string>('');

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
  const [axisFilter, setAxisFilter] = useState<string>('I_ONTOLOGICO');
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
    setTimeout(() => setFeedbackMsg(null), 7000);
  };

  // Cálculo automático e limpo de quantas propriedades o criador alterou entre o JSON de Leitura e o JSON de Escrita
  const modifiedKeysSet = useMemo(() => {
    const set = new Set<keyof WritingMatrix26>();
    if (!selectedArtwork || !readingMatrixBaseline) return set;
    for (const meta of MATRIX_26_KEYS_METADATA) {
      const k = meta.key;
      const readingVal = (readingMatrixBaseline[k] || '').trim();
      const writingVal = (selectedArtwork.writing_matrix_26?.[k] || '').trim();
      if (readingVal !== writingVal) {
        set.add(k);
      }
    }
    return set;
  }, [selectedArtwork, readingMatrixBaseline]);

  const effectiveAlteredCount = readingMatrixBaseline
    ? modifiedKeysSet.size
    : selectedArtwork?.mutated_keys_count || 0;

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

  const handleSearchMagnificStock = async (targetPage = 1, targetLimit = stockLimit, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStockLoading(true);
    setStockApiNotice(null);
    try {
      const params = new URLSearchParams({
        action: 'search',
        term: stockSearchTerm,
        type: stockContentType,
        limit: String(targetLimit),
        page: String(targetPage),
      });
      const res = await fetch(`/api/atelier/magnific?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setStockResources(data.resources || []);
        setStockPage(targetPage);
        setStockTotal(data.total || data.resources?.length || 0);
        setStockApiSource(data.source || 'MAGNIFIC_LIVE_API');
        if (data.apiNotice) setStockApiNotice(data.apiNotice);
      }
    } catch (err) {
      console.error('Erro ao consultar Magnific Stock API:', err);
    } finally {
      setStockLoading(false);
    }
  };

  // Decompõe a Imagem de Referência NA ÍNTEGRA -> Gera o JSON de Leitura (0 alterações automáticas) e carrega no Editor Amigável
  const handleDecomposeReferenceToReadingJson = async () => {
    const refUrl = customRefUrlInput.trim() || selectedRefImage?.previewUrl || '';
    const refTitle = customRefUrlInput.trim()
      ? 'Referência Customizada AVA'
      : selectedRefImage?.title || 'Referência Magnific';

    if (!refUrl) {
      triggerFeedback('⚠️ Selecione primeiro uma Imagem de Referência na grade acima para decompor.');
      return;
    }
    setDecomposingRef(true);
    try {
      const res = await fetch('/api/atelier/magnific', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DECOMPOSE_REFERENCE_TO_MATRIX26',
          referenceUrl: refUrl,
          referenceTitle: refTitle,
          referenceType: selectedRefImage?.type || 'photo',
          referenceAuthor: selectedRefImage?.author || 'Magnific Creator',
        }),
      });
      const data = await res.json();
      if (data.success && data.readingMatrix26) {
        setLastScannerMetrics(data.scannerMetrics);
        setReadingMatrixBaseline(data.readingMatrix26);
        setReadingRefTitle(refTitle);

        if (selectedArtwork) {
          setSelectedArtwork({
            ...selectedArtwork,
            title: refTitle,
            preview_image_url: refUrl,
            mutated_keys_count: 0,
            writing_matrix_26: { ...data.readingMatrix26 },
          });
        }
        setOpenStep2MatrixEditor(true);
        setAxisFilter('I_ONTOLOGICO');
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

  const handleGenerateMysticFromWritingJson = async () => {
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
            `★ Imagem gerada pelo JSON de Escrita na Magnific API e arquivada em ${data.savedLocalUrl}! Se gostou do resultado, salve e envie ao Jurídico (Flávio) no Passo 3.`
          );
        } else {
          triggerFeedback(
            `Status da Tarefa Magnific (${activeMagnificTask.taskId.slice(0, 8)}): ${data.status}`
          );
        }
      }
    } catch {
      triggerFeedback('Erro ao consultar status da tarefa na Magnific API.');
    }
  };

  // Salva o JSON de Escrita no banco (recalculando o SHA-256 definitivo) e envia automaticamente para a bandeja de Blockchain do Flávio (01 · Jurídico)
  const handleSaveWritingJsonAndSendToFlavio = async () => {
    if (!selectedArtwork) return;
    setApprovingFlow(true);
    try {
      const updatedCount = readingMatrixBaseline
        ? modifiedKeysSet.size
        : selectedArtwork.mutated_keys_count;

      const payloadToSave: ArtworkRecord = {
        ...selectedArtwork,
        mutated_keys_count: updatedCount,
        writing_matrix_26: {
          ...selectedArtwork.writing_matrix_26,
          '26_autonomous_signature_dna': `JSON DE ESCRITA AUTORAL AVA (${updatedCount}/26 propriedades editadas a partir do JSON de Leitura). Obra aprovada no Atelier para registro Blockchain.`,
        },
      };

      // 1. Persiste o JSON de Escrita no PostgreSQL e recalcula o Hash SHA-256 real
      const saveRes = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSave),
      });
      const saveData = await saveRes.json();
      const savedArt: ArtworkRecord = saveData?.artwork || payloadToSave;

      // 2. Envia o JSON de Escrita congelado + Hash SHA-256 para a bandeja do Flávio (Depto 01 · Jurídico & Blockchain)
      const baseCostMap: Record<string, number> = {
        'T-Shirt Prime 180g (Pele de Pêssego)': 67.9,
        'Camiseta Oversized Heavy 220g': 101.9,
        'Camiseta Estonada Vintage 30.1': 73.0,
        'T-Shirt Quality 30.1 (165g)': 59.9,
      };
      const baseCost = baseCostMap[garmentModel] || 67.9;

      const wfRes = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_ARTWORK_FOR_COLLECTION',
          code: savedArt.code,
          title: `${savedArt.title} (${garmentModel})`,
          previewImageUrl:
            savedArt.preview_image_url ||
            '/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg',
          supplier: savedArt.default_supplier || 'DIMONA',
          garmentModel,
          garmentColor,
          garmentSize,
          baseCost,
          sha256: savedArt.coa_hash_sha256,
          mutatedKeysCount: savedArt.mutated_keys_count,
        }),
      });
      const wfData = await wfRes.json();
      if (wfData.success) {
        setWfState(wfData.state);
        await fetchArtworks(savedArt.code);
        triggerFeedback(
          `✅ JSON de Escrita salvo (SHA-256: ${savedArt.coa_hash_sha256?.slice(0, 16)}...) e enviado para a bandeja do Flávio (Depto 01 · Jurídico) para Registro na Blockchain!`
        );
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
    handleSearchMagnificStock(1, 24);
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
    const nextMatrix = {
      ...selectedArtwork.writing_matrix_26,
      [key]: value,
    };
    let count = selectedArtwork.mutated_keys_count;
    if (readingMatrixBaseline) {
      let diff = 0;
      for (const m of MATRIX_26_KEYS_METADATA) {
        if ((readingMatrixBaseline[m.key] || '').trim() !== (nextMatrix[m.key] || '').trim()) {
          diff++;
        }
      }
      count = diff;
    }
    setSelectedArtwork({
      ...selectedArtwork,
      mutated_keys_count: count,
      writing_matrix_26: nextMatrix,
    });
  };

  const handleResetKeyToReadingValue = (key: keyof WritingMatrix26) => {
    if (!selectedArtwork || !readingMatrixBaseline) return;
    handleMatrixKeyChange(key, readingMatrixBaseline[key] || '');
  };

  const handleSaveSelectedArtwork = async () => {
    if (!selectedArtwork) return;
    setSavingArtwork(true);
    try {
      const res = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedArtwork,
          mutated_keys_count: effectiveAlteredCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerFeedback(
          `★ JSON de Escrita (26 Chaves) de "${selectedArtwork.code}" salvo no PostgreSQL e Hash SHA-256 recalculado! (Observação: para enviar ao Jurídico/Flávio, use o botão do Passo 3 abaixo quando aprovar a imagem).`
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
      `📋 Prompt to Image do JSON de Escrita copiado para a área de transferência!`
    );
  };

  const handleDownloadMatrixJson = () => {
    if (!selectedArtwork) return;
    const payload = {
      $schema: 'https://ava-vitoria.com.br/schemas/mdv_writing_matrix.v26.json',
      matrix_type: 'WRITING_JSON_26_KEYS',
      artwork_code: selectedArtwork.code,
      title: selectedArtwork.title,
      project_folder: selectedArtwork.project_folder,
      is_registered: selectedArtwork.is_registered,
      coa_hash_sha256: selectedArtwork.coa_hash_sha256,
      altered_properties_count: effectiveAlteredCount,
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

  // Agentes dedicados ao Depto 08 · Atelier Criativo
  const atelierAgents = [
    AGENTS_DOSSIER.curador_matrizes,
    AGENTS_DOSSIER.lookbook_ia,
    AGENTS_DOSSIER.content_creator,
    AGENTS_DOSSIER.whimsy_injector,
  ].filter(Boolean);

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
              Sócio Titular: <strong>Tripoint</strong> · 1. Decomposição Integral da Imagem de Referência (<strong>JSON de Leitura</strong>) ➔ 2. Edição Limpa de Propriedades (<strong>JSON de Escrita</strong>) ➔ 3. Geração Magnific Mystic &amp; Envio ao Jurídico (Flávio)
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

        {/* Faixa de Serviço dos 4 Agentes do Atelier (Clicáveis para ver Dossiê) */}
        <div className={styles.moduleCard}>
          <div className={styles.flexRowBetween}>
            <span className={styles.sectionHeading}>
              🤖 Equipe Agêntica do Depto 08 · Atelier Criativo (Alimentada por OpenRouter + Magnific API)
            </span>
            <span className={styles.textMutedSmall}>
              Clique em qualquer agente para ver seu serviço técnico no Atelier
            </span>
          </div>
          <div className={styles.agentsGrid}>
            {atelierAgents.map((ag) => (
              <div
                key={ag.id}
                onClick={() => setSelectedAgentModal(ag)}
                className={styles.agentBadge}
              >
                <span className={styles.agentStatusDotActive} />
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>{ag.name}</span>
                  <span className={styles.agentRole}>{ag.role}</span>
                </div>
              </div>
            ))}
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
            {/* ACCORDION 1 · PONTO DE PARTIDA: BUSCA & DECOMPOSIÇÃO NA ÍNTEGRA     */}
            {/* =================================================================== */}
            <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div
                className={styles.accordionHeaderBar}
                onClick={() => setOpenStep1Magnific(!openStep1Magnific)}
              >
                <div className={styles.accordionTitleGroup}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🔍 PASSO 1 (Início do Atelier): Escolher Imagem de Referência (Magnific API) ➔ Decompor na Íntegra (JSON de Leitura)
                  </h2>
                  <p className={styles.textBodySmall}>
                    {wfState?.activeCharter ? (
                      <>
                        <strong>Coleção Ativa (Fase 0):</strong> {wfState.activeCharter.name} · <strong>Tema:</strong> {wfState.activeCharter.themeTrend}
                      </>
                    ) : (
                      <>
                        Navegue no acervo de <strong>250M+ imagens da Magnific/Freepik API</strong> (com paginação até 100 itens por página), selecione uma referência e extraia o <strong>JSON de Leitura 100% fiel</strong>.
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
                  {/* Barra de Busca na Janela Magnific / Freepik Stock API com Paginação & Seletor de Quantidade */}
                  <form
                    onSubmit={(e) => handleSearchMagnificStock(1, stockLimit, e)}
                    className={`${styles.innerCard} ${styles.flexColStack}`}
                  >
                    <div className={styles.flexRowBetween}>
                      <div className={styles.decisionTitle}>
                        🌐 Janela Visual: Acervo Magnific / Freepik Stock Content API (250M+ Referências)
                      </div>
                      <div className={styles.flexRowStart}>
                        <span className={styles.textMutedSmall}>
                          Página <strong>{stockPage}</strong> · Exibindo{' '}
                          <strong>{stockResources.length}</strong> resultados
                          {stockTotal > 0 ? ` (Total API: ${stockTotal.toLocaleString('pt-BR')})` : ''}
                        </span>
                      </div>
                    </div>

                    <div className={styles.autoGridSmall}>
                      <div>
                        <label className={styles.formLabel}>Termo de Busca (Inglês ou Português)</label>
                        <input
                          type="text"
                          value={stockSearchTerm}
                          onChange={(e) => setStockSearchTerm(e.target.value)}
                          placeholder="Ex: skateboard, op art geometric 3d, jazz dancer, streetwear..."
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

                      <div>
                        <label className={styles.formLabel}>Imagens por Página (Limite API)</label>
                        <select
                          value={stockLimit}
                          onChange={(e) => {
                            const newLim = Number(e.target.value);
                            setStockLimit(newLim);
                            handleSearchMagnificStock(1, newLim);
                          }}
                          className={styles.formSelect}
                        >
                          <option value={12}>12 Imagens por página</option>
                          <option value={24}>24 Imagens por página (Padrão)</option>
                          <option value={48}>48 Imagens por página</option>
                          <option value={100}>100 Imagens por página (Máximo API)</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.flexRowBetween}>
                      <button
                        type="submit"
                        disabled={stockLoading}
                        className={styles.btnPrimary}
                      >
                        {stockLoading
                          ? 'Buscando na Magnific API...'
                          : '🔎 Buscar Imagens de Referência'}
                      </button>

                      {/* Controles de Paginação */}
                      <div className={styles.flexRowStart}>
                        <button
                          type="button"
                          disabled={stockLoading || stockPage <= 1}
                          onClick={() => handleSearchMagnificStock(stockPage - 1, stockLimit)}
                          className={styles.btnSecondary}
                        >
                          ◀ Página Anterior
                        </button>
                        <span className={styles.statusPill}>Página {stockPage}</span>
                        <button
                          type="button"
                          disabled={stockLoading}
                          onClick={() => handleSearchMagnificStock(stockPage + 1, stockLimit)}
                          className={styles.btnSecondary}
                        >
                          Próxima Página ▶
                        </button>
                      </div>
                    </div>

                    {stockApiNotice && (
                      <div className={styles.textMutedSmall}>{stockApiNotice}</div>
                    )}

                    {/* Grade Visual de Miniaturas dentro do Painel: Clique na imagem = Amplia (Lightbox) | Clique no botão = Seleciona / Desmarca */}
                    <div className={styles.stockGalleryGrid}>
                      {stockResources.map((item) => {
                        const isChosen =
                          !customRefUrlInput && selectedRefImage?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`${styles.innerCardCompact} ${styles.flexColTight} ${
                              isChosen ? styles.innerCardSelected : ''
                            }`}
                          >
                            <div
                              className={styles.stockThumbWrapper}
                              onClick={() => setZoomedRefImage(item)}
                              title="Clique na imagem para ampliar em alta resolução"
                            >
                              <img
                                src={item.previewUrl}
                                alt={item.title}
                                className={styles.stockThumbImg}
                              />
                              <span className={styles.stockThumbZoomHint}>
                                🔍 Ampliar
                              </span>
                            </div>

                            <div className={styles.decisionTitle}>{item.title}</div>
                            <div className={styles.textMutedSmall}>
                              <strong>{item.type.toUpperCase()}</strong> · {item.author}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isChosen) {
                                  setSelectedRefImage(null);
                                } else {
                                  setSelectedRefImage(item);
                                  setCustomRefUrlInput('');
                                }
                              }}
                              className={isChosen ? styles.btnPrimary : styles.btnSecondary}
                              title={
                                isChosen
                                  ? 'Clique novamente para desmarcar esta referência'
                                  : 'Clique para selecionar esta imagem como referência'
                              }
                            >
                              {isChosen
                                ? '✓ Referência Selecionada (Clique p/ Desmarcar)'
                                : '🎯 Selecionar Referência'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </form>

                  {/* Disparo Limpo da Decomposição Integral -> Gera o JSON de Leitura */}
                  <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                    <div className={styles.flexRowBetween}>
                      <div>
                        <div className={styles.decisionTitle}>
                          🔬 Decomposição Integral (MDV Python Scanner ➔ JSON de Leitura 100% Fiel à Referência)
                        </div>
                        <p className={styles.textBodySmall}>
                          O sistema <strong>não altera nada sozinho</strong>: ele extrai na íntegra as 26 propriedades da imagem escolhida acima (<strong>JSON de Leitura</strong>) e abre o painel organizado no <strong>Passo 2</strong> para você editar livremente o que desejar (como o <em>Sujeito</em>, o <em>Ângulo</em> ou as <em>Cores</em>), compondo o seu <strong>JSON de Escrita</strong>.
                        </p>
                      </div>
                      {customRefUrlInput || selectedRefImage ? (
                        <div className={styles.flexRowStart}>
                          <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                            Selecionada:{' '}
                            {customRefUrlInput
                              ? 'URL Customizada'
                              : selectedRefImage?.title.slice(0, 32)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRefImage(null);
                              setCustomRefUrlInput('');
                            }}
                            className={styles.btnSecondary}
                          >
                            ✕ Limpar Seleção
                          </button>
                        </div>
                      ) : (
                        <span className={`${styles.statusPill} ${styles.statusPillWarning}`}>
                          Nenhuma referência selecionada
                        </span>
                      )}
                    </div>

                    <div className={styles.flexRowBetween}>
                      <div className={styles.flexRowStart}>
                        <button
                          type="button"
                          onClick={handleDecomposeReferenceToReadingJson}
                          disabled={
                            decomposingRef || (!selectedRefImage && !customRefUrlInput.trim())
                          }
                          className={styles.btnPrimary}
                        >
                          {decomposingRef
                            ? '🔬 Extraindo Pixels & Gerando JSON de Leitura...'
                            : '⚡ Decompor Imagem na Íntegra (Gerar JSON de Leitura no Passo 2)'}
                        </button>
                      </div>

                      {lastScannerMetrics && (
                        <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                          ✓ Leitura MDV: {lastScannerMetrics.negative_space_percent}% Espaço Negativo · Traço {lastScannerMetrics.estimated_stroke_px}px · Eixo {lastScannerMetrics.dominant_vector_axis}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* =================================================================== */}
            {/* ACCORDION 2 · MATRIZ ATIVA (100% LARGURA): JSON LEITURA -> ESCRITA  */}
            {/* =================================================================== */}
            <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div
                className={styles.accordionHeaderBar}
                onClick={() => setOpenStep2MatrixEditor(!openStep2MatrixEditor)}
              >
                <div className={styles.accordionTitleGroup}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🎨 PASSO 2: Editor Limpo de Propriedades (JSON de Leitura ➔ JSON de Escrita) &amp; Gerador de Imagens Magnific
                  </h2>
                  <p className={styles.textBodySmall}>
                    Visualize as 26 propriedades organizadas por eixo, edite os valores que desejar (ex: <strong>#04 Sujeito Primário</strong>, <strong>#09 Geometria/Ângulo</strong>, <strong>#14 Cores</strong>) e coloque o <strong>JSON de Escrita</strong> para gerar imagens na Magnific API.
                  </p>
                </div>

                <div className={styles.accordionRightGroup}>
                  <span
                    className={`${styles.statusPill} ${
                      effectiveAlteredCount >= 1
                        ? styles.statusPillSuccess
                        : styles.statusPillWarning
                    }`}
                  >
                    ✏️ {effectiveAlteredCount} de 26 Propriedades Editadas
                  </span>
                  <button
                    type="button"
                    className={`${styles.accordionToggleBtn} ${
                      openStep2MatrixEditor ? styles.accordionToggleBtnOpen : ''
                    }`}
                  >
                    {openStep2MatrixEditor ? '▲ Recolher Passo 2' : '▼ Expandir Matriz Ativa'}
                  </button>
                </div>
              </div>

              {openStep2MatrixEditor && (
                <div className={styles.accordionBody}>
                  {/* MATRIZ ATIVA EM 100% DA LARGURA (SEM DUAS COLUNAS ESPREMIDAS!) */}
                  {selectedArtwork && (
                    <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                      <div className={styles.flexRowBetween}>
                        <div>
                          <h3 className={styles.cardHeadingNoBorder}>
                            Matriz Ativa: {selectedArtwork.code} — {selectedArtwork.title}
                          </h3>
                          <p className={styles.textBodySmall}>
                            {readingMatrixBaseline ? (
                              <>
                                Comparando ao vivo: <strong>JSON de Leitura</strong> (extraído de <em>&ldquo;{readingRefTitle}&rdquo;</em>) vs. <strong>JSON de Escrita</strong> ({effectiveAlteredCount} propriedades alteradas por você).
                              </>
                            ) : (
                              <>
                                Editando <strong>JSON de Escrita</strong> da obra selecionada.
                              </>
                            )}
                          </p>
                        </div>

                        <div className={styles.flexRowStart}>
                          <button
                            type="button"
                            onClick={handleDownloadMatrixJson}
                            className={styles.btnSecondary}
                          >
                            ⬇️ Baixar JSON de Escrita
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveSelectedArtwork}
                            disabled={savingArtwork}
                            className={styles.btnPrimary}
                          >
                            {savingArtwork
                              ? 'Salvando...'
                              : '💾 Salvar Rascunho do JSON de Escrita'}
                          </button>
                        </div>
                      </div>

                      {/* Cabeçalho da Matriz Ativa: Imagem + Campos Principais */}
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

                        <div className={styles.flexColStack} style={{ flex: 1, minWidth: '280px' }}>
                          <div className={styles.autoGridSmall}>
                            <div>
                              <label className={styles.formLabel}>Título Autoral da Nova Obra (AVA)</label>
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
                              <label className={styles.formLabel}>Pasta-Projeto da Coleção</label>
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
                              <label className={styles.formLabel}>
                                Propriedades Alteradas (Meta recomendada: ≥ 7)
                              </label>
                              <div className={styles.innerCardCompact}>
                                <strong
                                  className={
                                    effectiveAlteredCount >= 7
                                      ? styles.textSuccess
                                      : styles.textPrimaryBold
                                  }
                                >
                                  ✏️ {effectiveAlteredCount} / 26 propriedades alteradas
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Hash SHA-256 com word-break contido dentro do card */}
                          <div className={styles.shaHashBar}>
                            <strong>Hash SHA-256 do JSON de Escrita (Gerado p/ Blockchain — Enviado ao Jurídico apenas após sua aprovação no Passo 3):</strong>{' '}
                            <code>{selectedArtwork.coa_hash_sha256}</code>
                          </div>
                        </div>
                      </div>

                      {/* =============================================================== */}
                      {/* PAINEL ORGANIZADO DE EDIÇÃO DAS 26 PROPRIEDADES (POR EIXOS)     */}
                      {/* =============================================================== */}
                      <div className={`${styles.innerCardCompact} ${styles.flexColStack}`}>
                        <div className={styles.flexRowBetween}>
                          <div>
                            <div className={styles.decisionTitle}>
                              📋 Propriedades da Obra: Do JSON de Leitura para o JSON de Escrita
                            </div>
                            <p className={styles.textBodySmall}>
                              Navegue pelas 4 abas temáticas abaixo para consultar os valores extraídos pelo MDV e alterar livremente os campos que formarão a nova imagem. As propriedades que você alterar ficam destacadas com borda verde.
                            </p>
                          </div>
                        </div>

                        {/* Abas Limpas dos 4 Eixos Canônicos */}
                        <div className={styles.flexRowStart}>
                          {[
                            {
                              id: 'I_ONTOLOGICO',
                              label: '1. Sujeito, Identidade & Conceito (Chaves 01 a 07)',
                            },
                            {
                              id: 'II_EPISTEMOLOGICO',
                              label: '2. Ângulo, Luz, Cores & Espaço Negativo (Chaves 08 a 16)',
                            },
                            {
                              id: 'III_METODOLOGICO',
                              label: '3. Traço, Textura & Estamparia PoD (Chaves 17 a 24)',
                            },
                            {
                              id: 'IV_EXTENSAO_MDV',
                              label: '4. Telemetria MDV & Assinatura (Chaves 25 e 26)',
                            },
                            {
                              id: 'ALL',
                              label: 'Ver Todas as 26 Chaves Juntas',
                            },
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

                        {/* Grid de 2 Colunas Responsivo e Limpo para Editar as Propriedades do Eixo Selecionado */}
                        <div className={styles.matrixKeysGrid2Cols}>
                          {filteredKeysMetadata.map((meta) => {
                            const val = selectedArtwork.writing_matrix_26?.[meta.key] || '';
                            const readingVal = readingMatrixBaseline?.[meta.key] || '';
                            const isModified =
                              readingMatrixBaseline &&
                              readingVal.trim() !== val.trim();

                            return (
                              <div
                                key={meta.key}
                                className={`${styles.innerCardCompact} ${styles.flexColTight} ${
                                  isModified ? styles.keyCardModified : ''
                                }`}
                              >
                                <div className={styles.flexRowBetween}>
                                  <span className={styles.decisionTitle}>
                                    #{meta.number} · {meta.label}
                                  </span>
                                  <div className={styles.flexRowStart}>
                                    {isModified ? (
                                      <>
                                        <span
                                          className={`${styles.statusPill} ${styles.statusPillSuccess}`}
                                        >
                                          ✏️ Alterada no JSON de Escrita
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleResetKeyToReadingValue(meta.key)
                                          }
                                          className={styles.btnSecondary}
                                          title="Restaurar valor original do JSON de Leitura"
                                        >
                                          ↺ Restaurar Leitura
                                        </button>
                                      </>
                                    ) : (
                                      <span className={styles.statusPill}>
                                        Valor do JSON de Leitura
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className={styles.textMutedSmall}>
                                  {meta.description}
                                </div>

                                {isModified && readingVal && (
                                  <div className={styles.textMutedSmall}>
                                    <strong>Leitura Original:</strong> <em>{readingVal}</em>
                                  </div>
                                )}

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

                      {/* =============================================================== */}
                      {/* MOTOR GERADOR DE IMAGEM (JSON DE ESCRITA -> MAGNIFIC MYSTIC)    */}
                      {/* =============================================================== */}
                      <div className={`${styles.innerCardCompact} ${styles.flexColStack}`}>
                        <div className={styles.flexRowBetween}>
                          <div>
                            <div className={styles.decisionTitle}>
                              ⚡ Prompt to Image Compilado do JSON de Escrita ➔ Gerar Imagem na Magnific API
                            </div>
                            <p className={styles.textBodySmall}>
                              Este prompt é atualizado em tempo real conforme você edita as propriedades acima. Teste a geração de imagens quantas vezes quiser até obter uma arte excelente!
                            </p>
                          </div>

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
                              onClick={handleGenerateMysticFromWritingJson}
                              disabled={mysticGenerating}
                              className={styles.btnPrimary}
                            >
                              {mysticGenerating
                                ? 'Gerando na Magnific...'
                                : '🎨 Gerar Imagem com o JSON de Escrita (Magnific Mystic)'}
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

                        {/* Bloco pre contido 100% dentro do card com pre-wrap */}
                        <pre className={styles.promptPreBox}>{compiledPromptPreview}</pre>

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
                              🔄 Atualizar Status &amp; Visualizar Imagem Gerada
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* =============================================================== */}
                  {/* SUB-ACCORDION EMBAIXO DA MATRIZ ATIVA (RECOLHIDO POR DEFAULT!)  */}
                  {/* =============================================================== */}
                  <div className={styles.subAccordionBox}>
                    <div
                      className={styles.subAccordionHeader}
                      onClick={() => setOpenAcervoList(!openAcervoList)}
                    >
                      <span>
                        🗄️ Acervo de Matrizes Salvas no Banco PostgreSQL ({filteredArtworks.length} obras) — Clique para alternar de obra ou criar nova
                      </span>
                      <span className={styles.accordionToggleBtn}>
                        {openAcervoList ? '▲ Recolher Acervo' : '▼ Abrir Acervo de Matrizes'}
                      </span>
                    </div>

                    {openAcervoList && (
                      <div className={styles.subAccordionContent}>
                        <div className={styles.flexRowBetween}>
                          <div className={styles.flexRowStart}>
                            <span className={styles.kpiLabel}>📁 Pasta-Projeto:</span>
                            {projectFolders.map((folder) => (
                              <button
                                key={folder}
                                type="button"
                                onClick={() => setFolderFilter(folder)}
                                className={`${styles.executiveHeaderBtn} ${
                                  folderFilter === folder
                                    ? styles.executiveHeaderBtnActive
                                    : ''
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
                            {showCreateArtModal
                              ? '✕ Fechar Cadastro'
                              : '+ Cadastrar Nova Arte Matriz'}
                          </button>
                        </div>

                        {showCreateArtModal && (
                          <form
                            onSubmit={handleCreateNewArtwork}
                            className={`${styles.innerCard} ${styles.flexColStack} ${styles.moduleCardTopSpaced}`}
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
                                  placeholder="Ex: Skatista Urbano Cinético 3D"
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
                                  <option value="RESERVA_INK">
                                    RESERVA INK (DTG 4200×4800)
                                  </option>
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

                        {loadingArtworks ? (
                          <div className={styles.textMutedSmall}>
                            Carregando matrizes do PostgreSQL...
                          </div>
                        ) : (
                          <div className={`${styles.autoGridCards} ${styles.moduleCardTopSpaced}`}>
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

                                  <div className={styles.flexColTight} style={{ flex: 1 }}>
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
                                      <span className={styles.textPrimaryBold}>
                                        ✏️ {art.mutated_keys_count}/26 Propriedades Editadas
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
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* =================================================================== */}
            {/* ACCORDION 3 · GEROU UMA BOA? SALVAR JSON DE ESCRITA & ENVIAR AO 01  */}
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
                    🔐 PASSO 3 (Aprovação Autoral): Gostou da Imagem Gerada? Salvar JSON de Escrita &amp; Enviar ao Jurídico (Flávio · Blockchain)
                  </h2>
                  <p className={styles.textBodySmall}>
                    <strong>O envio não é automático na leitura!</strong> Somente quando você e o Tripoint aprovarem a imagem gerada pelo <strong>JSON de Escrita</strong>, clique no botão abaixo para salvar o JSON definitivo, gerar o Hash <strong>SHA-256</strong> e enviá-lo para a bandeja do <strong>Flávio (Depto 01 · Jurídico)</strong> registrar na Blockchain.
                  </p>
                </div>

                <div className={styles.accordionRightGroup}>
                  {wfState?.pilotPiece ? (
                    <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                      Enviado ao Jurídico: {wfState.pilotPiece.status}
                    </span>
                  ) : (
                    <span className={styles.statusPill}>Aguardando Aprovação da Arte</span>
                  )}

                  <button
                    type="button"
                    className={`${styles.accordionToggleBtn} ${
                      openStep3ApproveBlockchain ? styles.accordionToggleBtnOpen : ''
                    }`}
                  >
                    {openStep3ApproveBlockchain
                      ? '▲ Recolher Passo 3'
                      : '▼ Expandir Aprovação & Envio'}
                  </button>
                </div>
              </div>

              {openStep3ApproveBlockchain && (
                <div className={styles.accordionBody}>
                  <div className={styles.autoGridSmall}>
                    <div>
                      <label className={styles.formLabel}>
                        Obra &amp; JSON de Escrita a ser Enviado ao Jurídico
                      </label>
                      <div className={styles.innerCardCompact}>
                        <strong className={styles.textPrimaryBold}>
                          {selectedArtwork
                            ? `${selectedArtwork.code} — ${selectedArtwork.title} (${effectiveAlteredCount} propriedades editadas)`
                            : 'Selecione no Passo 2 acima'}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <label className={styles.formLabel}>
                        Modelagem da Camiseta na Coleção (Dimona Silk HD)
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
                        onClick={handleSaveWritingJsonAndSendToFlavio}
                        disabled={approvingFlow || !selectedArtwork}
                        className={styles.btnPrimary}
                      >
                        {approvingFlow
                          ? 'Salvando JSON de Escrita & Enviando ao Jurídico...'
                          : '✅ Gostei da Arte! Salvar JSON de Escrita & Enviar ao Flávio (Depto 01 · Blockchain)'}
                      </button>

                      {wfState?.pilotPiece && (
                        <Link href="/admin/juridico" className={styles.btnSuccess}>
                          ⛓️ Abrir Bandeja do Jurídico (Depto 01 · Flávio) p/ Registrar na Blockchain ➔
                        </Link>
                      )}
                    </div>
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

      {selectedAgentModal && (
        <AgentDossierModal
          agent={selectedAgentModal}
          onClose={() => setSelectedAgentModal(null)}
        />
      )}

      {/* MODAL LIGHTBOX DE AMPLIAÇÃO DA IMAGEM DE REFERÊNCIA */}
      {zoomedRefImage && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setZoomedRefImage(null)}
        >
          <div
            className={styles.lightboxModalWindow}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeaderGlass}>
              <span>
                🔍 Inspeção Ampliada: {zoomedRefImage.title}
              </span>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setZoomedRefImage(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.lightboxImageContainer}>
              <img
                src={zoomedRefImage.previewUrl}
                alt={zoomedRefImage.title}
                className={styles.lightboxImgLarge}
              />
            </div>

            <div className={styles.modalBody}>
              <div className={styles.flexRowBetween}>
                <div>
                  <div className={styles.decisionTitle}>{zoomedRefImage.title}</div>
                  <div className={styles.textMutedSmall}>
                    ID: <strong>{zoomedRefImage.id}</strong> · Formato:{' '}
                    <strong>{zoomedRefImage.type.toUpperCase()}</strong> · Autor:{' '}
                    <strong>{zoomedRefImage.author}</strong> · Licença:{' '}
                    <strong>{zoomedRefImage.license}</strong>
                  </div>
                </div>

                <div className={styles.flexRowStart}>
                  {selectedRefImage?.id === zoomedRefImage.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRefImage(null);
                        setZoomedRefImage(null);
                      }}
                      className={styles.btnPrimary}
                    >
                      ✓ Selecionada (Clique p/ Desmarcar)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRefImage(zoomedRefImage);
                        setCustomRefUrlInput('');
                        setZoomedRefImage(null);
                      }}
                      className={styles.btnPrimary}
                    >
                      🎯 Selecionar como Imagem de Referência
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setZoomedRefImage(null)}
                    className={styles.btnSecondary}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
