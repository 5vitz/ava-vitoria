'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { AGENTS_DOSSIER, AgentDossier } from '../agentDossierData';
import AgentDossierModal from '../AgentDossierModal';

export default function AgentesPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDossier | null>(null);
  const [filterDepto, setFilterDepto] = useState<string>('TODOS');

  const agentsList = Object.values(AGENTS_DOSSIER);
  const totalAgents = agentsList.length;
  const activeCount = agentsList.filter((a) => a.status === 'ACTIVE').length;
  const standbyCount = agentsList.filter((a) => a.status === 'STANDBY').length;

  const filteredAgents = filterDepto === 'TODOS'
    ? agentsList
    : agentsList.filter((a) => a.department.toLowerCase().includes(filterDepto.toLowerCase()));

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        {/* Cabeçalho Departamental Soberano */}
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>🤖 Mesa Redonda · Telemetria dos {totalAgents} Agentes de IA</h1>
            <p className={styles.moduleSubtitle}>
              Arquitetura de Inteligência Artificial Autônoma com Simetria Operacional entre os 4 Sócios e Especialistas Departamentais
            </p>
          </div>
          <div className={styles.flexRowStart}>
            <span className={styles.partnerOwnerBadge}>
              ⚙️ OPERAÇÃO: 24/7 AUTÔNOMA
            </span>
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

        {/* KPIs Gerais da Mesa Redonda */}
        <div className={`${styles.kpiGrid} ${styles.moduleCardSpaced}`}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Mesa Redonda Total</span>
            <div className={styles.kpiValue}>{totalAgents} Agentes</div>
            <span className={styles.kpiSub}>Cobertura nos 8 Departamentos</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>Em Atividade</span>
            <div className={`${styles.kpiValue} ${styles.textSuccess} ${styles.flexRowStart}`}>
              <span className={styles.agentStatusDotActive} />
              {activeCount} Ativos
            </div>
            <span className={`${styles.kpiSub} ${styles.textSuccess}`}>Executando rotinas e travas</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={`${styles.kpiLabel} ${styles.textWarning}`}>Em Prontidão (Stand-by)</span>
            <div className={`${styles.kpiValue} ${styles.textWarning} ${styles.flexRowStart}`}>
              <span className={styles.agentStatusDotStandby} />
              {standbyCount} Prontos
            </div>
            <span className={`${styles.kpiSub} ${styles.textWarning}`}>Disparados sob demanda de evento</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={`${styles.kpiLabel} ${styles.textInfo}`}>Economia Estimada (ROI)</span>
            <div className={`${styles.kpiValue} ${styles.textInfo}`}>R$ 28.500 / mês</div>
            <span className={`${styles.kpiSub} ${styles.textInfo}`}>Vs. contratação de equipe CLT / terceirizados</span>
          </div>
        </div>

        {/* Filtros por Departamento */}
        <div className={styles.tabStripContainer}>
          {[
            { id: 'TODOS', label: `Todos os Agentes (${totalAgents})` },
            { id: 'Diretoria', label: '🏛️ Diretoria & Governança' },
            { id: 'Jurídico', label: '⚖️ 01 · Jurídico (Dr. Lex)' },
            { id: 'Financeiro', label: '💎 02 · Financeiro & ERP' },
            { id: 'Arquitetura', label: '📐 03 · Arquitetura & TI' },
            { id: 'Produção', label: '🏭 04 · Produção & PoD' },
            { id: 'SAC', label: '🎧 05 · SAC 24/7' },
            { id: 'Vendas', label: '📈 06 · Mkt de Vendas' },
            { id: 'Produto', label: '🎨 07 · Mkt de Produto' },
            { id: 'Atelier', label: '✂️ 08 · Atelier & Mídias' },
          ].map((tab) => {
            const isSel = filterDepto === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterDepto(tab.id)}
                className={`${styles.tabBtn} ${isSel ? styles.tabBtnActive : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid dos Agentes de IA */}
        <div className={styles.moduleCard}>
          <div className={styles.flexRowBetween}>
            <h2 className={styles.cardHeadingNoBorder}>
              Dossiês Técnicos dos Agentes ({filteredAgents.length})
            </h2>
            <span className={styles.textMutedSmall}>
              💡 Clique no card de qualquer agente para abrir a Ficha Técnica com seus 4 pilares operacionais.
            </span>
          </div>

          <div className={styles.agentsGrid}>
            {filteredAgents.map((agent) => (
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
                  <span className={styles.textMutedSmall}>
                    {agent.department.split('(')[0].trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
