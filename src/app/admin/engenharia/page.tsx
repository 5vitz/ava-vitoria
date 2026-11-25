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
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Armando
          </span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Servidor VPS & PM2 */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Infraestrutura de Produção (VPS Contabo)</h2>
            <div className={styles.flexColStack}>
              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Servidor / IP</span>
                <span className={styles.textPrimaryBold}>Contabo Cloud VPS (31.220.102.2)</span>
              </div>

              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Domínio / SSL</span>
                <span className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>HTTPS Ativo (Let&apos;s Encrypt / Certbot)</span>
              </div>

              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Processo Node.js</span>
                <span className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>PM2: ava-vitoria (Porta 3000)</span>
              </div>

              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Deploy Automatizado</span>
                <span className={styles.textPrimaryBold}>scripts/deploy.sh (Soberania Genera)</span>
              </div>
            </div>
          </div>

          {/* Banco de Dados & Rota GEO */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Banco Relacional &amp; Arquitetura GEO / IA</h2>
            <div className={styles.flexColStack}>
              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Banco de Dados</span>
                <span className={styles.textPrimaryBold}>PostgreSQL Nativo (ACID Compliant)</span>
              </div>

              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Camada ORM</span>
                <span className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>Prisma Client v7.8.0 (@prisma/adapter-pg)</span>
              </div>

              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Indexação de Agentes</span>
                <a href="/llms.txt" target="_blank" className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
                  /llms.txt (Ativo) ↗
                </a>
              </div>

              <div className={styles.innerRowItem}>
                <span className={styles.textMutedSmall}>Estilo &amp; CSS</span>
                <span className={styles.textPrimaryBold}>100% CSS Modules Semântico Puro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos Integrados da AVA */}
        <div className={`${styles.moduleCard} ${styles.moduleCardTopSpaced}`}>
          <h2 className={styles.cardHeading}>Acessos Integrados do Ecossistema AVA</h2>
          <div className={styles.autoGridCards}>
            <div className={`${styles.innerCard} ${styles.flexColStack}`}>
              <div className={styles.decisionTitle}>🎨 Design System Dinâmico</div>
              <p className={styles.textBodySmall}>
                Gerencie paletas de cores, variáveis de tipografia, espessura de bordas e os tokens visuais da Vitrine e do Painel.
              </p>
              <Link href="/admin/design-system" className={styles.btnPrimary}>
                Abrir Design System ↗
              </Link>
            </div>

            <div className={`${styles.innerCard} ${styles.flexColStack}`}>
              <div className={styles.decisionTitle}>🔒 Portaria da Loja (SiteLock)</div>
              <p className={styles.textBodySmall}>
                Controle o cadeado de visualização da loja pública, tela de pré-lançamento e senhas para visitantes VIP.
              </p>
              <Link href="/admin/design-system" className={styles.btnSecondary}>
                Gerenciar Portaria ↗
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
