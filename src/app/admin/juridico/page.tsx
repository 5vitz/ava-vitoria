'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { WorkflowPersistentState } from '@/lib/workflowState';

const CHECKLIST_ITEMS = [
  { id: 1, label: 'Cartão CNPJ atualizado (CNAE 4781-4/00 vestuário)', checked: true },
  { id: 2, label: 'Inscrição Estadual (IE) ativa na SEFAZ-ES (SINTEGRA)', checked: false },
  { id: 3, label: 'Certificado Digital e-CNPJ Tipo A1 (.pfx + senha)', checked: false },
  { id: 4, label: 'Regime Tributário CRT 1 (Simples Nacional) definido', checked: false },
  { id: 5, label: 'Contrato Social consolidado dos 4 Sócios (Jucees)', checked: false },
  { id: 6, label: 'Conta Bancária PJ aberta no mesmo CNPJ da empresa', checked: false },
  { id: 7, label: 'Documento oficial com foto (CIN/CNH) do Sócio Administrador', checked: true },
  { id: 8, label: 'Comprovante de endereço recente da empresa e do sócio', checked: true },
  { id: 9, label: 'Disponibilidade para biometria facial nos marketplaces', checked: true },
  { id: 10, label: 'E-mail corporativo de operações (ex: integracoes@avasemlimites.com.br)', checked: false },
  { id: 11, label: 'Protocolo de registro da marca no INPI (Classes 25 e 35)', checked: false },
  { id: 12, label: 'Termos de Uso, Política de Trocas (CDC 49) e LGPD no ar', checked: true },
  { id: 13, label: 'Feed XML Meta Catalog ativo para Instagram Shopping', checked: true },
  { id: 14, label: 'Chave de API Dropsimples Dimona configurada', checked: true },
  { id: 15, label: 'Parametrização RTC 2027 no Bling ERP (NCM 6109.10.00 × cClassTrib/CST de CBS e IBS — LC 214/2025)', checked: false },
];

