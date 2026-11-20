'use client';

import React, { useState } from 'react';
import styles from './admin-cockpit.module.css';

interface ChangePasswordModalProps {
  userName?: string;
  onClose: () => void;
}

export default function ChangePasswordModal({ userName, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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
        setSuccess('✅ Senha alterada com sucesso no banco de dados!');
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
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
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
          background: '#DFCFA8',
          border: '1px solid rgba(0, 0, 0, 0.28)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: '420px',
          padding: '24px',
          borderRadius: '2px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#000000', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔑 Alterar Senha Pessoal
            </h3>
            {userName && (
              <p style={{ fontSize: '11px', color: '#3F3F46', margin: '4px 0 0 0' }}>
                Usuário: <strong>{userName}</strong>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.32)',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '4px 8px',
              fontWeight: 700,
              color: '#000000',
              borderRadius: '2px',
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 12px', background: 'rgba(220, 38, 38, 0.14)', border: '1px solid #DC2626', color: '#991B1B', fontSize: '12px', marginBottom: '14px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '10px 12px', background: 'rgba(5, 150, 105, 0.16)', border: '1px solid #059669', color: '#065F46', fontSize: '12px', marginBottom: '14px', fontWeight: 600 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#27272A', display: 'block', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
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
                background: '#EFE4CC',
                border: '1px solid rgba(0,0,0,0.25)',
                color: '#000000',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#27272A', display: 'block', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
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
                background: '#EFE4CC',
                border: '1px solid rgba(0,0,0,0.25)',
                color: '#000000',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#27272A', display: 'block', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
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
                background: '#EFE4CC',
                border: '1px solid rgba(0,0,0,0.25)',
                color: '#000000',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={styles.btnSecondary}
              style={{ fontSize: '11px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.btnPrimary}
              style={{ fontSize: '11px' }}
            >
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
