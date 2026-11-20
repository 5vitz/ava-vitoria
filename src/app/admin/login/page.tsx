"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Se houver erro vindo da URL (ex: erro geral do NextAuth)
  const urlError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  // Modo Recuperação de Senha
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryMasterKey, setRecoveryMasterKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Tente novamente.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRecoveryMessage("");

    if (!username || !recoveryMasterKey || !newPassword) {
      setError("Preencha o usuário, a chave mestra e a nova senha.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          masterKey: recoveryMasterKey,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao redefinir a senha.");
      } else {
        setRecoveryMessage("✅ Senha redefinida com sucesso! Você já pode entrar.");
        setPassword(newPassword);
        setTimeout(() => {
          setIsRecovering(false);
        }, 1500);
      }
    } catch {
      setError("Erro de conexão ao recuperar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h1 className={styles.title}>AVA Vitória</h1>
        <p className={styles.subtitle}>
          {isRecovering ? "Recuperação de Acesso" : "Painel de Controle"}
        </p>
      </div>

      {!isRecovering ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          {(error || urlError) && (
            <div className={styles.error}>
              {error || "Falha na autenticação. Verifique suas credenciais."}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Usuário
            </label>
            <input
              type="text"
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, armando, flavio, tripoint..."
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Acessar"}
          </button>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => {
                setIsRecovering(true);
                setError("");
                setRecoveryMessage("");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#A0A0A0",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Esqueci minha senha
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          {recoveryMessage && (
            <div style={{ padding: "10px", background: "rgba(5, 150, 105, 0.2)", border: "1px solid #059669", color: "#34D399", fontSize: "12px" }}>
              {recoveryMessage}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="rec-username" className={styles.label}>
              Seu Usuário
            </label>
            <input
              type="text"
              id="rec-username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: armando, flavio, tripoint, gustavo"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="rec-master" className={styles.label}>
              Chave Mestra da Diretoria
            </label>
            <input
              type="password"
              id="rec-master"
              className={styles.input}
              value={recoveryMasterKey}
              onChange={(e) => setRecoveryMasterKey(e.target.value)}
              placeholder="Digite a chave de emergência"
              disabled={loading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="rec-newpw" className={styles.label}>
              Nova Senha Desejada
            </label>
            <input
              type="password"
              id="rec-newpw"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => {
                setIsRecovering(false);
                setError("");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#A0A0A0",
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← Voltar ao Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={
        <div className={styles.loginCard} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p className={styles.subtitle}>Carregando painel...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
