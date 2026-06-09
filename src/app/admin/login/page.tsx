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
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/design-system";

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
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h1 className={styles.title}>AVA Vitória</h1>
        <p className={styles.subtitle}>Painel de Controle</p>
      </div>

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
            placeholder="Digite o usuário"
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
      </form>
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
