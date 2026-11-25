'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '../../AdminHeader';
import styles from './assinaturas.module.css';
import {
  INITIAL_SUBSCRIPTIONS,
  SubscriptionItem,
  SubscriptionCategory,
  CriticalityLevel,
  PayerAccountType,
} from '@/lib/subscriptionsData';

export default function AssinaturasPage() {
  const [items, setItems] = useState<SubscriptionItem[]>(INITIAL_SUBSCRIPTIONS);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPayer, setFilterPayer] = useState<string>('ALL');
  const [filterCriticality, setFilterCriticality] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedImpactId, setExpandedImpactId] = useState<string | null>(null);

  // Modal de Proposta para Urna 4/4
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalServiceName, setProposalServiceName] = useState('');
  const [proposalCategory, setProposalCategory] = useState<SubscriptionCategory>('CRIATIVO_ATELIER');
  const [proposalCostBrl, setProposalCostBrl] = useState<number>(115);
  const [proposalJustification, setProposalJustification] = useState('');
  const [proposalProposer, setProposalProposer] = useState('Flávio (Financeiro)');
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/financeiro/subscriptions');
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados de assinaturas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Cálculos de Resumo Financeiro
  const activeItems = items.filter((i) => i.status === 'ATIVO');
  const totalMonthlyActive = activeItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const underEvalItems = items.filter((i) => i.status === 'EM_AVALIACAO');
  const totalUnderEval = underEvalItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const personalArmandoItems = activeItems.filter((i) => i.payerAccount === 'PESSOAL_ARMANDO');
  const totalPersonalArmando = personalArmandoItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const companyPjItems = activeItems.filter((i) => i.payerAccount === 'CONTA_PJ_AVA');
  const totalCompanyPj = companyPjItems.reduce((acc, curr) => acc + curr.monthlyCostBrl, 0);

  const criticalItems = activeItems.filter((i) => i.criticality === 'CRITICA');

  // Filtragem da Tabela
  const filteredItems = items.filter((item) => {
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (filterPayer !== 'ALL' && item.payerAccount !== filterPayer) return false;
    if (filterCriticality !== 'ALL' && item.criticality !== filterCriticality) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.serviceName.toLowerCase().includes(q);
      const matchPurpose = item.purpose.toLowerCase().includes(q);
      const matchAgent = item.dependentAgents.some((a) => a.name.toLowerCase().includes(q));
      if (!matchName && !matchPurpose && !matchAgent) return false;
    }
    return true;
  });

  const handleOpenProposalModal = (prefillItem?: SubscriptionItem) => {
    if (prefillItem) {
      setProposalServiceName(prefillItem.serviceName);
      setProposalCategory(prefillItem.category);
      setProposalCostBrl(prefillItem.monthlyCostBrl);
      setProposalJustification(
        `Deliberação de contratação formal / transição de titularidade para a conta PJ da AVA Sem Limites do serviço ${prefillItem.serviceName}.`
      );
    } else {
      setProposalServiceName('');
      setProposalCategory('CRIATIVO_ATELIER');
      setProposalCostBrl(115);
      setProposalJustification('');
    }
    setIsModalOpen(true);
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalServiceName.trim()) return;

    setSubmittingProposal(true);
    try {
      const res = await fetch('/api/financeiro/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PROPOSE_TO_URNA',
          proposal: {
            serviceName: proposalServiceName,
            category: proposalCategory,
            monthlyCostBrl: proposalCostBrl,
            justification: proposalJustification,
            proposer: proposalProposer,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setIsModalOpen(false);
      } else {
        setToastMessage('Erro ao enviar proposta para a Urna.');
      }
    } catch {
      setToastMessage('Falha de conexão ao submeter proposta.');
    } finally {
      setSubmittingProposal(false);
      setTimeout(() => setToastMessage(null), 6000);
    }
  };

  return (
    <div className={styles.container}>
      <AdminHeader />

      <main className={styles.mainContent}>
        {/* Top Header */}
        <div className={styles.headerBar}>
          <div className={styles.titleArea}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Link href="/admin/financeiro" className={styles.btnSecondary} style={{ padding: '4px 8px', fontSize: '11px' }}>
                ← Depto 02 (Financeiro)
              </Link>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>/</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000', textTransform: 'uppercase' }}>
                Gerenciar Assinaturas &amp; Ferramentas
              </span>
            </div>
            <h1>Matriz de Assinaturas, APIs &amp; Ferramentas dos 23 Agentes</h1>
            <p>
              Sócio Titular: <strong>Flávio</strong> · Gestão de Custos Fixos, Mapeamento de Titularidade (Pessoal vs PJ) e Deliberação Colegiada 4/4
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              onClick={() => handleOpenProposalModal()}
              className={styles.btnPrimary}
              title="Convocar os 4 sócios para deliberar sobre uma nova assinatura ou cancelamento"
            >
              🗳️ Convocar Votação 4/4 (Nova Ferramenta)
            </button>
          </div>
        </div>

        {/* Notificação Toast */}
        {toastMessage && (
          <div
            style={{
              padding: '12px 18px',
              background: '#F4F4F6',
              border: '1px solid rgba(5, 150, 105, 0.5)',
              color: '#065F46',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* KPI Grid */}
        <div className={styles.kpiGrid}>
          {/* Card 1: Custo Mensal Ativo */}
          <div className={styles.kpiCard}>
            <div>
              <div className={styles.kpiLabel}>Custo Fixo Mensal Ativo</div>
              <div className={styles.kpiValue}>
                R$ {totalMonthlyActive.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.kpiSubtext}>
              {activeItems.length} ferramentas operacionais em produção.
            </div>
          </div>

          {/* Card 2: Titularidade Pessoal Armando (Ressarcimento) */}
          <div className={styles.kpiCard} style={{ borderLeft: '4px solid #B91C1C' }}>
            <div>
              <div className={styles.kpiLabel} style={{ color: '#991B1B' }}>
                👤 Cartão Pessoal Armando (A Migrar)
              </div>
              <div className={styles.kpiValue} style={{ color: '#991B1B' }}>
                R$ {totalPersonalArmando.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.kpiSubtext}>
              {personalArmandoItems.length} serviços (Contabo, Google AI Studio, Domínio) mantidos pessoalmente pelo sócio Armando.
            </div>
          </div>

          {/* Card 3: Conta PJ AVA */}
          <div className={styles.kpiCard}>
            <div>
              <div className={styles.kpiLabel}>🏢 Conta PJ AVA (MEI Ativo)</div>
              <div className={styles.kpiValue}>
                R$ {totalCompanyPj.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.kpiSubtext}>
              Bling ERP + Certificado e-CNPJ A1 emitidos com a Inscrição Estadual ativa.
            </div>
          </div>

          {/* Card 4: Projeção com Ferramentas em Avaliação */}
          <div className={styles.kpiCard}>
            <div>
              <div className={styles.kpiLabel}>Projeção (+ Magnific AI em Teste)</div>
              <div className={styles.kpiValue} style={{ color: '#92400E' }}>
                R$ {(totalMonthlyActive + totalUnderEval).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.kpiSubtext}>
              Considerando inclusão de ferramentas sob estudo técnico no Atelier Tripoint.
            </div>
          </div>
        </div>

        {/* Pareceres Estratégicos & Governança */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Alerta de Dependência Crítica dos 23 Agentes */}
          <div className={`${styles.alertCard} ${styles.alertCardCritical}`}>
            <div className={styles.alertHeading}>
              <span>🚨</span>
              <span>Interdependência Sistêmica &amp; Risco de Inadimplência</span>
            </div>
            <p className={styles.alertText}>
              Cada um dos <strong>23 agentes autônomos</strong> depende de ferramentas específicas para exercer sua função especializada.
              Se uma assinatura vencer ou for cortada por falta de pagamento, o ecossistema sofre efeito dominó: corte do Contabo derruba o banco de dados; corte do Google AI paralisa os cérebros analíticos; corte do Bling trava a emissão fiscal na SEFAZ e desativa os 10 canais de venda.
            </p>
          </div>

          {/* Alerta da Dimona e Preço de Fábrica */}
          <div className={`${styles.alertCard} ${styles.alertCardInfo}`}>
            <div className={styles.alertHeading}>
              <span>🏭</span>
              <span>Fornecedores PoD: Destravamento da Tabela de Lojista</span>
            </div>
            <p className={styles.alertText}>
              A <strong>Dimona (Dropsimples)</strong> possui mensalidade fixa R$ 0,00, mas contas avulsas pagam preço de consumidor final.
              Para obter o custo real de atacado (Silk HD de R$ 38 a R$ 58), é imperativo <strong>submeter o CNPJ e a Inscrição Estadual já existentes</strong> ao canal B2B da Dimona Corporate. A Reserva INK (R$ 159/mês) e Montink (R$ 149/mês) permanecem em standby como alternativas homologadas.
            </p>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div className={styles.filterBar} style={{ marginBottom: 0 }}>
            <button
              onClick={() => { setFilterCategory('ALL'); setFilterPayer('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterCategory === 'ALL' && filterPayer === 'ALL' && filterCriticality === 'ALL' ? styles.filterBtnActive : ''}`}
            >
              Todas ({items.length})
            </button>
            <button
              onClick={() => { setFilterCategory('INFRAESTRUTURA'); setFilterPayer('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterCategory === 'INFRAESTRUTURA' ? styles.filterBtnActive : ''}`}
            >
              Infraestrutura
            </button>
            <button
              onClick={() => { setFilterCategory('IA_AGENTES'); setFilterPayer('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterCategory === 'IA_AGENTES' ? styles.filterBtnActive : ''}`}
            >
              IA &amp; Agentes
            </button>
            <button
              onClick={() => { setFilterCategory('ERP_FISCAL'); setFilterPayer('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterCategory === 'ERP_FISCAL' ? styles.filterBtnActive : ''}`}
            >
              ERP &amp; Fiscal (Bling)
            </button>
            <button
              onClick={() => { setFilterCategory('CRIATIVO_ATELIER'); setFilterPayer('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterCategory === 'CRIATIVO_ATELIER' ? styles.filterBtnActive : ''}`}
            >
              Atelier &amp; Criação
            </button>
            <button
              onClick={() => { setFilterCategory('FORNECEDOR_POD'); setFilterPayer('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterCategory === 'FORNECEDOR_POD' ? styles.filterBtnActive : ''}`}
            >
              Fornecedores PoD
            </button>
            <button
              onClick={() => { setFilterPayer('PESSOAL_ARMANDO'); setFilterCategory('ALL'); setFilterCriticality('ALL'); }}
              className={`${styles.filterBtn} ${filterPayer === 'PESSOAL_ARMANDO' ? styles.filterBtnActive : ''}`}
              style={{ color: filterPayer === 'PESSOAL_ARMANDO' ? '#E4E4E7' : '#991B1B' }}
            >
              👤 Cartão Armando ({personalArmandoItems.length})
            </button>
            <button
              onClick={() => { setFilterCriticality('CRITICA'); setFilterCategory('ALL'); setFilterPayer('ALL'); }}
              className={`${styles.filterBtn} ${filterCriticality === 'CRITICA' ? styles.filterBtnActive : ''}`}
              style={{ color: filterCriticality === 'CRITICA' ? '#E4E4E7' : '#B91C1C' }}
            >
              🚨 Críticas ({criticalItems.length})
            </button>
          </div>

          <div style={{ minWidth: '220px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar serviço ou agente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.formInput}
              style={{ padding: '6px 10px', fontSize: '11px' }}
            />
          </div>
        </div>

        {/* Tabela de Assinaturas */}
        <div className={styles.tableContainer}>
          <table className={styles.subTable}>
            <thead>
              <tr>
                <th>Ferramenta / Serviço</th>
                <th>Categoria</th>
                <th>Custo Mensal (BRL)</th>
                <th>Ciclo</th>
                <th>Titularidade Atual</th>
                <th>Status</th>
                <th>Criticidade</th>
                <th>Agentes Dependentes</th>
                <th>Sócio</th>
                <th style={{ textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isArmando = item.payerAccount === 'PESSOAL_ARMANDO';
                const isUnderEval = item.status === 'EM_AVALIACAO';
                const isExpanded = expandedImpactId === item.id;

                return (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td style={{ fontWeight: 700 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{item.serviceName}</span>
                          {item.supplierType === 'FABRICA' && (
                            <span style={{ fontSize: '9px', background: '#000000', padding: '1px 4px', border: '1px solid #000000' }}>
                              FÁBRICA
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#4B5563', fontWeight: 400, marginTop: '2px', maxWidth: '280px' }}>
                          {item.purpose}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '11px', color: '#374151', fontWeight: 600 }}>
                          {item.categoryLabel}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: item.monthlyCostBrl > 0 ? '#000000' : '#065F46' }}>
                          {item.monthlyCostBrl === 0
                            ? 'R$ 0,00 (Sem Fixa)'
                            : `R$ ${item.monthlyCostBrl.toFixed(2)}`}
                        </div>
                        {item.originalCurrencyCost && (
                          <div style={{ fontSize: '10px', color: '#6B7280' }}>
                            {item.originalCurrencyCost}
                          </div>
                        )}
                      </td>

                      <td>
                        <span style={{ fontSize: '11px', color: '#4B5563' }}>
                          {item.billingCycle}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${
                            isArmando
                              ? styles.badgePayerArmando
                              : styles.badgePayerPJ
                          }`}
                        >
                          {item.payerLabel}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${
                            item.status === 'ATIVO'
                              ? styles.badgeActive
                              : item.status === 'EM_AVALIACAO'
                              ? styles.badgeUnderEval
                              : styles.badgeStandby
                          }`}
                        >
                          {item.statusLabel}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${
                            item.criticality === 'CRITICA'
                              ? styles.badgeCritical
                              : item.criticality === 'ALTA'
                              ? styles.badgeHigh
                              : styles.badgeMedium
                          }`}
                        >
                          {item.criticality}
                        </span>
                      </td>

                      <td style={{ maxWidth: '240px' }}>
                        <div>
                          {item.dependentAgents.slice(0, 3).map((ag) => (
                            <span key={ag.id} className={styles.agentChip} title={ag.name}>
                              {ag.name}
                            </span>
                          ))}
                          {item.dependentAgents.length > 3 && (
                            <span className={styles.agentChip} style={{ fontWeight: 700 }}>
                              +{item.dependentAgents.length - 3} mais
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <strong style={{ fontSize: '11px', color: '#000000' }}>{item.responsiblePartner}</strong>
                      </td>

                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          <button
                            onClick={() => setExpandedImpactId(isExpanded ? null : item.id)}
                            className={styles.btnSecondary}
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            title="Ver impacto se este plano não for pago"
                          >
                            {isExpanded ? '▲ Fechar' : '⚠️ Impacto'}
                          </button>
                          <button
                            onClick={() => handleOpenProposalModal(item)}
                            className={styles.btnSecondary}
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            title="Propor alteração na Urna dos 4 Sócios"
                          >
                            🗳️ Voto 4/4
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Linha expansível de Impacto de Inadimplência */}
                    {isExpanded && (
                      <tr style={{ background: '#F4F4F6' }}>
                        <td colSpan={10} style={{ padding: '14px 18px', borderBottom: '2px solid rgba(0,0,0,0.2)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#B91C1C' }}>
                              {item.impactIfUnpaid}
                            </div>
                            {item.notes && (
                              <div style={{ fontSize: '11px', color: '#374151', fontStyle: 'italic' }}>
                                💡 Nota de Governança: {item.notes}
                              </div>
                            )}
                            <div style={{ fontSize: '11px', color: '#1F2937' }}>
                              <strong>Agentes Dependentes Diretos:</strong>{' '}
                              {item.dependentAgents.map((ag) => ag.name).join(' · ')}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal: Proposta para Urna 4/4 */}
        {isModalOpen && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalBox}>
              <div className={styles.modalHeader}>
                <h2>🗳️ Convocação da Urna 4/4 · Proposta de Assinatura</h2>
                <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProposal}>
                <div className={styles.formGroup}>
                  <label>Nome do Serviço / Ferramenta</label>
                  <input
                    type="text"
                    required
                    value={proposalServiceName}
                    onChange={(e) => setProposalServiceName(e.target.value)}
                    className={styles.formInput}
                    placeholder="Ex: Magnific AI Pro, Reserva INK B2B..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className={styles.formGroup}>
                    <label>Categoria</label>
                    <select
                      value={proposalCategory}
                      onChange={(e) => setProposalCategory(e.target.value as SubscriptionCategory)}
                      className={styles.formSelect}
                    >
                      <option value="CRIATIVO_ATELIER">Atelier Criativo</option>
                      <option value="IA_AGENTES">Inteligência Artificial</option>
                      <option value="INFRAESTRUTURA">Infraestrutura</option>
                      <option value="ERP_FISCAL">ERP &amp; Fiscal</option>
                      <option value="FORNECEDOR_POD">Fornecedor PoD</option>
                      <option value="COMUNICACAO">Comunicação</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Custo Estimado (R$ / mês)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={proposalCostBrl}
                      onChange={(e) => setProposalCostBrl(Number(e.target.value))}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Sócio Convocante</label>
                  <select
                    value={proposalProposer}
                    onChange={(e) => setProposalProposer(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="Flávio (Financeiro)">Flávio (Financeiro)</option>
                    <option value="Armando (Engenharia)">Armando (Engenharia)</option>
                    <option value="Tripoint (Atelier)">Tripoint (Atelier)</option>
                    <option value="Gustavo (Produção)">Gustavo (Produção)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Justificativa do ROI &amp; Impacto nos Agentes</label>
                  <textarea
                    rows={4}
                    required
                    value={proposalJustification}
                    onChange={(e) => setProposalJustification(e.target.value)}
                    className={styles.formTextarea}
                    placeholder="Explique como essa ferramenta melhora as vendas, qualidade das estampas ou reduz trabalho manual dos sócios..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className={styles.btnPrimary}
                  >
                    {submittingProposal ? 'Registrando...' : '🗳️ Disparar Votação aos 4 Sócios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
