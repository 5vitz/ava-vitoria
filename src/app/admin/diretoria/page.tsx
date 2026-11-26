'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';
import { AGENTS_DOSSIER, AgentDossier } from '../agentDossierData';
import AgentDossierModal from '../AgentDossierModal';
import {
  WorkflowPersistentState,
  ArchivedOrderRecord,
} from '@/lib/workflowState';

const PARTNERS = [
  {
    name: 'Flávio',
    role: 'Titular: 01 · Jurídico & Compliance + 02 · Financeiro, Fiscal & ERP',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Governança Societária (MEI ➔ LTDA), INPI, Registro Blockchain (.ots), Unit Economics (DRE) e Bling ERP v3',
  },
  {
    name: 'Armando Sinkovitz (Genera)',
    role: 'Titular: 03 · Arquitetura & TI + 04 · Produção & Fornecedores',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Arquitetura de Sistemas, Design System, Hub Multi-Supplier PoD (Dimona/Printful/Reserva/King) e Produção até a Doca',
  },
  {
    name: 'Gustavo',
    role: 'Titular: 05 · SAC + 06 · Marketing de Vendas',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Torre Logística Pós-Coleta (J&T), Análise de KPIs de Tráfego (ROAS), 10 Canais de Venda e SAC (IA 24/7 + Gatilho BPO 5 chamados)',
  },
  {
    name: 'Tripoint',
    role: 'Titular: 07 · Marketing de Produto + 08 · Atelier Criativo & Mídias',
    quota: 'Diretoria Executiva · Voto Deliberativo',
    focus: 'Ponto de Partida (4 Pilares da Coleção), Visual Merchandising (Vitrine Canônica & Grid 3x3 Instagram) e Matrizes 300 DPI (MDV 26)',
  },
];

