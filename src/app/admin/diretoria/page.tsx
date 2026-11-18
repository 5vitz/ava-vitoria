'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

const PARTNERS = [
  {
    name: 'Armando Sinkovitz (Genera)',
    role: 'Titular: 02 · Engenharia & TI + 03 · Produção & Fornecedores',
    quota: '25% · Voto Soberano',
    focus: 'Arquitetura Tecnológica, Design System, Hub Multi-Supplier PoD (Dimona/Reserva) e Controle Fabril'
  },
  {
    name: 'Flávio',
    role: 'Titular: 01 · Jurídico & Compliance + 08 · Financeiro, Fiscal & ERP',
    quota: '25% · Voto Soberano',
    focus: 'Governança Societária (MEI ➔ LTDA), INPI, LGPD/CDC, Unit Economics (DRE) e Bling ERP v3'
  },
  {
    name: 'Tripoint',
    role: 'Titular: 06 · Marketing & Branding + 07 · Atelier Criativo & Mídias',
    quota: '25% · Voto Soberano',
    focus: 'Curadoria de Coleções (★ Vitrine Ativa), Lookbook 9:16, Matrizes 300 DPI, Trios 3x3 e Campanha Cupom'
  },
  {
    name: 'Gustavo',
    role: 'Titular: 04 · Atendimento & SAC + 05 · Vendas & Canais Comerciais',
    quota: '25% · Voto Soberano',
    focus: 'Análise de Tráfego, Impulsionamento (ROAS), Relacionamento com os 10 Canais de Venda e SAC 24/7'
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
              Conselho Deliberativo dos 4 Sócios (25% cada), Divisão Simétrica (2 Deptos por Sócio) e Consenso de Precificação
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)' }}>
            🏛️ Cúpula de Comando · 4 Sócios
          </span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Conselho dos 4 Sócios */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Conselho Societário (4 Sócios da AVA)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PARTNERS.map((p, i) => (
                <div key={i} style={{ padding: '12px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px' }}>{p.name}</span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>{p.quota}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#C0C0C5', marginBottom: '2px' }}>{p.role}</div>
                  <div style={{ fontSize: '11px', color: '#8E8F94' }}>{p.focus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulador de Inauguração de Natal */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Simulador de Inauguração (Natal 2026)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#A0A0A5', display: 'block', marginBottom: '6px' }}>
                  Meta de Vendas de Dezembro (Unidades): <strong>{targetUnits} peças</strong>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#A0A0A5', display: 'block', marginBottom: '6px' }}>
                  Ticket Médio da Peça: <strong>R$ {avgTicket.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min="120"
                  max="280"
                  step="10"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#FFFFFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div style={{ padding: '16px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#8E8F94', textTransform: 'uppercase' }}>Faturamento Bruto</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
                    R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ padding: '16px', background: '#0E0F10', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '11px', color: '#10B981', textTransform: 'uppercase' }}>Margem Bruta (58%)</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>
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
          <p style={{ fontSize: '13px', color: '#D1D2D6', lineHeight: '1.6' }}>
            A estratégia de inauguração em <strong>01 de Dezembro</strong> com a Nova Coleção PoD na vitrine principal e escoamento do estoque físico via Campanha <strong>"EU TENHO CUPOM!"</strong> posiciona a AVA Sem Limites com risco zero de capital imobilizado. A formalização da transformação para LTDA na JUCEES resguarda a cota dos 4 sócios e destrava os 10 canais sem limite tributário.
          </p>
        </div>
      </main>
    </div>
  );
}
