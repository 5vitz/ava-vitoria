'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

const PARTNERS = [
  {
    name: 'Flávio',
    role: 'Titular: 01 · Jurídico & Compliance + 02 · Financeiro, Fiscal & ERP',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Governança Societária (MEI ➔ LTDA), INPI, LGPD/CDC, Unit Economics (DRE) e Bling ERP v3'
  },
  {
    name: 'Armando Sinkovitz (Genera)',
    role: 'Titular: 03 · Engenharia & TI + 04 · Produção & Fornecedores',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Arquitetura Tecnológica, Design System, Hub Multi-Supplier PoD (Dimona/Reserva) e Controle Fabril'
  },
  {
    name: 'Gustavo',
    role: 'Titular: 05 · Atendimento & SAC + 06 · Vendas & Canais Comerciais',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Análise de Tráfego, Impulsionamento (ROAS), Relacionamento com os 10 Canais de Venda e SAC 24/7'
  },
  {
    name: 'Tripoint',
    role: 'Titular: 07 · Marketing & Branding + 08 · Atelier Criativo & Mídias',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Curadoria de Coleções (★ Vitrine Ativa), Lookbook 9:16, Matrizes 300 DPI, Trios 3x3 e Campanha Cupom'
  }
];

export default function DiretoriaPage() {
  const [targetUnits, setTargetUnits] = useState(250);
  const [avgTicket, setAvgTicket] = useState(180);
  const [avgMargin, setAvgMargin] = useState(58);

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
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)' }}>
            🏛️ Cúpula de Comando · Diretoria Executiva
          </span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Conselho dos 4 Sócios */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Conselho Societário (4 Sócios da AVA)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PARTNERS.map((p, i) => (
                <div key={i} style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
          <div className={styles.moduleCard}>
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
                <div style={{ padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '11px', color: '#4B5563', textTransform: 'uppercase', fontWeight: 600 }}>Faturamento Bruto</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#000000', marginTop: '4px' }}>
                    R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#EFE4CC', border: '1px solid rgba(5, 150, 105, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
      </main>
    </div>
  );
}
