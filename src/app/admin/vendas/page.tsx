'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { WorkflowPersistentState } from '@/lib/workflowState';

interface SalesChannelItem {
  id: string;
  name: string;
  category: string;
  commission: string;
  status: string;
}

const CHANNELS_10: SalesChannelItem[] = [
  { id: 'ch-01', name: '01. Vitrine Oficial AVA (E-commerce Próprio)', category: 'Canal Soberano D2C', commission: '0% (Gateway ~3,5%)', status: 'Ativo · Balenciaga 9:16' },
  { id: 'ch-02', name: '02. Instagram Shopping & Vitrine Meta', category: 'Social Commerce', commission: '0% (Checkout Site)', status: 'Feed XML Homologado' },
  { id: 'ch-03', name: '03. WhatsApp Concierge VIP (Venda Assistida)', category: 'Conversacional High-Ticket', commission: '0% (PIX Direto)', status: 'Ativo · Sócio Gustavo' },
  { id: 'ch-04', name: '04. TikTok Shop Brasil', category: 'Social Video Commerce', commission: '6% + Taxa Fixa', status: 'Em Preparação' },
  { id: 'ch-05', name: '05. Mercado Livre (Moda & Streetwear)', category: 'Marketplace Nacional', commission: '12% a 16%', status: 'Via Bling ERP' },
  { id: 'ch-06', name: '06. Shopee Oficial Brasil', category: 'Marketplace Escoamento', commission: '14% a 20%', status: 'Estoque Físico' },
  { id: 'ch-07', name: '07. Google Shopping (Merchant Center)', category: 'Busca Intenção Compradora', commission: 'CPC', status: 'Feed XML Ativo' },
  { id: 'ch-08', name: '08. Pinterest Shopping (Lookbook 9:16)', category: 'Descoberta Visual', commission: '0% Orgânico', status: '9:16 Nativo' },
  { id: 'ch-09', name: '09. Amazon Brasil (Vestuário)', category: 'Marketplace Global', commission: '12% a 15%', status: 'Fase LTDA' },
  { id: 'ch-10', name: '10. B2B Corporativo (Uniformes Reserva INK)', category: 'Atacado Corporativo', commission: 'Margem 40%+', status: 'Pronto no Admin' },
];

