'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
            <h1 className={styles.moduleTitle}>🤖 Mesa Redonda · Telemetria dos 16 Agentes de IA</h1>
            <p className={styles.moduleSubtitle}>
              Arquitetura de Inteligência Artificial Autônoma com Simetria Operacional entre os 4 Sócios e Especialistas Departamentais
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px',
              background: 'rgba(0, 0, 0, 0.46)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#FEFCF5',
              padding: '6px 14px',
              border: '1px solid rgba(0, 0, 0, 0.40)',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '14px 16px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.18)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 800 }}>Mesa Redonda Total</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
              {totalAgents} Agentes
            </div>
            <span style={{ fontSize: '11px', color: '#3F3F46' }}>Cobertura nos 8 Departamentos</span>
          </div>

          <div style={{ padding: '14px 16px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.18)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#065F46', fontWeight: 800 }}>Em Atividade</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#047857', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px rgba(5,150,105,0.7)' }} />
              {activeCount} Ativos
            </div>
            <span style={{ fontSize: '11px', color: '#065F46' }}>Executando rotinas e travas</span>
          </div>

          <div style={{ padding: '14px 16px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.18)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#92400E', fontWeight: 800 }}>Em Prontidão (Stand-by)</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#B45309', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#D97706', boxShadow: '0 0 6px rgba(217,119,6,0.5)' }} />
              {standbyCount} Prontos
            </div>
            <span style={{ fontSize: '11px', color: '#92400E' }}>Disparados sob demanda de evento</span>
          </div>

          <div style={{ padding: '14px 16px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.18)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#1E40AF', fontWeight: 800 }}>Economia Estimada (ROI)</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1D4ED8', marginTop: '4px' }}>
              R$ 28.500 / mês
            </div>
            <span style={{ fontSize: '11px', color: '#1E40AF' }}>Vs. contratação de equipe CLT / terceirizados</span>
          </div>
        </div>

        {/* Filtros por Departamento */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '6px'
        }}>
          {[
            { id: 'TODOS', label: 'Todos os Agentes (16)' },
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
                className={isSel ? styles.deptNavLinkActive : styles.executiveHeaderBtn}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid dos Agentes de IA */}
        <div className={styles.moduleCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 className={styles.cardHeading} style={{ margin: 0 }}>
              Dossiês Técnicos dos Agentes ({filteredAgents.length})
            </h2>
            <span style={{ fontSize: '11px', color: '#4B5563' }}>
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
                  <span style={{ fontSize: '9px', color: '#6B7280', marginTop: '2px' }}>
                    {agent.department.split('(')[0].trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
