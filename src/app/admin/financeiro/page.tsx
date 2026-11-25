'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

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
  const [sampleCost, setSampleCost] = useState(67.90);
  const [sampleMargin, setSampleMargin] = useState(60);

  const salePrice = sampleCost / (1 - sampleMargin / 100);
  const taxSimples = salePrice * 0.06;
  const paymentFee = salePrice * 0.035;
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
            <h1 className={styles.moduleTitle}>Depto 02 · Financeiro, Fiscal &amp; Precificação Colegiada</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Flávio</strong> · Precificação sob Votação Colegiada dos 4 Sócios (4/4), Unit Economics (DRE) e Bling ERP v3
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Flávio · 🗳️ Preços sob Voto 4/4
          </span>
        </div>

        {/* Banner Gerenciar Assinaturas & APIs */}
        <div className={`${styles.innerCard} ${styles.flexRowBetween} ${styles.moduleCardSpaced}`}>
          <div>
            <div className={styles.flexRowStart}>
              <span>📦</span>
              <span className={styles.decisionTitle}>Matriz de Assinaturas, Ferramentas &amp; APIs dos 23 Agentes</span>
              <span className={styles.statusPill}>NOVO</span>
            </div>
            <p className={styles.textBodySmall}>
              Controle de custos fixos (~R$ 489/mês), mapeamento de cartões (Armando vs PJ), fornecedores PoD (Dimona/Reserva/Montink) e votação 4/4 para novas ferramentas.
            </p>
          </div>
          <Link href="/admin/financeiro/assinaturas" className={styles.btnPrimary}>
            Gerenciar Assinaturas &amp; APIs ➔
          </Link>
        </div>

        {/* Lei de Ouro da Precificação Colegiada */}
        <div className={`${styles.innerCard} ${styles.innerCardWarning} ${styles.moduleCardSpaced}`}>
          <span className={styles.textBodySmall}>
            ⚖️ <strong>Governança Colegiada de Preços:</strong> <em>&ldquo;Se o preço estiver baixo, você nada e morre na praia; se estiver alto, você não sai do lugar e morre ali mesmo.&rdquo;</em> Toda alteração de margem exige votação dos 4 sócios com cobrança automática via WhatsApp e E-mail.
          </span>
        </div>

        {saveStatus && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {saveStatus}
          </div>
        )}

        {/* Chave de 2 Posições */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <h2 className={styles.cardHeading}>Chave de 2 Posições · Comportamento em Queda de Custo do Fornecedor (Votação 4/4)</h2>
          <p className={styles.textBodySmall}>
            Define a conduta automática do sistema quando a Dimona ou a Reserva realizam uma promoção ou reduzem os custos base:
          </p>

          <div className={styles.autoGridCards}>
            <div
              onClick={() => setIndexingMode('INDEXED')}
              className={`${styles.innerCardInteractive} ${
                indexingMode === 'INDEXED' ? styles.innerCardSelected : ''
              }`}
            >
              <div className={styles.flexRowBetween}>
                <span className={styles.decisionTitle}>
                  Posição 1: INDEXADO (Padrão)
                </span>
                {indexingMode === 'INDEXED' && (
                  <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>● Ativo</span>
                )}
              </div>
              <p className={styles.textBodySmall}>
                Qualquer redução no fornecedor baixa proporcionalmente o preço na vitrine da loja, mantendo constante a margem percentual configurada.
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
                Mantém o preço de venda atual na vitrine congelado e embolsa a margem de lucro extra. Se o fornecedor voltar a subir o custo ao patamar anterior, reindexa automaticamente.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Caixinhas de Margem por Categoria */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Tabela de Margem por Categoria (Submissão à Urna dos 4 Sócios)</h2>
            <div className={styles.flexColStack}>
              {[
                { code: 'CAMISETA_QUALITY', label: 'T-Shirts Quality 30.1' },
                { code: 'CAMISETA_PRIME', label: 'T-Shirts Prime 180g (Pele de Pêssego)' },
                { code: 'CAMISETA_OVERSIZED', label: 'T-Shirts Oversized 220g (Streetwear)' },
                { code: 'CAMISETA_ESTONADA', label: 'T-Shirts Estonadas Vintage 30.1' },
                { code: 'REGATA', label: 'Regatas Masculinas Quality' },
                { code: 'MOLETOM', label: 'Moletons (Crewneck & Canguru)' },
                { code: 'BONE', label: 'Bonés (Americano & Prime Fivela)' },
              ].map((cat) => (
                <div key={cat.code} className={styles.innerRowItem}>
                  <span className={styles.textPrimaryBold}>{cat.label}</span>
                  <div className={styles.flexRowStart}>
                    <input
                      type="number"
                      min="20"
                      max="90"
                      value={margins[cat.code] || 60}
                      onChange={(e) => setMargins({ ...margins, [cat.code]: Number(e.target.value) })}
                      className={styles.formInput}
                    />
                    <span className={styles.textMutedSmall}>%</span>
                    <button
                      onClick={() => handleSaveMargin(cat.code)}
                      disabled={loading}
                      className={styles.btnPrimary}
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
            <div className={styles.flexColStack}>
              <div>
                <label className={styles.formLabel}>
                  Custo Base do Fornecedor (Insumo + Silk HD): R$ {sampleCost.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="1"
                  value={sampleCost}
                  onChange={(e) => setSampleCost(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Margem Alvo da Categoria: {sampleMargin}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="80"
                  step="1"
                  value={sampleMargin}
                  onChange={(e) => setSampleMargin(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
              </div>

              <div className={`${styles.innerCard} ${styles.flexColTight}`}>
                <div className={styles.flexRowBetween}>
                  <span className={styles.textMutedSmall}>Preço de Venda Sugerido:</span>
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
                  <span>(-) Taxa Gateway / Cartão (3.5%):</span>
                  <span>- R$ {paymentFee.toFixed(2)}</span>
                </div>
                <div className={styles.flexRowBetween}>
                  <span className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>(=) Lucro Líquido Real por Peça:</span>
                  <span className={`${styles.kpiValue} ${styles.textSuccess}`}>R$ {netProfit.toFixed(2)}</span>
                </div>
              </div>

              {/* Conector Bling ERP */}
              <div className={styles.innerCard}>
                <div className={styles.flexRowBetween}>
                  <div>
                    <div className={styles.decisionTitle}>Conector Bling ERP (API v3)</div>
                    <div className={styles.textMutedSmall}>Emissão de NF-e e distribuição para os 10 Marketplaces</div>
                  </div>
                  <span className={styles.statusPill}>
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
