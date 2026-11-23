'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './boardroom.module.css';
import adminStyles from './admin-cockpit.module.css';

export interface BoardPautaItem {
  id: string;
  title: string;
  created_by: string;
  status: string;
  created_at: string;
}

export interface BoardMessageItem {
  id: string;
  pauta_id: string;
  author_username: string;
  author_name: string;
  subject: string;
  content: string | null;
  recipients: string[];
  copy_sender: boolean;
  attachment_name: string | null;
  attachment_url: string | null;
  attachment_size: number | null;
  attachment_mime: string | null;
  is_system_porteiro: boolean;
  created_at: string;
}

export interface GuestCredentialItem {
  id: string;
  guest_name: string;
  access_code: string;
  access_level: number;
  active: boolean;
}

interface BoardroomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  startLockedNewPauta?: boolean;
  onClearedLockedFlag?: () => void;
  externalPautaTitle?: string | null;
  onClearedExternalPauta?: () => void;
  currentUsername: string;
  currentDisplayName: string;
  level2Guests: GuestCredentialItem[];
  onPautaCreated?: (pauta: BoardPautaItem) => void;
}

const PARTNERS_INFO = [
  { username: 'armando', name: 'Armando', initials: 'AR', dept: '03 · Arq & TI / 04 · Produção' },
  { username: 'flavio', name: 'Flávio', initials: 'FL', dept: '01 · Jurídico / 02 · Financeiro' },
  { username: 'tripoint', name: 'Tripoint', initials: 'TR', dept: '07 · Mkt Produto / 08 · Atelier' },
  { username: 'gustavo', name: 'Gustavo', initials: 'GU', dept: '05 · SAC / 06 · Mkt Vendas' },
];

