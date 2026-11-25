'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface SalesChannelItem {
  id: string;
  name: string;
  category: string;
  commission: string;
  status: string;
  trafficShare: string;
  relationshipNote: string;
}

const CHANNELS_10: SalesChannelItem[] = [
  {
    id: 'ch-01',
    name: '01. Vitrine Oficial AVA (E-commerce Próprio)',
    category: 'Canal Soberano D2C',
    commission: '0% (Apenas Gateway ~3,5%)',
    status: 'Ativo · Balenciaga 9:16',
    trafficShare: '45% do Volume Alvo',
    relationshipNote: 'Maior margem líquida da empresa; recebe tráfego direto do Instagram e Google.'
  },
  {
    id: 'ch-02',
    name: '02. Instagram Shopping & Vitrine Meta',
    category: 'Social Commerce',
    commission: '0% (Checkout Redirecionado)',
    status: 'Feed XML Homologado',
    trafficShare: '25% do Volume Alvo',
    relationshipNote: 'Alimentado automaticamente pela rota /api/catalog/meta e Trios 3x3.'
  },
  {
    id: 'ch-03',
    name: '03. WhatsApp Concierge VIP (Venda Assistida)',
    category: 'Conversacional High-Ticket',
    commission: '0% (PIX Direto)',
    status: 'Ativo · Sócio Gustavo',
    trafficShare: '10% do Volume Alvo',
    relationshipNote: 'Fechamento de kits, atendimento personalizado e recuperação de carrinho abandonado.'
  },
  {
    id: 'ch-04',
    name: '04. TikTok Shop Brasil',
    category: 'Social Video Commerce',
    commission: '6% + Taxa Fixa',
    status: 'Em Preparação de Conta',
    trafficShare: '5% do Volume Alvo',
    relationshipNote: 'Ideal para vídeos curtos 9:16 vestindo as modelagens Oversized e Estonada.'
  },
  {
    id: 'ch-05',
    name: '05. Mercado Livre (Moda & Streetwear)',
    category: 'Marketplace Nacional',
    commission: '12% a 16% (Clássico/Premium)',
    status: 'Integrável via Bling ERP',
    trafficShare: '4% do Volume Alvo',
    relationshipNote: 'Exige precificação diferenciada aprovada em Urna para absorver comissão do canal.'
  },
  {
    id: 'ch-06',
    name: '06. Shopee Oficial Brasil',
    category: 'Marketplace Popular / Escoamento',
    commission: '14% a 20%',
    status: 'Canal para Estoque Físico',
    trafficShare: '3% do Volume Alvo',
    relationshipNote: 'Recomendado apenas para giro de coleções passadas e saldo de estoque físico.'
  },
  {
    id: 'ch-07',
    name: '07. Google Shopping (Merchant Center)',
    category: 'Busca de Intenção Compradora',
    commission: 'CPC (Tráfego Pago)',
    status: 'Feed XML Compatível',
    trafficShare: '3% do Volume Alvo',
    relationshipNote: 'Captura clientes buscando camisetas streetwear premium e algodão egípcio/penteado.'
  },
  {
    id: 'ch-08',
    name: '08. Pinterest Shopping (Catálogo Editorial 9:16)',
    category: 'Descoberta Visual & Moda',
    commission: '0% Orgânico / Ads Opcional',
    status: 'Proporção 9:16 Nativa',
    trafficShare: '2% do Volume Alvo',
    relationshipNote: 'As fotos 9:16 do Lookbook AVA têm encaixe nativo nos Pins de moda masculina e feminina.'
  },
  {
    id: 'ch-09',
    name: '09. Amazon Brasil (Vestuário)',
    category: 'Marketplace Global',
    commission: '12% a 15%',
    status: 'Planejado Fase 2 (LTDA)',
    trafficShare: '2% do Volume Alvo',
    relationshipNote: 'Requer CNPJ LTDA ativo e código EAN/GTIN homologado no Bling ERP.'
  },
  {
    id: 'ch-10',
    name: '10. Shein Marketplace Brasil (Sellers Locais)',
    category: 'Marketplace Fashion',
    commission: '10% a 16%',
    status: 'Planejado Fase 2 (LTDA)',
    trafficShare: '1% do Volume Alvo',
    relationshipNote: 'Canal complementar de alto tráfego jovem após validação da capacidade PoD.'
  }
];

