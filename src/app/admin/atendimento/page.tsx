'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface TicketItem {
  id: string;
  client: string;
  order: string;
  type: 'CDC49_TAMANHO' | 'DEFEITO_FABRICA';
  reason: string;
  assignedPartner: string;
  slaHoursLeft: number;
  status: 'PENDENTE_APROVACAO' | 'APROVADO' | 'TRANSBORDADO';
}

interface TrackingHistoryEvent {
  event_date_iso: string;
  event_date_brt: string;
  status_label: string;
  macro_code: string;
  micro_id: number;
  micro_name: string;
  micro_description: string;
  is_warning: boolean;
  owner_department: 'PRODUCAO_ARMANDO' | 'SAC_LOGISTICA_GUSTAVO';
  owner_label: string;
}

interface TrackingApiResponse {
  success: boolean;
  liveConnected: boolean;
  endpoint: string;
  clientId: string;
  orderNumber: string;
  publicTrackingUrl: string;
  summary: {
    statusMacro: string;
    statusLabel: string;
    microStateId: number;
    microStateName: string;
    microStateDescription: string;
    estimatedDeliveryIso: string;
    estimatedDeliveryBrt: string;
    carrierName: string;
    carrierMethod: string;
    origin: string;
    destination: string;
  };
  slaDiagnostics: {
    productionPhase: {
      owner: string;
      boundary: string;
      startedAtBrt: string;
      completedAtBrt: string;
      durationHours: number;
      durationFormatted: string;
      status: string;
      verdict: string;
    };
    dockPickupPhase: {
      owner: string;
      boundary: string;
      startedAtBrt: string;
      completedAtBrt: string;
      durationHours: number;
      durationFormatted: string;
      isBottleneck: boolean;
      verdict: string;
    };
    carrierTransitPhase: {
      owner: string;
      boundary: string;
      startedAtBrt: string;
      latestUpdateBrt: string;
      durationHours: number;
      durationFormatted: string;
      status: string;
      verdict: string;
    };
  };
  proactiveCustomerMessage: string;
  history: TrackingHistoryEvent[];
  rawGraphqlResponse: any;
  lastSync: string;
}

const INITIAL_TICKETS: TicketItem[] = [
  {
    id: 'TCK-2026-01',
    client: 'Lucas Andrade',
    order: '#AVA-1048',
    type: 'CDC49_TAMANHO',
    reason: 'Solicitação de troca do tamanho M para G na T-Shirt Prime Branca.',
    assignedPartner: 'Sócio Titular de Atendimento',
    slaHoursLeft: 1.5,
    status: 'PENDENTE_APROVACAO',
  },
  {
    id: 'TCK-2026-02',
    client: 'Mariana Silveira',
    order: '#AVA-1035',
    type: 'DEFEITO_FABRICA',
    reason: 'Pequena falha na junção da gola. Duas fotos anexadas para acionamento de garantia Dimona.',
    assignedPartner: 'Armando Sinkovitz (Transbordo Automático)',
    slaHoursLeft: 0.5,
    status: 'TRANSBORDADO',
  },
];

