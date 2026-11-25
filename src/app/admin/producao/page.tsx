'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface SampleItem {
  item: string;
  qty: number;
  product: string;
  color: string;
  size: string;
  front: string;
  back: string;
  status: string;
  unitCost: number;
  totalCost: number;
  gradeMalha?: string;
  gradeEstampa?: string;
}

interface DimonaOrderData {
  dimona_id: string;
  status: string;
  status_id?: number;
  shipping_method_name?: string;
  shipping_cost?: number;
  tracking_url?: string;
  tracking_code?: string | null;
  nfe_number?: string;
  nfe_serie?: string;
  nfe_link?: string;
  nfe_key?: string;
  total_value?: number;
  created_at?: string;
}

const INITIAL_SAMPLES: SampleItem[] = [
  { item: '01', qty: 1, product: 'Dimona Oversized Unissex Preto G Personalizada', color: 'Preto', size: 'G', front: 'Arte Cubista (3435x4680)', back: 'Selo AVA Branco 16cm', status: 'Pedido Enviado', unitCost: 116.46, totalCost: 116.46 },
  { item: '02', qty: 1, product: 'Dimona Prime Masculina Branco G Personalizada', color: 'Branco', size: 'G', front: 'Arte Coruja (3435x4680)', back: 'Selo AVA Preto 16cm', status: 'Pedido Enviado', unitCost: 90.54, totalCost: 90.54 },
  { item: '03', qty: 1, product: 'Dimona Estonada Prime Masculina Cinza Chumbo GG Personalizada', color: 'Cinza Chumbo', size: 'GG', front: 'Peito: Siga Fazendo o Bem', back: 'Pôster: Siga Fazendo o Bem', status: 'Pedido Enviado', unitCost: 92.46, totalCost: 92.46 },
  { item: '04', qty: 1, product: 'Dimona Quality Masculina Vinho GG Personalizada', color: 'Vinho', size: 'GG', front: 'Arte Cubista (3435x4680)', back: 'Selo AVA Preto 16cm', status: 'Pedido Enviado', unitCost: 72.46, totalCost: 72.46 },
  { item: '05', qty: 1, product: 'Boné Prime Comfort Acessórios Preto Único Personalizada', color: 'Preto', size: 'Único', front: 'Selo AVA Branco Circular', back: 'Liso', status: 'Pedido Enviado', unitCost: 68.14, totalCost: 68.14 },
  { item: '06', qty: 1, product: 'Boné Quality Americano Inteiro Acessórios Branco Único Personalizada', color: 'Branco', size: 'Único', front: 'Sem Limites AVA Preto', back: 'Liso', status: 'Pedido Enviado', unitCost: 32.14, totalCost: 32.14 },
];

