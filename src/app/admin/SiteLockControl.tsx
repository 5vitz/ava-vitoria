"use client";

import React, { useState } from "react";
import { updateSiteLockConfig } from "@/lib/siteLockActions";
import { useRouter } from "next/navigation";

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
    <div
      style={{
        backgroundColor: "rgba(31, 8, 15, 0.35)",
        border: `1px solid ${isLocked ? "#ff4d4d" : "rgba(212, 175, 55, 0.45)"}`,
        padding: "20px 25px",
        marginBottom: "25px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isLocked ? "#ff4d4d" : "#22c55e",
            }}
          />
          <strong
            style={{
              fontFamily: "var(--font-title), sans-serif",
              fontSize: "1rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#FFFFFF",
            }}
          >
            Portaria da Loja:{" "}
            <span style={{ color: isLocked ? "#ff4d4d" : "#22c55e" }}>
              {isLocked ? "FECHADA (Apenas com Senha)" : "ABERTA AO PÚBLICO"}
            </span>
          </strong>
        </div>
        <span style={{ fontSize: "0.82rem", color: "#A0A0A0" }}>
          Quando fechada, exibe a tela &ldquo;Resignificando... voltamos em breve!&rdquo; e pede apenas a senha abaixo.
        </span>
        {feedback && (
          <span
            style={{
              fontSize: "0.82rem",
              color: "#D4AF37",
              marginTop: "4px",
            }}
          >
            {feedback}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSavePasswordOnly}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#A0A0A0",
            }}
          >
            Senha:
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              padding: "10px 14px",
              fontSize: "0.9rem",
              width: "160px",
              outline: "none",
            }}
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleToggleLock(!isLocked)}
          style={{
            backgroundColor: isLocked ? "#22c55e" : "#ff4d4d",
            border: "none",
            color: isLocked ? "#000000" : "#FFFFFF",
            padding: "10px 20px",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
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
          style={{
            backgroundColor: "transparent",
            border: "1px solid #D4AF37",
            color: "#D4AF37",
            padding: "10px 16px",
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          Salvar Senha
        </button>
      </form>
    </div>
  );
}
