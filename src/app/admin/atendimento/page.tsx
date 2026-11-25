'use client';

import React, { useState, useEffect } from 'react';
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
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Gustavo
          </span>
        </div>

        {actionFeedback && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {actionFeedback}
          </div>
        )}

        {/* Seletor de Abas do SAC Unificado */}
        <div className={styles.tabStripContainer}>
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`${styles.tabBtn} ${activeTab === 'logistics' ? styles.tabBtnActive : ''}`}
          >
            🚚 Torre Logística Pós-Coleta &amp; Comunicação Cliente (API J&amp;T / Intelipost)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={`${styles.tabBtn} ${activeTab === 'tickets' ? styles.tabBtnActive : ''}`}
          >
            🛡️ Fila de Trocas, Garantia &amp; Cláusula Anti-Sobrecarga BPO
          </button>
        </div>

        {/* =================================================================== */}
        {/* ABA 1: TORRE LOGÍSTICA PÓS-COLETA & COMUNICAÇÃO COM O CLIENTE (SAC) */}
        {/* =================================================================== */}
        {activeTab === 'logistics' && (
          <div>
            <div className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
              <div className={styles.flexRowBetween}>
                <div>
                  <div className={styles.flexRowStart}>
                    <h2 className={styles.cardHeadingNoBorder}>
                      Telemetria Logística em Tempo Real (Intelipost TMS / J&amp;T Express)
                    </h2>
                    <span
                      className={`${styles.statusPill} ${
                        trackingData?.liveConnected ? styles.statusPillSuccess : styles.statusPillWarning
                      }`}
                    >
                      {trackingData?.liveConnected ? '🟢 GraphQL API Ao Vivo (200 OK)' : '🟡 Cache Persistido'}
                    </span>
                  </div>
                  <p className={styles.textBodySmall}>
                    <strong>Fronteira Operacional:</strong> A Produção (Armando · Depto 04) encerra sua alçada em <strong>Aguardando Coleta na Doca</strong>. A partir da Coleta, Trânsito entre Filiais e Entrega, o monitoramento de atrasos e toda a <strong>comunicação com o cliente</strong> pertencem ao <strong>SAC (Gustavo · Depto 05)</strong>.
                  </p>
                </div>

                <div className={styles.flexRowStart}>
                  <input
                    type="text"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    placeholder="Nº Pedido ou Link Intelipost..."
                    className={styles.formInput}
                  />
                  <button
                    type="button"
                    onClick={() => fetchLogisticsTracking(orderInput, true)}
                    disabled={trackingLoading}
                    className={styles.btnPrimary}
                  >
                    {trackingLoading ? 'Consultando...' : '🔄 Consultar API J&T / Intelipost'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRawGraphql(!showRawGraphql)}
                    className={styles.btnSecondary}
                  >
                    {showRawGraphql ? '✕ Fechar JSON' : '{ } JSON GraphQL'}
                  </button>
                </div>
              </div>

              {showRawGraphql && trackingData && (
                <div className={styles.jsonInspectorDrawer}>
                  <div className={styles.jsonInspectorHeader}>
                    <span>⚡ POST {trackingData.endpoint} (clientId: {trackingData.clientId}, orderNumber: &quot;{trackingData.orderNumber}&quot;)</span>
                    <span>Transportadora: {trackingData.summary.carrierName}</span>
                  </div>
                  <pre>{JSON.stringify(trackingData.rawGraphqlResponse, null, 2)}</pre>
                </div>
              )}

              {trackingData && (
                <div className={styles.kpiGrid}>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>Pedido &amp; Transportadora</span>
                    <div className={styles.kpiValue}>
                      #{trackingData.orderNumber} · {trackingData.summary.carrierName}
                    </div>
                    <span className={styles.kpiSub}>Origem: {trackingData.summary.origin}</span>
                  </div>

                  <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>Último Micro-Status na API</span>
                    <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                      ● {trackingData.summary.microStateName}
                    </div>
                    <span className={styles.kpiSub}>
                      Macro: {trackingData.summary.statusLabel} ({trackingData.summary.statusMacro})
                    </span>
                  </div>

                  <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>Previsão Oficial de Entrega</span>
                    <div className={styles.kpiValue}>{trackingData.summary.estimatedDeliveryBrt}</div>
                    <span className={styles.kpiSub}>Destino: {trackingData.summary.destination}</span>
                  </div>
                </div>
              )}

              {trackingData && (
                <div className={styles.flexColStack}>
                  <div className={styles.decisionTitle}>
                    🔬 Diagnóstico de Tempos &amp; Fatores de Atraso (Separação Produção × Coleta na Doca × Trânsito Logístico SAC):
                  </div>

                  <div className={styles.autoGridCards}>
                    {/* Fase 1: Produção */}
                    <div className={`${styles.innerCard} ${styles.innerCardSuccess}`}>
                      <div className={styles.flexRowBetween}>
                        <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>
                          1. {trackingData.slaDiagnostics.productionPhase.owner}
                        </span>
                        <span className={styles.decisionTitle}>
                          {trackingData.slaDiagnostics.productionPhase.durationFormatted}
                        </span>
                      </div>
                      <div className={styles.textPrimaryBold}>
                        {trackingData.slaDiagnostics.productionPhase.boundary}
                      </div>
                      <div className={styles.textMutedSmall}>
                        Início: {trackingData.slaDiagnostics.productionPhase.startedAtBrt} ➔ Doca: {trackingData.slaDiagnostics.productionPhase.completedAtBrt}
                      </div>
                      <div className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
                        {trackingData.slaDiagnostics.productionPhase.verdict}
                      </div>
                    </div>

                    {/* Fase 2: Gargalo de Doca / Coleta */}
                    <div
                      className={`${styles.innerCard} ${
                        trackingData.slaDiagnostics.dockPickupPhase.isBottleneck
                          ? styles.innerCardDanger
                          : styles.innerCardSuccess
                      }`}
                    >
                      <div className={styles.flexRowBetween}>
                        <span
                          className={`${styles.kpiLabel} ${
                            trackingData.slaDiagnostics.dockPickupPhase.isBottleneck
                              ? styles.textDanger
                              : styles.textSuccess
                          }`}
                        >
                          2. Janela de Coleta na Doca (Fator Crítico)
                        </span>
                        <span
                          className={`${styles.decisionTitle} ${
                            trackingData.slaDiagnostics.dockPickupPhase.isBottleneck
                              ? styles.textDanger
                              : ''
                          }`}
                        >
                          {trackingData.slaDiagnostics.dockPickupPhase.durationFormatted}
                        </span>
                      </div>
                      <div className={styles.textPrimaryBold}>
                        {trackingData.slaDiagnostics.dockPickupPhase.boundary}
                      </div>
                      <div className={styles.textMutedSmall}>
                        Despachado CD: {trackingData.slaDiagnostics.dockPickupPhase.startedAtBrt} ➔ Coletado: {trackingData.slaDiagnostics.dockPickupPhase.completedAtBrt}
                      </div>
                      <div
                        className={`${styles.textPrimaryBold} ${
                          trackingData.slaDiagnostics.dockPickupPhase.isBottleneck
                            ? styles.textDanger
                            : styles.textSuccess
                        }`}
                      >
                        {trackingData.slaDiagnostics.dockPickupPhase.verdict}
                      </div>
                      {trackingData.slaDiagnostics.dockPickupPhase.isBottleneck && (
                        <button
                          type="button"
                          onClick={handleReportBottleneckToProduction}
                          className={styles.btnSecondary}
                        >
                          📤 Reportar Gargalo de Coleta p/ Produção (Armando)
                        </button>
                      )}
                    </div>

                    {/* Fase 3: Trânsito Rodoviário & Última Milha (SAC) */}
                    <div className={`${styles.innerCard} ${styles.innerCardInfo}`}>
                      <div className={styles.flexRowBetween}>
                        <span className={`${styles.kpiLabel} ${styles.textInfo}`}>
                          3. {trackingData.slaDiagnostics.carrierTransitPhase.owner}
                        </span>
                        <span className={styles.decisionTitle}>
                          {trackingData.slaDiagnostics.carrierTransitPhase.durationFormatted}
                        </span>
                      </div>
                      <div className={styles.textPrimaryBold}>
                        {trackingData.slaDiagnostics.carrierTransitPhase.boundary}
                      </div>
                      <div className={styles.textMutedSmall}>
                        Coleta: {trackingData.slaDiagnostics.carrierTransitPhase.startedAtBrt} ➔ Último Evento: {trackingData.slaDiagnostics.carrierTransitPhase.latestUpdateBrt}
                      </div>
                      <div className={`${styles.textPrimaryBold} ${styles.textInfo}`}>
                        {trackingData.slaDiagnostics.carrierTransitPhase.verdict}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {trackingData && (
              <div className={styles.moduleGrid2Cols}>
                {/* Coluna Esquerda: Linha do Tempo Completa */}
                <div className={styles.moduleCard}>
                  <div className={styles.flexRowBetween}>
                    <h2 className={styles.cardHeadingNoBorder}>
                      Histórico Completo de Eventos ({trackingData.history.length})
                    </h2>
                    <a
                      href={trackingData.publicTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnSecondary}
                    >
                      Abrir Portal Intelipost/J&amp;T ↗
                    </a>
                  </div>

                  <div className={styles.flexColStack}>
                    {trackingData.history.map((ev, idx) => {
                      const isSacScope = ev.owner_department === 'SAC_LOGISTICA_GUSTAVO';
                      return (
                        <div
                          key={idx}
                          className={`${styles.innerCardCompact} ${
                            idx === 0 ? styles.innerCardSelected : ''
                          }`}
                        >
                          <div className={styles.flexRowBetween}>
                            <span className={styles.decisionTitle}>
                              {ev.event_date_brt} · {ev.micro_name}
                            </span>
                            <span
                              className={`${styles.statusPill} ${
                                isSacScope ? styles.statusPillInfo : styles.statusPillSuccess
                              }`}
                            >
                              {ev.owner_label}
                            </span>
                          </div>
                          <div className={styles.textBodySmall}>{ev.micro_description}</div>
                          <div className={styles.textMutedSmall}>
                            Macro: {ev.macro_code} · Micro ID: #{ev.micro_id} ({ev.status_label})
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Coluna Direita: Central de Comunicação Proativa */}
                <div className={styles.moduleCard}>
                  <h2 className={styles.cardHeading}>
                    Comunicação Proativa do SAC com o Cliente (Gustavo + Concierge IA)
                  </h2>
                  <p className={styles.textBodySmall}>
                    O cliente nunca precisa perguntar <em>&quot;Onde está meu pedido?&quot;</em>. Sempre que a API da transportadora registra uma movimentação ou quando há espera de coleta em feriado/fim de semana, o SAC dispara o posicionamento transparente ao cliente:
                  </p>

                  <div>
                    <label className={styles.formLabel}>
                      Mensagem Pronta Gerada com os Dados Ao Vivo da API (#{trackingData.orderNumber}):
                    </label>
                    <textarea
                      rows={5}
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      className={styles.formTextarea}
                    />
                  </div>

                  <div className={styles.flexRowStart}>
                    <button
                      type="button"
                      onClick={handleSendProactiveCustomerUpdate}
                      className={styles.btnPrimary}
                    >
                      💬 Disparar Atualização no WhatsApp do Cliente
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyCustomerMessage}
                      className={styles.btnSecondary}
                    >
                      📋 Copiar Mensagem p/ Cliente
                    </button>
                  </div>

                  <div className={styles.innerCard}>
                    <div className={styles.decisionTitle}>
                      📌 Governança do Fluxo Produção ➔ SAC:
                    </div>
                    <ul className={styles.textBodySmall}>
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
            <div className={styles.moduleCard}>
              <h2 className={styles.cardHeading}>Fila Operacional de Trocas &amp; Devoluções</h2>
              <div className={styles.flexColStack}>
                {tickets.map((ticket) => (
                  <div key={ticket.id} className={`${styles.innerCard} ${styles.flexColTight}`}>
                    <div className={styles.flexRowBetween}>
                      <span className={styles.decisionTitle}>
                        {ticket.id} · {ticket.client} ({ticket.order})
                      </span>
                      <span
                        className={`${styles.statusPill} ${
                          ticket.status === 'APROVADO'
                            ? styles.statusPillSuccess
                            : ticket.status === 'TRANSBORDADO'
                            ? styles.statusPillDanger
                            : styles.statusPillWarning
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <p className={styles.textBodySmall}>{ticket.reason}</p>

                    <div className={styles.flexRowBetween}>
                      <span className={styles.textMutedSmall}>
                        Responsável: <strong className={styles.textPrimaryBold}>{ticket.assignedPartner}</strong>
                      </span>
                      <span className={styles.textMutedSmall}>
                        SLA: <strong className={styles.textPrimaryBold}>{ticket.slaHoursLeft}h restantes</strong>
                      </span>
                    </div>

                    {ticket.status !== 'APROVADO' && (
                      <div className={styles.flexRowStart}>
                        <button onClick={() => handleApprove(ticket.id)} className={styles.btnPrimary}>
                          ✓ Aprovar Troca 1-Clique
                        </button>
                        <button onClick={() => handleSimulateWhatsAppAlert(ticket.id)} className={styles.btnSecondary}>
                          📲 Disparar WhatsApp aos 4 Sócios
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.moduleCard} data-boardroom-anchor="right-card">
              <h2 className={styles.cardHeading}>Cláusula Anti-Sobrecarga &amp; Gatilho de Terceirização BPO (5 Atendimentos)</h2>
              <div className={styles.flexColStack}>
                <p className={styles.textBodySmall}>
                  95% a 98% dos atendimentos são resolvidos 24/7 pelos Agentes de IA (<strong>Concierge IA</strong> e <strong>Discriminador de Ocorrências</strong>). O sócio titular (<strong>Gustavo</strong>) atua como Diretor da Pasta.
                </p>

                <div className={styles.innerCard}>
                  <div className={styles.decisionTitle}>
                    🎯 Gatilho Objetivo (Marca de 5 Atendimentos Humanos Recorrentes):
                  </div>
                  <p className={styles.textBodySmall}>
                    Ao atingir <strong>5 atendimentos humanos recorrentes</strong> por ciclo operacional (~75 a 150 chamados/mês), a fila humana é terceirizada para um <strong>Secretariado Virtual Compartilhado / Call Center BPO</strong> (custo de mercado: <strong>R$ 600 a R$ 850/mês</strong>, equivalente ao lucro de ~6 camisetas/mês), operando no Painel com <strong>🔑 Senha Convidado Nível 1</strong> (sem acesso à Sala de Reuniões).
                  </p>
                </div>

                <div className={styles.innerCard}>
                  <div className={styles.decisionTitle}>Filosofia do Zagueiro-Artilheiro (Transbordo Automático):</div>
                  <p className={styles.textBodySmall}>
                    Se o titular do dia não acionar a autorização em 2 horas, o sistema escala imediatamente para os <strong>outros 3 sócios</strong> via WhatsApp com deep link de aprovação instantânea.
                  </p>
                </div>

                <div className={styles.innerCardCompact}>
                  <span className={styles.kpiLabel}>Status do Concierge IA 24/7 na Loja Pública:</span>
                  <div className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
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