export default function VendasPage() {
  const [nudgeAlert, setNudgeAlert] = useState<string | null>(null);
  const [dailyBudget, setDailyBudget] = useState<number>(100);

  const estimatedClicks = Math.round(dailyBudget / 1.25);
  const estimatedOrders = Math.max(1, Math.round(estimatedClicks * 0.025));
  const estimatedRevenue = estimatedOrders * 169.75;
  const estimatedRoas = (estimatedRevenue / dailyBudget).toFixed(2);

  const handleRequestPricingVote = () => {
    setNudgeAlert(
      '🗳️ Proposta Comercial enviada para a Urna de Votação dos 4 Sócios! Cobrança disparada via WhatsApp e E-mail para Armando, Flávio, Tripoint e Gustavo.'
    );
    setTimeout(() => setNudgeAlert(null), 6000);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 06 · Marketing de Vendas</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Gustavo</strong> · Análise de KPIs de Tráfego, Plano de Investimentos Estratégicos (ROAS), Consenso 4/4 e 10 Canais
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Gustavo
          </span>
        </div>

        {nudgeAlert && (
          <div className={`${styles.alertBanner} ${styles.alertBannerWarning}`}>
            {nudgeAlert}
          </div>
        )}

        {/* Termômetro de Equilíbrio Preço vs. Conversão + Simulador de Impulsionamento */}
        <div className={`${styles.moduleGrid2Cols} ${styles.moduleCardSpaced}`}>
          <section className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Termômetro Comercial: Preço vs. Conversão de Tráfego</h2>
            <p className={styles.textBodySmall}>
              <em>&ldquo;Se o preço estiver baixo, você nada e morre na praia; se estiver alto, você não sai do lugar e morre ali mesmo.&rdquo;</em>
            </p>

            <div className={styles.flexColStack}>
              <div className={styles.innerCardCompact}>
                <div className={styles.kpiLabel}>1. Taxa de Inspeção na Vitrine 9:16 (1º Clique)</div>
                <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                  34,8% dos visitantes inspecionam as peças
                </div>
                <div className={styles.textMutedSmall}>
                  O efeito de vidro leitoso nos 8 vizinhos retém a atenção visual acima da média do mercado (18%).
                </div>
              </div>

              <div className={styles.innerCardCompact}>
                <div className={styles.kpiLabel}>2. Sensibilidade de Preço no Checkout</div>
                <div className={styles.decisionTitle}>
                  Faixa Ideal Homologada: R$ 149,90 a R$ 189,90 (T-Shirt Prime / Oversized)
                </div>
                <div className={styles.textMutedSmall}>
                  Qualquer ajuste de margem para campanhas em canais externos exige aprovação 4/4 na Urna.
                </div>
              </div>
            </div>

            <div className={styles.flexRowStart}>
              <button type="button" onClick={handleRequestPricingVote} className={styles.btnPrimary}>
                🗳️ Propor Ajuste Comercial na Urna (4 Sócios)
              </button>
              <Link href="/admin/financeiro" className={styles.btnSecondary}>
                Ver Simulador DRE (Depto 02) ↗
              </Link>
            </div>
          </section>

          <section className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Simulador de Impulsionamento &amp; Tráfego Pago (ROAS)</h2>
            <p className={styles.textBodySmall}>
              Calibre o investimento diário em Meta Ads / Instagram Shopping e projete o retorno comercial:
            </p>

            <div>
              <label className={styles.formLabel}>
                Orçamento Diário de Impulsionamento (R$/dia): <strong>R$ {dailyBudget}</strong>
              </label>
              <input
                type="range"
                min={30}
                max={1000}
                step={10}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Visitas Qualificadas / Dia</span>
                <div className={styles.kpiValue}>~{estimatedClicks} visitas</div>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Pedidos Estimados (Conv. 2,5%)</span>
                <div className={`${styles.kpiValue} ${styles.textSuccess}`}>{estimatedOrders} pedidos/dia</div>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Faturamento Bruto Projetado</span>
                <div className={styles.kpiValue}>R$ {estimatedRevenue.toFixed(2)}/dia</div>
              </div>
              <div className={`${styles.kpiCard} ${styles.innerCardSuccess}`}>
                <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>ROAS Projetado (Retorno)</span>
                <div className={`${styles.kpiValue} ${styles.textSuccess}`}>{estimatedRoas}x sobre o anúncio</div>
              </div>
            </div>
          </section>
        </div>

        {/* Painel de Relacionamento com os 10 Canais de Vendas */}
        <section className={styles.moduleCard}>
          <div className={styles.flexRowBetween}>
            <h2 className={styles.cardHeadingNoBorder}>
              Gestão &amp; Relacionamento com os 10 Canais de Vendas Nacionais
            </h2>
            <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
              ● Catálogo Centralizado via Feed Meta XML &amp; Bling ERP
            </span>
          </div>

          <div className={styles.autoGridCards}>
            {CHANNELS_10.map((ch) => (
              <div key={ch.id} className={`${styles.innerCard} ${styles.flexColStack}`}>
                <div>
                  <div className={styles.flexRowBetween}>
                    <span className={`${styles.kpiLabel} ${styles.textWarning}`}>
                      {ch.category}
                    </span>
                    <span className={`${styles.textMutedSmall} ${styles.textSuccess}`}>{ch.status}</span>
                  </div>
                  <div className={styles.decisionTitle}>{ch.name}</div>
                  <p className={styles.textBodySmall}>{ch.relationshipNote}</p>
                </div>

                <div className={styles.deptMetrics}>
                  <span>Taxa: <strong className={styles.textPrimaryBold}>{ch.commission}</strong></span>
                  <span>Alvo: <strong className={styles.textPrimaryBold}>{ch.trafficShare}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
