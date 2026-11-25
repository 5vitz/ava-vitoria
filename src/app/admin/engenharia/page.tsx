'use client';

import React from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

export default function ArquiteturaPage() {
  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 03 · Arquitetura &amp; TI</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Armando</strong> · Arquitetura de Sistemas, Infraestrutura VPS Contabo, PostgreSQL, Prisma ORM e Design System
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Armando
          </span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Servidor VPS & PM2 */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Infraestrutura de Produção (VPS Contabo)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Servidor / IP</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>Contabo Cloud VPS (31.220.102.2)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Domínio / SSL</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>HTTPS Ativo (Let&apos;s Encrypt / Certbot)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Processo Node.js</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>PM2: ava-vitoria (Porta 3000)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Deploy Automatizado</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>scripts/deploy.sh (Soberania Genera)</span>
              </div>
            </div>
          </div>

          {/* Banco de Dados & Rota GEO */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Banco Relacional &amp; Arquitetura GEO / IA</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Banco de Dados</span>
                <span style={{ fontWeight: 600, color: '#000000' }}>PostgreSQL Nativo (ACID Compliant)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Camada ORM</span>
                <span style={{ fontWeight: 600, color: '#047857' }}>Prisma Client v7.8.0 (@prisma/adapter-pg)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ color: '#4B5563' }}>Indexação de Agentes</span>
                <a href="/llms.txt" target="_blank" style={{ color: '#047857', textDecoration: 'underline', fontWeight: 600 }}>
                  /llms.txt (Ativo) ↗
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
            <div style={{ padding: '20px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 700, color: '#000000', fontSize: '15px' }}>🎨 Design System Dinâmico</div>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
                Gerencie paletas de cores, variáveis de tipografia, espessura de bordas e os tons Palha Claro e Palha Escuro.
              </p>
              <Link href="/admin/design-system" className={styles.btnPrimary} style={{ textAlign: 'center', marginTop: 'auto' }}>
                Abrir Design System ↗
              </Link>
            </div>

            <div style={{ padding: '20px', background: '#F4F4F6', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
