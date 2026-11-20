'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getSession, signOut } from 'next-auth/react';
import ChangePasswordModal from './ChangePasswordModal';
import styles from './admin-cockpit.module.css';

interface DeptLink {
  number: string;
  name: string;
  href: string;
}

const DEPTS: DeptLink[] = [
  { number: '01', name: 'Jurídico', href: '/admin/juridico' },
  { number: '02', name: 'Financeiro', href: '/admin/financeiro' },
  { number: '03', name: 'Engenharia', href: '/admin/engenharia' },
  { number: '04', name: 'Produção', href: '/admin/producao' },
  { number: '05', name: 'Atendimento', href: '/admin/atendimento' },
  { number: '06', name: 'Vendas', href: '/admin/vendas' },
  { number: '07', name: 'Marketing', href: '/admin/marketing' },
  { number: '08', name: 'Atelier', href: '/admin/atelier' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; username?: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setUser({
          name: session.user.name,
          username: (session.user as any).username,
        });
      }
    });
  }, []);

  const shortName = user?.name ? user.name.split(' ')[0] : user?.username || 'Sócio';

  return (
    <>
      <header className={styles.adminHeader}>
        <div className={styles.brandArea}>
          <Link href="/admin" className={styles.brandLogoLink} title="Cockpit Central AVA (Início)">
            <Image
              src="/imagens/AMOSTRAS/LOGOS/SELO_AVA_BRANCO_ISOLADO_300DPI.png"
              alt="AVA Selo Oficial"
              width={52}
              height={52}
              className={styles.brandLogoImg}
              priority
            />
          </Link>
        </div>

        <nav className={styles.deptNav}>
          {DEPTS.map((dept) => {
            const isActive = pathname === dept.href;
            return (
              <Link
                key={dept.href}
                href={dept.href}
                className={`${styles.deptNavLink} ${isActive ? styles.deptNavLinkActive : ''}`}
              >
                <span>{dept.number}</span> · {dept.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#18181B',
                  background: 'rgba(0, 0, 0, 0.05)',
                  padding: '5px 7px',
                  border: '1px solid rgba(0, 0, 0, 0.22)',
                  borderRadius: '2px',
                  whiteSpace: 'nowrap',
                }}
                title={`Logado como: ${user.name || user.username}`}
              >
                👤 {shortName}
              </span>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className={styles.executiveHeaderBtn}
                style={{ padding: '5px 7px', fontSize: '10px' }}
                title="Alterar Minha Senha Pessoal"
              >
                🔑 Senha
              </button>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className={styles.executiveHeaderBtn}
                style={{ padding: '5px 7px', fontSize: '10px' }}
                title="Sair do Painel"
              >
                Sair
              </button>
            </div>
          )}

          <Link href="/" target="_blank" className={styles.storeLink}>
            <span>↗</span> Vitrine
          </Link>
        </div>
      </header>

      {showPasswordModal && (
        <ChangePasswordModal
          userName={user?.name || user?.username}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}