export default function BoardroomPopup({
  isOpen,
  startLockedNewPauta,
  onClearedLockedFlag,
  externalPautaTitle,
  onClearedExternalPauta,
  currentUsername,
  currentDisplayName,
  level2Guests,
  onPautaCreated,
}: BoardroomPopupProps) {
  const winRef = useRef<HTMLElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [pautas, setPautas] = useState<BoardPautaItem[]>([]);
  const [selectedPautaId, setSelectedPautaId] = useState<string>('');
  const [messages, setMessages] = useState<BoardMessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  // Estado da Trava Obrigatória "Nomear a Pauta"
  const [isPautaLocked, setIsPautaLocked] = useState<boolean>(false);
  const [newPautaTitle, setNewPautaTitle] = useState<string>('');
  const [savingPauta, setSavingPauta] = useState<boolean>(false);

  // Controles de Janela e Ergonomia
  const [isGhost, setIsGhost] = useState<boolean>(false);
  const [isShaded, setIsShaded] = useState<boolean>(false);
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [isMax, setIsMax] = useState<boolean>(false);

  // Palco (chat vs vídeo híbrido)
  const [stageMode, setStageMode] = useState<'chat' | 'hybrid'>('chat');
  const [micActive, setMicActive] = useState<boolean>(true);
  const [camActive, setCamActive] = useState<boolean>(false);
  const [screenShareActive, setScreenShareActive] = useState<boolean>(false);
  const [jitsiLive, setJitsiLive] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Controle real de Câmera e Microfone locais (WebRTC Nativo)
  const toggleRealCamera = async () => {
    if (camActive) {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      setCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micActive,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setCamActive(true);
      } catch (err) {
        alert('Não foi possível acessar a câmera ou permissão negada.');
      }
    }
  };

  const toggleRealMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !micActive;
      });
    }
    setMicActive(!micActive);
  };

  // Controle real de Compartilhamento de Tela (Screen Share Nativo do Navegador)
  const toggleRealScreenShare = async () => {
    if (screenShareActive) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      setScreenShareActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = stream;
        if (screenVideoRef.current) screenVideoRef.current.srcObject = stream;
        stream.getVideoTracks()[0].onended = () => {
          setScreenShareActive(false);
          screenStreamRef.current = null;
        };
        setScreenShareActive(true);
      } catch (err) {
        // Usuário cancelou ou navegador não suporta
      }
    }
  };

  // Limpa streams quando fechar o popup
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Composer
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['TODOS']);
  const [copyMe, setCopyMe] = useState<boolean>(true);
  const [subject, setSubject] = useState<string>('');
  const [msgText, setMsgText] = useState<string>('');
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [sending, setSending] = useState<boolean>(false);

  // Arraste livre da janela
  const draggingRef = useRef<boolean>(false);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const normalizedUser =
    currentUsername === 'admin' || !currentUsername ? 'armando' : currentUsername.toLowerCase();

  // Posicionamento cirúrgico da barra minimizada (Print 2 do Genera) e modo split
  const fitToRightCard = useCallback((shaded: boolean) => {
    const win = winRef.current;
    if (!win) return;

    // Procura o card direito na página ou o container principal para ancorar dentro das bordas
    const rightCandidates = document.querySelectorAll(
      '[data-boardroom-anchor="right-card"], section, .moduleCard'
    );
    let targetRect: DOMRect | null = null;

    if (rightCandidates.length >= 2) {
      targetRect = rightCandidates[1].getBoundingClientRect();
    } else if (rightCandidates.length === 1) {
      targetRect = rightCandidates[0].getBoundingClientRect();
    }

    const inset = 12;

    if (targetRect && targetRect.width >= 340) {
      // Se o card tiver duas colunas ou largura total do container (ex: > 800px), ocupa apenas a metade direita interna
      const isFullWidthCard = targetRect.width > 820;
      const effectiveWidth = isFullWidthCard
        ? Math.floor(targetRect.width * 0.476) - inset * 2
        : Math.floor(targetRect.width) - inset * 2;
      const effectiveLeft = isFullWidthCard
        ? Math.floor(targetRect.right - effectiveWidth - inset)
        : Math.floor(targetRect.left + inset);

      win.style.left = `${effectiveLeft}px`;
      win.style.right = 'auto';
      win.style.width = `${effectiveWidth}px`;

      if (shaded) {
        const bottomTarget = Math.min(window.innerHeight - 56, Math.floor(targetRect.bottom - 44 - inset));
        win.style.top = `${Math.max(158, bottomTarget)}px`;
        win.style.bottom = 'auto';
      } else {
        win.style.top = `${Math.max(158, Math.floor(targetRect.top))}px`;
        win.style.height = `${Math.max(420, window.innerHeight - 190)}px`;
      }
    } else {
      // Fallback seguro alinhado à coluna direita do max-width 1440px
      const containerWidth = Math.min(window.innerWidth, 1440);
      const rightEdge = (window.innerWidth - containerWidth) / 2 + 24;
      const colWidth = Math.floor((containerWidth - 68) * 0.476) - 24;

      win.style.left = 'auto';
      win.style.right = `${rightEdge + 12}px`;
      win.style.width = `${Math.max(340, colWidth)}px`;

      if (shaded) {
        win.style.top = 'auto';
        win.style.bottom = '36px';
      } else {
        win.style.top = '158px';
        win.style.bottom = 'auto';
        win.style.height = `${window.innerHeight - 196}px`;
      }
    }
  }, []);

  // Carrega pautas iniciais
  const fetchPautas = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/boardroom/pautas');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.pautas)) {
        setPautas(data.pautas);
        if (data.pautas.length > 0 && !selectedPautaId) {
          setSelectedPautaId(data.pautas[0].id);
          setSubject(data.pautas[0].title);
        }
      }
    } catch {
      // Silencioso
    }
  }, [selectedPautaId]);

  useEffect(() => {
    if (isOpen) {
      fetchPautas();
    }
  }, [isOpen, fetchPautas]);

  // Carrega mensagens quando a pauta selecionada muda
  const fetchMessages = useCallback(async (pautaId: string) => {
    if (!pautaId) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/admin/boardroom/messages?pautaId=${encodeURIComponent(pautaId)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch {
      // Silencioso
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && selectedPautaId) {
      fetchMessages(selectedPautaId);
      const found = pautas.find((p) => p.id === selectedPautaId);
      if (found) {
        setSubject(found.title);
      }
    }
  }, [isOpen, selectedPautaId, pautas, fetchMessages]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Abre trava obrigatória quando clicam em "🚨 CONVOCAR REUNIÃO"
  useEffect(() => {
    if (startLockedNewPauta && isOpen) {
      setIsShaded(false);
      setIsPautaLocked(true);
      setNewPautaTitle('');
      onClearedLockedFlag?.();
    }
  }, [startLockedNewPauta, isOpen, onClearedLockedFlag]);

  // Seleciona ou cria pauta específica vinda da Urna de Votação
  useEffect(() => {
    if (externalPautaTitle && isOpen && pautas.length > 0) {
      setIsShaded(false);
      setIsPautaLocked(false);
      const existing = pautas.find(
        (p) => p.title.toLowerCase() === externalPautaTitle.toLowerCase()
      );
      if (existing) {
        setSelectedPautaId(existing.id);
        setSubject(existing.title);
      } else {
        setSubject(externalPautaTitle);
      }
      onClearedExternalPauta?.();
    }
  }, [externalPautaTitle, isOpen, pautas, onClearedExternalPauta]);

  // Atualiza posição no resize da janela quando minimizado ou split
  useEffect(() => {
    const onResize = () => {
      if (isShaded) fitToRightCard(true);
      else if (isSplit) fitToRightCard(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isShaded, isSplit, fitToRightCard]);

  // Arraste pelo cabeçalho
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !winRef.current) return;
      const x = Math.max(6, Math.min(window.innerWidth - 180, e.clientX - offsetRef.current.x));
      const y = Math.max(10, Math.min(window.innerHeight - 48, e.clientY - offsetRef.current.y));
      winRef.current.style.left = `${x}px`;
      winRef.current.style.top = `${y}px`;
      winRef.current.style.right = 'auto';
      winRef.current.style.bottom = 'auto';
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleTitlebarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    if (!winRef.current) return;

    if (isSplit || isMax) {
      setIsSplit(false);
      setIsMax(false);
    }

    draggingRef.current = true;
    const rect = winRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    winRef.current.style.right = 'auto';
    winRef.current.style.bottom = 'auto';
    winRef.current.style.left = `${rect.left}px`;
    winRef.current.style.top = `${rect.top}px`;
  };

  // Alternadores de ergonomia
  const toggleShade = () => {
    const next = !isShaded;
    if (next) {
      setIsMax(false);
      setIsSplit(false);
      setIsShaded(true);
      if (winRef.current) {
        winRef.current.style.top = 'auto';
        winRef.current.style.bottom = '16px';
        winRef.current.style.left = 'auto';
        winRef.current.style.right = '24px';
        winRef.current.style.width = '420px';
        winRef.current.style.height = '44px';
      }
    } else {
      setIsShaded(false);
      if (winRef.current) {
        winRef.current.style.top = '';
        winRef.current.style.bottom = '';
        winRef.current.style.left = '';
        winRef.current.style.width = '';
        winRef.current.style.height = '';
        winRef.current.style.right = '28px';
      }
    }
  };

  const toggleSplit = () => {
    setIsMax(false);
    setIsShaded(false);
    const next = !isSplit;
    setIsSplit(next);
    if (winRef.current) {
      winRef.current.style.top = '';
      winRef.current.style.bottom = '';
      winRef.current.style.left = '';
      winRef.current.style.width = '';
      winRef.current.style.height = '';
      winRef.current.style.right = '28px';
    }
  };

  const toggleMax = () => {
    setIsSplit(false);
    setIsShaded(false);
    const next = !isMax;
    setIsMax(next);
    if (winRef.current) {
      winRef.current.style.top = '';
      winRef.current.style.bottom = '';
      winRef.current.style.left = '';
      winRef.current.style.width = '';
      winRef.current.style.height = '';
      winRef.current.style.right = '28px';
    }
    if (next) {
      setStageMode('hybrid');
    }
  };

  // Confirmação da Trava Obrigatória de Nova Pauta
  const handleConfirmNewPauta = async () => {
    const trimmed = newPautaTitle.trim();
    if (!trimmed) {
      alert('Por favor, digite o Nome da Pauta / Assunto para destravar a Sala de Reuniões.');
      return;
    }

    setSavingPauta(true);
    try {
      const res = await fetch('/api/admin/boardroom/pautas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmed,
          createdBy: normalizedUser,
          authorName: currentDisplayName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.pauta) {
          setPautas((prev) => [data.pauta, ...prev]);
          setSelectedPautaId(data.pauta.id);
          setSubject(data.pauta.title);
          setIsPautaLocked(false);
          setNewPautaTitle('');
          onPautaCreated?.(data.pauta);
          await fetchMessages(data.pauta.id);
        }
      }
    } catch {
      alert('Erro ao gravar nova pauta.');
    } finally {
      setSavingPauta(false);
    }
  };

  // Seleção de destinatários ("ANEXAR / ENVIAR PARA")
  const handleToggleRecipient = (name: string) => {
    if (name === 'TODOS') {
      setSelectedRecipients(['TODOS']);
      return;
    }

    let next = selectedRecipients.filter((r) => r !== 'TODOS');
    if (next.includes(name)) {
      next = next.filter((r) => r !== name);
    } else {
      next.push(name);
    }

    if (next.length === 0) {
      next = ['TODOS'];
    }
    setSelectedRecipients(next);
  };

  // Envio de mensagem e/ou documento anexado
  const handleSend = async () => {
    if (!selectedPautaId) return;
    const text = msgText.trim();
    const subj = subject.trim() || 'Pauta em Debate';

    if (!text && !pickedFile) return;

    setSending(true);
    try {
      let uploadedMeta: {
        attachmentName?: string;
        attachmentUrl?: string;
        attachmentSize?: number;
        attachmentMime?: string;
      } = {};

      if (pickedFile) {
        const formData = new FormData();
        formData.append('file', pickedFile);
        const upRes = await fetch('/api/admin/boardroom/upload', {
          method: 'POST',
          body: formData,
        });
        if (upRes.ok) {
          uploadedMeta = await upRes.json();
        }
      }

      const partnerObj = PARTNERS_INFO.find((p) => p.username === normalizedUser);
      const authorLabel = partnerObj
        ? `${partnerObj.name} (${partnerObj.dept})`
        : currentDisplayName;

      const msgRes = await fetch('/api/admin/boardroom/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pautaId: selectedPautaId,
          subject: subj,
          content: text,
          recipients: selectedRecipients,
          copySender: copyMe,
          authorUsername: normalizedUser,
          authorName: authorLabel,
          ...uploadedMeta,
        }),
      });

      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages((prev) => [
          ...prev,
          ...(data.message ? [data.message] : []),
          ...(data.porteiroMessage ? [data.porteiroMessage] : []),
        ]);
        setMsgText('');
        setPickedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch {
      alert('Erro ao enviar mensagem ou documento.');
    } finally {
      setSending(false);
    }
  };

  const handleConvocarDoAnexo = async (fileName: string) => {
    setStageMode('hybrid');
    if (!selectedPautaId) return;

    try {
      await fetch('/api/admin/boardroom/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pautaId: selectedPautaId,
          subject: `Reunião de Vídeo sobre Anexo: ${fileName}`,
          content: `🚨 Reunião de Vídeo Convocada sobre o Anexo "${fileName}". Sala de Vídeo aberta para os sócios.`,
          recipients: ['TODOS'],
          copySender: true,
          authorUsername: normalizedUser,
          authorName: currentDisplayName,
        }),
      });
      fetchMessages(selectedPautaId);
    } catch {
      // Silencioso
    }
  };

  if (!isOpen) return null;

  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return '';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const totalParticipantsCount = 4 + level2Guests.length;

  return (
    <aside
      ref={winRef}
      className={`${styles.boardroomWindow} ${isGhost ? styles.ghostMode : ''} ${
        isShaded ? styles.shadedMode : ''
      } ${isSplit ? styles.splitMode : ''} ${isMax ? styles.maxMode : ''}`}
    >
      {/* 1. BARRA DE TÍTULO ARRASTÁVEL */}
      <div className={styles.windowTitlebar} onMouseDown={handleTitlebarMouseDown}>
        <div className={styles.titlebarLeft}>
          <span>⋮⋮</span>
          <span className={styles.windowTitle}>🏛️ SALA DE REUNIÕES &amp; COMPARTILHAMENTOS</span>
          <span className={styles.statusBadge}>
            {isPautaLocked
              ? '🔒 Aguardando Nome da Pauta'
              : level2Guests.length > 0
              ? `4+${level2Guests.length} Conectados`
              : '4/4 Sócios'}
          </span>
        </div>

        <div className={styles.titlebarControls}>
          <button
            type="button"
            className={`${styles.winBtn} ${isGhost ? styles.winBtnActive : ''}`}
            title="Modo Fantasma (Transparência para ver a tabela atrás)"
            onClick={() => setIsGhost(!isGhost)}
          >
            👁️
          </button>
          <button
            type="button"
            className={`${styles.winBtn} ${isShaded ? styles.winBtnActive : ''}`}
            title="Minimizar para o rodapé do card direito"
            onClick={toggleShade}
          >
            ▁
          </button>
          <button
            type="button"
            className={`${styles.winBtn} ${isSplit ? styles.winBtnActive : ''}`}
            title="Ancorar na Coluna Direita"
            onClick={toggleSplit}
          >
            ◫
          </button>
          <button
            type="button"
            className={`${styles.winBtn} ${isMax ? styles.winBtnActive : ''}`}
            title="Maximizar para Reunião por Vídeo"
            onClick={toggleMax}
          >
            ⛶
          </button>
        </div>
      </div>

      {/* 2. TRAVA OBRIGATÓRIA DE CRIAÇÃO DE PAUTA */}
      {isPautaLocked && (
        <div className={styles.pautaLockBanner}>
          <div className={styles.lockTitle}>🔒 OBRIGATÓRIO: NOMEAR A PAUTA ANTES DE INICIAR</div>
          <div className={styles.lockDesc}>
            Para evitar conversas soltas sem organização, grave primeiro o{' '}
            <strong>Nome da Pauta / Assunto</strong>. Ele será registrado na lista de Pautas da
            Diretoria e liberará os anexos, o chat e a chamada de vídeo.
          </div>
          <div className={styles.lockInputRow}>
            <input
              type="text"
              className={styles.lockInput}
              value={newPautaTitle}
              onChange={(e) => setNewPautaTitle(e.target.value)}
              placeholder="Ex: Pauta #04 · Homologação Tabela Atacado B2B Dimona"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmNewPauta();
              }}
            />
            <button
              type="button"
              className={adminStyles.btnPrimary}
              onClick={handleConfirmNewPauta}
              disabled={savingPauta}
            >
              {savingPauta ? 'Gravando...' : 'Gravar Pauta & Liberar Sala'}
            </button>
            <button
              type="button"
              className={adminStyles.executiveHeaderBtn}
              onClick={() => setIsPautaLocked(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* CORPO DA SALA */}
      <div
        className={`${styles.boardroomBodyWrapper} ${isPautaLocked ? styles.bodyLocked : ''}`}
      >
        {/* 3. SELETOR DE PAUTA ATIVA + BOTÕES DE PALCO */}
        <div className={styles.pautaSelectorStrip}>
          <div className={styles.pautaSelectGroup}>
            <strong style={{ fontSize: '10.5px', textTransform: 'uppercase' }}>📌 Pauta:</strong>
            <select
              className={styles.pautaDropdown}
              value={selectedPautaId}
              onChange={(e) => setSelectedPautaId(e.target.value)}
            >
              {pautas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={adminStyles.executiveHeaderBtn}
              title="Criar Nova Pauta Obrigatória"
              onClick={() => {
                setIsPautaLocked(true);
                setNewPautaTitle('');
              }}
            >
              + Nova
            </button>
          </div>

          <div className={styles.stageModeGroup}>
            <button
              type="button"
              className={`${adminStyles.executiveHeaderBtn} ${
                stageMode === 'chat' ? adminStyles.executiveHeaderBtnActive : ''
              }`}
              onClick={() => setStageMode('chat')}
            >
              💬 Chat
            </button>
            <button
              type="button"
              className={`${adminStyles.executiveHeaderBtn} ${
                stageMode === 'hybrid' ? adminStyles.executiveHeaderBtnActive : ''
              }`}
              onClick={() => setStageMode('hybrid')}
            >
              📹 Vídeo ({totalParticipantsCount})
            </button>
          </div>
        </div>

        {/* 4. PALCO DE VÍDEO & COMPARTILHAMENTO DE TELA */}
        {stageMode === 'hybrid' && (
          <div className={styles.videoStage}>
            {screenShareActive && (
              <div className={styles.screenShareBox}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      🖥️ <strong>TELA COMPARTILHADA AO VIVO:</strong> Transmissão ativa da sua tela
                    </span>
                    <button
                      type="button"
                      className={adminStyles.executiveHeaderBtn}
                      style={{ background: '#DFCFA8', color: '#000000' }}
                      onClick={toggleRealScreenShare}
                    >
                      Encerrar Tela
                    </button>
                  </div>
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      maxHeight: isMax ? '320px' : '180px',
                      background: '#000',
                      border: '1px solid #DFCFA8',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            )}

            {jitsiLive ? (
              <div style={{ width: '100%', height: isMax ? '360px' : '210px', border: '1px solid #000' }}>
                <iframe
                  title="AVA Sem Limites Boardroom Video"
                  src={`https://meet.jit.si/AVASemLimitesBoardroom_${selectedPautaId.slice(0, 8)}#config.prejoinPageEnabled=false`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="camera; microphone; display-capture; autoplay; clipboard-write"
                />
              </div>
            ) : (
              <div className={styles.videoGrid4}>
                {PARTNERS_INFO.map((p) => {
                  const isSelf = p.username === normalizedUser;
                  return (
                    <div
                      key={p.username}
                      className={`${styles.camCard} ${isSelf ? styles.camCardSpeaking : ''}`}
                    >
                      {isSelf && camActive ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '2px',
                          }}
                        />
                      ) : (
                        <>
                          <div className={styles.camInitials}>{p.initials}</div>
                          <div className={styles.camName}>
                            {p.name} {isSelf ? '(Você)' : ''}
                          </div>
                          <div className={styles.camDept}>{p.dept}</div>
                        </>
                      )}
                    </div>
                  );
                })}
                {level2Guests.map((g) => (
                  <div key={g.id} className={styles.camCard}>
                    <div className={styles.camInitials}>CT</div>
                    <div className={styles.camName}>🔑 {g.guest_name}</div>
                    <div className={styles.camDept}>Convidado Especial · Nível 2</div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.videoToolbar}>
              <button
                type="button"
                className={`${adminStyles.executiveHeaderBtn} ${styles.videoToolbarBtn} ${
                  micActive ? adminStyles.executiveHeaderBtnActive : ''
                }`}
                onClick={toggleRealMic}
                title="Ativar/Desativar Microfone Local"
              >
                🎙️ {micActive ? 'Mic ON' : 'Mic Mudo'}
              </button>
              <button
                type="button"
                className={`${adminStyles.executiveHeaderBtn} ${styles.videoToolbarBtn} ${
                  camActive ? adminStyles.executiveHeaderBtnActive : ''
                }`}
                onClick={toggleRealCamera}
                title="Ligar/Desligar Câmera Local"
              >
                📹 {camActive ? 'Câmera ON' : 'Ligar Câmera'}
              </button>
              <button
                type="button"
                className={`${adminStyles.executiveHeaderBtn} ${styles.videoToolbarBtn} ${
                  screenShareActive ? adminStyles.executiveHeaderBtnActive : ''
                }`}
                onClick={toggleRealScreenShare}
                title="Compartilhar Tela Nativa do Navegador"
              >
                🖥️ {screenShareActive ? 'Parar Tela' : 'Compartilhar Tela'}
              </button>
              <button
                type="button"
                className={`${adminStyles.executiveHeaderBtn} ${styles.videoToolbarBtn} ${
                  jitsiLive ? adminStyles.executiveHeaderBtnActive : ''
                }`}
                onClick={() => setJitsiLive(!jitsiLive)}
                title="Alternar Sala WebRTC Multiponto Ao Vivo"
              >
                {jitsiLive ? '📡 Sala Ao Vivo ON' : '📡 Conectar Ao Vivo'}
              </button>
              <button
                type="button"
                className={`${adminStyles.executiveHeaderBtn} ${styles.videoToolbarBtn}`}
                onClick={toggleMax}
              >
                ⛶ Maximizar
              </button>
              <button
                type="button"
                className={`${adminStyles.executiveHeaderBtn} ${styles.videoToolbarBtn}`}
                style={{ color: '#B91C1C', borderColor: '#B91C1C' }}
                onClick={() => {
                  setJitsiLive(false);
                  if (camActive) toggleRealCamera();
                  if (screenShareActive) toggleRealScreenShare();
                  setStageMode('chat');
                }}
              >
                ✕ Sair Vídeo
              </button>
            </div>
          </div>
        )}

        {/* 5. LISTA DE MENSAGENS, DOCUMENTOS E AVISOS DO AGENTE PORTEIRO */}
        <div className={styles.messagesContainer}>
          {loadingMessages && messages.length === 0 ? (
            <div style={{ fontSize: '11.5px', color: '#3F3F46', textAlign: 'center', padding: '16px' }}>
              Carregando histórico e documentos da pauta...
            </div>
          ) : (
            messages.map((m) => {
              const isOwn = m.author_username.toLowerCase() === normalizedUser && !m.is_system_porteiro;
              const recList = Array.isArray(m.recipients) ? m.recipients : ['TODOS'];
              const destDisplay = recList.includes('TODOS')
                ? 'TODOS os Sócios'
                : recList.join(', ');

              if (m.is_system_porteiro) {
                return (
                  <div key={m.id} className={`${styles.msgBubble} ${styles.msgBubblePorteiro}`}>
                    <div className={styles.msgMeta}>
                      <span className={styles.msgAuthor}>{m.author_name}</span>
                      <span className={styles.msgTime}>{formatTime(m.created_at)}</span>
                    </div>
                    <div className={styles.msgBody}>{m.content}</div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`${styles.msgBubble} ${isOwn ? styles.msgBubbleOwn : ''}`}
                >
                  <div className={styles.msgMeta}>
                    <span className={styles.msgAuthor}>{m.author_name}</span>
                    <span className={styles.msgTime}>{formatTime(m.created_at)}</span>
                  </div>
                  <div className={styles.msgSubjectLine}>📌 Assunto: {m.subject}</div>
                  <div className={styles.msgRecipientsLine}>
                    🎯 Anexado / Enviado para: {destDisplay}
                    {m.copy_sender ? ` · ☑️ Cópia enviada para ${m.author_name.split(' ')[0]}` : ''}
                  </div>
                  {m.content && <div className={styles.msgBody}>{m.content}</div>}

                  {m.attachment_name && (
                    <div className={styles.docAttachmentCard}>
                      <div className={styles.docTitle}>
                        📄 {m.attachment_name}{' '}
                        {m.attachment_size ? `(${formatBytes(m.attachment_size)})` : ''}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {m.attachment_url ? (
                          <a
                            href={m.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className={adminStyles.executiveHeaderBtn}
                            style={{ textDecoration: 'none' }}
                          >
                            Baixar / Abrir
                          </a>
                        ) : (
                          <button
                            type="button"
                            className={adminStyles.executiveHeaderBtn}
                            onClick={() =>
                              alert(`Documento protocolado na pauta: ${m.attachment_name}`)
                            }
                          >
                            Baixar / Abrir
                          </button>
                        )}
                        <button
                          type="button"
                          className={adminStyles.executiveHeaderBtn}
                          onClick={() => handleConvocarDoAnexo(m.attachment_name!)}
                        >
                          🚨 Convocar Reunião
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 6. COMPOSER COMPLETO */}
        <div className={styles.composerPanel}>
          <div className={styles.recipientsBar}>
            <div className={styles.recipientsLeft}>
              <span className={styles.recLabel}>🎯 Anexar / Enviar Para:</span>
              <button
                type="button"
                className={`${styles.recPill} ${
                  selectedRecipients.includes('TODOS') ? styles.recPillSelected : ''
                }`}
                onClick={() => handleToggleRecipient('TODOS')}
              >
                TODOS
              </button>

              {PARTNERS_INFO.map((p) => {
                const isSelf = p.username === normalizedUser;
                if (isSelf) {
                  return (
                    <button
                      key={p.username}
                      type="button"
                      className={`${styles.recPill} ${styles.recPillSelfDisabled}`}
                      title="Você é o remetente logado"
                      disabled
                    >
                      {p.name} (Você)
                    </button>
                  );
                }

                const isSelected = selectedRecipients.includes(p.name);
                return (
                  <button
                    key={p.username}
                    type="button"
                    className={`${styles.recPill} ${isSelected ? styles.recPillSelected : ''}`}
                    onClick={() => handleToggleRecipient(p.name)}
                  >
                    {p.name}
                  </button>
                );
              })}

              {level2Guests.map((g) => {
                const isSelected = selectedRecipients.includes(g.guest_name);
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`${styles.recPill} ${isSelected ? styles.recPillSelected : ''}`}
                    style={{ borderStyle: 'dashed' }}
                    onClick={() => handleToggleRecipient(g.guest_name)}
                  >
                    🔑 {g.guest_name}
                  </button>
                );
              })}
            </div>

            <label className={styles.copyMeCheck}>
              <input
                type="checkbox"
                checked={copyMe}
                onChange={(e) => setCopyMe(e.target.checked)}
              />
              <span>Enviar para mim também</span>
            </label>
          </div>

          <div className={styles.subjectRow}>
            <input
              type="text"
              className={styles.subjectInput}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto obrigatório do Anexo / Mensagem..."
            />
          </div>

          {pickedFile && (
            <div className={styles.pendingFileBar}>
              <span>
                📎 {pickedFile.name} ({formatBytes(pickedFile.size)})
              </span>
              <button
                type="button"
                className={adminStyles.executiveHeaderBtn}
                onClick={() => {
                  setPickedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                ✕ Remover
              </button>
            </div>
          )}

          <div className={styles.inputActionRow}>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPickedFile(f);
              }}
            />
            <button
              type="button"
              className={adminStyles.executiveHeaderBtn}
              onClick={() => fileInputRef.current?.click()}
              title="Anexar Documento Corporativo (Jurídico, Fiscal, Planilha, Contrato)"
            >
              📎 Anexar Doc
            </button>
            <input
              type="text"
              className={styles.msgInput}
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Explique o documento, tire dúvidas sobre o voto ou responda aos sócios..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !sending) handleSend();
              }}
            />
            <button
              type="button"
              className={styles.sendArrowBtn}
              onClick={handleSend}
              disabled={sending}
              title="Enviar & Notificar Sócios (Enter)"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="18" x2="18" y2="6"></line>
                <polyline points="9 6 18 6 18 15"></polyline>
              </svg>
            </button>
          </div>

          <div className={styles.footerHint}>
            <span>🤖 O Agente Porteiro avisa os sócios selecionados sobre cada anexo/assunto</span>
            <span>⟿ Arraste pelo topo · Redimensione pelo canto</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
