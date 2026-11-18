'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from './AdminHeader';
import AgentDossierModal from './AgentDossierModal';
import { AGENTS_DOSSIER, AgentDossier } from './agentDossierData';
import styles from './admin-cockpit.module.css';

interface DecisionItem {
  id: string;
  depto: string;
  tag: string;
  title: string;
  description: string;
  timeAgo: string;
  actionPrimary: string;
  actionSecondary?: string;
  resolved?: boolean;
}

const INITIAL_DECISIONS: DecisionItem[] = [
  {
    id: 'dec-1',
    depto: 'Depto 04 · Produção & Amostras',
    tag: 'Amostras Físicas Dimona',
    title: 'Pedido de Amostras #755-460-927 Pago via PIX',
    description: 'Lote de 6 peças físicas confirmado (Oversized, Prime 180g, Estonada, Quality e 2 Bonés). Rastreio e fotos serão disponibilizados para avaliação dos 4 sócios assim que a transportadora coletar na fábrica.',
    timeAgo: 'Hoje às 02:11',
    actionPrimary: 'Ver Detalhes do Pedido',
  },
  {
    id: 'dec-2',
    depto: 'Depto 08 · Financeiro & Precificação',
    tag: 'Auditoria 2h Multi-Supplier',
    title: 'Catálogo Dimona & Reserva INK Sincronizados',
    description: 'Inspeção preventiva confirmou estabilidade das tabelas de custos base. Margens por categoria operando em regime de indexação contínua.',
    timeAgo: 'Há 12 min',
    actionPrimary: 'Inspecionar Margens',
  },
  {
    id: 'dec-3',
    depto: 'Depto 02 · Jurídico & Compliance',
    tag: 'Planejamento Fiscal',
    title: 'Transição Societária MEI ➔ LTDA (Simples Nacional)',
    description: 'Diagnóstico concluído: limite de 38 peças/mês do MEI exige protocolo de transformação para formalizar os 4 sócios e desbloquear Dafiti e Reserva.',
    timeAgo: 'Pendente Diretoria',
    actionPrimary: 'Acessar Checklist Fiscal',
  }
];

const DEPARTMENTS_DATA = [
  {
    number: '01',
    title: 'Diretoria Executiva',
    icon: '🏛️',
    desc: 'Conselho dos 4 Sócios, metas comerciais de inauguração (01/Dezembro), Scorecard e Maestro Lincoln.',
    href: '/admin/diretoria',
    metric: '4 Sócios Conectados',
    status: 'Conselho Ativo'
  },
  {
    number: '02',
    title: 'Jurídico & Compliance',
    icon: '⚖️',
    desc: 'Contrato Social dos 4 Sócios, transição MEI ➔ LTDA, registro no INPI e Chat Consultivo Dr. Lex.',
    href: '/admin/juridico',
    metric: '14 Itens Checklist',
    status: 'Em Transição'
  },
  {
    number: '03',
    title: 'Engenharia & TI',
    icon: '⚡',
    desc: 'Telemetria da VPS Contabo (31.220.102.2), PostgreSQL, rota /llms.txt, Design System e Portaria.',
    href: '/admin/engenharia',
    metric: 'VPS Contabo 100% OK',
    status: 'SSL Ativo'
  },
  {
    number: '04',
    title: 'Produção & Fornecedores',
    icon: '📦',
    desc: 'Kanban PoD, comparativo de amostras físicas Dimona vs Reserva, hub multi-supplier e estoque físico.',
    href: '/admin/producao',
    metric: 'Pedido #755-460-927',
    status: '6 Amostras na Linha'
  },
  {
    number: '05',
    title: 'Atendimento & SAC',
    icon: '🛡️',
    desc: 'Agente Discriminador (CDC 49 vs Garantia PoD) e Escalada Anti-Omissão com transbordo aos 4 sócios.',
    href: '/admin/atendimento',
    metric: 'Concierge 24/7',
    status: 'SLA Zero Omissão'
  },
  {
    number: '06',
    title: 'Marketing & Vendas',
    icon: '🚀',
    desc: 'Postagens em Trios 3x3 no Instagram (Balenciaga), Feed Meta XML e Campanha "EU TENHO CUPOM!".',
    href: '/admin/marketing',
    metric: '10 Canais Ativos',
    status: 'Pronto para Inauguração'
  },
  {
    number: '07',
    title: 'Atelier Criativo & Mídias',
    icon: '🎨',
    desc: 'Matrizes 300 DPI (Dimona/Reserva), Prompts MDV 26 chaves, Biblioteca de 9 Colunas e Projetos/Coleções.',
    href: '/admin/atelier',
    metric: '3 Abas Unificadas',
    status: 'Estúdio Autoral'
  },
  {
    number: '08',
    title: 'Financeiro & Precificação',
    icon: '💎',
    desc: 'Painel de margens por categoria, Chave de 2 Posições, DRE Gerencial e Conector Bling ERP v3.',
    href: '/admin/financeiro',
    metric: 'Margem Média 58%',
    status: 'Indexação Ativa'
  }
];

