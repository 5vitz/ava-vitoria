'use client';

import React from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

export default function EngenhariaPage() {
  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 03 · Engenharia & TI</h1>
            <p className={styles.moduleSubtitle}>
              Infraestrutura VPS Contabo, PostgreSQL, Prisma ORM, Rota GEO e Design System
            </p>
          </div>
          <span className={styles.brandBadge}>Operações Técnicas</span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Servidor VPS & PM2 */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Infraestrutura de Produção (VPS Contabo)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Servidor / IP</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Contabo Cloud VPS (31.220.102.2)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Domínio / SSL</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>HTTPS Ativo (Let&apos;s Encrypt / Certbot)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Processo Node.js</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>PM2: ava-vitoria (Porta 3000)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Deploy Automatizado</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>scripts/deploy.sh (Soberania Genera)</span>
              </div>
            </div>
          </div>

          {/* Banco de Dados & Rota GEO */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Banco Relacional & Arquitetura GEO / IA</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Banco de Dados</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>PostgreSQL Nativo (ACID Compliant)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Camada ORM</span>
                <span style={{ fontWeight: 600, color: '#10B981' }}>Prisma Client v7.8.0 (@prisma/adapter-pg)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Indexação de Agentes</span>
                <a href="/llms.txt" target="_blank" style={{ color: '#10B981', textDecoration: 'underline' }}>
                  /llms.txt (Ativo) ↗
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8E8F94' }}>Estilo & CSS</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>100% CSS Modules Semântico Puro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos Integrados da AVA */}
        <div className={styles.moduleCard} style={{ marginTop: '24px' }}>
          <h2 className={styles.cardHeading}>Acessos Integrados do Ecossistema AVA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '15px' }}>🎨 Design System Dinâmico</div>
              <p style={{ fontSize: '12px', color: '#8E8F94', lineHeight: '1.5' }}>
                Gerencie paletas de cores, variáveis de tipografia, espessura de bordas e o tom Marfim Off-White (#FEFCF5).
              </p>
              <Link href="/admin/design-system" className={styles.btnPrimary} style={{ textAlign: 'center', marginTop: 'auto' }}>
                Abrir Design System ↗
              </Link>
            </div>

            <div style={{ padding: '20px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '15px' }}>🔒 Portaria da Loja (SiteLock)</div>
              <p style={{ fontSize: '12px', color: '#8E8F94', lineHeight: '1.5' }}>
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
