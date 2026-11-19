'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface MarginRule {
  id: string;
  category_code: string;
  category_label: string;
  target_margin_percent: number;
  drop_indexing_mode: string;
}

export default function FinanceiroPage() {
  const [margins, setMargins] = useState<Record<string, number>>({
    CAMISETA_QUALITY: 60,
    CAMISETA_PRIME: 60,
    CAMISETA_OVERSIZED: 55,
    CAMISETA_ESTONADA: 58,
    REGATA: 60,
    MOLETOM: 50,
    BONE: 45
  });

  const [indexingMode, setIndexingMode] = useState<'INDEXED' | 'HOLD_ON_DROP'>('INDEXED');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Unit Economics Simulator
  const [sampleCost, setSampleCost] = useState(67.90); // T-Shirt Prime Frente+Costas
  const [sampleMargin, setSampleMargin] = useState(60);

  const salePrice = sampleCost / (1 - sampleMargin / 100);
  const taxSimples = salePrice * 0.06; // 6% Simples Nacional
  const paymentFee = salePrice * 0.035; // 3.5% Gateway
  const netProfit = salePrice - sampleCost - taxSimples - paymentFee;

  const handleSaveMargin = async (code: string) => {
    setLoading(true);
    setSaveStatus(`Enviando proposta de margem de ${code} (${margins[code]}%) para a Urna de Votação dos 4 Sócios...`);
    try {
      const res = await fetch('/api/categories/margins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_code: code,
          target_margin_percent: margins[code],
          drop_indexing_mode: indexingMode,
          reindex_products: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus(
          `🗳️ Proposta de ${code} (${margins[code]}%) registrada na Urna! Cobrança de voto disparada via WhatsApp e E-mail para Armando, Flávio, Tripoint e Gustavo.`
        );
      } else {
        setSaveStatus('Erro ao registrar proposta de margem.');
      }
    } catch {
      setSaveStatus('Erro de conexão ao salvar proposta de margem.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus(null), 5500);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 08 · Financeiro, Fiscal &amp; Precificação Colegiada</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Flávio</strong> · Precificação sob Votação Colegiada dos 4 Sócios (4/4), Unit Economics (DRE) e Bling ERP v3
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Flávio · 🗳️ Preços sob Voto 4/4
          </span>
        </div>

        {/* Lei de Ouro da Precificação Colegiada */}
        <div
          style={{
            padding: '14px 18px',
            background: '#EFE4CC',
            border: '1px solid rgba(217, 119, 6, 0.45)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            color: '#18181B',
            fontSize: '12px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <span>
            ⚖️ <strong>Governança Colegiada de Preços:</strong> <em>&ldquo;Se o preço estiver baixo, você nada e morre na praia; se estiver alto, você não sai do lugar e morre ali mesmo.&rdquo;</em> Toda alteração de margem exige votação dos 4 sócios com cobrança automática via WhatsApp e E-mail.
          </span>
        </div>

        {saveStatus && (
          <div style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(5,150,105,0.4)', color: '#065F46', fontSize: '13px', marginBottom: '20px', fontWeight: 600 }}>
            {saveStatus}
          </div>
        )}

        {/* Chave de 2 Posições */}
        <section className={styles.moduleCard} style={{ marginBottom: '24px' }}>
          <h2 className={styles.cardHeading}>Chave de 2 Posições · Comportamento em Queda de Custo do Fornecedor (Votação 4/4)</h2>
          <p style={{ fontSize: '13px', color: '#3F3F46' }}>
            Define a conduta automática do sistema quando a Dimona ou a Reserva realizam uma promoção ou reduzem os custos base:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
            <div
              onClick={() => setIndexingMode('INDEXED')}
              style={{
                padding: '16px',
                background: '#EFE4CC',
                border: indexingMode === 'INDEXED' ? '2px solid #000000' : '1px solid rgba(0,0,0,0.14)',
                boxShadow: indexingMode === 'INDEXED' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#000000', fontSize: '14px' }}>
                  Posição 1: INDEXADO (Padrão)
                </span>
                {indexingMode === 'INDEXED' && <span style={{ color: '#065F46', fontSize: '11px', fontWeight: 700 }}>● Ativo</span>}
              </div>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                Qualquer redução no fornecedor baixa proporcionalmente o preço na vitrine da loja, mantendo constante a margem percentual configurada.
              </p>
            </div>

            <div
              onClick={() => setIndexingMode('HOLD_ON_DROP')}
              style={{
                padding: '16px',
                background: '#EFE4CC',
                border: indexingMode === 'HOLD_ON_DROP' ? '2px solid #000000' : '1px solid rgba(0,0,0,0.14)',
                boxShadow: indexingMode === 'HOLD_ON_DROP' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#000000', fontSize: '14px' }}>
                  Posição 2: DESINDEXAR NA BAIXA (Reter Lucro Extra)
                </span>
                {indexingMode === 'HOLD_ON_DROP' && <span style={{ color: '#065F46', fontSize: '11px', fontWeight: 700 }}>● Ativo</span>}
              </div>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                Mantém o preço de venda atual na vitrine congelado e embolsa a margem de lucro extra. Se o fornecedor voltar a subir o custo ao patamar anterior, reindexa automaticamente.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Caixinhas de Margem por Categoria */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Tabela de Margem por Categoria (Submissão à Urna dos 4 Sócios)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { code: 'CAMISETA_QUALITY', label: 'T-Shirts Quality 30.1' },
                { code: 'CAMISETA_PRIME', label: 'T-Shirts Prime 180g (Pele de Pêssego)' },
                { code: 'CAMISETA_OVERSIZED', label: 'T-Shirts Oversized 220g (Streetwear)' },
                { code: 'CAMISETA_ESTONADA', label: 'T-Shirts Estonadas Vintage 30.1' },
                { code: 'REGATA', label: 'Regatas Masculinas Quality' },
                { code: 'MOLETOM', label: 'Moletons (Crewneck & Canguru)' },
                { code: 'BONE', label: 'Bonés (Americano & Prime Fivela)' },
              ].map(cat => (
                <div key={cat.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#000000' }}>{cat.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="20"
                      max="90"
                      value={margins[cat.code] || 60}
                      onChange={(e) => setMargins({ ...margins, [cat.code]: Number(e.target.value) })}
                      style={{
                        width: '60px',
                        background: '#FAF6EE',
                        border: '1px solid rgba(0,0,0,0.25)',
                        color: '#000000',
                        fontWeight: 600,
                        padding: '4px 6px',
                        textAlign: 'center',
                        fontSize: '13px'
                      }}
                    />
                    <span style={{ color: '#4B5563', fontSize: '13px', fontWeight: 600 }}>%</span>
                    <button
                      onClick={() => handleSaveMargin(cat.code)}
                      disabled={loading}
                      className={styles.btnPrimary}
                      style={{ fontSize: '10px', padding: '5px 10px' }}
                    >
                      🗳️ Votar 4/4
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculadora de Unit Economics */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Calculadora de Unit Economics (Lucro Líquido Real)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#4B5563', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Custo Base do Fornecedor (Insumo + Silk HD): R$ {sampleCost.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="1"
                  value={sampleCost}
                  onChange={(e) => setSampleCost(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#000000' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#4B5563', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Margem Alvo da Categoria: {sampleMargin}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="80"
                  step="1"
                  value={sampleMargin}
                  onChange={(e) => setSampleMargin(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#000000' }}
                />
              </div>

              <div style={{ padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B5563' }}>Preço de Venda Sugerido:</span>
                  <span style={{ fontWeight: 700, color: '#000000', fontSize: '15px' }}>R$ {salePrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B91C1C' }}>
                  <span>(-) Custo de Produção PoD:</span>
                  <span>- R$ {sampleCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B91C1C' }}>
                  <span>(-) Imposto Simples Nacional (~6%):</span>
                  <span>- R$ {taxSimples.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B91C1C' }}>
                  <span>(-) Taxa Gateway / Cartão (3.5%):</span>
                  <span>- R$ {paymentFee.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.14)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#065F46', fontWeight: 700 }}>(=) Lucro Líquido Real por Peça:</span>
                  <span style={{ color: '#065F46', fontWeight: 700, fontSize: '18px' }}>R$ {netProfit.toFixed(2)}</span>
                </div>
              </div>

              {/* Conector Bling ERP */}
              <div style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#000000', fontSize: '13px' }}>Conector Bling ERP (API v3)</div>
                    <div style={{ fontSize: '11px', color: '#4B5563' }}>Emissão de NF-e e distribuição para os 10 Marketplaces</div>
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.18)', color: '#18181B', padding: '3px 8px', fontWeight: 600 }}>
                    OAuth 1-Clique Pronto
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
