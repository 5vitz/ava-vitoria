'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { WorkflowPersistentState } from '@/lib/workflowState';

export default function FinanceiroPage() {
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [reports, setReports] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [indexingMode, setIndexingMode] = useState<'INDEXED' | 'HOLD_ON_DROP'>('INDEXED');

  // Unit Economics Simulator (Vinculado à Peça Única)
  const [sampleCost, setSampleCost] = useState(67.90);
  const [sampleMargin, setSampleMargin] = useState(60);

  const salePrice = sampleCost / (1 - sampleMargin / 100);
  const taxSimples = salePrice * 0.06;
  const paymentFee = salePrice * 0.035;
  const netProfit = salePrice - sampleCost - taxSimples - paymentFee;

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
        if (data.state?.pilotPiece?.baseCost) {
          setSampleCost(Number(data.state.pilotPiece.baseCost));
        }
        if (data.state?.pilotPiece?.proposedMarginPercent) {
          setSampleMargin(Number(data.state.pilotPiece.proposedMarginPercent));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar workflow financeiro:', err);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const showToast = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 6500);
  };

  const handleProposePilotPricing = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROPOSE_PILOT_PIECE_PRICING',
          baseCost: sampleCost,
          marginPercent: sampleMargin,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
        showToast(data.message);
      } else {
        showToast(data.error || 'Erro ao enviar proposta de preço.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprovePrice44 = async () => {
    const decision = wfState?.decisionsQueue?.find((d) => d.decisionType === 'PIECE_PRICING');
    if (!decision) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_ALL_VOTES_AND_EXECUTE',
          decisionId: decision.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
        showToast(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAttachValeNfeInBoardroom = async (orderId?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ATTACH_VALE_NFE_IN_BOARDROOM',
          orderId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
        showToast(data.message);
        // Abre automaticamente a Sala de Reuniões na pauta recém-criada com o PDF Vale_uma_NFe_AVA.pdf anexado!
        if (data.pautaTitle) {
          window.dispatchEvent(
            new CustomEvent('ava:open-boardroom', {
              detail: { pautaTitle: data.pautaTitle },
            })
          );
        }
      } else {
        showToast(data.error || 'Erro ao anexar Vale uma NF-e.');
      }
    } finally {
      setLoading(false);
    }
  };

  const pilot = wfState?.pilotPiece;
  const liveOrders = wfState?.liveOrders || [];
  const flavioReport = reports?.flavioReport;
  const pricingDecision = wfState?.decisionsQueue?.find((d) => d.decisionType === 'PIECE_PRICING');

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 02 · Financeiro, Fiscal &amp; Precificação Colegiada</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Flávio</strong> · DRE Real (Amostras Dimona R$ 472,80 vs. Clientes), Precificação da Peça Única (Urna 4/4) e Anexação do PDF &quot;Vale uma NF-e&quot; na Sala de Reuniões
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Flávio · 🗳️ Preços sob Voto 4/4
          </span>
        </div>

        {saveStatus && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {saveStatus}
          </div>
        )}

        {/* =================================================================== */}
        {/* BLOCO 1: DEMONSTRATIVO FINANCEIRO REAL (ALIMENTADO PELO ARQUIVO DA DIRETORIA) */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                📊 Livro-Razão &amp; Relatório Financeiro Real (Extraído do Arquivo Central da Diretoria)
              </h2>
              <p className={styles.textBodySmall}>
                Zero valores fictícios. Contabiliza o investimento real do lote de 6 amostras da Dimona (<strong>#755-460-927 · R$ 472,80 · NF-e #114273</strong>) e soma automaticamente cada pedido de cliente concluído.
              </p>
            </div>
            <Link href="/admin/diretoria" className={styles.btnSecondary}>
              🗄️ Ver Arquivo na Diretoria ↗
            </Link>
          </div>

          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Despesa Real P&amp;D (🧪 Amostras Dimona)</span>
              <div className={`${styles.kpiValue} ${styles.textDanger}`}>
                - R$ {(flavioReport?.samplesPdSummary?.totalPdInvestment ?? 472.80).toFixed(2)}
              </div>
              <span className={styles.kpiSub}>
                Pedido #755-460-927 (6 peças) · NF-e #114273
              </span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Receita Bruta (👤 Pedidos Clientes)</span>
              <div className={styles.kpiValue}>
                R$ {(flavioReport?.clientSalesSummary?.grossRevenue ?? 0).toFixed(2)}
              </div>
              <span className={styles.kpiSub}>
                {flavioReport?.clientSalesSummary?.ordersCount ?? 0} pedido(s) arquivado(s) + {liveOrders.length} em andamento
              </span>
            </div>

            <div className={`${styles.kpiCard} ${styles.innerCardSuccess}`}>
              <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>
                Lucro Líquido de Vendas (👤 Clientes)
              </span>
              <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                R$ {(flavioReport?.clientSalesSummary?.netOperationalProfit ?? 0).toFixed(2)}
              </div>
              <span className={styles.kpiSub}>
                Descontados Custo PoD, Simples (6%) e Gateway (3,5%)
              </span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>Custos Fixos Mensais &amp; Assinaturas</span>
              <div className={styles.kpiValue}>R$ 489,91/mês</div>
              <span className={styles.kpiSub}>
                R$ 209,33 adiantados por Armando (a ressarcir)
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCO 2: FASE 3 (ETAPA 8) — EMISSÃO & ANEXAÇÃO DO PDF "VALE UMA NF-e" NA SALA DE REUNIÕES */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                📄 FASE 3 (Etapa 8): Emissão Fiscal &amp; Anexação do PDF &quot;Vale uma NF-e&quot; na Sala de Reuniões
              </h2>
              <p className={styles.textBodySmall}>
                Enquanto o conector automático do Bling ERP v3 não está plugado à SEFAZ, o Flávio valida o pedido pago pelo cliente e anexa o documento oficial <strong><code>Vale_uma_NFe_AVA.pdf</code></strong> na <strong>Sala de Reuniões</strong> para liberar a fabricação no <strong>Depto 04 · Produção (Armando)</strong> e o rastreio no <strong>Depto 05 · SAC (Gustavo)</strong>.
              </p>
            </div>
            <a
              href="/PDF/Vale_uma_NFe_AVA.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              📄 Inspecionar PDF &quot;Vale uma NF-e&quot; ↗
            </a>
          </div>

          {liveOrders.length === 0 ? (
            <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
              <div>
                <div className={styles.decisionTitle}>
                  ✓ Nenhum Pedido Aguardando Emissão de NF-e no Momento
                </div>
                <p className={styles.textBodySmall}>
                  Assim que a Peça Única for comprada no Ponto de Venda (Fase 3 · Depto 06), o pedido aparecerá aqui para o Flávio anexar o <strong>&ldquo;Vale uma NF-e&rdquo;</strong> na Sala de Reuniões.
                </p>
              </div>
              <Link href="/admin/vendas" className={styles.btnSecondary}>
                Ir para 06 · Marketing de Vendas ↗
              </Link>
            </div>
          ) : (
            <div className={styles.flexColStack}>
              {liveOrders.map((ord) => (
                <div
                  key={ord.id}
                  className={`${styles.innerCard} ${styles.flexColStack} ${
                    ord.nfeAttachedInBoardroom ? styles.innerCardSuccess : styles.innerCardSelected
                  }`}
                >
                  <div className={styles.flexRowBetween}>
                    <div>
                      <div className={styles.decisionTitle}>
                        Pedido {ord.orderCode} — {ord.productTitle} (R$ {ord.salePrice.toFixed(2)})
                      </div>
                      <div className={styles.textBodySmall}>
                        Cliente: <strong>{ord.customerName}</strong> · Canal: <strong>{ord.salesChannel}</strong> · Modelagem: <strong>{ord.garmentModel} ({ord.color} · {ord.size})</strong>
                      </div>
                    </div>
                    <span
                      className={`${styles.statusPill} ${
                        ord.nfeAttachedInBoardroom
                          ? styles.statusPillSuccess
                          : styles.statusPillWarning
                      }`}
                    >
                      {ord.nfeAttachedInBoardroom
                        ? '✓ VALE UMA NF-e ANEXADO NA SALA DE REUNIÕES'
                        : '⚡ AGUARDANDO ANEXAR "VALE UMA NF-e"'}
                    </span>
                  </div>

                  <div className={styles.flexRowStart}>
                    {!ord.nfeAttachedInBoardroom ? (
                      <button
                        type="button"
                        onClick={() => handleAttachValeNfeInBoardroom(ord.id)}
                        disabled={loading}
                        className={styles.btnPrimary}
                      >
                        📎 Anexar &quot;Vale_uma_NFe_AVA.pdf&quot; na Sala de Reuniões (P/ Armando &amp; Gustavo) &amp; Liberar Produção
                      </button>
                    ) : (
                      <>
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
                          💬 Ver Anexo &quot;Vale uma NF-e&quot; na Sala de Reuniões
                        </button>
                        <Link href="/admin/producao" className={styles.btnSuccess}>
                          🏭 Avançar para FASE 4 (Etapa 9): Fabricar até a Doca na Produção (Depto 04 · Armando) ➔
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =================================================================== */}
        {/* BLOCO 3: FASE 2 (ETAPA 3) — PRECIFICAÇÃO DA PEÇA ÚNICA & URNA 4/4   */}
        {/* =================================================================== */}
        <div className={styles.moduleGrid2Cols}>
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>
              💎 FASE 2 (Etapa 3): Calculadora Unit Economics da Peça Única &amp; Envio à Urna 4/4
            </h2>

            {pilot ? (
              <div className={`${styles.innerCardCompact} ${styles.innerCardSelected}`}>
                <div className={styles.textPrimaryBold}>
                  Peça em Precificação: {pilot.code} — {pilot.title}
                </div>
                <div className={styles.textMutedSmall}>
                  Blockchain: {pilot.blockchainTxId || 'Pendente Registro no 01'} · Status: {pilot.status}
                </div>
              </div>
            ) : (
              <div className={styles.innerCardCompact}>
                <span className={styles.textMutedSmall}>
                  Aguardando a Peça Única vir do Depto 01 · Jurídico (Registro Blockchain).
                </span>
              </div>
            )}

            <div className={styles.flexColStack}>
              <div>
                <label className={styles.formLabel}>
                  Custo Base do Fornecedor (Dimona Silk HD Frente+Costas): <strong>R$ {sampleCost.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min="38"
                  max="120"
                  step="0.10"
                  value={sampleCost}
                  onChange={(e) => setSampleCost(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Margem Alvo Proposta pelo Financeiro: <strong>{sampleMargin}%</strong>
                </label>
                <input
                  type="range"
                  min="35"
                  max="75"
                  step="1"
                  value={sampleMargin}
                  onChange={(e) => setSampleMargin(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
              </div>

              <div className={`${styles.innerCard} ${styles.flexColTight}`}>
                <div className={styles.flexRowBetween}>
                  <span className={styles.textMutedSmall}>Preço de Venda Proposto para a Vitrine:</span>
                  <span className={styles.decisionTitle}>R$ {salePrice.toFixed(2)}</span>
                </div>
                <div className={`${styles.flexRowBetween} ${styles.textDanger}`}>
                  <span>(-) Custo de Produção PoD:</span>
                  <span>- R$ {sampleCost.toFixed(2)}</span>
                </div>
                <div className={`${styles.flexRowBetween} ${styles.textDanger}`}>
                  <span>(-) Imposto Simples Nacional (~6%):</span>
                  <span>- R$ {taxSimples.toFixed(2)}</span>
                </div>
                <div className={`${styles.flexRowBetween} ${styles.textDanger}`}>
                  <span>(-) Taxa Gateway / PIX / Cartão (3.5%):</span>
                  <span>- R$ {paymentFee.toFixed(2)}</span>
                </div>
                <div className={styles.flexRowBetween}>
                  <span className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
                    (=) Lucro Líquido Real por Camiseta:
                  </span>
                  <span className={`${styles.kpiValue} ${styles.textSuccess}`}>
                    R$ {netProfit.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.flexColTight}>
                <button
                  type="button"
                  onClick={handleProposePilotPricing}
                  disabled={loading || !pilot}
                  className={styles.btnPrimary}
                >
                  🗳️ 1. Submeter Preço (R$ {salePrice.toFixed(2)}) para Votação na Urna 4/4
                </button>

                {pricingDecision && (
                  <button
                    type="button"
                    onClick={handleQuickApprovePrice44}
                    disabled={loading}
                    className={styles.btnSuccess}
                  >
                    ⚡ 2. Homologar Voto 4/4 dos Sócios Agora &amp; Liberar Vitrine (Depto 07)
                  </button>
                )}

                {pilot &&
                  (pilot.status === 'PRICE_APPROVED' ||
                    pilot.status === 'PUBLISHED_IN_STOREFRONT') && (
                    <Link href="/admin/marketing" className={styles.btnSuccess}>
                      🚀 Avançar para Etapa 5: Publicar Peça Única em Todos os Cards da Vitrine (Depto 07) ➔
                    </Link>
                  )}
              </div>
            </div>
          </div>

          {/* Chave de 2 Posições & Assinaturas */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>
              Chave de 2 Posições &amp; Matriz de Custos Fixos
            </h2>
            <div className={styles.flexColStack}>
              <div
                onClick={() => setIndexingMode('INDEXED')}
                className={`${styles.innerCardInteractive} ${
                  indexingMode === 'INDEXED' ? styles.innerCardSelected : ''
                }`}
              >
                <div className={styles.flexRowBetween}>
                  <span className={styles.decisionTitle}>Posição 1: INDEXADO (Padrão)</span>
                  {indexingMode === 'INDEXED' && (
                    <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>● Ativo</span>
                  )}
                </div>
                <p className={styles.textBodySmall}>
                  Qualquer redução no fornecedor baixa proporcionalmente o preço na vitrine, mantendo constante a margem percentual.
                </p>
              </div>

              <div
                onClick={() => setIndexingMode('HOLD_ON_DROP')}
                className={`${styles.innerCardInteractive} ${
                  indexingMode === 'HOLD_ON_DROP' ? styles.innerCardSelected : ''
                }`}
              >
                <div className={styles.flexRowBetween}>
                  <span className={styles.decisionTitle}>
                    Posição 2: DESINDEXAR NA BAIXA (Reter Lucro Extra)
                  </span>
                  {indexingMode === 'HOLD_ON_DROP' && (
                    <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>● Ativo</span>
                  )}
                </div>
                <p className={styles.textBodySmall}>
                  Mantém o preço de venda na vitrine congelado e retém a margem extra quando o fornecedor faz promoção.
                </p>
              </div>

              <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
                <div>
                  <div className={styles.decisionTitle}>Matriz de Assinaturas &amp; APIs</div>
                  <p className={styles.textBodySmall}>
                    Custos fixos reais (~R$ 489,91/mês) e ressarcimento pré-operacional.
                  </p>
                </div>
                <Link href="/admin/financeiro/assinaturas" className={styles.btnSecondary}>
                  Abrir Assinaturas ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