export default function JuridicoPage() {
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [lexQuestion, setLexQuestion] = useState('');
  const [lexAnswer, setLexAnswer] = useState<string | null>(null);

  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const fetchWorkflow = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.state) {
        setWfState(data.state);
      }
    } catch (err) {
      console.error('Erro ao carregar fila Blockchain:', err);
    }
  }, []);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const handleRegisterOnBlockchain = async () => {
    setRegistering(true);
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REGISTER_ARTWORK_ON_BLOCKCHAIN' }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setFeedback(data.message);
        setTimeout(() => setFeedback(null), 6500);
      }
    } finally {
      setRegistering(false);
    }
  };

  const toggleCheck = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const askLexTopic = (questionText: string) => {
    setLexQuestion(questionText);
    const q = questionText.toLowerCase();
    let ans = "Dr. Lex orienta: A conformidade jurídica e tributária da AVA Sem Limites deve resguardar os 4 sócios mediante Contrato Social registrado na JUCEES e emissão regular de NF-e (Modelo 55) via Bling ERP.";

    if (
      q.includes('rtc') ||
      q.includes('cbs') ||
      q.includes('ibs') ||
      q.includes('reforma') ||
      q.includes('214') ||
      q.includes('cclasstrib') ||
      q.includes('ncm') ||
      q.includes('b2b')
    ) {
      ans = "Dr. Lex (Reforma Tributária — LC 214/2025 · Motor RFB RTC): 1) Na emissão de NF-e (Modelo 55) via Bling ERP, o NCM padrão de vestuário (6109.10.00) deve estar estritamente vinculado ao código cClassTrib e CST de IBS/CBS para evitar a rejeição fiscal REG-011 da Receita Federal. 2) Estratégia Híbrida Simples Nacional: No Varejo B2C (Site e Marketplaces), recolhemos CBS e IBS por dentro do DAS (Anexo I com alíquota reduzida). Já em grandes contratos B2B Corporativos (Uniformes Reserva INK), a LC 214/2025 permite avaliar o destaque pelo regime regular caso a empresa compradora exija crédito tributário integral de IBS/CBS.";
    } else if (q.includes('mei') || q.includes('ltda') || q.includes('simples') || q.includes('tribut') || q.includes('imposto')) {
      ans = "Dr. Lex: O desenquadramento de MEI para LTDA no Simples Nacional é mandatório para a escala nacional. O MEI limita o faturamento a R$ 81 mil/ano (média de 38 camisetas/mês na nossa faixa de preço), não comporta os 4 sócios no Contrato Social e bloqueia canais como Dafiti e Reserva.";
    } else if (q.includes('inpi') || q.includes('marca') || q.includes('patente') || q.includes('registro') || q.includes('blockchain')) {
      ans = "Dr. Lex: A blindagem autoral das artes da AVA opera em fluxo bipartite: o Atelier (Tripoint) aprova o JSON de 26 Chaves gerando o Hash SHA-256, e o Jurídico (Flávio) ancora esse Hash no protocolo OpenTimestamps (Blockchain Bitcoin — custo R$ 0,00), emitindo o comprovante imutável (.ots / Certificado COA).";
    } else if (q.includes('troca') || q.includes('devolu') || q.includes('cdc') || q.includes('direito') || q.includes('arrependimento')) {
      ans = "Dr. Lex: O Artigo 49 do Código de Defesa do Consumidor garante 7 dias corridos para devolução sem ônus em compras online.";
    }

    setLexAnswer(ans);
  };

  const handleAskLex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lexQuestion.trim()) return;
    askLexTopic(lexQuestion);
  };

  const completedCount = checklist.filter((c) => c.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);
  const pilot = wfState?.pilotPiece;

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 01 · Jurídico, Registro Blockchain &amp; Compliance</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Flávio</strong> · Registro Blockchain do JSON 26 Chaves (OpenTimestamps Bitcoin), Transição MEI ➔ LTDA, LC 214/2025 e Dr. Lex
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Flávio
          </span>
        </div>

        {feedback && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {feedback}
          </div>
        )}

        {/* =================================================================== */}
        {/* FASE 1 (ETAPA 2): BANDEJA DE REGISTRO BLOCKCHAIN DO JSON 26 CHAVES   */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                ⛓️ FASE 1 (Etapa 2): Bandeja de Artes Aprovadas Aguardando Registro na Blockchain (OpenTimestamps Bitcoin)
              </h2>
              <p className={styles.textBodySmall}>
                Fluxo Bipartite de Propriedade Intelectual: O <strong>Atelier (08 · Tripoint)</strong> aprova a arte e congela o JSON de 26 Chaves com Hash SHA-256. O <strong>Jurídico (01 · Flávio / Dr. Lex)</strong> ancora o Hash na Blockchain Bitcoin (R$ 0,00) emitindo o Certificado COA (.ots).
              </p>
            </div>

            {!pilot ? (
              <span className={styles.statusPill}>Fila Limpa (0 Artes Pendentes)</span>
            ) : pilot.status === 'APPROVED_PENDING_BLOCKCHAIN' ? (
              <span className={`${styles.statusPill} ${styles.statusPillWarning}`}>
                ⚡ 1 ARTE AGUARDANDO REGISTRO BLOCKCHAIN
              </span>
            ) : (
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                🔒 APROVADA &amp; REGISTRADA NA BLOCKCHAIN
              </span>
            )}
          </div>

          {!pilot ? (
            <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
              <div>
                <div className={styles.decisionTitle}>
                  ✓ Nenhuma Arte Fictícia na Fila do Jurídico
                </div>
                <p className={styles.textBodySmall}>
                  Para alimentar esta bandeja com a nossa Peça Única real, acesse o <strong>Depto 08 · Atelier Criativo</strong> e clique em <strong>&ldquo;✅ Aprovar Arte para Coleção&rdquo;</strong>.
                </p>
              </div>
              <Link href="/admin/atelier" className={styles.btnPrimary}>
                🎨 Ir ao Atelier (Depto 08) ➔
              </Link>
            </div>
          ) : (
            <div
              className={`${styles.innerCard} ${styles.flexColStack} ${
                pilot.blockchainTxId ? styles.innerCardSuccess : styles.innerCardSelected
              }`}
            >
              <div className={styles.flexRowBetween}>
                <div>
                  <div className={styles.decisionTitle}>
                    {pilot.code} — {pilot.title}
                  </div>
                  <div className={styles.textBodySmall}>
                    Coleção: <strong>{pilot.collectionName}</strong> · Modelagem: <strong>{pilot.garmentModel} ({pilot.garmentColor} · Tam {pilot.garmentSize})</strong> · Desvinculação MDV: <strong>{pilot.mutatedKeysCount}/26 Chaves Mutadas</strong>
                  </div>
                </div>
                <span className={styles.statusPill}>
                  {pilot.blockchainTxId
                    ? `🔒 ${pilot.blockchainTxId}`
                    : '⏳ Aguardando Assinatura Blockchain'}
                </span>
              </div>

              <div className={styles.innerCardCompact}>
                <div className={styles.kpiLabel}>Hash Criptográfico SHA-256 do JSON de 26 Chaves:</div>
                <code>{pilot.sha256}</code>
                {pilot.otsReceipt && (
                  <div className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
                    ✓ Certificado OpenTimestamps emitido: {pilot.otsReceipt} em {pilot.blockchainRegisteredAt}
                  </div>
                )}
              </div>

              <div className={styles.flexRowStart}>
                {pilot.status === 'APPROVED_PENDING_BLOCKCHAIN' ? (
                  <button
                    type="button"
                    onClick={handleRegisterOnBlockchain}
                    disabled={registering}
                    className={styles.btnPrimary}
                  >
                    {registering
                      ? 'Ancorando Hash SHA-256 na Blockchain...'
                      : '⛓️ Registrar JSON na Blockchain (Flávio + Dr. Lex · OpenTimestamps)'}
                  </button>
                ) : (
                  <Link href="/admin/financeiro" className={styles.btnSuccess}>
                    💎 Avançar para FASE 2 (Etapa 3): Precificar Peça Única no Financeiro (Depto 02 · Flávio) ➔
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Diagnóstico MEI vs LTDA */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <h2 className={styles.cardHeading}>Diagnóstico Fiscal Crítico: MEI vs. LTDA (Simples Nacional)</h2>
          <div className={styles.autoGridCards}>
            <div className={`${styles.innerCard} ${styles.innerCardDanger}`}>
              <div className={`${styles.decisionTitle} ${styles.textDanger}`}>
                ⚠️ Gargalos do MEI Atual
              </div>
              <ul className={styles.textBodySmall}>
                <li>Limite de 38 peças/mês (R$ 81 mil/ano).</li>
                <li>Proibição legal de inclusão dos 4 sócios.</li>
                <li>Bloqueio de cadastro na Dafiti e Reserva.</li>
                <li>Trava de compras de notas fiscais da Dimona.</li>
              </ul>
            </div>

            <div className={`${styles.innerCard} ${styles.innerCardSuccess}`}>
              <div className={`${styles.decisionTitle} ${styles.textSuccess}`}>
                ✅ Vantagens da LTDA (Simples Nacional)
              </div>
              <ul className={styles.textBodySmall}>
                <li>Teto salta para R$ 360 mil até R$ 4,8 milhões/ano.</li>
                <li>Contrato Social formalizando a diretoria e sociedade na JUCEES.</li>
                <li>Liberação imediata nos 10 canais via Bling ERP.</li>
                <li>Mesmo número de CNPJ preservado na transição.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Checklist de Documentação */}
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <h2 className={styles.cardHeadingNoBorder}>Checklist Bling ERP &amp; 10 Canais</h2>
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>{progressPercent}% Completo</span>
            </div>

            <div className={styles.flexColTight}>
              {checklist.map((item) => (
                <label key={item.id} className={styles.innerRowItem}>
                  <span className={styles.flexRowStart}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                    />
                    <span>{item.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chat Dr. Lex */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Consultoria Jurídica IA · Dr. Lex</h2>
            <p className={styles.textBodySmall}>
              Tire dúvidas rápidas sobre contratos, Registro Blockchain (.ots), Reforma Tributária (CBS/IBS — LC 214/2025) e transição MEI ➔ LTDA.
            </p>

            <div className={styles.flexRowStart}>
              <button
                type="button"
                onClick={() => askLexTopic('Como funciona o registro Blockchain do JSON 26 chaves?')}
                className={styles.btnSecondary}
              >
                ⛓️ Registro Blockchain (.ots)
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Como funciona a Reforma Tributária (RTC — CBS, IBS e cClassTrib) na AVA?')}
                className={styles.btnSecondary}
              >
                ⚖️ Reforma Tributária (LC 214/2025)
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Qual a estratégia de transição MEI para LTDA no Simples Nacional?')}
                className={styles.btnSecondary}
              >
                🏛️ Transição MEI ➔ LTDA
              </button>
            </div>

            <form onSubmit={handleAskLex} className={styles.flexColStack}>
              <textarea
                rows={3}
                placeholder="Ex: Como funciona o registro Blockchain do JSON 26 chaves?"
                value={lexQuestion}
                onChange={(e) => setLexQuestion(e.target.value)}
                className={styles.formTextarea}
              />
              <div>
                <button type="submit" className={styles.btnPrimary}>
                  Consultar Dr. Lex
                </button>
              </div>
            </form>

            {lexAnswer && (
              <div className={styles.innerCard}>
                <p className={styles.textBodySmall}>{lexAnswer}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
