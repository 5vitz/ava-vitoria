"use client";

import React, { useState } from "react";
import { updateSiteLockConfig } from "@/lib/siteLockActions";
import { useRouter } from "next/navigation";
import styles from "./admin-cockpit.module.css";

interface SiteLockControlProps {
  initialIsLocked: boolean;
  initialPassword: string;
}

export default function SiteLockControl({
  initialIsLocked,
  initialPassword,
}: SiteLockControlProps) {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(initialIsLocked);
  const [password, setPassword] = useState(initialPassword || "avanovaera!");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleToggleLock = async (nextLockedState: boolean) => {
    setLoading(true);
    setFeedback("");
    try {
      const res = await updateSiteLockConfig(nextLockedState, password);
      if (res.success) {
        setIsLocked(res.config.isLocked);
        setPassword(res.config.password);
        setFeedback(
          res.config.isLocked
            ? "🔒 Site FECHADO! Agora exige senha para entrar."
            : "🔓 Site ABERTO ao público!"
        );
        router.refresh();
      }
    } catch (err: any) {
      setFeedback(err.message || "Erro ao atualizar bloqueio.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePasswordOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleToggleLock(isLocked);
  };

  return (
    <div className={`${styles.moduleCard} ${styles.flexRowBetween} ${styles.moduleCardSpaced}`}>
      <div className={styles.flexColTight}>
        <div className={styles.flexRowStart}>
          <span className={`${styles.ledDot} ${isLocked ? styles.ledDelayed : styles.ledOnline}`} />
          <strong className={styles.cardHeadingNoBorder}>
            Portaria da Loja:{" "}
            <span className={isLocked ? styles.textDanger : styles.textSuccess}>
              {isLocked ? "FECHADA (Apenas com Senha)" : "ABERTA AO PÚBLICO"}
            </span>
          </strong>
        </div>
        <span className={styles.textBodySmall}>
          Quando fechada, exibe a tela &ldquo;Resignificando... voltamos em breve!&rdquo; e pede apenas a senha abaixo.
        </span>
        {feedback && (
          <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
            {feedback}
          </span>
        )}
      </div>

      <form onSubmit={handleSavePasswordOnly} className={styles.flexRowStart}>
        <div className={styles.flexRowStart}>
          <label className={styles.kpiLabel}>Senha:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={styles.formInput}
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleToggleLock(!isLocked)}
          className={isLocked ? styles.btnSuccess : styles.btnPrimary}
        >
          {loading
            ? "Salvando..."
            : isLocked
            ? "🔓 Abrir Site ao Público"
            : "🔒 Fechar Site com Senha"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className={styles.btnSecondary}
        >
          Salvar Senha
        </button>
      </form>
    </div>
  );
}