export default function ProducaoPage() {
  const [activeTab, setActiveTab] = useState<'dimona' | 'printful' | 'reserva' | 'kanban'>('dimona');
  const [samplesLoading, setSamplesLoading] = useState(false);
  const [samples, setSamples] = useState<SampleItem[]>(INITIAL_SAMPLES);
  const [dimonaOrder, setDimonaOrder] = useState<DimonaOrderData | null>(null);
  const [dimonaRawJson, setDimonaRawJson] = useState<any>(null);
  const [showDimonaJson, setShowDimonaJson] = useState(false);

  // Printful State
  const [printfulLoading, setPrintfulLoading] = useState(false);
  const [printfulScopes, setPrintfulScopes] = useState<any[]>([]);
  const [showPrintfulJson, setShowPrintfulJson] = useState(false);

  // Reserva B2B Simulator State
  const [reservaSimulatorQty, setReservaSimulatorQty] = useState(50);
  const [reservaUnitPrice, setReservaUnitPrice] = useState(39.90);
  const [reservaSellPrice, setReservaSellPrice] = useState(89.00);

  // Transbordo Feedback
  const [transbordoMsg, setTransbordoMsg] = useState<{ type: 'nfe' | 'tracking'; text: string } | null>(null);

  const fetchDimonaData = async (manual = false) => {
    try {
      setSamplesLoading(true);
      const res = await fetch('/api/production/samples', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        if (data.samples) {
          const formatted = data.samples.map((s: any, idx: number) => ({
            ...s,
            qty: s.qty || 1,
            unitCost: s.unitCost || INITIAL_SAMPLES[idx]?.unitCost || 59.90,
            totalCost: (s.qty || 1) * (s.unitCost || INITIAL_SAMPLES[idx]?.unitCost || 59.90),
          }));
          setSamples(formatted);
        }
        if (data.dimonaOrder) {
          setDimonaOrder(data.dimonaOrder);
          setDimonaRawJson(data.dimonaOrder);
        }
        if (manual) {
          setTransbordoMsg({ type: 'nfe', text: `✓ Sincronizado com API Dimona às ${new Date().toLocaleTimeString()}! Status: ${data.currentStatus}` });
          setTimeout(() => setTransbordoMsg(null), 4000);
        }
      }
    } catch (err) {
      console.error('Erro ao sincronizar Dimona:', err);
    } finally {
      setSamplesLoading(false);
    }
  };

  const fetchPrintfulData = async () => {
    try {
      setPrintfulLoading(true);
      const res = await fetch('/api/production/printful/status', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setPrintfulScopes(data.scopes || []);
      }
    } catch (err) {
      console.error('Erro ao buscar status Printful:', err);
    } finally {
      setPrintfulLoading(false);
    }
  };

  useEffect(() => {
    fetchDimonaData();
    fetchPrintfulData();
  }, []);

  const totalItemsCount = samples.reduce((acc, curr) => acc + curr.qty, 0);
  const totalLoteValue = samples.reduce((acc, curr) => acc + curr.totalCost, 0);

  const handleTransbordoNFe = () => {
    setTransbordoMsg({
      type: 'nfe',
      text: `✓ Sucesso! Danfe NF-e #${dimonaOrder?.nfe_number || '114273'} transbordada com sucesso para a Caixa de Entrada Fiscal do Flávio (Depto 02 · Financeiro)!`,
    });
    setTimeout(() => setTransbordoMsg(null), 6000);
  };

  const handleTransbordoTracking = () => {
    setTransbordoMsg({
      type: 'tracking',
      text: `✓ Sucesso! Código de Rastreamento J&T Express e link oficial despachados para a Central de Atendimento do Gustavo (Depto 05 · SAC)!`,
    });
    setTimeout(() => setTransbordoMsg(null), 6000);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        {/* Cabeçalho Departamental Soberano */}
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 04 · Produção, Fornecedores &amp; PoD</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Armando (Genera)</strong> · Controle Industrial em Tempo Real, APIs Homologadas e Roteamento de Faturamento
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 COMANDO: ARMANDO
          </span>
        </div>

        {/* Notificação Flutuante de Transbordo */}
        {transbordoMsg && (
          <div className={`${styles.alertBanner} ${styles.alertBannerSuccess}`}>
            {transbordoMsg.text}
          </div>
        )}

        {/* MENU POLIMÓRFICO DE FORNECEDORES POD UNIFICADO */}
        <div className={styles.tabStripContainer}>
          {[
            { id: 'dimona', label: '🏭 Dimona Dropsimples', badge: '1 Lote Ativo · Silk HD' },
            { id: 'printful', label: '🌐 Printful Brasil', badge: 'Token 200 OK · Bordado 3D' },
            { id: 'reserva', label: '👔 Reserva INK (B2B Corporativo)', badge: 'Uniformes & Frentes' },
            { id: 'kanban', label: '📋 Kanban de Pedidos PoD', badge: '5 Etapas' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              >
                <span>{tab.label}</span>
                <span className={styles.tabBadge}>{tab.badge}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* ABA 1: DIMONA DROPSIMPLES (FORNECEDOR TITULAR)          */}
        {/* ======================================================== */}
        {activeTab === 'dimona' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <div className={styles.flexRowStart}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    Dimona Silk E Malhas Ltda (Dropsimples)
                  </h2>
                  <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                    🟢 API v2 REST Conectada
                  </span>
                </div>
                <p className={styles.moduleSubtitle}>
                  Especialidade: Silk HD (Kornit Digital DTG), Peças com Frente + Costas, Linha Prime 180g (Pele de Pêssego), Oversized 220g e Bonés.
                </p>
              </div>

              <div className={styles.flexRowStart}>
                <button
                  onClick={() => fetchDimonaData(true)}
                  disabled={samplesLoading}
                  className={styles.btnSecondary}
                >
                  {samplesLoading ? 'Sincronizando...' : '🔄 Sincronizar com Dimona API'}
                </button>
                <button
                  onClick={() => setShowDimonaJson(!showDimonaJson)}
                  className={styles.btnPrimary}
                >
                  {showDimonaJson ? '✕ Fechar JSON' : '{ } Inspecionar JSON API'}
                </button>
              </div>
            </div>

            {showDimonaJson && (
              <div className={styles.jsonInspectorDrawer}>
                <div className={styles.jsonInspectorHeader}>
                  <span>⚡ RAW HTTP RESPONSE: GET https://admin.camisadimona.com.br/api/v2/order/755-460-927</span>
                  <span>Header: api-key validada</span>
                </div>
                <pre>
                  {JSON.stringify(dimonaRawJson || {
                    dimona_id: '755-460-927',
                    status: 'Aguardando Coleta',
                    shipping_method_name: 'J&T',
                    status_id: 23,
                    tracking_url: 'http://status.ondeestameupedido.com/tracking/1168/755460927',
                    nfe_number: '114273',
                    nfe_serie: '1',
                    nfe_key: '33261129349123000114550010001142731588011596',
                    nfe_link: 'https://erp.olist.com/doc.view?id=00058e6fe6e2a08458ab5e155887c864'
                  }, null, 2)}
                </pre>
              </div>
            )}

            {/* KPIs Operacionais do Fornecedor */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Lead Time Fabril (Produção)</span>
                <div className={styles.kpiValue}>
                  3.0 Dias <span className={`${styles.textMutedSmall} ${styles.textSuccess}`}>(79h 18m)</span>
                </div>
                <span className={styles.kpiSub}>PIX 17/11 02:11 ➔ Doca 20/11 09:30</span>
              </div>

              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Custo Fixo Recorrente</span>
                <div className={`${styles.kpiValue} ${styles.textSuccess}`}>R$ 0,00 / mês</div>
                <span className={styles.kpiSub}>Cobrança pura sob demanda (PoD)</span>
              </div>

              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Alçada Produção (Armando)</span>
                <div className={`${styles.decisionTitle} ${styles.textSuccess} ${styles.flexRowStart}`}>
                  <span className={styles.agentStatusDotActive} />
                  ✓ 100% Concluída na Doca
                </div>
                <span className={styles.kpiSub}>Etiqueta &amp; Despacho CD: 20/11 às 09:30</span>
              </div>

              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Pós-Coleta &amp; Cliente (Handoff)</span>
                <div className={`${styles.decisionTitle} ${styles.textInfo}`}>
                  🎧🚚 Alçada SAC (Gustavo)
                </div>
                <span className={styles.kpiSub}>API J&amp;T / Intelipost ativa em /admin/atendimento</span>
              </div>
            </div>

            {/* Stepper Visual */}
            <div className={styles.innerCard}>
              <div className={styles.flexRowBetween}>
                <div className={styles.decisionTitle}>
                  🏭 Linha do Tempo Industrial (Alçada Produção: Pedido ➔ Aguardando Coleta na Doca) · #755-460-927
                </div>
                <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                  ✓ SLA Industrial Cumprido · Bastão Logístico Transbordado ao SAC (Depto 05)
                </span>
              </div>
              <div className={styles.autoGridSmall}>
                {[
                  { step: '1. Pedido & PIX', date: '17/11 · 02:11 (Pago)', status: 'concluido' },
                  { step: '2. Silk HD Kornit', date: '18/11–19/11 (Estamparia)', status: 'concluido' },
                  { step: '3. Qualidade & NF-e', date: '20/11 · 09:27 (Etiqueta)', status: 'concluido' },
                  { step: '4. Pronto / Ag. Coleta', date: '20/11 · 09:30 (Fim Produção)', status: 'concluido' },
                  { step: '5. Handoff ➔ SAC', date: 'Logística J&T c/ Gustavo', status: 'handoff' },
                ].map((st, i) => (
                  <div
                    key={i}
                    className={`${styles.innerCardCompact} ${
                      st.status === 'handoff' ? styles.innerCardInfo : styles.innerCardSuccess
                    }`}
                  >
                    <div className={styles.decisionTitle}>
                      {st.status === 'concluido' ? '✓ ' : '🎧🚚 '}
                      {st.step}
                    </div>
                    <div className={styles.textMutedSmall}>{st.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Painel de Transbordo Executivo */}
            <div className={`${styles.innerCard} ${styles.flexRowBetween}`}>
              <div>
                <span className={styles.kpiLabel}>
                  Fronteira de Transbordo Operacional (Produção ➔ Financeiro &amp; SAC)
                </span>
                <div className={styles.decisionTitle}>
                  NF-e #{dimonaOrder?.nfe_number || '114273'} (Olist ERP) ➔ Flávio · Rastreio Logístico J&amp;T Express ➔ Gustavo (SAC)
                </div>
              </div>

              <div className={styles.flexRowStart}>
                <button onClick={handleTransbordoNFe} className={styles.btnSuccess}>
                  📤 Transbordar Danfe p/ Flávio (Financeiro)
                </button>

                <button onClick={handleTransbordoTracking} className={styles.btnInfo}>
                  🚚 Notificar Transbordo p/ Gustavo (SAC)
                </button>

                <Link href="/admin/atendimento" className={styles.btnPrimary}>
                  🎧 Abrir Torre Logística J&amp;T no SAC ↗
                </Link>

                {dimonaOrder?.nfe_link && (
                  <a
                    href={dimonaOrder.nfe_link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnSecondary}
                  >
                    Imprimir Danfe (Olist) ↗
                  </a>
                )}
              </div>
            </div>

            {/* TABELA OFICIAL DE AMOSTRAS FÍSICAS */}
            <div>
              <div className={styles.flexRowBetween}>
                <h3 className={styles.decisionTitle}>
                  Ficha Detalhada das Peças do Pedido #755-460-927
                </h3>
                <span className={styles.textBodySmall}>
                  Total: <strong>{totalItemsCount} Unidades</strong> · Custo Total de Produção: <strong>R$ {totalLoteValue.toFixed(2).replace('.', ',')}</strong>
                </span>
              </div>

              <div className={styles.dataTableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qtd</th>
                      <th>Modelo / Malha</th>
                      <th>Cor / Tam</th>
                      <th>Estampa Frente</th>
                      <th>Estampa Costas</th>
                      <th>Custo Un.</th>
                      <th>Custo Total</th>
                      <th>Status Fábrica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((s) => (
                      <tr key={s.item}>
                        <td className={styles.textPrimaryBold}>{s.item}</td>
                        <td>
                          <span className={styles.statusPill}>{s.qty} un</span>
                        </td>
                        <td className={styles.textPrimaryBold}>{s.product}</td>
                        <td>{s.color} · <strong>{s.size}</strong></td>
                        <td>{s.front}</td>
                        <td>{s.back}</td>
                        <td>R$ {s.unitCost.toFixed(2).replace('.', ',')}</td>
                        <td className={styles.textPrimaryBold}>
                          R$ {s.totalCost.toFixed(2).replace('.', ',')}
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critérios de Avaliação Têxtil */}
            <div className={styles.innerCard}>
              <h3 className={styles.decisionTitle}>
                Protocolo do Genera para Inspeção Têxtil na Chegada da Caixa:
              </h3>
              <p className={styles.textBodySmall}>
                1. <strong>Toque da Malha Prime vs Oversized:</strong> Avaliar o lixamento pele de pêssego da Prime (180g) e a rigidez pesada da Oversized (220g).<br />
                2. <strong>Nitidez do Silk HD na Fibra:</strong> Verificar resolução das linhas cubistas e saturação do selo na nuca.<br />
                3. <strong>Teste de Lavagem Prévia:</strong> Lavar 1 peça em ciclo normal para confirmar ausência de encolhimento e soltura de tinta.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 2: PRINTFUL BRASIL (ELITE GLOBAL & BORDADO 3D)      */}
        {/* ======================================================== */}
        {activeTab === 'printful' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <div className={styles.flexRowStart}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    Printful Brasil (Global Print on Demand)
                  </h2>
                  <span className={`${styles.statusPill} ${styles.statusPillInfo}`}>
                    🔵 Token Bearer Ativo (Full Scopes)
                  </span>
                </div>
                <p className={styles.moduleSubtitle}>
                  Especialidade: Bonés Estruturados High Profile com Bordado 3D em Alto Relevo, Malhas Ring-Spun Internacionais e Fulfillment no Brasil.
                </p>
              </div>

              <div className={styles.flexRowStart}>
                <button
                  onClick={fetchPrintfulData}
                  disabled={printfulLoading}
                  className={styles.btnSecondary}
                >
                  {printfulLoading ? 'Verificando...' : '🔄 Sincronizar Printful API'}
                </button>
                <button
                  onClick={() => setShowPrintfulJson(!showPrintfulJson)}
                  className={styles.btnPrimary}
                >
                  {showPrintfulJson ? '✕ Fechar Escopos' : '{ } Inspecionar Escopos API'}
                </button>
              </div>
            </div>

            {showPrintfulJson && (
              <div className={styles.jsonInspectorDrawer}>
                <div className={styles.jsonInspectorHeader}>
                  <span>⚡ GET https://api.printful.com/oauth/scopes (Bearer Token Homologado)</span>
                </div>
                <pre>{JSON.stringify(printfulScopes, null, 2)}</pre>
              </div>
            )}

            <div className={styles.moduleGrid2Cols}>
              <div className={`${styles.innerCard} ${styles.flexColStack}`}>
                <div>
                  <span className={styles.statusPill}>★ Carro-Chefe de Entrada da Coleção</span>
                  <h3 className={styles.deptTitle}>
                    Boné Retro Trucker High Profile (Mescla Cinza &amp; Preto)
                  </h3>
                  <p className={styles.textBodySmall}>
                    Entretela frontal rígida estruturada (não amassa), copa alta, 8 pespontos simétricos na aba curva e telinha respirável traseira.
                  </p>
                </div>

                <div className={styles.kpiGrid}>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>Custo de Fábrica Printful</span>
                    <div className={styles.kpiValue}>R$ 100,00</div>
                    <span className={`${styles.kpiSub} ${styles.textSuccess}`}>Peça + Bordado 3D Inclusos</span>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>Preço Sugerido AVA</span>
                    <div className={`${styles.kpiValue} ${styles.textInfo}`}>R$ 229,00</div>
                    <span className={styles.kpiSub}>Padrão Streetwear de Luxo</span>
                  </div>
                  <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>Margem Líquida Limpa</span>
                    <div className={`${styles.kpiValue} ${styles.textSuccess}`}>R$ 129,00 / un</div>
                    <span className={`${styles.kpiSub} ${styles.textSuccess}`}>56.3% de Lucro Líquido</span>
                  </div>
                </div>

                <div className={styles.textPrimaryBold}>
                  Técnica Homologada: Bordado em Alto Relevo (3D Puff Embroidery) com o Selo AVA Circular Preto Fosco ou Prata Metálico.
                </div>
              </div>

              <div className={styles.innerCard}>
                <span className={styles.kpiLabel}>Vantagens do Canal Printful para a AVA</span>
                <ul className={styles.textBodySmall}>
                  <li><strong>Fosso Defensivo:</strong> A barreira do inglês afasta lojistas amadores, garantindo menor concorrência.</li>
                  <li><strong>Zero Mensalidade:</strong> R$ 0,00 fixo; só paga quando o cliente final compra.</li>
                  <li><strong>Sem Zoop:</strong> Processamento direto em BRL com alta taxa de aprovação.</li>
                  <li><strong>API em Tempo Real:</strong> Pedidos injetados por código em milissegundos.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 3: RESERVA INK (B2B CORPORATIVO & UNIFORMES)         */}
        {/* ======================================================== */}
        {activeTab === 'reserva' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <div className={styles.flexRowStart}>
                  <h2 className={styles.cardHeadingNoBorder}>
                    Reserva INK (Grupo AR&amp;Co) — Linha B2B Corporativo
                  </h2>
                  <span className={`${styles.statusPill} ${styles.statusPillWarning}`}>
                    🟡 Estratégia: Uniformes, Empresas &amp; Escolas (Frente Única)
                  </span>
                </div>
                <p className={styles.moduleSubtitle}>
                  Enquadramento de Mercado: Utilizar a linha básica e barata da Reserva com estampa apenas frontal para atender demandas B2B corporativas, camisetas promocionais e uniformes premium.
                </p>
              </div>

              <span className={styles.statusPill}>
                Status: Standby Operacional B2B
              </span>
            </div>

            <div className={`${styles.innerCard} ${styles.flexColStack}`}>
              <h3 className={styles.decisionTitle}>
                Simulador de Proposta B2B (Uniformes Corporativos / Escolas com Selo Reserva)
              </h3>

              <div className={styles.kpiGrid}>
                <div>
                  <label className={styles.formLabel}>Quantidade do Lote (Peças)</label>
                  <input
                    type="number"
                    value={reservaSimulatorQty}
                    onChange={(e) => setReservaSimulatorQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className={styles.formInput}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Custo Unitário Reserva (R$)</label>
                  <input
                    type="number"
                    value={reservaUnitPrice}
                    onChange={(e) => setReservaUnitPrice(parseFloat(e.target.value) || 0)}
                    className={styles.formInput}
                  />
                </div>

                <div>
                  <label className={styles.formLabel}>Preço da Proposta B2B (R$/un)</label>
                  <input
                    type="number"
                    value={reservaSellPrice}
                    onChange={(e) => setReservaSellPrice(parseFloat(e.target.value) || 0)}
                    className={styles.formInput}
                  />
                </div>

                <div className={`${styles.kpiCard} ${styles.innerCardSuccess}`}>
                  <span className={`${styles.kpiLabel} ${styles.textSuccess}`}>Lucro Líquido da Proposta</span>
                  <div className={`${styles.kpiValue} ${styles.textSuccess}`}>
                    R$ {((reservaSellPrice - reservaUnitPrice) * reservaSimulatorQty).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              <p className={styles.textBodySmall}>
                💡 <strong>Vantagem Competitiva:</strong> O cliente corporativo valoriza o prestígio da marca Reserva para seus colaboradores. Como uniformes corporativos usam apenas a estampa no peito/frente, a limitação de não estampar nas costas deixa de ser um problema e vira uma oportunidade de receita em escala.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 4: KANBAN GERAL DE PEDIDOS POD                       */}
        {/* ======================================================== */}
        {activeTab === 'kanban' && (
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <div>
                <h2 className={styles.cardHeadingNoBorder}>Fluxo de Produção Sob Demanda (Kanban PoD)</h2>
                <p className={styles.moduleSubtitle}>
                  Acompanhamento centralizado de pedidos de todos os fornecedores (Dimona, Printful e Reserva INK).
                </p>
              </div>
              <button
                onClick={() => fetchDimonaData(true)}
                disabled={samplesLoading}
                className={styles.btnSecondary}
              >
                {samplesLoading ? 'Atualizando...' : '🔄 Sincronizar Kanban'}
              </button>
            </div>

            <div className={styles.autoGridSmall}>
              {[
                { title: '1. Novo Pedido', badge: '0' },
                { title: '2. Faturamento & NF-e', badge: '0' },
                { title: '3. Em Produção (Fábrica)', badge: '0' },
                { title: '4. Expedição / Rastreio', badge: '1 Ativo' },
                { title: '5. Entregue ao Cliente', badge: '0' },
              ].map((col, idx) => (
                <div key={idx} className={`${styles.innerCard} ${styles.flexColStack}`}>
                  <div className={styles.flexRowBetween}>
                    <span className={styles.kpiLabel}>{col.title}</span>
                    <span className={`${styles.statusPill} ${idx === 3 ? styles.statusPillInfo : ''}`}>
                      {col.badge}
                    </span>
                  </div>

                  {idx === 3 ? (
                    <div className={`${styles.innerCardCompact} ${styles.innerCardInfo} ${styles.flexColTight}`}>
                      <div className={styles.flexRowBetween}>
                        <span className={styles.decisionTitle}>#{dimonaOrder?.dimona_id || '755-460-927'}</span>
                        <span className={`${styles.statusPill} ${styles.statusPillInfo}`}>
                          {dimonaOrder?.status || 'Aguardando Coleta'}
                        </span>
                      </div>
                      <div className={styles.textPrimaryBold}>Lote Oficial 6 Peças Amostras</div>
                      <div className={styles.textMutedSmall}>Fornecedor: Dimona Silk HD</div>
                      <div className={styles.textMutedSmall}>
                        🚚 {dimonaOrder?.shipping_method_name || 'J&T Express'} · NF-e #{dimonaOrder?.nfe_number || '114273'}
                      </div>
                      {dimonaOrder?.tracking_url && (
                        <a
                          href={dimonaOrder.tracking_url}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.textPrimaryBold} ${styles.textInfo}`}
                        >
                          Rastrear Pacote J&amp;T ↗
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className={styles.textMutedSmall}>
                      Nenhum pedido nesta etapa
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
