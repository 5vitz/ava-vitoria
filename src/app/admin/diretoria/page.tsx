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
  const [avgMargin] = useState(58);
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
          <div className={styles.flexRowStart}>
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
            <div className={styles.flexColStack}>
              {PARTNERS.map((p, i) => (
                <div key={i} className={styles.innerCard}>
                  <div className={styles.flexRowBetween}>
                    <span className={styles.decisionTitle}>{p.name}</span>
                    <span className={`${styles.textMutedSmall} ${styles.textSuccess}`}>{p.quota}</span>
                  </div>
                  <div className={styles.textPrimaryBold}>{p.role}</div>
                  <div className={styles.textMutedSmall}>{p.focus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulador de Inauguração / Drop Inaugural */}
          <div className={styles.moduleCard} data-boardroom-anchor="right-card">
            <h2 className={styles.cardHeading}>Simulador de Inauguração (Drop Inaugural)</h2>
            <div className={styles.flexColStack}>
              <div>
                <label className={styles.formLabel}>
                  Meta de Vendas do Lançamento (Unidades): <strong>{targetUnits} peças</strong>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
              </div>

              <div>
                <label className={styles.formLabel}>
                  Ticket Médio da Peça: <strong>R$ {avgTicket.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min="120"
                  max="280"
                  step="10"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
              </div>

              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiLabel}>Faturamento Bruto</div>
                  <div className={styles.kpiValue}>
                    R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className={`${styles.kpiCard} ${styles.innerCardSuccess}`}>
                  <div className={`${styles.kpiLabel} ${styles.textSuccess}`}>Margem Bruta (58%)</div>
                  <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                    R$ {estimatedGrossProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parecer do Maestro Lincoln */}
        <div className={`${styles.moduleCard} ${styles.moduleCardTopSpaced}`}>
          <h2 className={styles.cardHeading}>Parecer Estratégico do Maestro Lincoln</h2>
          <p className={styles.textBodySmall}>
            A estratégia de lançamento da Nova Coleção PoD na vitrine principal e escoamento do estoque físico via Campanha <strong>&quot;EU TENHO CUPOM!&quot;</strong> posiciona a AVA Sem Limites com risco zero de capital imobilizado. A utilização transitória da estrutura MEI com Inscrição Estadual ativa viabiliza a emissão de NF-e e operação imediata via Bling ERP, permitindo validar vendas e tração real antes da formalização definitiva da LTDA na JUCEES.
          </p>
        </div>

        {/* Governança Colegiada: Cultura de Reuniões Periódicas */}
        <div className={`${styles.moduleCard} ${styles.moduleCardTopSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                🤝 Cultura de Reuniões Periódicas da Mesa Redonda
              </h2>
              <p className={styles.moduleSubtitle}>
                Governança deliberativa entre iguais. A presença dos sócios é tratada institucionalmente nas pautas de alinhamento periódico, eliminando qualquer controle de ponto individual.
              </p>
            </div>
            <span className={styles.statusPill}>
              🏛️ Consenso 4/4
            </span>
          </div>

          <div className={styles.autoGridSmall}>
            <div className={styles.innerCard}>
              <div className={styles.kpiLabel}>Periodicidade Sugerida</div>
              <div className={styles.decisionTitle}>Alinhamento Periódico</div>
              <div className={styles.textMutedSmall}>Definição em consenso colegiado pelos 4 sócios (ex: semanal ou quinzenal).</div>
            </div>

            <div className={styles.innerCard}>
              <div className={styles.kpiLabel}>Pauta Operacional</div>
              <div className={styles.decisionTitle}>8 Departamentos</div>
              <div className={styles.textMutedSmall}>Cada sócio apresenta o progresso e gargalos das suas 2 pastas de titularidade.</div>
            </div>

            <div className={styles.innerCard}>
              <div className={`${styles.kpiLabel} ${styles.textSuccess}`}>Deliberação</div>
              <div className={`${styles.decisionTitle} ${styles.textSuccess}`}>Urna de Votação 4/4</div>
              <div className={styles.textMutedSmall}>Decisões de preço, investimento e contratos registradas sem atrito na plataforma.</div>
            </div>
          </div>
        </div>

        {/* Telemetria dos Agentes de IA da Mesa Redonda */}
        <section className={`${styles.agentsPanel} ${styles.moduleCardTopSpaced}`}>
          <div className={styles.agentsPanelHeader}>
            <div>
              <h2 className={styles.sectionHeading}>
                Telemetria dos Agentes de IA da Mesa Redonda
              </h2>
              <p className={styles.moduleSubtitle}>
                💡 Clique em qualquer agente para ver o Dossiê de Ajuda (O que faz, Por que faz, Como faz e Economia).
              </p>
            </div>
            <div className={styles.flexRowStart}>
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                <span className={styles.agentStatusDotActive}></span> Em Atividade
              </span>
              <span className={`${styles.statusPill} ${styles.statusPillWarning}`}>
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

      {selectedAgent && (
        <AgentDossierModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
