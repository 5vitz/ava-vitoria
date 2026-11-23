'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import AdminHeader from './AdminHeader';
import styles from './admin-cockpit.module.css';
import { AGENTS_DOSSIER, AgentDossier } from './agentDossierData';
import AgentDossierModal from './AgentDossierModal';

type VoteState = 'APPROVED' | 'PENDING' | 'REJECTED';

interface PartnerVotes {
  Armando: VoteState;
  Flavio: VoteState;
  Tripoint: VoteState;
  Gustavo: VoteState;
}

interface DecisionItem {
  id: string;
  depto: string;
  tag: string;
  title: string;
  description: string;
  actionPrimary: string;
  timeAgo: string;
  votes: PartnerVotes;
  lastNudge?: string;
}

const INITIAL_DECISIONS: DecisionItem[] = [
  {
    id: 'DEC-PRICE-01',
    depto: 'Urna Colegiada · Precificação & Margem',
    tag: 'Consenso 4/4 Obrigatório',
    title: 'Homologação de Preço & Margem: T-Shirt Prime (60%) + Chave Posição 2',
    description:
      'Custo PoD Dimona (Frente+Costas Silk HD): R$ 67,90 ➔ Preço Vitrine Proposto: R$ 169,75 (Lucro Líquido Real: R$ 85,73/peça após Simples 6% e Gateway 3,5%). Regra: Preço baixo morre na praia; preço alto não sai do lugar.',
    actionPrimary: 'Homologar Precificação na Vitrine',
    timeAgo: 'Em votação na esteira',
    votes: {
      Armando: 'APPROVED',
      Flavio: 'APPROVED',
      Tripoint: 'PENDING',
      Gustavo: 'PENDING'
    }
  },
  {
    id: 'DEC-POD-02',
    depto: '04 · Produção & Fornecedores (Armando)',
    tag: 'Lote Piloto #755-460-927',
    title: 'Conferência das 6 Amostras Físicas Dimona (Frente + Costas)',
    description:
      'Pedido pago via PIX (R$ 342,35). Assim que a caixa física chegar, os 4 sócios votam a aprovação do toque da malha, caimento e resistência do Silk HD após lavagem.',
    actionPrimary: 'Homologar Qualidade Fabril',
    timeAgo: 'Aguardando entrega física',
    votes: {
      Armando: 'APPROVED',
      Flavio: 'PENDING',
      Tripoint: 'APPROVED',
      Gustavo: 'PENDING'
    }
  },
  {
    id: 'DEC-JUR-03',
    depto: '01 · Jurídico & Compliance (Flávio)',
    tag: 'Gatilho Fiscal 38 Peças/Mês',
    title: 'Transição Societária MEI ➔ LTDA (Minuta do Contrato Social)',
    description:
      'Teto do MEI estoura com apenas 38 camisetas/mês. Votação da minuta do Contrato Social consolidado da sociedade e migração para Simples Nacional Anexo I.',
    actionPrimary: 'Autorizar Abertura LTDA',
    timeAgo: 'Prioridade pré-inauguração',
    votes: {
      Armando: 'APPROVED',
      Flavio: 'APPROVED',
      Tripoint: 'APPROVED',
      Gustavo: 'PENDING'
    }
  },
  {
    id: 'DEC-MKT-04',
    depto: '06 · Vendas (Gustavo) & 07 · Marketing (Tripoint)',
    tag: 'Campanha & Tráfego',
    title: 'Ativação da Campanha "EU TENHO CUPOM!" (Estoque Físico 10% a 50% OFF)',
    description:
      'Escoamento do estoque físico antigo via Vitrine Secreta por senhas prefixadas (1 a 5), preservando o preço cheio da Nova Coleção PoD na vitrine principal.',
    actionPrimary: 'Liberar Campanha & Tráfego',
    timeAgo: 'Pronto para disparo',
    votes: {
      Armando: 'APPROVED',
      Flavio: 'PENDING',
      Tripoint: 'APPROVED',
      Gustavo: 'APPROVED'
    }
  }
];

