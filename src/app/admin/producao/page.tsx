'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { WorkflowPersistentState, LivePipelineOrder } from '@/lib/workflowState';

export default function ProducaoPage() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'dimona' | 'printful' | 'reserva'>('kanban');
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Printful Status
  const [printfulScopes, setPrintfulScopes] = useState<any[]>([]);
  const [showPrintfulJson, setShowPrintfulJson] = useState(false);

  // Reserva B2B Simulator
  const [reservaSimulatorQty, setReservaSimulatorQty] = useState(50);
  const [reservaUnitPrice, setReservaUnitPrice] = useState(39.90);
  const [reservaSellPrice, setReservaSellPrice] = useState(89.00);

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.state) {
        setWfState(data.state);
      }
    } catch (err) {
      console.error('Erro ao buscar workflow na Produção:', err);
    }
  }, []);

  const fetchPrintfulData = async () => {
    try {
      const res = await fetch('/api/production/printful/status', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setPrintfulScopes(data.scopes || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchWorkflow();
    fetchPrintfulData();
  }, [fetchWorkflow]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 6500);
  };

  const handleAdvanceProductionStep = async (
    orderId: string,
    nextStep: LivePipelineOrder['productionStep']
  ) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADVANCE_PRODUCTION_STEP',
          orderId,
          nextStep,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        showToast(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const liveOrders = wfState?.liveOrders || [];
  const activeProductionOrders = liveOrders.filter((o) => o.productionStep !== '5_COLETADO_SAC');

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 04 · Produção, Fornecedores &amp; PoD (Alçada até a Doca)</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Armando (Genera)</strong> · Esteira Viva de Pedidos de Clientes até <strong>4. Pronto na Doca / Aguardando Coleta</strong> (Amostras Dimona #755-460-927 arquivadas na Diretoria)
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 COMANDO: ARMANDO
          </span>
        </div>

        {feedback && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {feedback}
          </div>
        )}

        {/* Banner de Arquivamento das Amostras Dimona #755-460-927 */}
        <div className={`${styles.innerCard} ${styles.flexRowBetween} ${styles.moduleCardSpaced}`}>
          <div>
            <div className={styles.decisionTitle}>
              🧪 Lote Piloto de 6 Amostras Dimona (#755-460-927 · R$ 472,80 · NF-e #114273) — Entregue &amp; Arquivado
            </div>
            <p className={styles.textBodySmall}>
              Como o pedido de amostras já chegou e é esporádico, ele foi arquivado na <strong>Diretoria Executiva (Pasta: 🧪 Amostras)</strong>, mantendo esta esteira de Produção 100% dedicada aos pedidos reais de <strong>👤 Clientes</strong>.
            </p>
          </div>
          <Link href="/admin/diretoria" className={styles.btnSecondary}>
            🗄️ Consultar Amostras na Diretoria ↗
          </Link>
        </div>

        {/* MENU DE ABAS DA PRODUÇÃO */}
        <div className={styles.tabStripContainer}>
          {[
            {
              id: 'kanban',
              label: '📋 Esteira Viva de Produção (Pedidos de Clientes)',
              badge: `${activeProductionOrders.length} Ativo(s)`,
            },
            { id: 'dimona', label: '🏭 Dimona Dropsimples (Silk HD)', badge: 'API v2 Homologada' },
            { id: 'printful', label: '🌐 Printful Brasil (Bordado 3D)', badge: 'Token 200 OK' },
            { id: 'reserva', label: '👔 Reserva INK (B2B Corporativo)', badge: 'Uniformes' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              >
                <span>{tab.label}</span>
                <span className={styles.tabBadge}>{tab.badge}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* ABA 1: ESTEIRA VIVA DE PRODUÇÃO (FASE 4 · ETAPA 9)       */}
        {/* ======================================================== */}
        {activeTab === 'kanban' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>
                  🏭 FASE 4 (Etapa 9): Esteira Industrial de Pedidos de Clientes (Até a Fronteira da Doca)
                </h2>
                <p className={styles.textBodySmall}>
                  A Produção (Armando) recebe o pedido com o documento <strong>&ldquo;Vale uma NF-e&rdquo;</strong> anexado na Sala de Reuniões pelo Financeiro (Flávio), conduz a fabricação até <strong>4. Pronto na Doca / Aguardando Coleta</strong> e transborda ao <strong>SAC (Gustavo · Depto 05)</strong>.
                </p>
              </div>
              <button onClick={fetchWorkflow} className={styles.btnSecondary}>
                🔄 Atualizar Esteira
              </button>
            </div>

            {liveOrders.length === 0 ? (
              <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
                <div>
                  <div className={styles.decisionTitle}>
                    ✓ Esteira de Produção Limpa (0 Pedidos na Fábrica)
                  </div>
                  <p className={styles.textBodySmall}>
                    Nenhum pedido fictício! Para testar a Etapa 9, registre uma compra de cliente na Fase 3 (<strong>Depto 06 · Marketing de Vendas</strong>) e anexe o <strong>&ldquo;Vale uma NF-e&rdquo;</strong> no <strong>Depto 02 · Financeiro</strong>.
                  </p>
                </div>
                <Link href="/admin/vendas" className={styles.btnPrimary}>
                  🛒 Ir para Fase 3 (Depto 06) ➔
                </Link>
              </div>
            ) : (
              <div className={styles.flexColStack}>
                {liveOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className={`${styles.innerCard} ${styles.flexColStack} ${
                      ord.productionStep === '5_COLETADO_SAC'
                        ? styles.innerCardSuccess
                        : styles.innerCardSelected
                    }`}
                  >
                    <div className={styles.flexRowBetween}>
                      <div>
                        <span className={styles.statusPill}>👤 PEDIDO DE CLIENTE</span>{' '}
                        <strong className={styles.decisionTitle}>
                          {ord.orderCode} — {ord.productTitle} ({ord.qty} un)
                        </strong>
                      </div>
                      <span
                        className={`${styles.statusPill} ${
                          ord.nfeAttachedInBoardroom
                            ? styles.statusPillSuccess
                            : styles.statusPillWarning
                        }`}
                      >
                        {ord.nfeAttachedInBoardroom
                          ? `✓ Documento Fiscal: ${ord.nfeDocumentName}`
                          : '⏳ Aguardando Flávio anexar "Vale uma NF-e"'}
                      </span>
                    </div>

                    <div className={styles.textBodySmall}>
                      Comprador: <strong>{ord.customerName}</strong> · Canal: <strong>{ord.salesChannel}</strong> · Malha: <strong>{ord.garmentModel} ({ord.color} · Tam {ord.size})</strong> · Custo PoD: <strong>R$ {ord.totalCost.toFixed(2)}</strong>
                    </div>

                    {/* Stepper de 4 Etapas da Produção + Handoff SAC */}
                    <div className={styles.autoGridSmall}>
                      {[
                        {
                          code: '1_AGUARDANDO_NFE',
                          label: '1. Pedido & Vale NF-e',
                          desc: ord.nfeAttachedInBoardroom ? '✓ Vale NF-e Anexado' : 'Aguardando Financeiro',
                        },
                        {
                          code: '2_SILK_HD_PRODUCAO',
                          label: '2. Silk HD Kornit (Fábrica)',
                          desc: 'Impressão 300 DPI na fibra',
                        },
                        {
                          code: '3_CONTROLE_QUALIDADE',
                          label: '3. Controle de Qualidade',
                          desc: 'Inspeção de cura & etiqueta',
                        },
                        {
                          code: '4_PRONTO_NA_DOCA',
                          label: '4. Pronto na Doca / Coleta',
                          desc: 'Fronteira Final da Produção',
                        },
                        {
                          code: '5_COLETADO_SAC',
                          label: '5. COLETADO ➔ SAC (05)',
                          desc: 'Alçada Gustavo (J&T Express)',
                        },
                      ].map((st) => {
                        const isCurrent = ord.productionStep === st.code;
                        return (
                          <div
                            key={st.code}
                            className={`${styles.innerCardCompact} ${
                              isCurrent ? styles.innerCardSelected : ''
                            }`}
                          >
                            <div className={styles.decisionTitle}>
                              {isCurrent ? '● ' : ''}
                              {st.label}
                            </div>
                            <div className={styles.textMutedSmall}>{st.desc}</div>
                          </div>
                        );
                      })}
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
                            📄 Abrir &quot;Vale_uma_NFe_AVA.pdf&quot; ↗
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            window.dispatchEvent(
                              new CustomEvent('ava:open-boardroom', {
                                detail: {
                                  pautaTitle: `Faturamento & NF-e · Pedido ${ord.orderCode} (${ord.productTitle})`,
                                },
                              })
                            )
                          }
                          className={styles.btnSecondary}
                        >
                          💬 Ver na Sala de Reuniões
                        </button>
                      </div>

                      <div className={styles.flexRowStart}>
                        {!ord.nfeAttachedInBoardroom && (
                          <Link href="/admin/financeiro" className={styles.btnPrimary}>
                            📄 Ir ao Financeiro (02) Anexar &quot;Vale uma NF-e&quot; ➔
                          </Link>
                        )}

                        {ord.productionStep === '2_SILK_HD_PRODUCAO' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAdvanceProductionStep(ord.id, '3_CONTROLE_QUALIDADE')
                            }
                            disabled={loading}
                            className={styles.btnPrimary}
                          >
                            🔬 Avançar p/ 3. Controle de Qualidade
                          </button>
                        )}

                        {ord.productionStep === '3_CONTROLE_QUALIDADE' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceProductionStep(ord.id, '4_PRONTO_NA_DOCA')}
                            disabled={loading}
                            className={styles.btnPrimary}
                          >
                            📦 Avançar p/ 4. Pronto na Doca / Aguardando Coleta
                          </button>
                        )}

                        {ord.productionStep === '4_PRONTO_NA_DOCA' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceProductionStep(ord.id, '5_COLETADO_SAC')}
                            disabled={loading}
                            className={styles.btnSuccess}
                          >
                            🚚 Marcar como COLETADO &amp; Transbordar Bastão ao SAC (Depto 05 · Gustavo) ➔
                          </button>
                        )}

                        {ord.productionStep === '5_COLETADO_SAC' && (
                          <Link href="/admin/atendimento" className={styles.btnSuccess}>
                            🎧 Pedido Transbordado! Abrir Torre Logística no SAC (Depto 05 · Gustavo) ➔
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA 2: DIMONA DROPSIMPLES */}
        {activeTab === 'dimona' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>
                  Dimona Silk E Malhas Ltda (Dropsimples API v2)
                </h2>
                <p className={styles.moduleSubtitle}>
                  Catálogo de 975 SKUs ativos, Silk Digital HD (Kornit) Frente + Costas e R$ 0,00 de mensalidade fixa.
                </p>
              </div>
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                🟢 API v2 Conectada
              </span>
            </div>

            <div className={styles.autoGridSmall}>
              <div className={styles.innerCardCompact}>
                <div className={styles.decisionTitle}>T-Shirt Quality 30.1 (165g)</div>
                <div className={styles.textMutedSmall}>1 Estampa: R$ 41,90 | Frente+Costas: R$ 59,90</div>
              </div>
              <div className={styles.innerCardCompact}>
                <div className={styles.decisionTitle}>T-Shirt Prime 180g (Pele de Pêssego)</div>
                <div className={styles.textMutedSmall}>1 Estampa: R$ 49,90 | Frente+Costas: R$ 67,90</div>
              </div>
              <div className={styles.innerCardCompact}>
                <div className={styles.decisionTitle}>Camiseta Estonada Vintage 30.1</div>
                <div className={styles.textMutedSmall}>1 Estampa: R$ 55,00 | Frente+Costas: R$ 73,00</div>
              </div>
              <div className={styles.innerCardCompact}>
                <div className={styles.decisionTitle}>Camiseta Oversized Heavy 220g</div>
                <div className={styles.textMutedSmall}>1 Estampa: R$ 83,90 | Frente+Costas: R$ 101,90</div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: PRINTFUL BRASIL */}
        {activeTab === 'printful' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>
                  Printful Brasil (Bordado 3D Puff &amp; Mockup Generator API)
                </h2>
                <p className={styles.moduleSubtitle}>
                  Boné Retro Trucker High Profile com Bordado 3D em Alto Relevo (Custo ~R$ 100 · Venda R$ 229 · Lucro R$ 129).
                </p>
              </div>
              <button
                onClick={() => setShowPrintfulJson(!showPrintfulJson)}
                className={styles.btnSecondary}
              >
                {showPrintfulJson ? '✕ Fechar Escopos' : '{ } Ver Escopos Bearer Token'}
              </button>
            </div>
            {showPrintfulJson && (
              <pre className={styles.innerCardCompact}>
                {JSON.stringify(printfulScopes, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* ABA 4: RESERVA INK B2B */}
        {activeTab === 'reserva' && (
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>
              Reserva INK — Simulador de Lotes B2B Corporativos (Uniformes &amp; Escolas)
            </h2>
            <div className={styles.kpiGrid}>
              <div>
                <label className={styles.formLabel}>Quantidade do Lote</label>
                <input
                  type="number"
                  value={reservaSimulatorQty}
                  onChange={(e) => setReservaSimulatorQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className={styles.formInput}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Custo Unitário (R$)</label>
                <input
                  type="number"
                  value={reservaUnitPrice}
                  onChange={(e) => setReservaUnitPrice(parseFloat(e.target.value) || 0)}
                  className={styles.formInput}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Preço Proposta B2B (R$/un)</label>
                <input
                  type="number"
                  value={reservaSellPrice}
                  onChange={(e) => setReservaSellPrice(parseFloat(e.target.value) || 0)}
                  className={styles.formInput}
                />
              </div>
              <div className={`${styles.kpiCard} ${styles.innerCardSuccess}`}>
                <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>Lucro Líquido do Lote</span>
                <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                  R$ {((reservaSellPrice - reservaUnitPrice) * reservaSimulatorQty).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
