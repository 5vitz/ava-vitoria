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
            <h1 className={styles.moduleTitle}>Depto 05 · SAC</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Gustavo</strong> · Retenção 95%-98% por IA (Concierge 24/7 + Discriminador) e Gatilho de Terceirização BPO (5 Atendimentos Humanos)
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Gustavo
          </span>
        </div>

        {actionFeedback && (
          <div style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(5,150,105,0.4)', color: '#065F46', fontSize: '13px', marginBottom: '20px', fontWeight: 600 }}>
            {actionFeedback}
          </div>
        )}

        <div className={styles.moduleGrid2Cols}>
          {/* Fila de Chamados e Triagem */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Fila Operacional de Trocas &amp; Devoluções</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#000000', fontSize: '13px' }}>
                      {ticket.id} · {ticket.client} ({ticket.order})
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      fontWeight: 700,
                      background: ticket.status === 'APROVADO' ? 'rgba(5,150,105,0.14)' : ticket.status === 'TRANSBORDADO' ? 'rgba(220,38,38,0.14)' : 'rgba(217,119,6,0.14)',
                      color: ticket.status === 'APROVADO' ? '#065F46' : ticket.status === 'TRANSBORDADO' ? '#991B1B' : '#92400E',
                      border: '1px solid',
                      borderColor: ticket.status === 'APROVADO' ? 'rgba(5,150,105,0.3)' : ticket.status === 'TRANSBORDADO' ? 'rgba(220,38,38,0.3)' : 'rgba(217,119,6,0.3)'
                    }}>
                      {ticket.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#27272A', marginBottom: '8px' }}>{ticket.reason}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#4B5563' }}>
                    <span>Responsável: <strong style={{ color: '#000000' }}>{ticket.assignedPartner}</strong></span>
                    <span>SLA: <strong style={{ color: '#000000' }}>{ticket.slaHoursLeft}h restantes</strong></span>
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

          {/* Manifesto do Zagueiro-Artilheiro + Gatilho de Terceirização BPO */}
          <div className={styles.moduleCard} data-boardroom-anchor="right-card">
            <h2 className={styles.cardHeading}>Cláusula Anti-Sobrecarga &amp; Gatilho de Terceirização BPO (5 Atendimentos)</h2>
            <div style={{ fontSize: '13px', color: '#18181B', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '12px' }}>
                95% a 98% dos atendimentos são resolvidos 24/7 pelos Agentes de IA (<strong>Concierge IA</strong> e <strong>Discriminador de Ocorrências</strong>). O sócio titular (<strong>Gustavo</strong>) atua como Diretor da Pasta.
              </p>

              <div style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.18)', marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                  🎯 Gatilho Objetivo (Marca de 5 Atendimentos Humanos Recorrentes):
                </div>
                <p style={{ fontSize: '12px', color: '#374151', margin: 0 }}>
                  Ao atingir <strong>5 atendimentos humanos recorrentes</strong> por ciclo operacional (~75 a 150 chamados/mês), a fila humana é terceirizada para um <strong>Secretariado Virtual Compartilhado / Call Center BPO</strong> (custo de mercado: <strong>R$ 600 a R$ 850/mês</strong>, equivalente ao lucro de ~6 camisetas/mês), operando no Painel com <strong>🔑 Senha Convidado Nível 1</strong> (sem acesso à Sala de Reuniões).
                </p>
              </div>

              <div style={{ padding: '14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, color: '#000000', marginBottom: '4px' }}>Filosofia do Zagueiro-Artilheiro (Transbordo Automático):</div>
                <p style={{ fontSize: '12px', color: '#374151' }}>
                  Se o titular do dia não acionar a autorização em 2 horas, o sistema escala imediatamente para os <strong>outros 3 sócios</strong> via WhatsApp com deep link de aprovação instantânea.
                </p>
              </div>

              <div style={{ padding: '12px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: 600 }}>Status do Concierge IA 24/7 na Loja Pública:</span>
                <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700, marginTop: '2px' }}>
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
