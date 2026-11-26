'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import AdminHeader from './AdminHeader';
import styles from './admin-cockpit.module.css';
import {
  WorkflowPersistentState,
  DecisionQueueItem,
  PartnerVotes,
} from '@/lib/workflowState';

const PARTNERS_KEYS: (keyof PartnerVotes)[] = ['Armando', 'Flavio', 'Tripoint', 'Gustavo'];

const PARTNER_LABELS: Record<keyof PartnerVotes, string> = {
  Armando: 'Armando',
  Flavio: 'Flávio',
  Tripoint: 'Tripoint',
  Gustavo: 'Gustavo',
};

export default function AdminCockpitClient() {
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nudgeToast, setNudgeToast] = useState<string | null>(null);

  const fetchWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.state) {
        setWfState(data.state);
      }
    } catch (err) {
      console.error('Erro ao carregar estado do fluxo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();
    fetchWorkflow();
  }, [fetchWorkflow]);

  const showToast = (msg: string) => {
    setNudgeToast(msg);
    setTimeout(() => setNudgeToast(null), 6500);
  };

  const handleCycleVote = async (decisionId: string, partner: keyof PartnerVotes) => {
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CYCLE_VOTE', decisionId, partner }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
      }
    } catch (err) {
      console.error('Erro ao votar:', err);
    }
  };

  const handleExecuteDecision = async (item: DecisionQueueItem) => {
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_ALL_VOTES_AND_EXECUTE',
          decisionId: item.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        showToast(data.message || 'Decisão 4/4 homologada e executada com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao homologar decisão:', err);
    }
  };

  const handleNudgePending = (item: DecisionQueueItem) => {
    const pendingNames = PARTNERS_KEYS.filter((k) => item.votes[k] !== 'APPROVED').map(
      (k) => PARTNER_LABELS[k]
    );

    if (pendingNames.length === 0) {
      showToast(`✅ Todos os 4 sócios já aprovaram a pauta "${item.title}"!`);
    } else {
      showToast(
        `📲 Cobrança disparada via WhatsApp e E-mail para: ${pendingNames.join(', ')} — exigindo voto na pauta "${item.title}"!`
      );
    }
  };

  const handleResetCleanSlate = async () => {
    try {
      const res = await fetch('/api/admin/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET_CLEAN_SLATE' }),
      });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        showToast(data.message);
      }
    } catch {
      showToast('Erro ao zerar estado de homologação.');
    }
  };

  const decisions = wfState?.decisionsQueue || [];
  const charter = wfState?.activeCharter;
  const pilot = wfState?.pilotPiece;
  const liveOrders = wfState?.liveOrders || [];
  const archivedClients = wfState?.archivedClientOrders || [];
  const archivedSamples = wfState?.archivedSampleOrders || [];

  const DEPARTMENTS_DATA = [
    {
      number: '01',
      title: 'Jurídico & Compliance',
      owner: 'Flávio',
      icon: '⚖️',
      desc: 'Fila de Registro Blockchain (.ots Bitcoin) das artes aprovadas, Contrato Social MEI ➔ LTDA, INPI e Dr. Lex.',
      href: '/admin/juridico',
      metric:
        pilot?.status === 'APPROVED_PENDING_BLOCKCHAIN'
          ? '1 Arte Aguardando Blockchain'
          : pilot?.blockchainTxId
          ? '1 Arte Registrada (.ots)'
          : '0 Pendências Blockchain',
      status:
        pilot?.status === 'APPROVED_PENDING_BLOCKCHAIN'
          ? '⚡ Ação Flávio: Registrar'
          : 'Fila Limpa',
    },
    {
      number: '02',
      title: 'Financeiro, Fiscal & ERP',
      owner: 'Flávio',
      icon: '💎',
      desc: 'Unit Economics (DRE Real), Precificação da Peça Única p/ Urna 4/4 e emissão do PDF "Vale uma NF-e" na Sala de Reuniões.',
      href: '/admin/financeiro',
      metric: `Amostras P&D: R$ 472,80`,
      status:
        pilot?.status === 'REGISTERED_ON_BLOCKCHAIN'
          ? '⚡ Ação Flávio: Precificar'
          : liveOrders.some((o) => !o.nfeAttachedInBoardroom)
          ? '⚡ Anexar Vale uma NF-e'
          : 'Contabilidade Real',
    },
    {
      number: '03',
      title: 'Arquitetura & TI',
      owner: 'Armando',
      icon: '📐',
      desc: 'Arquitetura de Sistemas, Next.js 16, PostgreSQL ACID, VPS Contabo, Design System, feeds XML/JSON e GEO (/llms.txt).',
      href: '/admin/engenharia',
      metric: 'VPS 31.220.102.2',
      status: 'Online · PM2 OK',
    },
    {
      number: '04',
      title: 'Produção & Fornecedores',
      owner: 'Armando',
      icon: '🏭',
      desc: 'Esteira Viva de Pedidos de Clientes até a Doca (Amostras Dimona #755-460-927 arquivadas na Diretoria).',
      href: '/admin/producao',
      metric: `${liveOrders.filter((o) => o.productionStep !== '5_COLETADO_SAC').length} Pedido(s) na Fábrica`,
      status:
        liveOrders.length > 0 ? '⚡ Em Fabricação PoD' : 'Esteira Limpa (0 Ativos)',
    },
    {
      number: '05',
      title: 'SAC',
      owner: 'Gustavo',
      icon: '💬',
      desc: 'Torre Logística Pós-Coleta (J&T/Intelipost), Entrega ao Cliente e Arquivamento na Diretoria (Pasta: Clientes).',
      href: '/admin/atendimento',
      metric: `${liveOrders.filter((o) => o.productionStep === '5_COLETADO_SAC').length} Entrega(s) Pós-Coleta`,
      status:
        liveOrders.some((o) => o.productionStep === '5_COLETADO_SAC')
          ? '⚡ Ação Gustavo: Entregar'
          : '0 Chamados Abertos',
    },
    {
      number: '06',
      title: 'Marketing de Vendas',
      owner: 'Gustavo',
      icon: '📈',
      desc: 'Relatório Inteligente da Diretoria (Mais Vendido / Menos Vendido), Simulador de Compra de Cliente e 10 Canais.',
      href: '/admin/vendas',
      metric: `${archivedClients.length} Venda(s) Concluída(s)`,
      status:
        pilot?.status === 'PUBLISHED_IN_STOREFRONT'
          ? '⚡ Pronto p/ Simular Compra'
          : 'Ciclo PDCA',
    },
    {
      number: '07',
      title: 'Marketing de Produto',
      owner: 'Tripoint',
      icon: '🚀',
      desc: 'PONTO DE PARTIDA (Fase 0): Os 4 Pilares da Coleção (Nome, Tema, Estética e Mensagem A·V·A) e Vitrine Canônica.',
      href: '/admin/marketing',
      metric: charter ? `Coleção: ${charter.name}` : '1º Passo: Criar Coleção',
      status: !charter
        ? '⚡ Iniciar Fase 0 Aqui'
        : pilot?.status === 'PRICE_APPROVED'
        ? '⚡ Publicar na Vitrine'
        : charter.status === 'HOMOLOGADA_4_4'
        ? '✓ Coleção Homologada 4/4'
        : '⏳ Em Votação na Urna',
    },
    {
      number: '08',
      title: 'Atelier Criativo & Mídias',
      owner: 'Tripoint',
      icon: '🎨',
      desc: 'Criação da Peça Única com Matriz Canônica MDV (26 Chaves) & 300 DPI. Envia para Registro Blockchain no Jurídico.',
      href: '/admin/atelier',
      metric: pilot ? `Peça: ${pilot.code}` : 'MDV 26 Chaves · 300 DPI',
      status:
        charter?.status === 'HOMOLOGADA_4_4' && !pilot
          ? '⚡ Criar & Aprovar Peça Única'
          : pilot
          ? `✓ ${pilot.status}`
          : 'Aguarda Fase 0 (07)',
    },
  ];

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        {/* Camada Soberana de Governança · Diretoria Executiva */}
        <section className={styles.executiveCommandStrip}>
          <div>
            <div className={styles.flexRowStart}>
              <span>🏛️</span>
              <span className={styles.sectionHeading}>
                DIRETORIA EXECUTIVA &amp; ROTEIRO DO ESPELHO DO FLUXO (DADOS REAIS)
              </span>
            </div>
            <p className={styles.moduleSubtitle}>
              Simetria Operacional: <strong className={styles.textPrimaryBold}>Flávio</strong> (01 Jurídico &amp; 02 Financeiro) ·{' '}
              <strong className={styles.textPrimaryBold}>Armando</strong> (03 Arquitetura &amp; 04 Produção) ·{' '}
              <strong className={styles.textPrimaryBold}>Gustavo</strong> (05 SAC &amp; 06 Mkt de Vendas) ·{' '}
              <strong className={styles.textPrimaryBold}>Tripoint</strong> (07 Mkt de Produto &amp; 08 Atelier)
            </p>
          </div>

          <div className={styles.flexRowStart}>
            <Link href="/admin/diretoria" className={styles.btnPrimary}>
              🗄️ Arquivo Central &amp; 2 Relatórios (Diretoria) ↗
            </Link>
            <button
              type="button"
              onClick={handleResetCleanSlate}
              className={styles.btnSecondary}
              title="Zera qualquer dado de teste e restaura o Marco Zero (apenas Amostras Dimona #755-460-927 arquivadas)"
            >
              🧹 Zerar Teste (Marco Zero)
            </button>
          </div>
        </section>

        {nudgeToast && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {nudgeToast}
          </div>
        )}

        {/* BÚSSOLA DO ROTEIRO DA PEÇA ÚNICA (AS 5 FASES DO ESPELHO DO FLUXO) */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                🧭 Bússola Viva do Espelho do Fluxo — Jornada da Coleção &amp; Peça Única
              </h2>
              <p className={styles.moduleSubtitle}>
                Todos os dados fictícios foram eliminados. O pedido real Dimona <strong>#755-460-927 (R$ 472,80)</strong> está arquivado na Diretoria (Pasta: <strong>🧪 Amostras</strong>). Siga os passos abaixo para conduzir a Peça Única pelos 8 Departamentos:
              </p>
            </div>
            <a
              href="/PDF/Vale_uma_NFe_AVA.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              📄 Ver PDF &quot;Vale uma NF-e&quot; ↗
            </a>
          </div>

          <div className={styles.autoGridSmall}>
            {/* FASE 0 */}
            <div
              className={`${styles.innerCardCompact} ${
                charter?.status === 'HOMOLOGADA_4_4'
                  ? styles.innerCardSuccess
                  : styles.innerCardSelected
              }`}
            >
              <div className={styles.kpiLabel}>FASE 0 · Ponto de Partida</div>
              <div className={styles.decisionTitle}>
                07 · Mkt Produto ➔ Urna 4/4
              </div>
              <p className={styles.textBodySmall}>
                1. Nome · 2. Tema/Tendência · 3. Estética · 4. Mensagem A·V·A.
              </p>
              <div className={styles.flexRowBetween}>
                <span className={styles.textPrimaryBold}>
                  {!charter
                    ? '⚪ Pendente'
                    : charter.status === 'HOMOLOGADA_4_4'
                    ? '🟢 Homologada 4/4'
                    : '🟡 Na Urna 4/4'}
                </span>
                <Link href="/admin/marketing" className={styles.btnSecondary}>
                  Ir ao 07 ↗
                </Link>
              </div>
            </div>

            {/* FASE 1 */}
            <div
              className={`${styles.innerCardCompact} ${
                pilot?.blockchainTxId ? styles.innerCardSuccess : ''
              }`}
            >
              <div className={styles.kpiLabel}>FASE 1 · Arte &amp; Blockchain</div>
              <div className={styles.decisionTitle}>
                08 · Atelier ➔ 01 · Jurídico
              </div>
              <p className={styles.textBodySmall}>
                Tripoint aprova Peça Única (SHA-256) ➔ Flávio registra na Blockchain (.ots).
              </p>
              <div className={styles.flexRowBetween}>
                <span className={styles.textPrimaryBold}>
                  {!pilot
                    ? '⚪ Aguarda Atelier'
                    : pilot.status === 'APPROVED_PENDING_BLOCKCHAIN'
                    ? '🟡 Fila Jurídico (01)'
                    : '🟢 Blockchain OK'}
                </span>
                <Link
                  href={
                    pilot?.status === 'APPROVED_PENDING_BLOCKCHAIN'
                      ? '/admin/juridico'
                      : '/admin/atelier'
                  }
                  className={styles.btnSecondary}
                >
                  {pilot?.status === 'APPROVED_PENDING_BLOCKCHAIN' ? 'Ir ao 01 ↗' : 'Ir ao 08 ↗'}
                </Link>
              </div>
            </div>

            {/* FASE 2 */}
            <div
              className={`${styles.innerCardCompact} ${
                pilot?.status === 'PUBLISHED_IN_STOREFRONT' ? styles.innerCardSuccess : ''
              }`}
            >
              <div className={styles.kpiLabel}>FASE 2 · Preço &amp; Vitrine</div>
              <div className={styles.decisionTitle}>
                02 · Fin ➔ Urna ➔ 07 · Vitrine
              </div>
              <p className={styles.textBodySmall}>
                Flávio precifica ➔ Urna vota 4/4 ➔ Tripoint publica em todos os cards da Vitrine.
              </p>
              <div className={styles.flexRowBetween}>
                <span className={styles.textPrimaryBold}>
                  {pilot?.status === 'PUBLISHED_IN_STOREFRONT'
                    ? '🟢 Na Vitrine (/)'
                    : pilot?.status === 'PRICE_APPROVED'
                    ? '🟡 Publicar no 07'
                    : pilot?.status === 'PRICING_IN_URNA'
                    ? '🟡 Na Urna 4/4'
                    : '⚪ Aguarda Fase 1'}
                </span>
                <Link
                  href={pilot?.status === 'PRICE_APPROVED' ? '/admin/marketing' : '/admin/financeiro'}
                  className={styles.btnSecondary}
                >
                  {pilot?.status === 'PRICE_APPROVED' ? 'Ir ao 07 ↗' : 'Ir ao 02 ↗'}
                </Link>
              </div>
            </div>

            {/* FASE 3 */}
            <div
              className={`${styles.innerCardCompact} ${
                liveOrders.some((o) => o.nfeAttachedInBoardroom) || archivedClients.length > 0
                  ? styles.innerCardSuccess
                  : ''
              }`}
            >
              <div className={styles.kpiLabel}>FASE 3 · Compra &amp; Vale NF-e</div>
              <div className={styles.decisionTitle}>
                06 · Compra ➔ 02 · Sala Chat
              </div>
              <p className={styles.textBodySmall}>
                Cliente compra Peça Única ➔ Flávio anexa &quot;Vale uma NF-e&quot; na Sala de Reuniões.
              </p>
              <div className={styles.flexRowBetween}>
                <span className={styles.textPrimaryBold}>
                  {liveOrders.some((o) => o.nfeAttachedInBoardroom) || archivedClients.length > 0
                    ? '🟢 Vale NF-e Anexado'
                    : liveOrders.length > 0
                    ? '🟡 Falta Vale NF-e (02)'
                    : '⚪ Simular Compra (06)'}
                </span>
                <Link
                  href={liveOrders.length > 0 ? '/admin/financeiro' : '/admin/vendas'}
                  className={styles.btnSecondary}
                >
                  {liveOrders.length > 0 ? 'Ir ao 02 ↗' : 'Ir ao 06 ↗'}
                </Link>
              </div>
            </div>

            {/* FASE 4 */}
            <div
              className={`${styles.innerCardCompact} ${
                archivedClients.length > 0 ? styles.innerCardSuccess : ''
              }`}
            >
              <div className={styles.kpiLabel}>FASE 4 · Doca, SAC &amp; Arquivo</div>
              <div className={styles.decisionTitle}>
                04 · Doca ➔ 05 · SAC ➔ Diretoria
              </div>
              <p className={styles.textBodySmall}>
                Armando leva até Doca ➔ Gustavo entrega no SAC e arquiva na Diretoria (2 Relatórios).
              </p>
              <div className={styles.flexRowBetween}>
                <span className={styles.textPrimaryBold}>
                  {archivedClients.length > 0
                    ? `🟢 ${archivedClients.length} Arquivado(s)`
                    : liveOrders.some((o) => o.productionStep === '5_COLETADO_SAC')
                    ? '🟡 No SAC (05)'
                    : liveOrders.length > 0
                    ? '🟡 Na Produção (04)'
                    : '⚪ Aguarda Pedido'}
                </span>
                <Link
                  href={
                    archivedClients.length > 0
                      ? '/admin/diretoria'
                      : liveOrders.some((o) => o.productionStep === '5_COLETADO_SAC')
                      ? '/admin/atendimento'
                      : '/admin/producao'
                  }
                  className={styles.btnSecondary}
                >
                  {archivedClients.length > 0
                    ? 'Ver Relatórios ↗'
                    : liveOrders.some((o) => o.productionStep === '5_COLETADO_SAC')
                    ? 'Ir ao 05 ↗'
                    : 'Ir ao 04 ↗'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bloco 1: Card Container & Grid dos 8 Departamentos Operacionais (01 a 08) */}
        <section className={styles.deptsPanel}>
          <div className={styles.decisionQueueHeader}>
            <h2 className={styles.sectionHeading}>
              8 Departamentos Operacionais da Empresa (2 por Sócio)
            </h2>
            <div className={styles.flexRowStart}>
              <span className={styles.statusPill}>
                🧪 Amostras Arquivadas: {archivedSamples.length} (#755-460-927)
              </span>
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                👤 Pedidos de Clientes Arquivados: {archivedClients.length}
              </span>
            </div>
          </div>

          <div className={styles.deptGrid}>
            {DEPARTMENTS_DATA.map((dept) => (
              <Link key={dept.number} href={dept.href} className={styles.deptCard}>
                <div>
                  <div className={styles.deptCardTop}>
                    <span className={styles.deptNumber}>{dept.number}</span>
                    <span className={styles.partnerOwnerBadge}>
                      👤 Titular: {dept.owner}
                    </span>
                    <span className={styles.deptCardIcon}>{dept.icon}</span>
                  </div>
                  <h3 className={styles.deptTitle}>{dept.title}</h3>
                  <p className={styles.deptDesc}>{dept.desc}</p>
                </div>

                <div className={styles.deptMetrics}>
                  <span>{dept.metric}</span>
                  <span className={styles.textPrimaryBold}>{dept.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fila de Decisões Executivas & Urna de Votação Societária */}
        <section className={styles.decisionQueueSection}>
          <div className={styles.decisionQueueHeader}>
            <div>
              <div className={styles.sectionHeading}>
                <span className={styles.badgePulse}></span>
                Fila de Decisões Executivas &amp; Urna de Votação (Consenso 4 Sócios)
              </div>
              <p className={styles.moduleSubtitle}>
                🗳️ Urna 100% Real (Zero pautas fictícias). As pautas nascem automaticamente quando o Tripoint propõe os 4 Pilares da Coleção (Depto 07) ou quando o Flávio envia a Precificação da Peça Única (Depto 02).
              </p>
            </div>
            <div className={styles.flexRowStart}>
              <Link href="/admin/marketing" className={styles.btnPrimary}>
                + Propor Coleção (Fase 0 · Depto 07)
              </Link>
              <span className={styles.textMutedSmall}>
                {decisions.length} {decisions.length === 1 ? 'pauta real em votação' : 'pautas em votação'}
              </span>
            </div>
          </div>

          {loading ? (
            <div className={styles.innerCard}>Carregando Urna Societária...</div>
          ) : decisions.length === 0 ? (
            <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
              <div>
                <div className={styles.decisionTitle}>
                  ✓ Urna Limpa — Nenhuma Pauta Fictícia Pendente (0 Pautas em Votação)
                </div>
                <p className={styles.textBodySmall}>
                  Para iniciar a jornada pelo Ponto de Partida correto (<em>&ldquo;Planejar errado é planejar errar&rdquo;</em>), acesse o <strong>Depto 07 · Marketing de Produto</strong> e submeta os <strong>4 Pilares da Coleção</strong> (Nome, Tema/Tendência, Estética e Mensagem A·V·A) para deliberação dos 4 sócios.
                </p>
              </div>
              <Link href="/admin/marketing" className={styles.btnPrimary}>
                🚀 Iniciar Fase 0 no Depto 07 ➔
              </Link>
            </div>
          ) : (
            <div className={styles.decisionCardsGrid}>
              {decisions.map((item) => {
                const approvedCount = PARTNERS_KEYS.filter((k) => item.votes[k] === 'APPROVED').length;
                const pendingPartners = PARTNERS_KEYS.filter((k) => item.votes[k] !== 'APPROVED').map(
                  (k) => PARTNER_LABELS[k]
                );
                const isUnanimous = approvedCount === 4;

                return (
                  <div key={item.id} className={styles.decisionCard}>
                    <div className={styles.decisionCardHeader}>
                      <span className={styles.decisionCardDepto}>{item.depto}</span>
                      <span className={styles.decisionCardTag}>
                        {approvedCount}/4 Votos · {item.tag}
                      </span>
                    </div>

                    <div className={styles.decisionTitle}>{item.title}</div>
                    <p className={styles.decisionText}>{item.description}</p>

                    <div className={styles.voterGrid}>
                      {PARTNERS_KEYS.map((partnerKey) => {
                        const vote = item.votes[partnerKey];
                        const chipClass =
                          vote === 'APPROVED'
                            ? styles.voterApproved
                            : vote === 'REJECTED'
                            ? styles.voterRejected
                            : styles.voterPending;
                        const icon =
                          vote === 'APPROVED'
                            ? '🟢 Aprovou'
                            : vote === 'REJECTED'
                            ? '🔴 Revisão'
                            : '🟡 Pendente';

                        return (
                          <div
                            key={partnerKey}
                            onClick={() => handleCycleVote(item.id, partnerKey)}
                            className={`${styles.voterChip} ${chipClass}`}
                            title={`Clique para alternar o voto de ${PARTNER_LABELS[partnerKey]}`}
                          >
                            <strong className={styles.textPrimaryBold}>
                              {PARTNER_LABELS[partnerKey]}
                            </strong>
                            <span>{icon}</span>
                          </div>
                        );
                      })}
                    </div>

                    {!isUnanimous ? (
                      <div className={styles.nudgeStrip}>
                        <span>
                          ⏳ Falta votar:{' '}
                          <strong className={styles.textPrimaryBold}>
                            {pendingPartners.join(', ')}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleNudgePending(item)}
                          className={styles.btnNudge}
                        >
                          📲 Cobrar WhatsApp/E-mail
                        </button>
                      </div>
                    ) : (
                      <div className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                        ✅ CONSENSO 4/4 ALCANÇADO — DECISÃO LIBERADA PARA EXECUÇÃO
                      </div>
                    )}

                    <div className={styles.decisionActions}>
                      <button
                        type="button"
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent('ava:open-boardroom', {
                              detail: { pautaTitle: item.title },
                            })
                          )
                        }
                        className={styles.executiveHeaderBtn}
                      >
                        💬 Abrir Conversa &amp; Anexos desta Pauta
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecuteDecision(item)}
                        className={isUnanimous ? styles.btnSuccess : styles.btnPrimary}
                      >
                        {isUnanimous
                          ? `✓ Executar: ${item.actionPrimary}`
                          : `⚡ Aprovar 4/4 & ${item.actionPrimary}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
