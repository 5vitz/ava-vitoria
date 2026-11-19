'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    depto: '03 · Produção & Fornecedores (Armando)',
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
    title: 'Transição Societária MEI ➔ LTDA (Contrato 4 Sócios · 25% cada)',
    description:
      'Teto do MEI estoura com apenas 38 camisetas/mês. Votação da minuta do Contrato Social igualitário (25% por sócio) e migração para Simples Nacional Anexo I.',
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
    depto: '05 · Vendas (Gustavo) & 06 · Marketing (Tripoint)',
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
    title: 'Engenharia & TI',
    owner: 'Armando',
    icon: '⚙️',
    desc: 'Arquitetura Next.js 16, PostgreSQL ACID, VPS Contabo, Sentinel Security, feeds XML/JSON e GEO (/llms.txt).',
    href: '/admin/engenharia',
    metric: 'VPS 31.220.102.2',
    status: 'Online · PM2 OK'
  },
  {
    number: '03',
    title: 'Produção & Fornecedores',
    owner: 'Armando',
    icon: '🏭',
    desc: 'Hub Multi-Supplier (Dimona/Reserva), controle de amostras físicas (#755-460-927), auditoria 2h e estoque físico.',
    href: '/admin/producao',
    metric: '6 Amostras PoD',
    status: 'PIX Pago · Em Prod'
  },
  {
    number: '04',
    title: 'Atendimento & SAC',
    owner: 'Gustavo',
    icon: '💬',
    desc: 'Concierge IA 24/7 na loja, Agente Discriminador (CDC Art. 49 vs Garantia PoD) e transbordo Zagueiro-Artilheiro.',
    href: '/admin/atendimento',
    metric: 'SLA < 2 Horas',
    status: 'Zero Omissão'
  },
  {
    number: '05',
    title: 'Vendas & Canais',
    owner: 'Gustavo',
    icon: '📈',
    desc: 'Análise de tráfego e conversão, relacionamento com os 10 Canais de Venda/Marketplaces e gestão de impulsionamento (ROAS).',
    href: '/admin/vendas',
    metric: '10 Canais Ativos',
    status: 'Funil & Tráfego'
  },
  {
    number: '06',
    title: 'Marketing & Branding',
    owner: 'Tripoint',
    icon: '🚀',
    desc: 'Estrategista Trios 3x3 Balenciaga no Instagram (9:16), posicionamento de marca e campanha viral "Eu Tenho Cupom!".',
    href: '/admin/marketing',
    metric: 'Grid 3x3 9:16',
    status: 'Branding Luxo'
  },
  {
    number: '07',
    title: 'Atelier Criativo & Mídias',
    owner: 'Tripoint',
    icon: '🎨',
    desc: 'Projetos & Coleções (★ Vitrine Ativa), Biblioteca de Mídias 9:16 e Artes Matrizes 300 DPI com prontuário MDV 26.',
    href: '/admin/atelier',
    metric: '300 DPI · MDV 26',
    status: 'Curadoria Ativa'
  },
  {
    number: '08',
    title: 'Financeiro, Fiscal & ERP',
    owner: 'Flávio',
    icon: '💎',
    desc: 'Unit Economics (DRE), Conector Fiscal Bling ERP v3, Chave de 2 Posições e simulador de Precificação para votação 4/4.',
    href: '/admin/financeiro',
    metric: 'Margem Alvo 58%',
    status: 'Urna de Preços'
  }
];

const PARTNERS_KEYS: (keyof PartnerVotes)[] = ['Armando', 'Flavio', 'Tripoint', 'Gustavo'];

const PARTNER_LABELS: Record<keyof PartnerVotes, string> = {
  Armando: 'Armando',
  Flavio: 'Flávio',
  Tripoint: 'Tripoint',
  Gustavo: 'Gustavo'
};

export default function AdminCockpitClient() {
  const [decisions, setDecisions] = useState<DecisionItem[]>(INITIAL_DECISIONS);
  const [selectedAgent, setSelectedAgent] = useState<AgentDossier | null>(null);
  const [nudgeToast, setNudgeToast] = useState<string | null>(null);

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
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#000000' }}>
                Camada Soberana · Diretoria Executiva (Conselho dos 4 Sócios · 25% Cada)
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#3F3F46', margin: 0 }}>
              Simetria Operacional: <strong style={{ color: '#000000' }}>Armando</strong> (02 Engenharia &amp; 03 Produção) · <strong style={{ color: '#000000' }}>Flávio</strong> (01 Jurídico &amp; 08 Financeiro) · <strong style={{ color: '#000000' }}>Tripoint</strong> (06 Marketing &amp; 07 Atelier) · <strong style={{ color: '#000000' }}>Gustavo</strong> (04 Atendimento &amp; 05 Vendas)
            </p>
          </div>

          <Link
            href="/admin/diretoria"
            className={styles.executiveHeaderBtn}
            style={{ padding: '8px 14px' }}
          >
            Abrir Sala do Conselho &amp; Governança ↗
          </Link>
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
                🗳️ Pautas estratégicas e de Precificação exigem consenso. Clique no crachá do sócio para registrar voto ou dispare cobrança por WhatsApp e E-mail.
              </p>
            </div>
            <span style={{ fontSize: '11px', color: '#3F3F46', fontWeight: 600 }}>
              {decisions.length} pautas em votação
            </span>
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

                  <div className={styles.decisionActions} style={{ marginTop: '6px' }}>
                    <button
                      onClick={() => handleResolve(item.id)}
                      className={styles.btnPrimary}
                      style={{
                        background: isUnanimous ? '#059669' : '#000000',
                        color: isUnanimous ? '#FFFFFF' : '#DFCFA8'
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
