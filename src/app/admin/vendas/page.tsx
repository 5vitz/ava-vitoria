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
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Gustavo
          </span>
        </div>

        {nudgeAlert && (
          <div
            style={{
              padding: '14px 18px',
              background: '#FFFFFF',
              border: '1px solid #D97706',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              color: '#92400E',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: 600
            }}
          >
            {nudgeAlert}
          </div>
        )}

        {/* Termômetro de Equilíbrio Preço vs. Conversão + Simulador de Impulsionamento */}
        <div className={styles.moduleGrid2Cols} style={{ marginBottom: '24px' }}>
          <section className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Termômetro Comercial: Preço vs. Conversão de Tráfego</h2>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
              <em>&ldquo;Se o preço estiver baixo, você nada e morre na praia; se estiver alto, você não sai do lugar e morre ali mesmo.&rdquo;</em>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '11px', color: '#4B5563', textTransform: 'uppercase', fontWeight: 600 }}>1. Taxa de Inspeção na Vitrine 9:16 (1º Clique)</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#047857', marginTop: '4px' }}>
                  34,8% dos visitantes inspecionam as peças
                </div>
                <div style={{ fontSize: '11px', color: '#52525B', marginTop: '2px' }}>
                  O efeito de vidro leitoso nos 8 vizinhos retém a atenção visual acima da média do mercado (18%).
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '11px', color: '#4B5563', textTransform: 'uppercase', fontWeight: 600 }}>2. Sensibilidade de Preço no Checkout</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>
                  Faixa Ideal Homologada: R$ 149,90 a R$ 189,90 (T-Shirt Prime / Oversized)
                </div>
                <div style={{ fontSize: '11px', color: '#52525B', marginTop: '2px' }}>
                  Qualquer ajuste de margem para campanhas em canais externos exige aprovação 4/4 na Urna.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button type="button" onClick={handleRequestPricingVote} className={styles.btnPrimary}>
                🗳️ Propor Ajuste Comercial na Urna (4 Sócios)
              </button>
              <Link href="/admin/financeiro" className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
                Ver Simulador DRE (Depto 02) ↗
              </Link>
            </div>
          </section>

          <section className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Simulador de Impulsionamento &amp; Tráfego Pago (ROAS)</h2>
            <p style={{ fontSize: '12px', color: '#4B5563', margin: 0 }}>
              Calibre o investimento diário em Meta Ads / Instagram Shopping e projete o retorno comercial:
            </p>

            <div>
              <label style={{ fontSize: '11px', color: '#4B5563', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Orçamento Diário de Impulsionamento (R$/dia): <strong>R$ {dailyBudget}</strong>
              </label>
              <input
                type="range"
                min={30}
                max={1000}
                step={10}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000000' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: 600 }}>Visitas Qualificadas / Dia</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>
                  ~{estimatedClicks} visitas
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: 600 }}>Pedidos Estimados (Conv. 2,5%)</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#047857', marginTop: '4px' }}>
                  {estimatedOrders} pedidos/dia
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: 600 }}>Faturamento Bruto Projetado</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>
                  R$ {estimatedRevenue.toFixed(2)}/dia
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid rgba(5,150,105,0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '11px', color: '#065F46', fontWeight: 600 }}>ROAS Projetado (Retorno)</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#065F46', marginTop: '4px' }}>
                  {estimatedRoas}x sobre o anúncio
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Painel de Relacionamento com os 10 Canais de Vendas */}
        <section className={styles.moduleCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className={styles.cardHeading} style={{ borderBottom: 'none', paddingBottom: 0 }}>
              Gestão &amp; Relacionamento com os 10 Canais de Vendas Nacionais
            </h2>
            <span style={{ fontSize: '11px', color: '#065F46', fontWeight: 700 }}>
              ● Catálogo Centralizado via Feed Meta XML &amp; Bling ERP
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {CHANNELS_10.map((ch) => (
              <div
                key={ch.id}
                style={{
                  padding: '16px',
                  background: '#FFFFFF',
                  border: '1px solid #000000',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#92400E', fontWeight: 700 }}>
                      {ch.category}
                    </span>
                    <span style={{ fontSize: '10px', color: '#047857', fontWeight: 600 }}>{ch.status}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '6px' }}>
                    {ch.name}
                  </div>
                  <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.45', margin: 0 }}>
                    {ch.relationshipNote}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(0,0,0,0.12)',
                    fontSize: '11px',
                    color: '#4B5563'
                  }}
                >
                  <span>Taxa: <strong style={{ color: '#000000' }}>{ch.commission}</strong></span>
                  <span>Alvo: <strong style={{ color: '#000000' }}>{ch.trafficShare}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