export default function AdminCockpitClient() {
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [selectedAgent, setSelectedAgent] = useState<AgentDossier | null>(null);

  const handleResolve = (id: string) => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        {/* Grid dos 8 Departamentos */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className={styles.sectionHeading}>Departamentos Operacionais da Empresa</h2>
            <Link href="/admin/atelier" style={{ fontSize: '11px', color: '#FFFFFF', textDecoration: 'underline' }}>
              Acessar Atelier & Gestão de Coleções ↗
            </Link>
          </div>

          <div className={styles.deptGrid}>
            {DEPARTMENTS_DATA.map(dept => (
              <Link key={dept.number} href={dept.href} className={styles.deptCard}>
                <div>
                  <div className={styles.deptCardTop}>
                    <span className={styles.deptNumber}>{dept.number}</span>
                    <span className={styles.deptCardIcon}>{dept.icon}</span>
                  </div>
                  <h3 className={styles.deptTitle}>{dept.title}</h3>
                  <p className={styles.deptDesc}>{dept.desc}</p>
                </div>

                <div className={styles.deptMetrics}>
                  <span>{dept.metric}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{dept.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fila de Decisões Executivas */}
        <section className={styles.decisionQueueSection}>
          <div className={styles.decisionQueueHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.badgePulse}></span>
              Fila de Decisões Executivas
            </div>
            <span style={{ fontSize: '11px', color: '#A0A0A5' }}>
              {decisions.length} pendências ativas
            </span>
          </div>

          <div className={styles.decisionCardsGrid}>
            {decisions.map(item => (
              <div key={item.id} className={styles.decisionCard}>
                <div className={styles.decisionCardHeader}>
                  <span className={styles.decisionCardDepto}>{item.depto}</span>
                  <span className={styles.decisionCardTag}>{item.tag}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#FFFFFF' }}>{item.title}</div>
                <p className={styles.decisionText}>{item.description}</p>
                <div style={{ fontSize: '11px', color: '#8E8F94' }}>{item.timeAgo}</div>
                <div className={styles.decisionActions}>
                  <button onClick={() => handleResolve(item.id)} className={styles.btnPrimary}>
                    {item.actionPrimary}
                  </button>
                  <button onClick={() => handleResolve(item.id)} className={styles.btnSecondary}>
                    Arquivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Painel de Telemetria dos 20 Agentes */}
        <section className={styles.agentsPanel}>
          <div className={styles.agentsPanelHeader}>
            <div>
              <h2 className={styles.sectionHeading}>Telemetria dos 20 Agentes de IA da Mesa Redonda</h2>
              <p style={{ fontSize: '11px', color: '#8E8F94', marginTop: '3px' }}>
                💡 Clique em qualquer agente para ver o Dossiê de Ajuda (O que faz, Por que faz, Como faz e Economia).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 500 }}>
                <span className={styles.agentStatusDotActive}></span> Em Atividade
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: 500 }}>
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
