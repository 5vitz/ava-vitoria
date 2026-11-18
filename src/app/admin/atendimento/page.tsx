'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface TicketItem {
  id: string;
  client: string;
  order: string;
  type: 'CDC49_TAMANHO' | 'DEFEITO_FABRICA';
  reason: string;
  assignedPartner: string;
  slaHoursLeft: number;
  status: 'PENDENTE_APROVACAO' | 'APROVADO' | 'TRANSBORDADO';
}

const INITIAL_TICKETS: TicketItem[] = [
  {
    id: 'TCK-2026-01',
    client: 'Lucas Andrade',
    order: '#AVA-1048',
    type: 'CDC49_TAMANHO',
    reason: 'Solicitação de troca do tamanho M para G na T-Shirt Prime Branca.',
    assignedPartner: 'Sócio Titular de Atendimento',
    slaHoursLeft: 1.5,
    status: 'PENDENTE_APROVACAO'
  },
  {
    id: 'TCK-2026-02',
    client: 'Mariana Silveira',
    order: '#AVA-1035',
    type: 'DEFEITO_FABRICA',
    reason: 'Pequena falha na junção da gola. Duas fotos anexadas para acionamento de garantia Dimona.',
    assignedPartner: 'Armando Sinkovitz (Transbordo Automático)',
    slaHoursLeft: 0.5,
    status: 'TRANSBORDADO'
  }
];

export default function AtendimentoAdminPage() {
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'APROVADO' } : t));
    setActionFeedback(`Chamado ${id} aprovado com sucesso! Código de postagem reversa gerado e enviado ao cliente.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleSimulateWhatsAppAlert = (id: string) => {
    setActionFeedback(`📲 Alerta WhatsApp enviado com Deep Link de 1-Clique aos 4 Sócios para o chamado ${id}!`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 04 · Atendimento &amp; SAC Anti-Omissão</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Gustavo</strong> · Triagem em 2 Vias (Agente Discriminador) e Transbordo aos 4 Sócios (Zagueiro-Artilheiro)
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Gustavo
          </span>
        </div>

        {actionFeedback && (
          <div style={{ padding: '14px', background: '#0F1814', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: '13px', marginBottom: '20px' }}>
            {actionFeedback}
          </div>
        )}

        <div className={styles.moduleGrid2Cols}>
          {/* Fila de Chamados e Triagem */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Fila Operacional de Trocas &amp; Devoluções</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{ padding: '14px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px' }}>
                      {ticket.id} · {ticket.client} ({ticket.order})
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      fontWeight: 600,
                      background: ticket.status === 'APROVADO' ? 'rgba(16,185,129,0.2)' : ticket.status === 'TRANSBORDADO' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: ticket.status === 'APROVADO' ? '#10B981' : ticket.status === 'TRANSBORDADO' ? '#EF4444' : '#F59E0B'
                    }}>
                      {ticket.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#D1D2D6', marginBottom: '8px' }}>{ticket.reason}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#8E8F94' }}>
                    <span>Responsável: <strong>{ticket.assignedPartner}</strong></span>
                    <span>SLA: <strong>{ticket.slaHoursLeft}h restantes</strong></span>
                  </div>

                  {ticket.status !== 'APROVADO' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button onClick={() => handleApprove(ticket.id)} className={styles.btnPrimary} style={{ fontSize: '10px' }}>
                        ✓ Aprovar Troca 1-Clique
                      </button>
                      <button onClick={() => handleSimulateWhatsAppAlert(ticket.id)} className={styles.btnSecondary} style={{ fontSize: '10px' }}>
                        📲 Disparar WhatsApp aos 4 Sócios
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Manifesto do Zagueiro-Artilheiro */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Filosofia do Zagueiro-Artilheiro (SLA Anti-Omissão)</h2>
            <div style={{ fontSize: '13px', color: '#D1D2D6', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '12px' }}>
                Na <strong>AVA Sem Limites</strong>, nenhum cliente pode esperar mais de 4 horas por uma resposta de troca ou garantia.
              </p>
              <div style={{ padding: '14px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' }}>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>Regra de Transbordo Automático:</div>
                <p style={{ fontSize: '12px', color: '#8E8F94' }}>
                  Se o sócio titular do dia não acionar a autorização em 2 horas, o sistema escala imediatamente para os <strong>outros 3 sócios</strong> via WhatsApp com deep link de aprovação instantânea.
                </p>
                <div style={{ fontSize: '12px', color: '#10B981', fontStyle: 'italic', marginTop: '6px' }}>
                  &quot;Nada impede o zagueiro de avançar e marcar o gol para resguardar a reputação da empresa.&quot;
                </div>
              </div>

              <div style={{ padding: '12px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: '#8E8F94' }}>Status do Concierge IA 24/7 na Loja Pública:</span>
                <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
                  ● Operando online em /atendimento respondendo dúvidas de modelagem, prazos e cuidados.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