export default function DiretoriaPage() {
  const [wfState, setWfState] = useState<WorkflowPersistentState | null>(null);
  const [reports, setReports] = useState<any>(null);
  const [archiveTab, setArchiveTab] = useState<'CLIENTES' | 'AMOSTRAS'>('AMOSTRAS');
  const [selectedAgent, setSelectedAgent] = useState<AgentDossier | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchWorkflowAndReports = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/workflow', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setWfState(data.state);
        setReports(data.reports);
        if ((data.state?.archivedClientOrders || []).length > 0) {
          setArchiveTab('CLIENTES');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar Arquivo da Diretoria:', err);
    }
  }, []);

  useEffect(() => {
    fetchWorkflowAndReports();
  }, [fetchWorkflowAndReports]);

  const archivedClients: ArchivedOrderRecord[] = wfState?.archivedClientOrders || [];
  const archivedSamples: ArchivedOrderRecord[] = wfState?.archivedSampleOrders || [];
  const flavioReport = reports?.flavioReport;
  const gustavoReport = reports?.gustavoReport;

  const handleShareReportInBoardroom = (reportTitle: string) => {
    window.dispatchEvent(
      new CustomEvent('ava:open-boardroom', {
        detail: { pautaTitle: reportTitle },
      })
    );
    setToastMsg(`💬 Abrindo Sala de Reuniões na pauta "${reportTitle}" para deliberação dos 4 sócios!`);
    setTimeout(() => setToastMsg(null), 5000);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>🏛️ Camada Soberana · Diretoria Executiva &amp; Arquivo Central</h1>
            <p className={styles.moduleSubtitle}>
              Conselho Deliberativo (4/4), Sistema Central de Arquivamento de Pedidos (<strong>👤 Clientes</strong> vs. <strong>🧪 Amostras</strong>) e Geração Automática dos <strong>2 Relatórios Executivos</strong> (Flávio &amp; Gustavo)
            </p>
          </div>
          <div className={styles.flexRowStart}>
            <button
              type="button"
              className={styles.actionCardBtn}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('ava:open-boardroom', {
                    detail: { createNewLocked: true },
                  })
                )
              }
            >
              🚨 CONVOCAR REUNIÃO / NOVA PAUTA
            </button>
            <button
              type="button"
              className={styles.executiveHeaderBtn}
              onClick={() =>
                window.dispatchEvent(new CustomEvent('ava:open-boardroom', { detail: {} }))
              }
            >
              💬 ABRIR SALA DE REUNIÕES
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {toastMsg}
          </div>
        )}

        {/* =================================================================== */}
        {/* BLOCO 1: OS 2 RELATÓRIOS AUTOMÁTICOS GERADOS QUANDO OS DADOS BATEM NA DIRETORIA */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                ⚡ Motor de Inteligência da Diretoria: 2 Relatórios Automáticos (Flávio &amp; Gustavo)
              </h2>
              <p className={styles.moduleSubtitle}>
                Sempre que um pedido é concluído e arquivado aqui na Diretoria Executiva (seja na pasta <strong>🧪 Amostras</strong> ou <strong>👤 Clientes</strong>), o sistema compila automaticamente estes dois relatórios direcionados:
              </p>
            </div>
            <button
              type="button"
              onClick={fetchWorkflowAndReports}
              className={styles.btnSecondary}
            >
              🔄 Atualizar Relatórios
            </button>
          </div>

          <div className={styles.moduleGrid2Cols}>
            {/* RELATÓRIO 1: PARA O FLÁVIO (02 · FINANCEIRO, FISCAL & DRE) */}
            <div className={`${styles.innerCard} ${styles.flexColStack}`}>
              <div className={styles.flexRowBetween}>
                <span className={styles.decisionTitle}>
                  💎 Relatório #1 · Financeiro, Fiscal &amp; DRE (Para: FLÁVIO)
                </span>
                <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                  Depto 01 &amp; 02
                </span>
              </div>

              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>Receita Vendas (👤 Clientes)</span>
                  <div className={styles.kpiValue}>
                    R$ {(flavioReport?.clientSalesSummary?.grossRevenue ?? 0).toFixed(2)}
                  </div>
                  <span className={styles.kpiSub}>
                    {flavioReport?.clientSalesSummary?.ordersCount ?? 0} pedido(s) concluído(s)
                  </span>
                </div>

                <div className={`${styles.kpiCard} ${styles.innerCardSuccess}`}>
                  <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>
                    Lucro Líquido Operacional
                  </span>
                  <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                    R$ {(flavioReport?.clientSalesSummary?.netOperationalProfit ?? 0).toFixed(2)}
                  </div>
                  <span className={styles.kpiSub}>
                    Após Custo PoD, Simples (6%) e Gateway (3,5%)
                  </span>
                </div>

                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>Investimento P&amp;D (🧪 Amostras)</span>
                  <div className={`${styles.kpiValue} ${styles.textDanger}`}>
                    - R$ {(flavioReport?.samplesPdSummary?.totalPdInvestment ?? 472.80).toFixed(2)}
                  </div>
                  <span className={styles.kpiSub}>
                    Lote Real Dimona #755-460-927 (6 peças)
                  </span>
                </div>

                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>NF-es &amp; Documentos Arquivados</span>
                  <div className={styles.kpiValue}>
                    {flavioReport?.fiscalDocumentsArchived?.length ?? 1} doc(s)
                  </div>
                  <span className={styles.kpiSub}>
                    NF-e #114273 + PDFs &quot;Vale uma NF-e&quot;
                  </span>
                </div>
              </div>

              <div className={styles.innerCardCompact}>
                <div className={styles.textPrimaryBold}>
                  📑 Documentos Fiscais Disponíveis para Contabilidade (Flávio + Contador Nível 2):
                </div>
                <div className={styles.flexColTight}>
                  {(flavioReport?.fiscalDocumentsArchived || []).map((doc: any, idx: number) => (
                    <div key={idx} className={styles.flexRowBetween}>
                      <span className={styles.textBodySmall}>
                        <strong>[{doc.category}]</strong> Pedido <strong>{doc.orderCode}</strong> · {doc.nfeNumber} (R$ {Number(doc.value).toFixed(2)})
                      </span>
                      <a
                        href={doc.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnSecondary}
                      >
                        📄 Abrir NF-e ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.flexRowStart}>
                <Link href="/admin/financeiro" className={styles.btnPrimary}>
                  Abrir Painel Financeiro (Depto 02 · Flávio) ↗
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    handleShareReportInBoardroom('Relatório Financeiro & DRE — Diretoria (Flávio)')
                  }
                  className={styles.btnSecondary}
                >
                  💬 Debater DRE na Sala de Reuniões
                </button>
              </div>
            </div>

            {/* RELATÓRIO 2: PARA O GUSTAVO (06 · MARKETING DE VENDAS — MAIS VENDIDO / MENOS VENDIDO) */}
            <div className={`${styles.innerCard} ${styles.flexColStack}`} data-boardroom-anchor="right-card">
              <div className={styles.flexRowBetween}>
                <span className={styles.decisionTitle}>
                  📈 Relatório #2 · Inteligência de Mkt de Vendas (Para: GUSTAVO)
                </span>
                <span className={`${styles.statusPill} ${styles.statusPillInfo}`}>
                  Depto 05 &amp; 06
                </span>
              </div>

              <div className={styles.flexColTight}>
                <div className={`${styles.innerCardCompact} ${styles.innerCardSuccess}`}>
                  <div className={styles.kpiLabel}>🏆 Produto Mais Vendido (Campeão de Receita)</div>
                  <div className={styles.decisionTitle}>
                    {gustavoReport?.topSellingProduct ||
                      'Aguardando 1º pedido de cliente ser concluído e arquivado'}
                  </div>
                </div>

                <div className={styles.innerCardCompact}>
                  <div className={styles.kpiLabel}>📦 Modelagem &amp; Cor Mais Encomendada</div>
                  <div className={styles.textPrimaryBold}>
                    {gustavoReport?.mostOrderedModel ||
                      'Nenhuma encomenda de cliente arquivada ainda (6 malhas homologadas em Amostras)'}
                  </div>
                </div>

                <div className={styles.innerCardCompact}>
                  <div className={styles.kpiLabel}>📉 Produto Menos Vendido (Alerta de Giro)</div>
                  <div className={styles.textBodySmall}>
                    {gustavoReport?.leastSellingProduct ||
                      'Sem dados comparativos de baixa saída no momento'}
                  </div>
                </div>

                <div className={`${styles.innerCardCompact} ${styles.innerCardSelected}`}>
                  <div className={styles.kpiLabel}>🎯 Direcionamento Estratégico de Investimento (ROAS)</div>
                  <p className={styles.textBodySmall}>
                    {gustavoReport?.strategicRecommendation}
                  </p>
                </div>
              </div>

              <div className={styles.flexRowStart}>
                <Link href="/admin/vendas" className={styles.btnPrimary}>
                  Abrir Marketing de Vendas (Depto 06 · Gustavo) ↗
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    handleShareReportInBoardroom('Estratégia de Investimento Mkt de Vendas (Gustavo)')
                  }
                  className={styles.btnSecondary}
                >
                  💬 Levar p/ Votação na Sala de Reuniões
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCO 2: SISTEMA DE ARQUIVAMENTO DE PEDIDOS (CLIENTES vs. AMOSTRAS) */}
        {/* =================================================================== */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <div>
              <h2 className={styles.cardHeadingNoBorder}>
                🗄️ Sistema Central de Arquivamento de Pedidos (Histórico Oficial da Diretoria)
              </h2>
              <p className={styles.moduleSubtitle}>
                Separação estrita entre <strong>👤 Pedidos de Clientes</strong> (Fluxo Comercial Real) e <strong>🧪 Pedidos de Amostras</strong> (Homologação Fabril Esporádica, como o lote Dimona #755-460-927 que já chegou).
              </p>
            </div>

            <div className={styles.flexRowStart}>
              <button
                type="button"
                onClick={() => setArchiveTab('CLIENTES')}
                className={`${styles.executiveHeaderBtn} ${
                  archiveTab === 'CLIENTES' ? styles.executiveHeaderBtnActive : ''
                }`}
              >
                👤 Pasta: Clientes ({archivedClients.length})
              </button>
              <button
                type="button"
                onClick={() => setArchiveTab('AMOSTRAS')}
                className={`${styles.executiveHeaderBtn} ${
                  archiveTab === 'AMOSTRAS' ? styles.executiveHeaderBtnActive : ''
                }`}
              >
                🧪 Pasta: Amostras ({archivedSamples.length})
              </button>
            </div>
          </div>

          {archiveTab === 'CLIENTES' ? (
            archivedClients.length === 0 ? (
              <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
                <div>
                  <div className={styles.decisionTitle}>
                    📂 Pasta de Clientes Limpa (0 Pedidos de Clientes Arquivados)
                  </div>
                  <p className={styles.textBodySmall}>
                    Nenhum pedido fictício! Assim que a nossa <strong>Peça Única de Teste</strong> percorrer as 4 Fases do Espelho e tiver sua entrega confirmada lá no <strong>Depto 05 · SAC (Gustavo)</strong>, ela será arquivada aqui e atualizará instantaneamente os 2 Relatórios acima (Flávio e Gustavo).
                  </p>
                </div>
                <Link href="/admin/marketing" className={styles.btnPrimary}>
                  🚀 Iniciar Roteiro da Peça Única (Fase 0) ➔
                </Link>
              </div>
            ) : (
              <div className={styles.flexColStack}>
                {archivedClients.map((ord) => (
                  <div key={ord.id} className={`${styles.innerCard} ${styles.innerCardSuccess}`}>
                    <div className={styles.flexRowBetween}>
                      <div>
                        <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                          👤 CLIENTE · ENTREGUE &amp; ARQUIVADO
                        </span>{' '}
                        <strong className={styles.decisionTitle}>
                          Pedido {ord.orderCode} — {ord.title}
                        </strong>
                      </div>
                      <span className={styles.textMutedSmall}>
                        Arquivado em: {ord.archivedAt}
                      </span>
                    </div>

                    <div className={styles.autoGridSmall}>
                      <div className={styles.innerCardCompact}>
                        <div className={styles.kpiLabel}>Comprador &amp; Canal</div>
                        <div className={styles.textPrimaryBold}>{ord.customerOrTarget}</div>
                        <div className={styles.textMutedSmall}>{ord.salesChannel}</div>
                      </div>

                      <div className={styles.innerCardCompact}>
                        <div className={styles.kpiLabel}>Coleção &amp; Modelagem</div>
                        <div className={styles.textPrimaryBold}>{ord.collectionName}</div>
                        <div className={styles.textMutedSmall}>
                          {ord.garmentModel} · {ord.color} · Tam {ord.size} ({ord.qtyTotal} un)
                        </div>
                      </div>

                      <div className={styles.innerCardCompact}>
                        <div className={styles.kpiLabel}>Resultado Financeiro (Flávio)</div>
                        <div className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>
                          Venda: R$ {ord.grossRevenue.toFixed(2)} | Lucro Líquido: R$ {ord.netResult.toFixed(2)}
                        </div>
                        <div className={styles.textMutedSmall}>
                          Custo PoD: R$ {ord.productionCost.toFixed(2)} · Simples: R$ {ord.taxSimples.toFixed(2)}
                        </div>
                      </div>

                      <div className={styles.innerCardCompact}>
                        <div className={styles.kpiLabel}>Documento Fiscal &amp; Entrega</div>
                        <div className={styles.textPrimaryBold}>{ord.nfeDocumentName}</div>
                        <a
                          href={ord.nfeDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.textPrimaryBold} ${styles.textSuccess}`}
                        >
                          📄 Abrir &quot;Vale uma NF-e&quot; ↗
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className={styles.flexColStack}>
              {archivedSamples.map((samp) => (
                <div key={samp.id} className={styles.innerCard}>
                  <div className={styles.flexRowBetween}>
                    <div>
                      <span className={styles.statusPill}>
                        🧪 AMOSTRA HOMOLOGADA &amp; ARQUIVADA
                      </span>{' '}
                      <strong className={styles.decisionTitle}>
                        Pedido Dimona {samp.orderCode} — {samp.title}
                      </strong>
                    </div>
                    <div className={styles.flexRowStart}>
                      <a
                        href={samp.nfeDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnSecondary}
                      >
                        📄 Abrir DANFE Real ({samp.nfeNumber}) ↗
                      </a>
                    </div>
                  </div>

                  <p className={styles.textBodySmall}>
                    <strong>Finalidade:</strong> {samp.customerOrTarget} · <strong>Fornecedor:</strong> {samp.supplier} · <strong>Logística:</strong> {samp.carrierName} · <strong>Custo Total Real Pago via PIX:</strong>{' '}
                    <strong className={styles.textDanger}>R$ {samp.productionCost.toFixed(2)}</strong> (Contabilizado no Financeiro do Flávio como Investimento P&amp;D).
                  </p>

                  {samp.itemsDetail && (
                    <div className={styles.dataTableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Qtd</th>
                            <th>Peça / Modelagem Homologada</th>
                            <th>Cor / Tam</th>
                            <th>Frente</th>
                            <th>Costas</th>
                            <th>Custo Real</th>
                          </tr>
                        </thead>
                        <tbody>
                          {samp.itemsDetail.map((it) => (
                            <tr key={it.item}>
                              <td className={styles.textPrimaryBold}>{it.item}</td>
                              <td>{it.qty} un</td>
                              <td className={styles.textPrimaryBold}>{it.product}</td>
                              <td>
                                {it.color} · <strong>{it.size}</strong>
                              </td>
                              <td>{it.front}</td>
                              <td>{it.back}</td>
                              <td className={styles.textPrimaryBold}>
                                R$ {it.totalCost.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Conselho dos 4 Sócios & Governança */}
        <div className={styles.moduleGrid2Cols}>
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Conselho Societário (4 Sócios da AVA · 2 Deptos cada)</h2>
            <div className={styles.flexColStack}>
              {PARTNERS.map((p, i) => (
                <div key={i} className={styles.innerCard}>
                  <div className={styles.flexRowBetween}>
                    <span className={styles.decisionTitle}>{p.name}</span>
                    <span className={`${styles.textMutedSmall} ${styles.textSuccess}`}>{p.quota}</span>
                  </div>
                  <div className={styles.textPrimaryBold}>{p.role}</div>
                  <div className={styles.textMutedSmall}>{p.focus}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Espelho do Fluxo Geral de Processos (PDF Oficial)</h2>
            <div className={styles.flexColStack}>
              <p className={styles.textBodySmall}>
                O documento executivo que mapeia as responsabilidades dos 4 sócios nos 8 departamentos e fundamenta a transição de <strong>MEI para LTDA (Simples Nacional)</strong> está arquivado na pasta de Reunião.
              </p>

              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>
                  📄 05_ESPELHO_FLUXO_GERAL_DE_PROCESSOS.pdf
                </div>
                <p className={styles.textBodySmall}>
                  Inclui Fase 0 (Os 4 Pilares da Coleção: Nome, Tema/Tendência, Estética e Mensagem A·V·A com votação 4/4) + Fases 1 a 4 + Arquivo Central na Diretoria gerando os 2 Relatórios (Flávio e Gustavo).
                </p>
              </div>

              <div className={styles.flexRowStart}>
                <a
                  href="/PDF/Vale_uma_NFe_AVA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPrimary}
                >
                  📄 Abrir PDF &quot;Vale uma NF-e&quot; (Teste Fase 3) ↗
                </a>
                <Link href="/admin/marketing" className={styles.btnSecondary}>
                  🚀 Ir para Fase 0 (07 · Mkt de Produto) ↗
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetria dos Agentes de IA da Mesa Redonda */}
        <section className={`${styles.agentsPanel} ${styles.moduleCardTopSpaced}`}>
          <div className={styles.agentsPanelHeader}>
            <div>
              <h2 className={styles.sectionHeading}>
                Telemetria dos Agentes de IA da Mesa Redonda
              </h2>
              <p className={styles.moduleSubtitle}>
                💡 Clique em qualquer agente para ver o Dossiê de Ajuda (O que faz, Por que faz, Como faz e Economia).
              </p>
            </div>
            <div className={styles.flexRowStart}>
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                <span className={styles.agentStatusDotActive}></span> Em Atividade
              </span>
              <span className={`${styles.statusPill} ${styles.statusPillWarning}`}>
                <span className={styles.agentStatusDotStandby}></span> Em Prontidão (Stand-by)
              </span>
            </div>
          </div>

          <div className={styles.agentsGrid}>
            {Object.values(AGENTS_DOSSIER).map((agent) => (
              <div
                key={agent.id}
                className={styles.agentBadge}
                onClick={() => setSelectedAgent(agent)}
                title={`Clique para abrir o Dossiê e Economia de ${agent.name}`}
              >
                <span
                  className={
                    agent.status === 'ACTIVE'
                      ? styles.agentStatusDotActive
                      : styles.agentStatusDotStandby
                  }
                ></span>
                <div className={styles.agentInfo}>
                  <span className={styles.agentName}>{agent.name}</span>
                  <span className={styles.agentRole}>{agent.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {selectedAgent && (
        <AgentDossierModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