const DEPARTMENTS_DATA = [
  {
    number: '01',
    title: 'Jurídico & Compliance',
    owner: 'Flávio',
    icon: '⚖️',
    desc: 'Contrato Social dos 4 Sócios, transição MEI ➔ LTDA, blindagem INPI, termos CDC/LGPD e assistente Dr. Lex.',
    href: '/admin/juridico',
    metric: '14 Docs Legais',
    status: 'Alerta MEI (38 pçs)'
  },
  {
    number: '02',
    title: 'Financeiro, Fiscal & ERP',
    owner: 'Flávio',
    icon: '💎',
    desc: 'Unit Economics (DRE), Conector Fiscal Bling ERP v3, Chave de 2 Posições e simulador de Precificação para votação 4/4.',
    href: '/admin/financeiro',
    metric: 'Margem Alvo 58%',
    status: 'Urna de Preços'
  },
  {
    number: '03',
    title: 'Arquitetura & TI',
    owner: 'Armando',
    icon: '📐',
    desc: 'Arquitetura de Sistemas, Next.js 16, PostgreSQL ACID, VPS Contabo, Design System, feeds XML/JSON e GEO (/llms.txt).',
    href: '/admin/engenharia',
    metric: 'VPS 31.220.102.2',
    status: 'Online · PM2 OK'
  },
  {
    number: '04',
    title: 'Produção & Fornecedores',
    owner: 'Armando',
    icon: '🏭',
    desc: 'Hub Multi-Supplier (Dimona/Reserva), controle de amostras físicas (#755-460-927), auditoria 2h e estoque físico.',
    href: '/admin/producao',
    metric: '6 Amostras PoD',
    status: 'PIX Pago · Em Prod'
  },
  {
    number: '05',
    title: 'SAC',
    owner: 'Gustavo',
    icon: '💬',
    desc: 'Concierge IA 24/7 na loja, Agente Discriminador (CDC Art. 49 vs Garantia PoD) e gatilho BPO (5 atendimentos humanos).',
    href: '/admin/atendimento',
    metric: '98% IA · BPO N1',
    status: 'Zero Omissão'
  },
  {
    number: '06',
    title: 'Marketing de Vendas',
    owner: 'Gustavo',
    icon: '📈',
    desc: 'Análise de KPIs de tráfego, plano de investimentos estratégicos (ROAS), votação 4/4 e performance dos 10 Canais.',
    href: '/admin/vendas',
    metric: '10 Canais · ROAS',
    status: 'Ciclo PDCA'
  },
  {
    number: '07',
    title: 'Marketing de Produto',
    owner: 'Tripoint',
    icon: '🚀',
    desc: 'Estratégia da Coleção, tema das estampas e Visual Merchandising no Instagram (Trios 3x3 9:16) e Vitrine Canônica.',
    href: '/admin/marketing',
    metric: 'Grid 3x3 9:16',
    status: 'Visual Merch'
  },
  {
    number: '08',
    title: 'Atelier Criativo & Mídias',
    owner: 'Tripoint',
    icon: '🎨',
    desc: 'Projetos & Coleções (★ Vitrine Ativa), Biblioteca de Mídias 9:16 e Artes Matrizes 300 DPI com prontuário MDV 26.',
    href: '/admin/atelier',
    metric: '300 DPI · MDV 26',
    status: 'Curadoria Ativa'
  }
];

const PARTNERS_KEYS: (keyof PartnerVotes)[] = ['Armando', 'Flavio', 'Tripoint', 'Gustavo'];

const PARTNER_LABELS: Record<keyof PartnerVotes, string> = {
  Armando: 'Armando',
  Flavio: 'Flávio',
  Tripoint: 'Tripoint',
  Gustavo: 'Gustavo'
};

const PARTNER_PRESENCE_ORDER: { key: keyof PartnerVotes; name: string; username: string }[] = [
  { key: 'Flavio', name: 'Flávio', username: 'flavio' },
  { key: 'Armando', name: 'Armando', username: 'armando' },
  { key: 'Gustavo', name: 'Gustavo', username: 'gustavo' },
  { key: 'Tripoint', name: 'Tripoint', username: 'tripoint' },
];

