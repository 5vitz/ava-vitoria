'use client';

import React, { useState, useEffect } from 'react';
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
  { number: '01', name: 'Jurídico', href: '/admin/juridico' },
  { number: '02', name: 'Engenharia', href: '/admin/engenharia' },
  { number: '03', name: 'Produção', href: '/admin/producao' },
  { number: '04', name: 'Atendimento', href: '/admin/atendimento' },
  { number: '05', name: 'Vendas', href: '/admin/vendas' },
  { number: '06', name: 'Marketing', href: '/admin/marketing' },
  { number: '07', name: 'Atelier', href: '/admin/atelier' },
  { number: '08', name: 'Financeiro', href: '/admin/financeiro' },
];

const STRAW_TONES = [
  {
    id: 'polen',
    label: 'Pólen Soft',
    card: '#F0E6D2',
    subcard: '#E6D9BE',
    hover: '#F6EFE0',
  },
  {
    id: 'palha',
    label: 'Palha Livro',
    card: '#EADCC1',
    subcard: '#DFCFAF',
    hover: '#F2E6CE',
  },
  {
    id: 'camurca',
    label: 'Palha Escuro',
    card: '#DFCFA8',
    subcard: '#D3C197',
    hover: '#E8DAB8',
  },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const isDiretoria = pathname === '/admin/diretoria';
  const [toneId, setToneId] = useState<string>('palha');

  const applyTone = (id: string) => {
    const found = STRAW_TONES.find((t) => t.id === id) || STRAW_TONES[1];
    setToneId(found.id);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--admin-card-bg', found.card);
      document.documentElement.style.setProperty('--admin-subcard-bg', found.subcard);
      document.documentElement.style.setProperty('--admin-card-hover', found.hover);
    }
    try {
      localStorage.setItem('ava_admin_straw_tone', found.id);
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ava_admin_straw_tone');
      if (saved) {
        applyTone(saved);
      } else {
        applyTone('palha');
      }
    } catch {
      applyTone('palha');
    }
  }, []);

  return (
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
        <Link
          href="/admin/diretoria"
          className={`${styles.executiveHeaderBtn} ${isDiretoria ? styles.executiveHeaderBtnActive : ''}`}
          title="Camada Soberana · Conselho dos 4 Sócios"
        >
          <span>🏛️</span> Diretoria
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px',
            border: '1px solid rgba(0,0,0,0.18)',
            background: 'rgba(0,0,0,0.04)'
          }}
          title="Calibrar Tom Amarelo Palha (Conforto Visual)"
        >
          {STRAW_TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTone(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 7px',
                fontSize: '10px',
                fontWeight: 600,
                border: toneId === t.id ? '1px solid #18181B' : '1px solid transparent',
                background: toneId === t.id ? '#18181B' : t.card,
                color: toneId === t.id ? '#F3E9D2' : '#18181B',
                cursor: 'pointer'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: t.card,
                  border: '1px solid rgba(0,0,0,0.35)',
                  display: 'inline-block'
                }}
              />
              {t.label}
            </button>
          ))}
        </div>

        <Link href="/" target="_blank" className={styles.storeLink}>
          <span>↗</span> Ver Vitrine
        </Link>
      </div>
    </header>
  );
}
