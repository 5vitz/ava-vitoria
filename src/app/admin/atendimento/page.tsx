'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { WorkflowPersistentState } from '@/lib/workflowState';

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

export default function AtendimentoAdminPage() {
  const [activeTab, setActiveTab] = useState<'logistics' | 'tickets'>('logistics');
  // Fila de trocas começa 100% ZERADA (sem chamados fictícios)
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Consulta avulsa da API GraphQL Intelipost (para consulta histórica opcional)
  const [orderInput, setOrderInput] = useState('755460927');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [showHistoricalApi, setShowHistoricalApi] = useState(false);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 6500);
  };

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.state) {
        setWfState(data.state);
      }
    } catch (err) {
      console.error('Erro ao buscar workflow no SAC:', err);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const handleAdvanceSacAndArchive = async (
    orderId: string,
    sacStatus: 'EM_TRANSITO_FILIAL' | 'ENTREGUE_AO_CLIENTE'
  ) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADVANCE_SAC_AND_ARCHIVE_TO_DIRETORIA',
          orderId,
          sacStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        triggerFeedback(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLogisticsTracking = async () => {
    setTrackingLoading(true);
    try {
      const res = await fetch(
        `/api/sac/tracking?orderNumber=${encodeURIComponent(orderInput || '755460927')}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (data.success) {
        setTrackingData(data);
        setShowHistoricalApi(true);
      }
    } finally {
      setTrackingLoading(false);
    }
  };

  const liveOrders = wfState?.liveOrders || [];
  const sacOrders = liveOrders.filter((o) => o.productionStep === '5_COLETADO_SAC');
  const archivedClients = wfState?.archivedClientOrders || [];

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 05 · SAC, Torre Logística Pós-Coleta &amp; Arquivamento na Diretoria</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Gustavo</strong> · Alçada Pós-Coleta (COLETADO ➔ Entregue ao Cliente), Arquivamento na Diretoria (Gera os 2 Relatórios) e Cláusula BPO (5 atendimentos)
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

        {/* Seletor de Abas do SAC */}
        <div className={styles.tabStripContainer}>
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`${styles.tabBtn} ${activeTab === 'logistics' ? styles.tabBtnActive : ''}`}
          >
            🚚 Torre Logística Pós-Coleta (Fase 4 · Etapa 10) ({sacOrders.length} em Entrega)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={`${styles.tabBtn} ${activeTab === 'tickets' ? styles.tabBtnActive : ''}`}
          >
            🛡️ Fila de Trocas ({tickets.length} Abertos) &amp; Cláusula Anti-Sobrecarga BPO
          </button>
        </div>

        {/* =================================================================== */}
        {/* ABA 1: TORRE LOGÍSTICA PÓS-COLETA & ARQUIVAMENTO NA DIRETORIA       */}
        {/* =================================================================== */}
        {activeTab === 'logistics' && (
          <div className={styles.flexColStack}>
            <div className={styles.moduleCard}>
              <div className={styles.flexRowBetween}>
                <div>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🚚 FASE 4 (Etapa 10): Pedidos de Clientes Pós-Coleta (Alçada do SAC até Entrega &amp; Arquivamento)
                  </h2>
                  <p className={styles.textBodySmall}>
                    <strong>Fronteira Operacional:</strong> Assim que a Produção (Armando · Depto 04) marca o pedido como <strong>COLETADO</strong> na doca, ele entra nesta Torre Logística do <strong>SAC (Gustavo · Depto 05)</strong>. Ao confirmar a entrega ao cliente, o pedido é <strong>arquivado na Diretoria Executiva (Pasta: 👤 Clientes)</strong> e gera os <strong>2 Relatórios Executivos (Flávio &amp; Gustavo)</strong>!
                  </p>
                </div>
                <Link href="/admin/diretoria" className={styles.btnSecondary}>
                  🗄️ Ver Arquivo &amp; 2 Relatórios na Diretoria ({archivedClients.length}) ↗
                </Link>
              </div>

              {sacOrders.length === 0 ? (
                <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
                  <div>
                    <div className={styles.decisionTitle}>
                      ✓ Torre Logística Limpa (0 Entregas de Clientes Pendentes no SAC)
                    </div>
                    <p className={styles.textBodySmall}>
                      {archivedClients.length > 0 ? (
                        <>
                          🎉 <strong>{archivedClients.length} pedido(s) de cliente já foi(ram) entregue(s) e arquivado(s) na Diretoria Executiva!</strong> Os 2 Relatórios (Financeiro do Flávio e Marketing de Vendas do Gustavo) já estão atualizados lá na Diretoria.
                        </>
                      ) : (
                        <>
                          Aguardando o <strong>Depto 04 · Produção (Armando)</strong> concluir a fabricação da Peça Única até a Doca e transbordar o status <strong>COLETADO</strong> para esta Torre.
                        </>
                      )}
                    </p>
                  </div>
                  {archivedClients.length > 0 ? (
                    <Link href="/admin/diretoria" className={styles.btnSuccess}>
                      🏛️ Abrir Diretoria &amp; Ver os 2 Relatórios Gerados ➔
                    </Link>
                  ) : (
                    <Link href="/admin/producao" className={styles.btnPrimary}>
                      🏭 Ir à Produção (Depto 04) ➔
                    </Link>
                  )}
                </div>
              ) : (
                <div className={styles.flexColStack}>
                  {sacOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className={`${styles.innerCard} ${styles.innerCardSelected} ${styles.flexColStack}`}
                    >
                      <div className={styles.flexRowBetween}>
                        <div>
                          <span className={`${styles.statusPill} ${styles.statusPillInfo}`}>
                            🚚 EM TRÂNSITO PÓS-COLETA ({ord.carrierName})
                          </span>{' '}
                          <strong className={styles.decisionTitle}>
                            Pedido {ord.orderCode} — {ord.productTitle}
                          </strong>
                        </div>
                        <span className={styles.textPrimaryBold}>
                          Rastreio: {ord.trackingCode} · Status: {ord.sacTrackingStatus}
                        </span>
                      </div>

                      <div className={styles.textBodySmall}>
                        Cliente: <strong>{ord.customerName} ({ord.customerEmail})</strong> · Canal: <strong>{ord.salesChannel}</strong> · Valor: <strong>R$ {ord.salePrice.toFixed(2)}</strong> · Documento Fiscal: <strong>{ord.nfeDocumentName}</strong>
                      </div>

                      <div className={styles.flexRowBetween}>
                        <div className={styles.flexRowStart}>
                          {ord.nfeDocumentUrl && (
                            <a
                              href={ord.nfeDocumentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.btnSecondary}
                            >
                              📄 Ver &quot;Vale_uma_NFe_AVA.pdf&quot; ↗
                            </a>
                          )}
                        </div>

                        <div className={styles.flexRowStart}>
                          {ord.sacTrackingStatus !== 'EM_TRANSITO_FILIAL' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAdvanceSacAndArchive(ord.id, 'EM_TRANSITO_FILIAL')
                              }
                              disabled={loading}
                              className={styles.btnSecondary}
                            >
                              🚚 1. Atualizar Trânsito Rodoviário &amp; Avisar Cliente
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleAdvanceSacAndArchive(ord.id, 'ENTREGUE_AO_CLIENTE')
                            }
                            disabled={loading}
                            className={styles.btnSuccess}
                          >
                            📦 2. Confirmar Entrega Final &amp; Arquivar na Diretoria (Gerar Relatórios Flávio &amp; Gustavo) ➔
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Consulta Opcional da API GraphQL Intelipost / J&T Express (Lote Arquivado #755-460-927) */}
            <div className={styles.moduleCard}>
              <div className={styles.flexRowBetween}>
                <div>
                  <h2 className={styles.cardHeadingNoBorder}>
                    🔎 Inspetor Técnico da API GraphQL Intelipost / J&amp;T Express (Consulta Sob Demanda)
                  </h2>
                  <p className={styles.textBodySmall}>
                    O pedido de amostras Dimona <strong>#755-460-927</strong> já foi arquivado na pasta <strong>🧪 Amostras</strong> da Diretoria. Caso queira consultar a resposta ao vivo da API GraphQL da transportadora para qualquer número de pedido, utilize o inspetor abaixo:
                  </p>
                </div>

                <div className={styles.flexRowStart}>
                  <input
                    type="text"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    placeholder="Nº Pedido Intelipost..."
                    className={styles.formInput}
                  />
                  <button
                    type="button"
                    onClick={fetchLogisticsTracking}
                    disabled={trackingLoading}
                    className={styles.btnSecondary}
                  >
                    {trackingLoading ? 'Consultando...' : '🔄 Consultar GraphQL J&T'}
                  </button>
                </div>
              </div>

              {showHistoricalApi && trackingData && (
                <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                  <div className={styles.flexRowBetween}>
                    <span className={styles.decisionTitle}>
                      Pedido #{trackingData.orderNumber} · {trackingData.summary?.carrierName} · Status: {trackingData.summary?.microStateName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowHistoricalApi(false)}
                      className={styles.btnSecondary}
                    >
                      ✕ Ocultar Consulta
                    </button>
                  </div>
                  <div className={styles.textBodySmall}>
                    Produção: {trackingData.slaDiagnostics?.productionPhase?.durationFormatted} | Coleta Doca: {trackingData.slaDiagnostics?.dockPickupPhase?.durationFormatted} | Trânsito: {trackingData.slaDiagnostics?.carrierTransitPhase?.durationFormatted}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ABA 2: FILA DE TROCAS ZERADA & CLÁUSULA ANTI-SOBRECARGA BPO         */}
        {/* =================================================================== */}
        {activeTab === 'tickets' && (
          <div className={styles.moduleGrid2Cols}>
            <div className={styles.moduleCard}>
              <h2 className={styles.cardHeading}>Fila Operacional de Trocas &amp; Devoluções (0 Chamados Fictícios)</h2>
              {tickets.length === 0 ? (
                <div className={styles.innerCard}>
                  <div className={styles.decisionTitle}>
                    ✓ Fila de Chamados 100% Limpa (0 Ocorrências Abertas)
                  </div>
                  <p className={styles.textBodySmall}>
                    Todos os chamados fictícios foram removidos. Apenas solicitações reais abertas por clientes no portal <code>/atendimento</code> aparecerão nesta fila.
                  </p>
                </div>
              ) : null}
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
                    Ao atingir <strong>5 atendimentos humanos recorrentes</strong> por ciclo operacional (~75 a 150 chamados/mês), a fila humana é terceirizada para um <strong>Secretariado Virtual Compartilhado / Call Center BPO</strong> (custo de mercado: <strong>R$ 600 a R$ 850/mês</strong>), operando no Painel com <strong>🔑 Senha Convidado Nível 1</strong> (sem acesso à Sala de Reuniões).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
