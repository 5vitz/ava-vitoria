'use client';

import React, { useState } from 'react';
import styles from './admin-cockpit.module.css';
import { GuestCredentialItem } from './BoardroomPopup';

interface ChangePasswordModalProps {
  userName?: string;
  onClose: () => void;
  onGuestActivated?: (cred: GuestCredentialItem) => void;
}

export default function ChangePasswordModal({
  userName,
  onClose,
  onGuestActivated,
}: ChangePasswordModalProps) {
  const [activeTab, setActiveTab] = useState<'GUEST' | 'PERSONAL'>('GUEST');

  // Estado da aba Convidados (2 Níveis)
  const [selectedLevel, setSelectedLevel] = useState<1 | 2>(2);
  const [guestName, setGuestName] = useState('Contador (Contabilidade)');
  const [guestCode, setGuestCode] = useState('AVA-N2-CONTADOR-2026');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestSuccess, setGuestSuccess] = useState('');
  const [guestError, setGuestError] = useState('');

  // Estado da aba Senha Pessoal do Sócio
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSelectLevel = (lvl: 1 | 2) => {
    setSelectedLevel(lvl);
    if (lvl === 1) {
      setGuestName('Operador SAC (Secretariado BPO)');
      setGuestCode('AVA-N1-PAINEL-2026');
    } else {
      setGuestName('Contador (Contabilidade)');
      setGuestCode('AVA-N2-CONTADOR-2026');
    }
  };

  const handleActivateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError('');
    setGuestSuccess('');

    if (!guestName.trim() || !guestCode.trim()) {
      setGuestError('Informe a identificação do convidado e a senha temporária.');
      return;
    }

    setGuestLoading(true);
    try {
      const res = await fetch('/api/admin/boardroom/guest-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestName.trim(),
          accessCode: guestCode.trim(),
          accessLevel: selectedLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGuestError(data.error || 'Erro ao ativar senha de convidado.');
      } else {
        if (selectedLevel === 1) {
          setGuestSuccess(
            `✅ Senha Nível 1 (${guestCode}) ativada para "${guestName}". Permissão: Acesso somente ao Painel (Sem Sala de Reuniões).`
          );
        } else {
          setGuestSuccess(
            `✅ Senha Nível 2 (${guestCode}) ativada! "${guestName}" entrou na barra de Conectados, no seletor "ANEXAR / ENVIAR PARA" e na Sala de Vídeo.`
          );
        }
        if (data.credential && onGuestActivated) {
          onGuestActivated(data.credential);
        }
        setTimeout(() => {
          onClose();
        }, 1600);
      }
    } catch {
      setGuestError('Erro de conexão ao ativar credencial de convidado.');
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSubmitPersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação da nova senha não confere.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao alterar a senha.');
      } else {
        setSuccess('✅ Senha pessoal alterada com sucesso no banco de dados!');
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch {
      setError('Erro de conexão ao atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#E4E4E7',
          border: '2px solid #000000',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          width: '580px',
          maxWidth: '94vw',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Translúcido com Blur */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.76)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            color: '#FEFCF5',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            borderBottom: '1px solid rgba(223, 207, 168, 0.25)',
          }}
        >
          <span>🔑 CONTROLE DE SENHAS &amp; ACESSO DE CONVIDADOS (2 NÍVEIS)</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(223, 207, 168, 0.12)',
              border: '1px solid rgba(223, 207, 168, 0.4)',
              color: '#FEFCF5',
              width: '26px',
              height: '26px',
              borderRadius: '2px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Corpo do Modal */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'GUEST' ? (
            <form
              onSubmit={handleActivateGuest}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ fontSize: '12px', color: '#3F3F46', lineHeight: 1.45 }}>
                O Painel Executivo é protegido por senha com <strong>2 Níveis de Acesso</strong>.
                Você pode emitir uma senha para um convidado externo (ex.: Contador, Advogado,
                Consultor ou Atendente SAC) escolhendo o nível abaixo:
              </div>

              {guestError && (
                <div
                  style={{
                    padding: '9px 12px',
                    background: 'rgba(220, 38, 38, 0.14)',
                    border: '1px solid #DC2626',
                    color: '#991B1B',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {guestError}
                </div>
              )}

              {guestSuccess && (
                <div
                  style={{
                    padding: '9px 12px',
                    background: 'rgba(5, 150, 105, 0.16)',
                    border: '1px solid #059669',
                    color: '#065F46',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {guestSuccess}
                </div>
              )}

              {/* Grid dos 2 Níveis */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                {/* NÍVEL 1 */}
                <div
                  onClick={() => handleSelectLevel(1)}
                  style={{
                    background: selectedLevel === 1 ? '#FEFCF5' : '#F4F4F6',
                    border:
                      selectedLevel === 1 ? '2px solid #000000' : '2px solid rgba(0, 0, 0, 0.22)',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 7px',
                      background: 'rgba(0, 0, 0, 0.76)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      color: '#FEFCF5',
                      alignSelf: 'flex-start',
                      borderRadius: '2px',
                    }}
                  >
                    NÍVEL 1 · PAINEL
                  </span>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#000000' }}>
                    Acesso Somente ao Painel
                  </div>
                  <div style={{ fontSize: '11px', color: '#3F3F46', lineHeight: 1.4 }}>
                    O convidado visualiza os indicadores e tabelas autorizadas do Painel,{' '}
                    <strong>sem acesso à Sala de Reuniões</strong> e sem voto na Urna.
                  </div>
                </div>

                {/* NÍVEL 2 */}
                <div
                  onClick={() => handleSelectLevel(2)}
                  style={{
                    background: selectedLevel === 2 ? '#FEFCF5' : '#F4F4F6',
                    border:
                      selectedLevel === 2 ? '2px solid #000000' : '2px solid rgba(0, 0, 0, 0.22)',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 7px',
                      background: 'rgba(0, 0, 0, 0.76)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      color: '#FEFCF5',
                      alignSelf: 'flex-start',
                      borderRadius: '2px',
                    }}
                  >
                    NÍVEL 2 · PAINEL + SALA DE REUNIÕES
                  </span>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#000000' }}>
                    Painel + Sala de Reuniões
                  </div>
                  <div style={{ fontSize: '11px', color: '#3F3F46', lineHeight: 1.4 }}>
                    Ideal para <strong>Contador / Consultor</strong>: acessa o Painel{' '}
                    <strong>e entra na Sala de Reuniões</strong> (chat, anexos e chamada de vídeo
                    com os 4 sócios).
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#000000',
                  }}
                >
                  Identificação do Convidado:
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ex: Contador (Contabilidade) / Consultor Fiscal"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #000000',
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#000000',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#000000',
                  }}
                >
                  Senha Temporária Gerada:
                </label>
                <input
                  type="text"
                  value={guestCode}
                  onChange={(e) => setGuestCode(e.target.value)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #000000',
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#000000',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  paddingTop: '6px',
                }}
              >
                <button
                  type="button"
                  className={styles.executiveHeaderBtn}
                  onClick={() => setActiveTab('PERSONAL')}
                >
                  Minha Senha de Sócio ({userName || 'Sócio'})
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className={styles.executiveHeaderBtn}
                    onClick={onClose}
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={guestLoading}
                  >
                    {guestLoading ? 'Ativando...' : 'Ativar Senha Convidado'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitPersonal}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>
                  Alterar Senha Pessoal do Sócio: <strong>{userName}</strong>
                </div>
                <button
                  type="button"
                  className={styles.executiveHeaderBtn}
                  onClick={() => setActiveTab('GUEST')}
                >
                  ← Voltar para Convidados (2 Níveis)
                </button>
              </div>

              {error && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(220, 38, 38, 0.14)',
                    border: '1px solid #DC2626',
                    color: '#991B1B',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(5, 150, 105, 0.16)',
                    border: '1px solid #059669',
                    color: '#065F46',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {success}
                </div>
              )}

              <div>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#27272A',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite a senha atual"
                  disabled={loading}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#FFFFFF',
                    border: '1px solid #000000',
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#27272A',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Nova Senha (Mínimo 6 dígitos)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  disabled={loading}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#FFFFFF',
                    border: '1px solid #000000',
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#27272A',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  disabled={loading}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: '#FFFFFF',
                    border: '1px solid #000000',
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-end',
                  marginTop: '6px',
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className={styles.executiveHeaderBtn}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.btnPrimary}
                >
                  {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
