'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { AGENTS_DOSSIER, AgentDossier } from '../agentDossierData';
import AgentDossierModal from '../AgentDossierModal';

const PARTNERS = [
  {
    name: 'Flávio',
    role: 'Titular: 01 · Jurídico & Compliance + 02 · Financeiro, Fiscal & ERP',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Governança Societária (MEI ➔ LTDA), INPI, LGPD/CDC, Unit Economics (DRE) e Bling ERP v3'
  },
  {
    name: 'Armando Sinkovitz (Genera)',
    role: 'Titular: 03 · Arquitetura & TI + 04 · Produção & Fornecedores',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Arquitetura de Sistemas, Design System, Hub Multi-Supplier PoD (Dimona/Reserva) e Controle Fabril'
  },
  {
    name: 'Gustavo',
    role: 'Titular: 05 · SAC + 06 · Marketing de Vendas',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Análise de KPIs de Tráfego, Plano de Investimentos (ROAS), 10 Canais de Venda e SAC (IA 24/7 + Gatilho BPO 5 atendimentos)'
  },
  {
    name: 'Tripoint',
    role: 'Titular: 07 · Marketing de Produto + 08 · Atelier Criativo & Mídias',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Estratégia da Coleção, Tema das Estampas, Visual Merchandising (Trios 3x3 Instagram & Vitrine Canônica) e Matrizes 300 DPI'
  }
];

export default function DiretoriaPage() {
  const [targetUnits, setTargetUnits] = useState(250);
  const [avgTicket, setAvgTicket] = useState(180);
  const [avgMargin, setAvgMargin] = useState(58);
  const [selectedAgent, setSelectedAgent] = useState<AgentDossier | null>(null);

  const estimatedRevenue = targetUnits * avgTicket;
  const estimatedGrossProfit = estimatedRevenue * (avgMargin / 100);

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>🏛️ Camada Soberana · Diretoria Executiva</h1>
            <p className={styles.moduleSubtitle}>
              Conselho Deliberativo &amp; Governança da Diretoria Executiva, Divisão Simétrica de Pastas Operacionais e Consenso Colegiado
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={styles.actionCardBtn}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('ava:open-boardroom', {
                    detail: { createNewLocked: true },
                  })
                )
              }
            >
              🚨 CONVOCAR REUNIÃO / NOVA PAUTA
            </button>
            <button
              type="button"
              className={styles.executiveHeaderBtn}
              onClick={() =>
                window.dispatchEvent(new CustomEvent('ava:open-boardroom', { detail: {} }))
              }
            >
              💬 ABRIR SALA DE REUNIÕES
            </button>
          </div>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Conselho dos 4 Sócios */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Conselho Societário (4 Sócios da AVA)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PARTNERS.map((p, i) => (
                <div key={i} style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#000000', fontSize: '13px' }}>{p.name}</span>
                    <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>{p.quota}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#27272A', fontWeight: 600, marginBottom: '2px' }}>{p.role}</div>
                  <div style={{ fontSize: '11px', color: '#4B5563' }}>{p.focus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulador de Inauguração / Drop Inaugural */}
          <div className={styles.moduleCard} data-boardroom-anchor="right-card">
            <h2 className={styles.cardHeading}>Simulador de Inauguração (Drop Inaugural)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#4B5563', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Meta de Vendas do Lançamento (Unidades): <strong>{targetUnits} peças</strong>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#000000' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#4B5563', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Ticket Médio da Peça: <strong>R$ {avgTicket.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min="120"
                  max="280"
                  step="10"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#000000' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #000000', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '11px', color: '#4B5563', textTransform: 'uppercase', fontWeight: 600 }}>Faturamento Bruto</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>
                    R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#FFFFFF', border: '1px solid rgba(5, 150, 105, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '11px', color: '#065F46', textTransform: 'uppercase', fontWeight: 600 }}>Margem Bruta (58%)</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#065F46', marginTop: '4px' }}>
                    R$ {estimatedGrossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parecer do Maestro Lincoln */}
        <div className={styles.moduleCard} style={{ marginTop: '20px' }}>
          <h2 className={styles.cardHeading}>Parecer Estratégico do Maestro Lincoln</h2>
          <p style={{ fontSize: '13px', color: '#27272A', lineHeight: '1.6' }}>
            A estratégia de lançamento da Nova Coleção PoD na vitrine principal e escoamento do estoque físico via Campanha <strong>&quot;EU TENHO CUPOM!&quot;</strong> posiciona a AVA Sem Limites com risco zero de capital imobilizado. A utilização transitória da estrutura MEI com Inscrição Estadual ativa viabiliza a emissão de NF-e e operação imediata via Bling ERP, permitindo validar vendas e tração real antes da formalização definitiva da LTDA na JUCEES.
          </p>
        </div>

        {/* Governança Colegiada: Cultura de Reuniões Periódicas */}
        <div className={styles.moduleCard} style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 className={styles.cardHeading} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <span>🤝</span> Cultura de Reuniões Periódicas da Mesa Redonda
              </h2>
              <p style={{ fontSize: '12px', color: '#4B5563', margin: '4px 0 0 0' }}>
                Governança deliberativa entre iguais. A presença dos sócios é tratada institucionalmente nas pautas de alinhamento periódico, eliminando qualquer controle de ponto individual.
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: '#FFFFFF', border: '1px solid #000000', borderRadius: '2px' }}>
              🏛️ Consenso 4/4
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '12px' }}>
            <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700 }}>Periodicidade Sugerida</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>Alinhamento Periódico</div>
              <div style={{ fontSize: '11px', color: '#52525B', marginTop: '4px' }}>Definição em consenso colegiado pelos 4 sócios (ex: semanal ou quinzenal).</div>
            </div>

            <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700 }}>Pauta Operacional</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>8 Departamentos</div>
              <div style={{ fontSize: '11px', color: '#52525B', marginTop: '4px' }}>Cada sócio apresenta o progresso e gargalos das suas 2 pastas de titularidade.</div>
            </div>

            <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#047857', fontWeight: 700 }}>Deliberação</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#047857', marginTop: '4px' }}>Urna de Votação 4/4</div>
              <div style={{ fontSize: '11px', color: '#52525B', marginTop: '4px' }}>Decisões de preço, investimento e contratos registradas sem atrito na plataforma.</div>
            </div>
          </div>
        </div>

        {/* Telemetria dos Agentes de IA da Mesa Redonda */}
        <section className={styles.agentsPanel} style={{ marginTop: '24px' }}>
          <div className={styles.agentsPanelHeader}>
            <div>
              <h2 className={styles.sectionHeading}>
                Telemetria dos 16 Agentes de IA da Mesa Redonda
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