export default function AdminCockpitClient() {
  const [decisions, setDecisions] = useState<DecisionItem[]>(INITIAL_DECISIONS);
  const [selectedAgent, setSelectedAgent] = useState<AgentDossier | null>(null);
  const [nudgeToast, setNudgeToast] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        const u = ((session.user as any).username || session.user.name || '').toLowerCase();
        setCurrentUsername(u);
      }
    });

    const pingPresence = async () => {
      try {
        const res = await fetch('/api/presence/ping', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.onlineUsers)) {
            setOnlineUsers(data.onlineUsers);
          }
        }
      } catch {
        // Silencioso em caso de oscilação de rede
      }
    };

    pingPresence();
    const interval = setInterval(pingPresence, 45000); // Heartbeat a cada 45 segundos

    return () => clearInterval(interval);
  }, []);

  const handleResolve = (id: string) => {
    setDecisions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCycleVote = (decisionId: string, partner: keyof PartnerVotes) => {
    const nextState: Record<VoteState, VoteState> = {
      PENDING: 'APPROVED',
      APPROVED: 'REJECTED',
      REJECTED: 'PENDING'
    };

    setDecisions((prev) =>
      prev.map((item) => {
        if (item.id !== decisionId) return item;
        return {
          ...item,
          votes: {
            ...item.votes,
            [partner]: nextState[item.votes[partner]]
          }
        };
      })
    );
  };

  const handleNudgePending = (item: DecisionItem) => {
    const pendingNames = PARTNERS_KEYS.filter((k) => item.votes[k] !== 'APPROVED').map(
      (k) => PARTNER_LABELS[k]
    );

    if (pendingNames.length === 0) {
      setNudgeToast(`✅ Todos os 4 sócios já aprovaram a pauta "${item.title}"!`);
    } else {
      const msg = `📲 Cobrança disparada via WhatsApp e E-mail para: ${pendingNames.join(', ')} — exigindo voto na pauta "${item.title}"!`;
      setNudgeToast(msg);
      setDecisions((prev) =>
        prev.map((d) =>
          d.id === item.id
            ? { ...d, lastNudge: `Cobrança WhatsApp/E-mail enviada para ${pendingNames.join(', ')} agora mesmo` }
            : d
        )
      );
    }

    setTimeout(() => setNudgeToast(null), 5500);
  };

  const totalAgents = Object.keys(AGENTS_DOSSIER).length;

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        {/* Camada Soberana de Governança · Diretoria Executiva */}
        <section className={styles.executiveCommandStrip}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🏛️</span>
              <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#000000' }}>
                DIRETORIA EXECUTIVA
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#3F3F46', margin: 0 }}>
              Simetria Operacional: <strong style={{ color: '#000000' }}>Flávio</strong> (01 Jurídico &amp; 02 Financeiro) · <strong style={{ color: '#000000' }}>Armando</strong> (03 Arquitetura &amp; 04 Produção) · <strong style={{ color: '#000000' }}>Gustavo</strong> (05 SAC &amp; 06 Mkt de Vendas) · <strong style={{ color: '#000000' }}>Tripoint</strong> (07 Mkt de Produto &amp; 08 Atelier)
            </p>
          </div>

          {/* Presença em Tempo Real da Diretoria Executiva */}
          <div className={styles.executivePresenceArea}>
            <div className={styles.partnerStatusList}>
              {PARTNER_PRESENCE_ORDER.map((partner) => {
                const isOnline =
                  onlineUsers.includes(partner.username) ||
                  (partner.username === 'armando' && onlineUsers.includes('admin')) ||
                  currentUsername === partner.username ||
                  (currentUsername === 'admin' && partner.username === 'armando');

                const ledClass = isOnline ? styles.ledOnline : styles.ledOffline;
                const tooltip = isOnline
                  ? `${partner.name}: Conectado agora no Painel`
                  : `${partner.name}: Desconectado`;

                return (
                  <div
                    key={partner.key}
                    className={styles.partnerStatusChip}
                    title={tooltip}
                  >
                    <span className={`${styles.ledDot} ${ledClass}`}></span>
                    <span>{partner.name}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('ava:open-boardroom', {
                    detail: { createNewLocked: true },
                  })
                )
              }
              className={styles.executiveHeaderBtn}
              style={{ padding: '8px 14px', cursor: 'pointer' }}
            >
              🚨 CONVOCAR REUNIÃO / NOVA PAUTA
            </button>
          </div>
        </section>

        {/* Bloco 1: Card Container & Grid dos 8 Departamentos Operacionais (01 a 08) */}
        <section className={styles.deptsPanel}>
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className={styles.sectionHeading}>
              8 Departamentos Operacionais da Empresa (2 por Sócio)
            </h2>
            <Link href="/admin/atelier" style={{ fontSize: '11px', color: '#18181B', fontWeight: 600, textDecoration: 'underline' }}>
              Acessar Atelier &amp; Gestão de Coleções ↗
            </Link>
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
                  <h3 className={styles.deptTitle} style={{ marginTop: '8px' }}>{dept.title}</h3>
                  <p className={styles.deptDesc}>{dept.desc}</p>
                </div>

                <div className={styles.deptMetrics}>
                  <span>{dept.metric}</span>
                  <span style={{ color: '#111113', fontWeight: 700 }}>{dept.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fila de Decisões Executivas & Urna de Votação Societária (Bloco 2 Uniformizado em Palha Escuro) */}
        <section className={styles.decisionQueueSection}>
          <div className={styles.decisionQueueHeader}>
            <div>
              <div className={styles.sectionHeading}>
                <span className={styles.badgePulse}></span>
                Fila de Decisões Executivas &amp; Urna de Votação (Consenso 4 Sócios)
              </div>
              <p style={{ fontSize: '11px', color: '#3F3F46', marginTop: '4px' }}>
                🗳️ Pautas estratégicas e de Precificação exigem consenso. Clique no crachá do sócio para registrar voto, abra a Sala de Reuniões da pauta ou dispare cobrança por WhatsApp e E-mail.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className={styles.executiveHeaderBtn}
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('ava:open-boardroom', {
                      detail: { createNewLocked: true },
                    })
                  )
                }
              >
                + Nova Pauta / Reunião
              </button>
              <span style={{ fontSize: '11px', color: '#3F3F46', fontWeight: 600 }}>
                {decisions.length} pautas em votação
              </span>
            </div>
          </div>

          {nudgeToast && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.08)',
                border: '1px solid #000000',
                color: '#000000',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '16px'
              }}
            >
              {nudgeToast}
            </div>
          )}

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

                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#000000' }}>{item.title}</div>
                  <p className={styles.decisionText}>{item.description}</p>

                  {/* Crachás de Votação dos 4 Sócios */}
                  <div className={styles.voterGrid}>
                    {PARTNERS_KEYS.map((partnerKey) => {
                      const vote = item.votes[partnerKey];
                      const chipClass =
                        vote === 'APPROVED'
                          ? styles.voterApproved
                          : vote === 'REJECTED'
                          ? styles.voterRejected
                          : styles.voterPending;
                      const icon = vote === 'APPROVED' ? '🟢 Aprovou' : vote === 'REJECTED' ? '🔴 Revisão' : '🟡 Pendente';

                      return (
                        <div
                          key={partnerKey}
                          onClick={() => handleCycleVote(item.id, partnerKey)}
                          className={`${styles.voterChip} ${chipClass}`}
                          title={`Clique para alternar o voto de ${PARTNER_LABELS[partnerKey]}`}
                        >
                          <strong style={{ fontSize: '10px', color: '#000000', marginBottom: '2px' }}>
                            {PARTNER_LABELS[partnerKey]}
                          </strong>
                          <span>{icon}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barra de Cobrança Automática WhatsApp / E-mail */}
                  {!isUnanimous ? (
                    <div className={styles.nudgeStrip}>
                      <span>
                        ⏳ Falta votar: <strong style={{ color: '#000000' }}>{pendingPartners.join(', ')}</strong>
                        {item.lastNudge ? ` · (${item.lastNudge})` : ' · Régua WhatsApp/E-mail a cada 2h'}
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
                    <div
                      style={{
                        padding: '8px 10px',
                        background: 'rgba(5, 150, 105, 0.16)',
                        border: '1px solid #059669',
                        color: '#065F46',
                        fontSize: '11px',
                        fontWeight: 700,
                        marginTop: '4px'
                      }}
                    >
                      ✅ CONSENSO 4/4 ALCANÇADO — DECISÃO LIBERADA PARA EXECUÇÃO
                    </div>
                  )}

                  <div className={styles.decisionActions} style={{ marginTop: '6px', flexWrap: 'wrap' }}>
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
                      onClick={() => handleResolve(item.id)}
                      className={styles.btnPrimary}
                      style={{
                        background: isUnanimous ? '#059669' : undefined,
                        color: isUnanimous ? '#FFFFFF' : '#FAF6EE'
                      }}
                    >
                      {isUnanimous ? `✓ ${item.actionPrimary}` : `${item.actionPrimary} (${approvedCount}/4)`}
                    </button>
                    <button onClick={() => handleResolve(item.id)} className={styles.btnSecondary}>
                      Arquivar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Painel de Telemetria dos Agentes da Mesa Redonda */}
        <section className={styles.agentsPanel}>
          <div className={styles.agentsPanelHeader}>
            <div>
              <h2 className={styles.sectionHeading}>
                Telemetria dos {totalAgents} Agentes de IA da Mesa Redonda
              </h2>
              <p style={{ fontSize: '11px', color: '#52525B', marginTop: '3px' }}>
                💡 Clique em qualquer agente para ver o Dossiê de Ajuda (O que faz, Por que faz, Como faz e Economia).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
                <span className={styles.agentStatusDotActive}></span> Em Atividade
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 600 }}>
                <span className={styles.agentStatusDotStandby}></span> Em Prontidão (Stand-by)
              </span>
            </div>
          </div>

          <div className={styles.agentsGrid}>
            {Object.values(AGENTS_DOSSIER).map((agent) => (
              <div
                key={agent.id}
                className={styles.agentBadge}
                onClick={() => setSelectedAgent(agent)}
                title={`Clique para abrir o Dossiê e Economia de ${agent.name}`}
              >
                <span
                  className={
                    agent.status === 'ACTIVE'
                      ? styles.agentStatusDotActive
                      : styles.agentStatusDotStandby
                  }
                ></span>
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>{agent.name}</span>
                  <span className={styles.agentRole}>{agent.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal do Dossiê do Agente */}
      {selectedAgent && (
        <AgentDossierModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
