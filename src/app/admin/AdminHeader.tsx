'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getSession, signOut } from 'next-auth/react';
import ChangePasswordModal from './ChangePasswordModal';
import BoardroomPopup, { GuestCredentialItem } from './BoardroomPopup';
import styles from './admin-cockpit.module.css';

interface DeptLink {
  number: string;
  name: string;
  href: string;
}

const DEPTS: DeptLink[] = [
  { number: '01', name: 'Jurídico', href: '/admin/juridico' },
  { number: '02', name: 'Financeiro', href: '/admin/financeiro' },
  { number: '03', name: 'Arquitetura', href: '/admin/engenharia' },
  { number: '04', name: 'Produção', href: '/admin/producao' },
  { number: '05', name: 'SAC', href: '/admin/atendimento' },
  { number: '06', name: 'Mkt de Vendas', href: '/admin/vendas' },
  { number: '07', name: 'Mkt de Produto', href: '/admin/marketing' },
  { number: '08', name: 'Atelier', href: '/admin/atelier' },
];

const PARTNERS_PRESENCE = [
  { username: 'armando', name: 'Armando', title: 'Titular: 03 · Arquitetura & 04 · Produção' },
  { username: 'flavio', name: 'Flávio', title: 'Titular: 01 · Jurídico & 02 · Financeiro' },
  { username: 'tripoint', name: 'Tripoint', title: 'Titular: 07 · Mkt de Produto & 08 · Atelier' },
  { username: 'gustavo', name: 'Gustavo', title: 'Titular: 05 · SAC & 06 · Mkt de Vendas' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; username?: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [startLockedNewPauta, setStartLockedNewPauta] = useState(false);
  const [externalPautaTitle, setExternalPautaTitle] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [level2Guests, setLevel2Guests] = useState<GuestCredentialItem[]>([]);

  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/boardroom/guest-access');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.credentials)) {
          setLevel2Guests(
            data.credentials.filter((c: GuestCredentialItem) => c.active && c.access_level === 2)
          );
        }
      }
    } catch {
      // Silencioso
    }
  }, []);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setUser({
          name: session.user.name,
          username: (session.user as any).username,
        });
      }
    });

    fetchGuests();

    const pingPresence = async () => {
      try {
        const res = await fetch('/api/presence/ping', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.onlineUsers)) {
            setOnlineUsers(data.onlineUsers);
          }
        }
      } catch {
        // Silencioso
      }
    };

    pingPresence();
    const interval = setInterval(pingPresence, 45000);

    const handleOpenBoardroomEvent = (e: Event) => {
      const custom = e as CustomEvent<{
        pautaTitle?: string;
        createNewLocked?: boolean;
      }>;
      setIsRoomOpen(true);
      if (custom.detail?.createNewLocked) {
        setStartLockedNewPauta(true);
      } else if (custom.detail?.pautaTitle) {
        setExternalPautaTitle(custom.detail.pautaTitle);
      }
    };

    window.addEventListener('ava:open-boardroom', handleOpenBoardroomEvent);
    return () => {
      clearInterval(interval);
      window.removeEventListener('ava:open-boardroom', handleOpenBoardroomEvent);
    };
  }, [fetchGuests]);

  const rawUsername = (user?.username || user?.name || 'armando').toLowerCase();
  const normalizedUsername = rawUsername === 'admin' ? 'armando' : rawUsername;
  const shortName = user?.name ? user.name.split(' ')[0] : user?.username || 'Armando';

  const handleToggleRoom = () => {
    setIsRoomOpen((prev) => !prev);
  };

  const handleGuestActivated = (cred: GuestCredentialItem) => {
    if (cred.access_level === 2 && cred.active) {
      setLevel2Guests((prev) => {
        const exists = prev.some((g) => g.id === cred.id);
        return exists ? prev : [...prev, cred];
      });
    }
  };

  const isDiretoriaActive = pathname === '/admin/diretoria' || pathname === '/admin';

  const onlinePartnersCount = PARTNERS_PRESENCE.filter((p) => {
    const isCurrent = p.username === normalizedUsername;
    return (
      isCurrent ||
      onlineUsers.includes(p.username) ||
      (p.username === 'armando' && (onlineUsers.includes('admin') || onlineUsers.includes('armando sinkovitz (genera)')))
    );
  }).length;

  return (
    <>
      <div className={styles.topHeaderWrapper} id="adminHeaderWrapper">
        <header className={styles.headerRow1Card}>
          <div className={styles.row1Left}>
            <Link
              href="/admin"
              className={styles.avaBlackLogoBox}
              title="Início · Painel Executivo AVA Sem Limites"
            >
              <Image
                src="/imagens/AMOSTRAS/LOGOS/LOGO_SEM_LIMITES_PRETO_TRIMMED.png"
                alt="AVA Sem Limites"
                width={200}
                height={86}
                className={styles.avaOfficialLogoImg}
                priority
              />
            </Link>

            <div className={styles.meetingActionCards}>
              <Link
                href="/admin/agentes"
                className={`${styles.actionCardBtn} ${
                  pathname === '/admin/agentes' ? styles.actionCardBtnActive : ''
                }`}
                title="Mesa Redonda · Telemetria dos Agentes de IA e Dossiês Operacionais"
              >
                🤖 AGENTES
              </Link>
              <button
                type="button"
                className={`${styles.actionCardBtn} ${
                  isRoomOpen ? styles.actionCardBtnActive : ''
                }`}
                onClick={handleToggleRoom}
                title="Abrir Sala de Reuniões, Compartilhamento de Arquivos e Votação"
              >
                💬 SALA DE REUNIÕES
              </button>
            </div>
          </div>

          <div className={styles.connectedPartnersCard}>
            <span className={styles.connectedLabel}>
              CONECTADOS ({onlinePartnersCount}/4{level2Guests.length > 0 ? `+${level2Guests.length}` : ''}):
            </span>
            {PARTNERS_PRESENCE.map((p) => {
              const isCurrent = p.username === normalizedUsername;
              const isOnline =
                isCurrent ||
                onlineUsers.includes(p.username) ||
                (p.username === 'armando' && (onlineUsers.includes('admin') || onlineUsers.includes('armando sinkovitz (genera)')));

              return (
                <span
                  key={p.username}
                  className={`${styles.partnerPresencePill} ${
                    isCurrent ? styles.partnerPresenceCurrentUser : ''
                  }`}
                  title={`${p.name} (${p.title}) · ${isOnline ? '🟢 Conectado' : '🟡 Desconectado'}`}
                >
                  <span
                    className={`${styles.ledDot} ${
                      isOnline ? styles.ledOnline : styles.ledOffline
                    }`}
                  />
                  {p.name}
                  {isCurrent ? ' (Você)' : ''}
                </span>
              );
            })}

            {level2Guests.map((guest) => (
              <span
                key={guest.id}
                className={`${styles.partnerPresencePill} ${styles.partnerPresenceGuestLevel2}`}
                title={`Convidado Nível 2 (Painel + Sala de Reuniões) · Código: ${guest.access_code}`}
              >
                <span className={`${styles.ledDot} ${styles.ledOnline}`} />🔑 {guest.guest_name}{' '}
                (Nível 2)
              </span>
            ))}
          </div>

          <div className={styles.row1RightAccount}>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className={styles.executiveHeaderBtn}
              title="Gerenciar Senhas de Acesso (Nível 1: Painel | Nível 2: Painel + Sala de Reuniões)"
            >
              🔑 Senha
            </button>

            <Link href="/" target="_blank" className={styles.executiveHeaderBtn}>
              ↗ Vitrine
            </Link>

            {user && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className={styles.executiveHeaderBtn}
                title="Sair do Painel"
              >
                Sair
              </button>
            )}
          </div>
        </header>

        <nav className={styles.headerRow2Card}>
          <div className={styles.deptNavRow}>
            <Link
              href="/admin/diretoria"
              className={`${styles.deptNavLink} ${
                isDiretoriaActive ? styles.deptNavLinkActive : ''
              }`}
            >
              🏛️ Diretoria
            </Link>

            {DEPTS.map((dept) => {
              const isActive =
                pathname === dept.href ||
                (dept.href !== '/admin' && pathname.startsWith(dept.href + '/'));
              return (
                <Link
                  key={dept.href}
                  href={dept.href}
                  className={`${styles.deptNavLink} ${
                    isActive ? styles.deptNavLinkActive : ''
                  }`}
                >
                  {dept.number} · {dept.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <BoardroomPopup
        isOpen={isRoomOpen}
        onClose={() => setIsRoomOpen(false)}
        startLockedNewPauta={startLockedNewPauta}
        onClearedLockedFlag={() => setStartLockedNewPauta(false)}
        externalPautaTitle={externalPautaTitle}
        onClearedExternalPauta={() => setExternalPautaTitle(null)}
        currentUsername={normalizedUsername}
        currentDisplayName={shortName}
        level2Guests={level2Guests}
      />

      {showPasswordModal && (
        <ChangePasswordModal
          userName={user?.name || user?.username || 'Armando'}
          onClose={() => setShowPasswordModal(false)}
          onGuestActivated={handleGuestActivated}
        />
      )}
    </>
  );
}
