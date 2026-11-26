'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { WorkflowPersistentState } from '@/lib/workflowState';

export default function MarketingPage() {
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fase 0 — Os 4 Pilares da Coleção
  const [colName, setColName] = useState('Coleção Sem Limites — Peça Única');
  const [colSeason, setColSeason] = useState('Outono');
  const [colYear, setColYear] = useState('2027');
  const [colTheme, setColTheme] = useState(
    'Movimento Cinético Urbano & Liberdade Escultórica em 3D (Escorço 75° Eixo Z)'
  );
  const [colAesthetic, setColAesthetic] = useState(
    'Estética da Subtração: 63% Espaço Negativo, Traço Fino 1px Hairline, Contraste Chiaroscuro e Acento Ouro Ocre (#C29E5D)'
  );
  const [colMessage, setColMessage] = useState(
    'Atitude para saltar além do óbvio, Valorização da arte autoral e Amizade que move a rua sem limites.'
  );

  // Fase 2 (Etapa 5) — Quantidade de cards na Vitrine 3x3
  const [cardsCount, setCardsCount] = useState(9);

  // Campanha "EU TENHO CUPOM!"
  const [couponCode, setCouponCode] = useState('3AMIGOSAVA');
  const [discountSimulated, setDiscountSimulated] = useState<number | null>(null);

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.state) {
        setWfState(data.state);
        if (data.state.activeCharter) {
          setColName(data.state.activeCharter.name);
          setColSeason(data.state.activeCharter.season);
          setColYear(String(data.state.activeCharter.year));
          setColTheme(data.state.activeCharter.themeTrend);
          setColAesthetic(data.state.activeCharter.aesthetic);
          setColMessage(data.state.activeCharter.brandMessage);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar workflow:', err);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 6500);
  };

  const handleProposeCharter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROPOSE_COLLECTION_CHARTER',
          name: colName,
          season: colSeason,
          year: Number(colYear),
          themeTrend: colTheme,
          aesthetic: colAesthetic,
          brandMessage: colMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        showToast(data.message);
      } else {
        showToast(data.error || 'Erro ao submeter Carta Conceitual.');
      }
    } catch {
      showToast('Erro de conexão ao submeter Carta Conceitual.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickApproveCharter44 = async () => {
    if (!wfState?.activeCharter?.decisionId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_ALL_VOTES_AND_EXECUTE',
          decisionId: wfState.activeCharter.decisionId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        showToast(data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishSinglePieceStorefront = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PUBLISH_SINGLE_PIECE_STOREFRONT',
          cardsCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        showToast(data.message);
      } else {
        showToast(data.error || 'Erro ao publicar na vitrine.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const testCoupon = () => {
    const firstChar = couponCode.trim().charAt(0);
    const num = parseInt(firstChar, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      setDiscountSimulated(num * 10);
    } else {
      setDiscountSimulated(null);
    }
  };

  const charter = wfState?.activeCharter;
  const pilot = wfState?.pilotPiece;

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 07 · Marketing de Produto (Ponto de Partida · Fase 0 &amp; Fase 2)</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Tripoint</strong> · Concepção Estratégica dos 4 Pilares da Coleção (4x ao Ano), Visual Merchandising da Vitrine Canônica e Trios 3x3 Instagram
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Tripoint
          </span>
        </div>

        {feedback && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {feedback}
          </div>
        )}

        {/* =================================================================== */}
        {/* FASE 0 · PONTO DE PARTIDA: OS 4 PILARES DA COLEÇÃO (VOTAÇÃO 4/4)    */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                🧭 FASE 0 (Ponto de Partida): Carta Conceitual da Coleção — Os 4 Pilares Fundadores
              </h2>
              <p className={styles.textBodySmall}>
                <em>&ldquo;Planejar errado é o mesmo que planejar errar!&rdquo;</em> — Uma coleção acontece 4 vezes ao ano (guiada pelas estações) e <strong>exige aprovação na Urna 4/4 pela Diretoria Executiva</strong> antes que o Atelier (Depto 08) inicie a criação da peça.
              </p>
            </div>
            {charter ? (
              <span
                className={`${styles.statusPill} ${
                  charter.status === 'HOMOLOGADA_4_4'
                    ? styles.statusPillSuccess
                    : styles.statusPillWarning
                }`}
              >
                {charter.status === 'HOMOLOGADA_4_4'
                  ? '✓ COLEÇÃO HOMOLOGADA 4/4 NA DIRETORIA'
                  : '⏳ AGUARDANDO VOTAÇÃO 4/4 NA URNA'}
              </span>
            ) : (
              <span className={styles.statusPill}>1º Passo do Roteiro</span>
            )}
          </div>

          <form onSubmit={handleProposeCharter} className={styles.flexColStack}>
            <div className={styles.autoGridSmall}>
              <div>
                <label className={styles.formLabel}>
                  1. Um Nome (Batismo Oficial da Coleção) *
                </label>
                <input
                  type="text"
                  required
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div>
                <label className={styles.formLabel}>Estação do Ano (4x/Ano)</label>
                <select
                  value={colSeason}
                  onChange={(e) => setColSeason(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="Outono">Outono</option>
                  <option value="Inverno">Inverno</option>
                  <option value="Primavera">Primavera</option>
                  <option value="Verão">Verão</option>
                </select>
              </div>

              <div>
                <label className={styles.formLabel}>Ano</label>
                <input
                  type="number"
                  value={colYear}
                  onChange={(e) => setColYear(e.target.value)}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.moduleGrid2Cols}>
              <div>
                <label className={styles.formLabel}>
                  2. Um Tema / Uma Tendência (Movimento Cultural ou Conceitual) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={colTheme}
                  onChange={(e) => setColTheme(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  3. Uma Estética (Linguagem Visual, Traço, Luz e Contraste) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={colAesthetic}
                  onChange={(e) => setColAesthetic(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>
            </div>

            <div>
              <label className={styles.formLabel}>
                4. Uma Mensagem Clara e Bem Definida (Alinhada aos Valores da Marca: Atitude · Valorização · Amizade) *
              </label>
              <textarea
                rows={2}
                required
                value={colMessage}
                onChange={(e) => setColMessage(e.target.value)}
                className={styles.formTextarea}
              />
            </div>

            <div className={styles.flexRowBetween}>
              <div className={styles.flexRowStart}>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.btnPrimary}
                >
                  🗳️ 1. Submeter 4 Pilares da Coleção para Votação na Urna (4/4)
                </button>

                {charter?.status === 'EM_VOTACAO_URNA' && (
                  <button
                    type="button"
                    onClick={handleQuickApproveCharter44}
                    disabled={submitting}
                    className={styles.btnSuccess}
                  >
                    ⚡ 2. Homologar Votação 4/4 dos Sócios Agora &amp; Destravar Atelier (08)
                  </button>
                )}

                {charter?.status === 'HOMOLOGADA_4_4' && (
                  <Link href="/admin/atelier" className={styles.btnSuccess}>
                    🎨 Avançar para FASE 1: Criar &amp; Aprovar Peça Única no Atelier (Depto 08) ➔
                  </Link>
                )}
              </div>

              <Link href="/admin" className={styles.btnSecondary}>
                Ver Urna no Cockpit (/admin) ↗
              </Link>
            </div>
          </form>
        </section>

        {/* =================================================================== */}
        {/* FASE 2 (ETAPA 5): PUBLICAR PEÇA ÚNICA EM TODOS OS CARDS DA VITRINE  */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                ★ FASE 2 (Etapa 5): Publicação da Peça Única na Vitrine Canônica (Todos os Cards do Grid 3x3)
              </h2>
              <p className={styles.textBodySmall}>
                <em>&ldquo;O processo que funcionar para uma camisa, deve funcionar para todas.&rdquo;</em> — Uma vez que a Peça Única foi registrada na Blockchain (Depto 01) e teve seu preço aprovado na Urna 4/4 (Depto 02), publique-a como a <strong>Vitrine Ativa da Loja (/)</strong> repetida em todos os cards do Grid Balenciaga 9:16.
              </p>
            </div>
            {pilot?.status === 'PUBLISHED_IN_STOREFRONT' ? (
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                ★ VITRINE PUBLICADA &amp; ATIVA NA LOJA (/)
              </span>
            ) : (
              <span className={styles.statusPill}>
                Status da Peça: {pilot?.status || 'Aguardando Fase 1 (Atelier)'}
              </span>
            )}
          </div>

          {!pilot ? (
            <div className={styles.innerCard}>
              <p className={styles.textBodySmall}>
                ⏳ Nenhuma Peça Única aprovada no Atelier ainda. Homologue a Fase 0 acima e aprove a Peça Única no <strong>Depto 08 · Atelier Criativo</strong>.
              </p>
            </div>
          ) : (
            <div className={`${styles.innerCard} ${styles.flexColStack}`}>
              <div className={styles.flexRowBetween}>
                <div>
                  <div className={styles.decisionTitle}>
                    Peça Única Pronta: {pilot.title} ({pilot.code})
                  </div>
                  <div className={styles.textBodySmall}>
                    Coleção: <strong>{pilot.collectionName}</strong> · Modelagem: <strong>{pilot.garmentModel} ({pilot.garmentColor} · Tam {pilot.garmentSize})</strong> · Preço Homologado:{' '}
                    <strong className={styles.textSuccess}>
                      R$ {(pilot.approvedSalePrice || 169.75).toFixed(2)}
                    </strong>{' '}
                    · Blockchain: <strong>{pilot.blockchainTxId || 'Pendente Registro no 01'}</strong>
                  </div>
                </div>

                <div className={styles.flexRowStart}>
                  <label className={styles.formLabel}>Cards no Grid 3x3:</label>
                  <select
                    value={cardsCount}
                    onChange={(e) => setCardsCount(Number(e.target.value))}
                    className={styles.formSelect}
                  >
                    <option value={3}>3 Cards (1 Linha 3x3)</option>
                    <option value={6}>6 Cards (2 Linhas 3x3)</option>
                    <option value={9}>9 Cards (Bloco 3x3 Completo)</option>
                  </select>
                </div>
              </div>

              <div className={styles.flexRowStart}>
                <button
                  type="button"
                  onClick={handlePublishSinglePieceStorefront}
                  disabled={submitting}
                  className={styles.btnPrimary}
                >
                  ⚡ Publicar Peça Única em Todos os {cardsCount} Cards da Vitrine Oficial (/)
                </button>

                <Link href="/" target="_blank" className={styles.btnSecondary}>
                  ↗ Abrir Vitrine Pública da Loja (/)
                </Link>

                {pilot.status === 'PUBLISHED_IN_STOREFRONT' && (
                  <Link href="/admin/vendas" className={styles.btnSuccess}>
                    🛒 Avançar para FASE 3: Simular Compra do Cliente (Depto 06) ➔
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Postagens em Trios 3x3 no Instagram */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Estratégia de Feed Instagram (Trios 3x3 Balenciaga)</h2>
            <p className={styles.textBodySmall}>
              Para reproduzir o impacto visual da vitrine da AVA no Instagram, todas as publicações no feed devem ser lançadas em <strong>blocos de 3 postagens simultâneas (Trios 3x3)</strong>:
            </p>

            <div className={styles.autoGridSmall}>
              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>Post 1</div>
                <div className={styles.textMutedSmall}>Modelo Lookbook 9:16</div>
              </div>
              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>Post 2</div>
                <div className={styles.textMutedSmall}>Close da Arte Silk HD</div>
              </div>
              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>Post 3</div>
                <div className={styles.textMutedSmall}>Conceito / Detalhes</div>
              </div>
            </div>
          </div>

          {/* Sacolinha Instagram & Meta Commerce */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Sacolinha do Instagram &amp; Campanha &quot;EU TENHO CUPOM!&quot;</h2>
            <div className={styles.flexColStack}>
              <div className={styles.innerRowItem}>
                <span className={styles.textPrimaryBold}>Feed XML Meta: /api/catalog/meta</span>
                <a href="/api/catalog/meta" target="_blank" className={styles.btnSecondary}>
                  Ver XML ↗
                </a>
              </div>

              <div className={styles.flexRowStart}>
                <input
                  type="text"
                  placeholder="Senha cupom (Ex: 3AMIGOSAVA)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className={styles.formInput}
                />
                <button onClick={testCoupon} className={styles.btnSecondary}>
                  Testar Cupom
                </button>
              </div>
              {discountSimulated !== null && (
                <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                  ✓ {discountSimulated}% OFF na Vitrine Secreta
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
