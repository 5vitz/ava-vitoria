'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './admin-cockpit.module.css';

interface DeptLink {
  number: string;
  name: string;
  href: string;
}

const DEPTS: DeptLink[] = [
  { number: '01', name: 'Diretoria', href: '/admin/diretoria' },
  { number: '02', name: 'Jurídico', href: '/admin/juridico' },
  { number: '03', name: 'Engenharia', href: '/admin/engenharia' },
  { number: '04', name: 'Produção PoD', href: '/admin/producao' },
  { number: '05', name: 'Atendimento', href: '/admin/atendimento' },
  { number: '06', name: 'Marketing', href: '/admin/marketing' },
  { number: '07', name: 'Atelier', href: '/admin/atelier' },
  { number: '08', name: 'Financeiro', href: '/admin/financeiro' },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.adminHeader}>
      <div className={styles.brandArea}>
        <Link href="/admin" className={styles.brandLogoLink} title="Cockpit Central AVA (Início)">
          <Image
            src="/imagens/AMOSTRAS/LOGOS/SELO_AVA_BRANCO_ISOLADO_300DPI.png"
            alt="AVA Selo Oficial"
            width={38}
            height={38}
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
        <Link href="/" target="_blank" className={styles.storeLink}>
          <span>↗</span> Ver Vitrine
        </Link>
      </div>
    </header>
  );
}
