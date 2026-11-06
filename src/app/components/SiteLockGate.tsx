"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { verifySiteLockPassword } from "@/lib/siteLockActions";
import styles from "./SiteLockGate.module.css";

interface SiteLockGateProps {
  isLocked: boolean;
  hasValidCookie: boolean;
  children: React.ReactNode;
}

export default function SiteLockGate({
  isLocked,
  hasValidCookie,
  children,
}: SiteLockGateProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [unlocked, setUnlocked] = useState(hasValidCookie);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // As rotas administrativas permanecem sempre acessíveis para o lojista
  const isAdminRoute = pathname?.startsWith("/admin");

  if (!isLocked || unlocked || isAdminRoute) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const res = await verifySiteLockPassword(password);
      if (res.success) {
        setUnlocked(true);
        router.refresh();
      } else {
        setError(res.error || "Senha incorreta.");
      }
    } catch {
      setError("Erro ao validar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.lockScreen}>
      <div className={styles.lockCard}>
        <div className={styles.logoWrapper}>
          <Image
            src="/imagens/LOGO/logo_ava_transparent.png"
            alt="AVA Sem Limites"
            width={400}
            height={200}
            className={styles.logoImage}
            priority
          />
        </div>

        <p className={styles.message}>Resignificando... voltamos em breve!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            className={styles.passwordInput}
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
