'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

const PARTNERS = [
  { name: 'Armando Sinkovitz (Genera)', role: 'Diretor Criativo & Mentor Estratégico', quota: '25%', focus: 'Direção Geral, Design System & Decisões Soberanas' },
  { name: 'Diretor Audiovisual & IA', role: 'Diretor de Vídeo & Novas Mídias', quota: '25%', focus: 'Lookbook Editorial, Reels, Vídeos em IA & Benchmark Balenciaga' },
  { name: 'Diretor Comercial', role: 'Diretor de Parcerias & Expansão', quota: '25%', focus: 'Marketplaces, Relacionamento B2B & Ponto Físico' },
  { name: 'Diretor de Marketing', role: 'Diretor de Performance & Growth', quota: '25%', focus: 'Meta Ads, Campanha "EU TENHO CUPOM!" & Gestão de Comunidade' }
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
            <h1 className={styles.moduleTitle}>Depto 01 · Diretoria Executiva</h1>
            <p className={styles.moduleSubtitle}>
              Governança dos 4 Sócios, Metas de Inauguração (01/Dezembro) e Scorecard Estratégico
            </p>
          </div>
          <span className={styles.brandBadge}>Conselho Deliberativo</span>
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
