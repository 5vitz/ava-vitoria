'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface DailyReportItem {
  username: string;
  name: string;
  role: string;
  isOnline: boolean;
  enteredToday: boolean;
  firstEntry: string | null;
  lastExit: string | null;
  totalDuration: string | null;
  statusText: string;
  sessionCount: number;
}

interface RecentLogItem {
  id: string;
  username: string;
  dateFormatted: string;
  entryTime: string;
  exitTime: string;
  duration: string;
  isOnline: boolean;
  ip: string;
}

export default function EngenhariaPage() {
  const [dailyReport, setDailyReport] = useState<DailyReportItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<RecentLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/presence/logs');
      if (res.ok) {
        const data = await res.json();
        setDailyReport(data.dailyReport || []);
        setRecentLogs(data.recentLogs || []);
      }
    } catch (err) {
      console.error('Erro ao buscar logs do Sentinela:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 03 · Engenharia &amp; TI</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Armando</strong> · Infraestrutura VPS Contabo, PostgreSQL, Prisma ORM, Sentinel Security e Design System
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Armando
          </span>
        </div>

        {/* MÓDULO EXCLUSIVO: Sentinel Security · Monitor de Expediente & Auditoria de Presença */}
        <div className={styles.moduleCard} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 className={styles.cardHeading} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <span>🛡️</span> Sentinel Security · Monitor de Expediente &amp; Auditoria de Presença
              </h2>
              <p style={{ fontSize: '12px', color: '#4B5563', margin: '4px 0 0 0' }}>
                Registro contínuo e imutável de entradas, saídas, permanência ativa e histórico de acessos dos 4 sócios no banco PostgreSQL.
              </p>
            </div>
            <button
              onClick={fetchLogs}
              className={styles.executiveHeaderBtn}
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              🔄 Atualizar Auditoria
            </button>
          </div>

          {/* Quadro de Expediente de Hoje (Os 4 Sócios) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {dailyReport.length > 0 ? (
              dailyReport.map((p) => (
                <div
                  key={p.username}
                  style={{
                    padding: '16px',
                    background: '#EFE4CC',
                    border: '1px solid rgba(0, 0, 0, 0.16)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>{p.name}</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: p.isOnline ? '#065F46' : '#52525B'
                      }}
                    >
                      <span className={`${styles.ledDot} ${p.isOnline ? styles.ledOnline : styles.ledOffline}`}></span>
                      {p.isOnline ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#52525B', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '6px' }}>
                    {p.role}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', marginTop: '2px' }}>
                    {p.enteredToday ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#4B5563' }}>Primeiro Acesso:</span>
                          <strong style={{ color: '#000000' }}>{p.firstEntry}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#4B5563' }}>Último Registro:</span>
                          <strong style={{ color: p.isOnline ? '#065F46' : '#000000' }}>{p.lastExit}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#4B5563' }}>Tempo no Painel:</span>
                          <strong style={{ color: '#000000' }}>{p.totalDuration}</strong>
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: '8px 0', color: '#6B7280', fontStyle: 'italic', fontSize: '12px' }}>
                        ⚪ Não entrou hoje
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', color: '#6B7280', fontSize: '12px' }}>
                {loading ? 'Carregando registros do Sentinela...' : 'Nenhum registro de presença encontrado.'}
              </div>
            )}
          </div>

          {/* Trilha de Auditoria Recente do Sentinela */}
          <div>
            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#18181B', fontWeight: 700, marginBottom: '10px' }}>
              📜 Trilha de Auditoria do Sentinela (Últimos Acessos ao Banco)
            </h3>

            <div style={{ overflowX: 'auto', background: '#EFE4CC', border: '1px solid rgba(0, 0, 0, 0.16)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.06)', borderBottom: '1px solid rgba(0, 0, 0, 0.14)' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#000000' }}>Data</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#000000' }}>Sócio / Usuário</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#000000' }}>Entrada</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#000000' }}>Saída</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#000000' }}>Permanência</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#000000' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                        <td style={{ padding: '8px 12px', color: '#374151' }}>{log.dateFormatted}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: '#000000' }}>
                          {log.username.toUpperCase()}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#18181B' }}>{log.entryTime}</td>
                        <td style={{ padding: '8px 12px', color: log.isOnline ? '#065F46' : '#18181B' }}>
                          {log.exitTime}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#374151' }}>{log.duration}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: log.isOnline ? '#065F46' : '#52525B'
                            }}
                          >
                            <span className={`${styles.ledDot} ${log.isOnline ? styles.ledOnline : styles.ledOffline}`}></span>
                            {log.isOnline ? 'Online' : 'Encerrada'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#6B7280' }}>
                        Nenhum registro de auditoria disponível no momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Servidor VPS & PM2 */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Infraestrutura de Produção (VPS Contabo)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Servidor / IP</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>Contabo Cloud VPS (31.220.102.2)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Domínio / SSL</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>HTTPS Ativo (Let&apos;s Encrypt / Certbot)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Processo Node.js</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>PM2: ava-vitoria (Porta 3000)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Deploy Automatizado</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>scripts/deploy.sh (Soberania Genera)</span>
              </div>
            </div>
          </div>

          {/* Banco de Dados & Rota GEO */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Banco Relacional &amp; Arquitetura GEO / IA</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Banco de Dados</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>PostgreSQL Nativo (ACID Compliant)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Camada ORM</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>Prisma Client v7.8.0 (@prisma/adapter-pg)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Indexação de Agentes</span>
                <a href="/llms.txt" target="_blank" style={{ color: '#047857', textDecoration: 'underline', fontWeight: 600 }}>
                  /llms.txt (Ativo) ↗
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Estilo &amp; CSS</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>100% CSS Modules Semântico Puro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos Integrados da AVA */}
        <div className={styles.moduleCard} style={{ marginTop: '24px' }}>
          <h2 className={styles.cardHeading}>Acessos Integrados do Ecossistema AVA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 700, color: '#000000', fontSize: '15px' }}>🎨 Design System Dinâmico</div>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                Gerencie paletas de cores, variáveis de tipografia, espessura de bordas e os tons Palha Claro e Palha Escuro.
              </p>
              <Link href="/admin/design-system" className={styles.btnPrimary} style={{ textAlign: 'center', marginTop: 'auto' }}>
                Abrir Design System ↗
              </Link>
            </div>

            <div style={{ padding: '20px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 700, color: '#000000', fontSize: '15px' }}>🔒 Portaria da Loja (SiteLock)</div>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                Controle o cadeado de visualização da loja pública, tela de pré-lançamento e senhas para visitantes VIP.
              </p>
              <Link href="/admin/design-system" className={styles.btnSecondary} style={{ textAlign: 'center', marginTop: 'auto' }}>
                Gerenciar Portaria ↗
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