export default function VendasPage() {
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [reports, setReports] = useState<any>(null);
  const [nudgeAlert, setNudgeAlert] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dados da Simulação de Compra de Cliente Real (Fase 3)
  const [customerName, setCustomerName] = useState('Rafael Mendes (Cliente Vitrine AVA)');
  const [customerEmail, setCustomerEmail] = useState('rafael.mendes@cliente.com.br');
  const [selectedChannel, setSelectedChannel] = useState('01. Vitrine Oficial AVA (Checkout PIX ACID)');
  const [orderQty, setOrderQty] = useState(1);

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Erro ao buscar workflow em Marketing de Vendas:', err);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const showToast = (msg: string) => {
    setNudgeAlert(msg);
    setTimeout(() => setNudgeAlert(null), 6500);
  };

  const handleSimulateCustomerPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_CUSTOMER_ORDER',
          customerName,
          customerEmail,
          salesChannel: selectedChannel,
          qty: orderQty,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
        showToast(data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const pilot = wfState?.pilotPiece;
  const liveOrders = wfState?.liveOrders || [];
  const gustavoReport = reports?.gustavoReport;

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 06 · Marketing de Vendas (Relatório da Diretoria &amp; Fase 3)</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Gustavo</strong> · Subsídio Informacional da Diretoria (Mais Vendido / Mais Encomendado / Menos Vendido), Ciclo PDCA de Investimento e 10 Canais
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Gustavo
          </span>
        </div>

        {nudgeAlert && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {nudgeAlert}
          </div>
        )}

        {/* =================================================================== */}
        {/* BLOCO 1: RELATÓRIO ESTRATÉGICO AUTOMÁTICO VINDO DA DIRETORIA        */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                📊 Relatório Estratégico de Marketing de Vendas (Alimentado pelo Arquivo Central da Diretoria)
              </h2>
              <p className={styles.textBodySmall}>
                Zero métricas fictícias! Este painel lê diretamente os pedidos reais arquivados na <strong>Diretoria Executiva</strong> para informar ao Gustavo qual produto foi <strong>mais vendido</strong>, <strong>mais encomendado</strong> e <strong>menos vendido</strong>, direcionando onde alocar a verba de anúncios.
              </p>
            </div>
            <Link href="/admin/diretoria" className={styles.btnSecondary}>
              🗄️ Ver Arquivo na Diretoria ↗
            </Link>
          </div>

          <div className={styles.autoGridSmall}>
            <div className={`${styles.innerCardCompact} ${styles.innerCardSuccess}`}>
              <div className={styles.kpiLabel}>🏆 Produto Mais Vendido</div>
              <div className={styles.decisionTitle}>
                {gustavoReport?.topSellingProduct ||
                  '0 Vendas Arquivadas (Aguardando conclusão do Pedido da Peça Única)'}
              </div>
            </div>

            <div className={styles.innerCardCompact}>
              <div className={styles.kpiLabel}>📦 Modelagem &amp; Canal Mais Encomendado</div>
              <div className={styles.textPrimaryBold}>
                {gustavoReport?.mostOrderedModel ||
                  'Nenhuma encomenda de cliente arquivada ainda'}
              </div>
            </div>

            <div className={styles.innerCardCompact}>
              <div className={styles.kpiLabel}>📉 Produto Menos Vendido</div>
              <div className={styles.textBodySmall}>
                {gustavoReport?.leastSellingProduct ||
                  'Sem dados comparativos de baixa saída'}
              </div>
            </div>
          </div>

          <div className={`${styles.innerCardCompact} ${styles.innerCardSelected}`}>
            <div className={styles.kpiLabel}>🎯 Direcionamento para Investimento de Tráfego (Ciclo PDCA):</div>
            <div className={styles.textBodySmall}>
              {gustavoReport?.strategicRecommendation}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCO 2: FASE 3 (ETAPAS 6 & 7) — COMPRA DE CLIENTE REAL NO PONTO DE VENDA */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                🛒 FASE 3 (Etapas 6 &amp; 7): Registrar Compra de Cliente no Ponto de Venda (Fluxo Comercial Real)
              </h2>
              <p className={styles.textBodySmall}>
                <em>&ldquo;Fluxo Real é aquele em que o Cliente é alguém conectado em algum ponto de venda nosso, comprando um produto, e não nossa equipe.&rdquo;</em> — Dispare abaixo a compra da Peça Única publicada na Vitrine para iniciar a emissão do <strong>&ldquo;Vale uma NF-e&rdquo;</strong> e a produção fabril.
              </p>
            </div>
            <span className={`${styles.statusPill} ${styles.statusPillInfo}`}>
              {liveOrders.length} Pedido(s) na Esteira Viva
            </span>
          </div>

          <form onSubmit={handleSimulateCustomerPurchase} className={styles.flexColStack}>
            <div className={styles.autoGridSmall}>
              <div>
                <label className={styles.formLabel}>Peça da Vitrine Comprada pelo Cliente</label>
                <div className={styles.innerCardCompact}>
                  <strong className={styles.textPrimaryBold}>
                    {pilot
                      ? `${pilot.title} — R$ ${(pilot.approvedSalePrice || 169.75).toFixed(2)}`
                      : 'Camiseta Peça Única — R$ 169,75'}
                  </strong>
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>Nome do Cliente Comprador *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div>
                <label className={styles.formLabel}>Ponto de Venda / Canal de Origem *</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="01. Vitrine Oficial AVA (Checkout PIX ACID)">01. Vitrine Oficial AVA (Checkout PIX ACID)</option>
                  <option value="02. Instagram Shopping (Sacolinha Meta)">02. Instagram Shopping (Sacolinha Meta)</option>
                  <option value="03. WhatsApp Concierge VIP">03. WhatsApp Concierge VIP</option>
                  <option value="05. Mercado Livre">05. Mercado Livre</option>
                </select>
              </div>

              <div>
                <label className={styles.formLabel}>Quantidade</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Math.max(1, Number(e.target.value)))}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.flexRowStart}>
              <button
                type="submit"
                disabled={submitting}
                className={styles.btnPrimary}
              >
                🛒 Confirmar Compra do Cliente no Checkout ACID (Gerar Pedido Vivo)
              </button>

              {liveOrders.length > 0 && (
                <Link href="/admin/financeiro" className={styles.btnSuccess}>
                  📄 Avançar para Etapa 8: Anexar &quot;Vale uma NF-e&quot; na Sala de Reuniões (Depto 02 · Flávio) ➔
                </Link>
              )}
            </div>
          </form>
        </section>

        {/* Painel dos 10 Canais de Vendas */}
        <section className={styles.moduleCard}>
          <div className={styles.flexRowBetween}>
            <h2 className={styles.cardHeadingNoBorder}>
              Arquitetura dos 10 Canais de Vendas Nacionais
            </h2>
            <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
              ● Alimentados pela Vitrine Canônica
            </span>
          </div>

          <div className={styles.autoGridSmall}>
            {CHANNELS_10.map((ch) => (
              <div key={ch.id} className={styles.innerCardCompact}>
                <div className={styles.decisionTitle}>{ch.name}</div>
                <div className={styles.textMutedSmall}>
                  {ch.category} · Comissão: <strong>{ch.commission}</strong>
                </div>
                <div className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
                  {ch.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