export default function AtendimentoAdminPage() {
  const [activeTab, setActiveTab] = useState<'logistics' | 'tickets'>('logistics');
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Estado da Torre de Rastreamento Logístico (API GraphQL Intelipost / J&T Express)
  const [orderInput, setOrderInput] = useState('755460927');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingApiResponse | null>(null);
  const [customerMessage, setCustomerMessage] = useState('');
  const [showRawGraphql, setShowRawGraphql] = useState(false);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 5500);
  };

  const fetchLogisticsTracking = async (queryOrder?: string, manual = false) => {
    const target = queryOrder || orderInput || '755460927';
    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/sac/tracking?orderNumber=${encodeURIComponent(target)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setTrackingData(data);
        setCustomerMessage(data.proactiveCustomerMessage || '');
        if (manual) {
          triggerFeedback(
            `✓ Sincronizado ao vivo com API GraphQL Intelipost / ${data.summary.carrierName} (Pedido #${data.orderNumber})!`
          );
        }
      } else {
        triggerFeedback(`⚠️ ${data.error || 'Não foi possível localizar o rastreamento.'}`);
      }
    } catch (err) {
      console.error('Erro ao buscar rastreamento logístico:', err);
      triggerFeedback('⚠️ Erro de conexão ao consultar API de rastreamento.');
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    fetchLogisticsTracking('755460927', false);
  }, []);

  const handleApprove = (id: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'APROVADO' } : t)));
    triggerFeedback(`Chamado ${id} aprovado com sucesso! Código de postagem reversa gerado e enviado ao cliente.`);
  };

  const handleSimulateWhatsAppAlert = (id: string) => {
    triggerFeedback(`📲 Alerta WhatsApp enviado com Deep Link de 1-Clique aos 4 Sócios para o chamado ${id}!`);
  };

  const handleSendProactiveCustomerUpdate = () => {
    if (!trackingData) return;
    triggerFeedback(
      `💬 Comunicado proativo disparado pelo SAC (Gustavo + Concierge IA) ao cliente do Pedido #${trackingData.orderNumber} com status "${trackingData.summary.microStateName}"!`
    );
  };

  const handleCopyCustomerMessage = () => {
    navigator.clipboard.writeText(customerMessage);
    triggerFeedback('📋 Mensagem proativa para o cliente copiada para a área de transferência!');
  };

  const handleReportBottleneckToProduction = () => {
    if (!trackingData) return;
    triggerFeedback(
      `📤 Relatório Gerencial enviado para Armando (Depto 04 · Produção): Alerta de janela de coleta de ${trackingData.slaDiagnostics.dockPickupPhase.durationFormatted} na doca (${trackingData.summary.carrierName}) no Pedido #${trackingData.orderNumber}.`
    );
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 05 · SAC, Logística de Entrega &amp; Comunicação com o Cliente</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Gustavo</strong> · Monitoramento Pós-Coleta (API J&amp;T Express / Intelipost), Comunicação Proativa com o Cliente, Concierge IA 24/7 e Triagem de Trocas
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Gustavo
          </span>
        </div>

        {actionFeedback && (
          <div
            style={{
              padding: '14px',
              background: '#FFFFFF',
              border: '2px solid #047857',
              color: '#065F46',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: 700,
            }}
          >
            {actionFeedback}
          </div>
        )}

        {/* Seletor de Abas do SAC */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '22px',
            borderBottom: '1px solid rgba(0,0,0,0.16)',
            paddingBottom: '12px',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            style={{
              padding: '9px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              background: activeTab === 'logistics' ? '#000000' : '#FFFFFF',
              color: activeTab === 'logistics' ? '#E4E4E7' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'logistics' ? '#000000' : 'rgba(0,0,0,0.18)',
              cursor: 'pointer',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            🚚 Torre Logística Pós-Coleta &amp; Comunicação Cliente (API J&amp;T / Intelipost)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            style={{
              padding: '9px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              background: activeTab === 'tickets' ? '#000000' : '#FFFFFF',
              color: activeTab === 'tickets' ? '#E4E4E7' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'tickets' ? '#000000' : 'rgba(0,0,0,0.18)',
              cursor: 'pointer',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            🛡️ Fila de Trocas, Garantia &amp; Cláusula Anti-Sobrecarga BPO
          </button>
        </div>

        {/* =================================================================== */}
        {/* ABA 1: TORRE LOGÍSTICA PÓS-COLETA & COMUNICAÇÃO COM O CLIENTE (SAC) */}
        {/* =================================================================== */}
        {activeTab === 'logistics' && (
          <div>
            {/* Barra de Conexão com a API GraphQL Intelipost / J&T Express */}
            <div className={styles.moduleCard} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h2 className={styles.cardHeading} style={{ margin: 0 }}>
                      Telemetria Logística em Tempo Real (Intelipost TMS / J&amp;T Express)
                    </h2>
                    <span
                      style={{
                        fontSize: '11px',
                        background: trackingData?.liveConnected ? 'rgba(5,150,105,0.14)' : 'rgba(217,119,6,0.14)',
                        color: trackingData?.liveConnected ? '#065F46' : '#92400E',
                        border: `1px solid ${trackingData?.liveConnected ? 'rgba(5,150,105,0.35)' : 'rgba(217,119,6,0.35)'}`,
                        padding: '2px 8px',
                        fontWeight: 700,
                      }}
                    >
                      {trackingData?.liveConnected ? '🟢 GraphQL API Ao Vivo (200 OK)' : '🟡 Cache Persistido'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>
                    <strong>Fronteira Operacional:</strong> A Produção (Armando · Depto 04) encerra sua alçada em <strong>Aguardando Coleta na Doca</strong>. A partir da Coleta, Trânsito entre Filiais e Entrega, o monitoramento de atrasos e toda a <strong>comunicação com o cliente</strong> pertencem ao <strong>SAC (Gustavo · Depto 05)</strong>.
                  </p>
                </div>

                {/* Buscador de Pedido / Link de Rastreio */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    placeholder="Nº Pedido ou Link Intelipost..."
                    style={{
                      padding: '7px 12px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.25)',
                      fontSize: '12px',
                      fontWeight: 700,
                      width: '210px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fetchLogisticsTracking(orderInput, true)}
                    disabled={trackingLoading}
                    className={styles.btnPrimary}
                    style={{ fontSize: '11px', padding: '8px 14px' }}
                  >
                    {trackingLoading ? 'Consultando...' : '🔄 Consultar API J&T / Intelipost'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRawGraphql(!showRawGraphql)}
                    className={styles.btnSecondary}
                    style={{ fontSize: '11px', padding: '8px 12px' }}
                  >
                    {showRawGraphql ? '✕ Fechar JSON' : '{ } JSON GraphQL'}
                  </button>
                </div>
              </div>

              {/* Inspetor do JSON Bruto da API GraphQL Intelipost */}
              {showRawGraphql && trackingData && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '14px',
                    background: '#0C0D0E',
                    color: '#10B981',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '4px' }}>
                    <span>⚡ POST {trackingData.endpoint} (clientId: {trackingData.clientId}, orderNumber: &quot;{trackingData.orderNumber}&quot;)</span>
                    <span>Transportadora: {trackingData.summary.carrierName}</span>
                  </div>
                  <pre style={{ margin: 0 }}>{JSON.stringify(trackingData.rawGraphqlResponse, null, 2)}</pre>
                </div>
              )}

              {/* Resumo Rápido da Remessa */}
              {trackingData && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '12px',
                    marginTop: '16px',
                  }}
                >
                  <div style={{ padding: '12px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.14)' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>
                      Pedido &amp; Transportadora
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                      #{trackingData.orderNumber} · {trackingData.summary.carrierName}
                    </div>
                    <span style={{ fontSize: '11px', color: '#4B5563' }}>
                      Origem: {trackingData.summary.origin}
                    </span>
                  </div>

                  <div style={{ padding: '12px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.14)' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>
                      Último Micro-Status na API
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                      ● {trackingData.summary.microStateName}
                    </div>
                    <span style={{ fontSize: '11px', color: '#4B5563' }}>
                      Macro: {trackingData.summary.statusLabel} ({trackingData.summary.statusMacro})
                    </span>
                  </div>

                  <div style={{ padding: '12px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.14)' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>
                      Previsão Oficial de Entrega
                    </span>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#000000', marginTop: '4px', textTransform: 'capitalize' }}>
                      {trackingData.summary.estimatedDeliveryBrt}
                    </div>
                    <span style={{ fontSize: '11px', color: '#4B5563' }}>
                      Destino: {trackingData.summary.destination}
                    </span>
                  </div>
                </div>
              )}

              {/* Autópsia de SLAs e Diagnóstico de Fatores de Atraso (Produção vs Doca vs Trânsito SAC) */}
              {trackingData && (
                <div style={{ marginTop: '18px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginBottom: '10px' }}>
                    🔬 Diagnóstico de Tempos &amp; Fatores de Atraso (Separação Produção × Coleta na Doca × Trânsito Logístico SAC):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    {/* Fase 1: Produção */}
                    <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid rgba(4,120,87,0.35)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#065F46' }}>
                          1. {trackingData.slaDiagnostics.productionPhase.owner}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#000000' }}>
                          {trackingData.slaDiagnostics.productionPhase.durationFormatted}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                        {trackingData.slaDiagnostics.productionPhase.boundary}
                      </div>
                      <div style={{ fontSize: '11px', color: '#374151', marginBottom: '6px' }}>
                        Início: {trackingData.slaDiagnostics.productionPhase.startedAtBrt} ➔ Doca: {trackingData.slaDiagnostics.productionPhase.completedAtBrt}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#065F46' }}>
                        {trackingData.slaDiagnostics.productionPhase.verdict}
                      </div>
                    </div>

                    {/* Fase 2: Gargalo de Doca / Coleta */}
                    <div
                      style={{
                        padding: '14px',
                        background: trackingData.slaDiagnostics.dockPickupPhase.isBottleneck ? '#FEF2F2' : '#FFFFFF',
                        border: `2px solid ${trackingData.slaDiagnostics.dockPickupPhase.isBottleneck ? '#DC2626' : 'rgba(4,120,87,0.35)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: trackingData.slaDiagnostics.dockPickupPhase.isBottleneck ? '#991B1B' : '#065F46',
                          }}
                        >
                          2. Janela de Coleta na Doca (Fator Crítico)
                        </span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 800,
                            color: trackingData.slaDiagnostics.dockPickupPhase.isBottleneck ? '#991B1B' : '#000000',
                          }}
                        >
                          {trackingData.slaDiagnostics.dockPickupPhase.durationFormatted}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                        {trackingData.slaDiagnostics.dockPickupPhase.boundary}
                      </div>
                      <div style={{ fontSize: '11px', color: '#374151', marginBottom: '6px' }}>
                        Despachado CD: {trackingData.slaDiagnostics.dockPickupPhase.startedAtBrt} ➔ Coletado: {trackingData.slaDiagnostics.dockPickupPhase.completedAtBrt}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: trackingData.slaDiagnostics.dockPickupPhase.isBottleneck ? '#991B1B' : '#065F46',
                          marginBottom: '8px',
                        }}
                      >
                        {trackingData.slaDiagnostics.dockPickupPhase.verdict}
                      </div>
                      {trackingData.slaDiagnostics.dockPickupPhase.isBottleneck && (
                        <button
                          type="button"
                          onClick={handleReportBottleneckToProduction}
                          className={styles.btnSecondary}
                          style={{ fontSize: '10px', padding: '5px 10px', width: '100%' }}
                        >
                          📤 Reportar Gargalo de Coleta p/ Produção (Armando)
                        </button>
                      )}
                    </div>

                    {/* Fase 3: Trânsito Rodoviário & Última Milha (SAC) */}
                    <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid rgba(29,78,216,0.35)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#1E40AF' }}>
                          3. {trackingData.slaDiagnostics.carrierTransitPhase.owner}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#000000' }}>
                          {trackingData.slaDiagnostics.carrierTransitPhase.durationFormatted}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                        {trackingData.slaDiagnostics.carrierTransitPhase.boundary}
                      </div>
                      <div style={{ fontSize: '11px', color: '#374151', marginBottom: '6px' }}>
                        Coleta: {trackingData.slaDiagnostics.carrierTransitPhase.startedAtBrt} ➔ Último Evento: {trackingData.slaDiagnostics.carrierTransitPhase.latestUpdateBrt}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF' }}>
                        {trackingData.slaDiagnostics.carrierTransitPhase.verdict}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid 2 Colunas: Histórico Completo da Transportadora vs Central de Comunicação com o Cliente */}
            {trackingData && (
              <div className={styles.moduleGrid2Cols}>
                {/* Coluna Esquerda: Linha do Tempo Completa da API Intelipost / J&T */}
                <div className={styles.moduleCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 className={styles.cardHeading} style={{ margin: 0 }}>
                      Histórico Completo de Eventos ({trackingData.history.length})
                    </h2>
                    <a
                      href={trackingData.publicTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnSecondary}
                      style={{ fontSize: '10px', padding: '5px 10px', textDecoration: 'none' }}
                    >
                      Abrir Portal Intelipost/J&amp;T ↗
                    </a>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {trackingData.history.map((ev, idx) => {
                      const isSacScope = ev.owner_department === 'SAC_LOGISTICA_GUSTAVO';
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '12px',
                            background: idx === 0 ? '#FEFCF5' : '#FFFFFF',
                            border: idx === 0 ? '2px solid #000000' : '1px solid rgba(0,0,0,0.14)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#000000' }}>
                              {ev.event_date_brt} · {ev.micro_name}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                background: isSacScope ? 'rgba(29,78,216,0.12)' : 'rgba(5,150,105,0.12)',
                                color: isSacScope ? '#1E40AF' : '#065F46',
                                border: `1px solid ${isSacScope ? 'rgba(29,78,216,0.3)' : 'rgba(5,150,105,0.3)'}`,
                              }}
                            >
                              {ev.owner_label}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#374151' }}>
                            {ev.micro_description}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px', fontFamily: 'monospace' }}>
                            Macro: {ev.macro_code} · Micro ID: #{ev.micro_id} ({ev.status_label})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Coluna Direita: Central de Comunicação Proativa do SAC com o Cliente */}
                <div className={styles.moduleCard}>
                  <h2 className={styles.cardHeading}>
                    Comunicação Proativa do SAC com o Cliente (Gustavo + Concierge IA)
                  </h2>
                  <p style={{ fontSize: '12px', color: '#374151', marginBottom: '12px', lineHeight: '1.5' }}>
                    O cliente nunca precisa perguntar <em>&quot;Onde está meu pedido?&quot;</em>. Sempre que a API da transportadora registra uma movimentação ou quando há espera de coleta em feriado/fim de semana, o SAC dispara o posicionamento transparente ao cliente:
                  </p>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4B5563', marginBottom: '4px' }}>
                      Mensagem Pronta Gerada com os Dados Ao Vivo da API (#{trackingData.orderNumber}):
                    </label>
                    <textarea
                      rows={5}
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0,0,0,0.22)',
                        fontSize: '12px',
                        color: '#000000',
                        lineHeight: '1.5',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    <button
                      type="button"
                      onClick={handleSendProactiveCustomerUpdate}
                      className={styles.btnPrimary}
                      style={{ fontSize: '11px', padding: '9px 14px' }}
                    >
                      💬 Disparar Atualização no WhatsApp do Cliente
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyCustomerMessage}
                      className={styles.btnSecondary}
                      style={{ fontSize: '11px', padding: '9px 14px' }}
                    >
                      📋 Copiar Mensagem p/ Cliente
                    </button>
                  </div>

                  <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.14)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#000000', marginBottom: '6px' }}>
                      📌 Governança do Fluxo Produção ➔ SAC:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#374151', lineHeight: '1.55' }}>
                      <li>
                        <strong>Até &quot;Aguardando Coleta / Despachado p/ Doca&quot;:</strong> Responsabilidade da <strong>Produção (Armando · Depto 04)</strong> garantir que a fábrica produza, emita a NF-e e cole a etiqueta dentro de 3 dias úteis.
                      </li>
                      <li>
                        <strong>De &quot;Aguardando Coleta / Coletado&quot; até &quot;Entregue&quot;:</strong> Responsabilidade do <strong>SAC (Gustavo · Depto 05)</strong> monitorar a transportadora via API e manter o cliente informado com proatividade e cortesia.
                      </li>
                      <li>
                        <strong>Retroalimentação Executiva:</strong> Quando a API aponta gargalo de coleta (&gt; 24h na doca), o SAC tranquiliza o cliente e reporta o indicador à Produção para auditoria de SLA junto ao fornecedor.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* ABA 2: FILA DE TROCAS, GARANTIA & CLÁUSULA ANTI-SOBRECARGA BPO      */}
        {/* =================================================================== */}
        {activeTab === 'tickets' && (
          <div className={styles.moduleGrid2Cols}>
            {/* Fila de Chamados e Triagem */}
            <div className={styles.moduleCard}>
              <h2 className={styles.cardHeading}>Fila Operacional de Trocas &amp; Devoluções</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    style={{
                      padding: '14px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.12)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#000000', fontSize: '13px' }}>
                        {ticket.id} · {ticket.client} ({ticket.order})
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          fontWeight: 700,
                          background:
                            ticket.status === 'APROVADO'
                              ? 'rgba(5,150,105,0.14)'
                              : ticket.status === 'TRANSBORDADO'
                              ? 'rgba(220,38,38,0.14)'
                              : 'rgba(217,119,6,0.14)',
                          color:
                            ticket.status === 'APROVADO'
                              ? '#065F46'
                              : ticket.status === 'TRANSBORDADO'
                              ? '#991B1B'
                              : '#92400E',
                          border: '1px solid',
                          borderColor:
                            ticket.status === 'APROVADO'
                              ? 'rgba(5,150,105,0.3)'
                              : ticket.status === 'TRANSBORDADO'
                              ? 'rgba(220,38,38,0.3)'
                              : 'rgba(217,119,6,0.3)',
                        }}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#27272A', marginBottom: '8px' }}>{ticket.reason}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#4B5563' }}>
                      <span>
                        Responsável: <strong style={{ color: '#000000' }}>{ticket.assignedPartner}</strong>
                      </span>
                      <span>
                        SLA: <strong style={{ color: '#000000' }}>{ticket.slaHoursLeft}h restantes</strong>
                      </span>
                    </div>

                    {ticket.status !== 'APROVADO' && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button onClick={() => handleApprove(ticket.id)} className={styles.btnPrimary} style={{ fontSize: '10px' }}>
                          ✓ Aprovar Troca 1-Clique
                        </button>
                        <button onClick={() => handleSimulateWhatsAppAlert(ticket.id)} className={styles.btnSecondary} style={{ fontSize: '10px' }}>
                          📲 Disparar WhatsApp aos 4 Sócios
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Manifesto do Zagueiro-Artilheiro + Gatilho de Terceirização BPO */}
            <div className={styles.moduleCard} data-boardroom-anchor="right-card">
              <h2 className={styles.cardHeading}>Cláusula Anti-Sobrecarga &amp; Gatilho de Terceirização BPO (5 Atendimentos)</h2>
              <div style={{ fontSize: '13px', color: '#18181B', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '12px' }}>
                  95% a 98% dos atendimentos são resolvidos 24/7 pelos Agentes de IA (<strong>Concierge IA</strong> e <strong>Discriminador de Ocorrências</strong>). O sócio titular (<strong>Gustavo</strong>) atua como Diretor da Pasta.
                </p>

                <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.18)', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                    🎯 Gatilho Objetivo (Marca de 5 Atendimentos Humanos Recorrentes):
                  </div>
                  <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>
                    Ao atingir <strong>5 atendimentos humanos recorrentes</strong> por ciclo operacional (~75 a 150 chamados/mês), a fila humana é terceirizada para um <strong>Secretariado Virtual Compartilhado / Call Center BPO</strong> (custo de mercado: <strong>R$ 600 a R$ 850/mês</strong>, equivalente ao lucro de ~6 camisetas/mês), operando no Painel com <strong>🔑 Senha Convidado Nível 1</strong> (sem acesso à Sala de Reuniões).
                  </p>
                </div>

                <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#000000', marginBottom: '4px' }}>Filosofia do Zagueiro-Artilheiro (Transbordo Automático):</div>
                  <p style={{ fontSize: '12px', color: '#374151' }}>
                    Se o titular do dia não acionar a autorização em 2 horas, o sistema escala imediatamente para os <strong>outros 3 sócios</strong> via WhatsApp com deep link de aprovação instantânea.
                  </p>
                </div>

                <div style={{ padding: '12px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: 600 }}>Status do Concierge IA 24/7 na Loja Pública:</span>
                  <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700, marginTop: '2px' }}>
                    ● Operando online em /atendimento respondendo dúvidas de modelagem, prazos e cuidados.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
