'use client';

import React from 'react';
import { AgentDossier } from './agentDossierData';
import styles from './AgentDossierModal.module.css';

interface AgentDossierModalProps {
  agent: AgentDossier;
  onClose: () => void;
}

export default function AgentDossierModal({ agent, onClose }: AgentDossierModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.agentTitleArea}>
            <div className={styles.agentNameRow}>
              <h2 className={styles.agentName}>{agent.name}</h2>
              <span
                className={`${styles.statusIndicator} ${
                  agent.status === 'ACTIVE' ? styles.statusActive : styles.statusStandby
                }`}
              >
                ● {agent.statusLabel}
              </span>
            </div>
            <div className={styles.agentRole}>{agent.role}</div>
            <div className={styles.agentDepto}>{agent.department}</div>
          </div>

          <button onClick={onClose} className={styles.closeButton} aria-label="Fechar Dossiê">
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.sectionBlock}>
            <div className={styles.sectionLabel}>
              <span>⚙️</span> 1. O que faz na empresa
            </div>
            <div className={styles.sectionText}>{agent.whatItDoes}</div>
          </div>

          <div className={styles.sectionBlock}>
            <div className={styles.sectionLabel}>
              <span>🛡️</span> 2. Por que faz (Justificativa Estratégica)
            </div>
            <div className={styles.sectionText}>{agent.whyItDoes}</div>
          </div>

          <div className={styles.sectionBlock}>
            <div className={styles.sectionLabel}>
              <span>🧩</span> 3. Como faz (Engrenagem Técnica)
            </div>
            <div className={styles.sectionText}>{agent.howItDoes}</div>
          </div>

          <div className={styles.humanRoiBlock}>
            <div className={styles.humanRoiLabel}>
              <span>💎</span> 4. Economia
            </div>
            <div className={styles.humanRoiText}>{agent.humanRoi}</div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.footerCloseButton}>
            Fechar Ficha Técnica
          </button>
        </div>
      </div>
    </div>
  );
}
