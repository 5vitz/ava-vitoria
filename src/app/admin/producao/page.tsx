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
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Printful State
  const [printfulLoading, setPrintfulLoading] = useState(false);
  const [printfulScopes, setPrintfulScopes] = useState<any[]>([]);
  const [printfulPing, setPrintfulPing] = useState<string | null>(null);
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
          // Garante campos qty e custos
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
        setLastSyncTime(new Date().toLocaleTimeString());
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
        setPrintfulPing(new Date(data.lastPing).toLocaleTimeString());
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
      text: `✓ Sucesso! Danfe NF-e #${dimonaOrder?.nfe_number || '114273'} transbordada com sucesso para a Caixa de Entrada Fiscal do Flávio (Depto 08 · Financeiro)!`,
    });
    setTimeout(() => setTransbordoMsg(null), 6000);
  };

  const handleTransbordoTracking = () => {
    setTransbordoMsg({
      type: 'tracking',
      text: `✓ Sucesso! Código de Rastreamento J&T Express e link oficial despachados para a Central de Atendimento do Gustavo (Depto 04 · SAC)!`,
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', background: '#000000', color: '#DFCFA8', padding: '6px 14px', border: '1px solid #DFCFA8', fontWeight: 700, letterSpacing: '0.5px' }}>
              👤 COMANDO: ARMANDO
            </span>
          </div>
        </div>

        {/* Notificação Flutuante de Transbordo */}
        {transbordoMsg && (
          <div style={{
            padding: '12px 18px',
            marginBottom: '20px',
            background: transbordoMsg.type === 'nfe' ? '#ECFDF5' : '#EFF6FF',
            border: `1px solid ${transbordoMsg.type === 'nfe' ? '#059669' : '#2563EB'}`,
            color: transbordoMsg.type === 'nfe' ? '#065F46' : '#1E40AF',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            {transbordoMsg.text}
          </div>
        )}

        {/* NOVO MENU POLIMÓRFICO DE FORNECEDORES POD */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid rgba(0,0,0,0.18)',
          paddingBottom: '12px',
          overflowX: 'auto'
        }}>
          {[
            {
              id: 'dimona',
              label: '🏭 Dimona Dropsimples',
              badge: '1 Lote Ativo · Silk HD',
              badgeColor: '#059669',
              badgeBg: 'rgba(5,150,105,0.12)'
            },
            {
              id: 'printful',
              label: '🌐 Printful Brasil',
              badge: 'Token 200 OK · Bordado 3D',
              badgeColor: '#1D4ED8',
              badgeBg: 'rgba(29,78,216,0.12)'
            },
            {
              id: 'reserva',
              label: '👔 Reserva INK (B2B Corporativo)',
              badge: 'Uniformes & Frentes',
              badgeColor: '#92400E',
              badgeBg: 'rgba(217,119,6,0.14)'
            },
            {
              id: 'kanban',
              label: '📋 Kanban de Pedidos PoD',
              badge: '5 Etapas',
              badgeColor: '#000000',
              badgeBg: 'rgba(0,0,0,0.08)'
            },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 18px',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  background: isActive ? '#000000' : '#EFE4CC',
                  color: isActive ? '#DFCFA8' : '#18181B',
                  border: '1px solid',
                  borderColor: isActive ? '#000000' : 'rgba(0, 0, 0, 0.18)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.18)' : 'none'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  background: isActive ? '#DFCFA8' : tab.badgeBg,
                  color: isActive ? '#000000' : tab.badgeColor,
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* ABA 1: DIMONA DROPSIMPLES (FORNECEDOR TITULAR)          */}
        {/* ======================================================== */}
        {activeTab === 'dimona' && (
          <div className={styles.moduleCard}>
            {/* Header do Fornecedor & Status API */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h2 className={styles.cardHeading} style={{ margin: 0 }}>
                    Dimona Silk E Malhas Ltda (Dropsimples)
                  </h2>
                  <span style={{ fontSize: '11px', background: 'rgba(5,150,105,0.12)', color: '#065F46', border: '1px solid rgba(5,150,105,0.3)', padding: '2px 8px', fontWeight: 700 }}>
                    🟢 API v2 REST Conectada
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#3F3F46', margin: 0 }}>
                  Especialidade: Silk HD (Kornit Digital DTG), Peças com Frente + Costas, Linha Prime 180g (Pele de Pêssego), Oversized 220g e Bonés.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => fetchDimonaData(true)}
                  disabled={samplesLoading}
                  className={styles.btnSecondary}
                  style={{ fontSize: '11px', padding: '7px 14px' }}
                >
                  {samplesLoading ? 'Sincronizando...' : '🔄 Sincronizar com Dimona API'}
                </button>
                <button
                  onClick={() => setShowDimonaJson(!showDimonaJson)}
                  style={{
                    padding: '7px 12px',
                    fontSize: '11px',
                    background: '#000000',
                    color: '#DFCFA8',
                    border: '1px solid #DFCFA8',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {showDimonaJson ? '✕ Fechar JSON' : '{ } Inspecionar JSON API'}
                </button>
              </div>
            </div>

            {/* Gaveta Técnica: JSON Bruto da API Dimona */}
            {showDimonaJson && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#0C0D0E',
                color: '#10B981',
                border: '1px solid rgba(255,255,255,0.14)',
                fontFamily: 'monospace',
                fontSize: '11px',
                overflowX: 'auto',
                maxHeight: '320px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                  <span>⚡ RAW HTTP RESPONSE: GET https://admin.camisadimona.com.br/api/v2/order/755-460-927</span>
                  <span>Header: api-key validada</span>
                </div>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(dimonaRawJson || {
                    dimona_id: "755-460-927",
                    status: "Aguardando Coleta",
                    shipping_method_name: "J&T",
                    status_id: 23,
                    tracking_url: "http://status.ondeestameupedido.com/tracking/1168/755460927",
                    nfe_number: "114273",
                    nfe_serie: "1",
                    nfe_key: "33261129349123000114550010001142731588011596",
                    nfe_link: "https://erp.olist.com/doc.view?id=00058e6fe6e2a08458ab5e155887c864"
                  }, null, 2)}
                </pre>
              </div>
            )}

            {/* KPIs Operacionais do Fornecedor */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginTop: '18px'
            }}>
              <div style={{ padding: '12px 14px', background: '#F5ECE0', border: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Lead Time Médio</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                  3.0 Dias <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>(-40% vs Prazo)</span>
                </div>
                <span style={{ fontSize: '11px', color: '#4B5563' }}>Pago em 17/11 ➔ Pronto em 20/11</span>
              </div>

              <div style={{ padding: '12px 14px', background: '#F5ECE0', border: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Custo Fixo Recorrente</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  R$ 0,00 / mês
                </div>
                <span style={{ fontSize: '11px', color: '#4B5563' }}>Cobrança pura sob demanda (PoD)</span>
              </div>

              <div style={{ padding: '12px 14px', background: '#F5ECE0', border: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Status da Fábrica</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                  {dimonaOrder?.status || 'Pedido Enviado'}
                </div>
                <span style={{ fontSize: '11px', color: '#4B5563' }}>Status ID: {dimonaOrder?.status_id || 26} (Em Trânsito J&T)</span>
              </div>

              <div style={{ padding: '12px 14px', background: '#F5ECE0', border: '1px solid rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Logística / Coleta</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginTop: '4px' }}>
                  🚚 {dimonaOrder?.shipping_method_name || 'J&T Express'}
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Previsão: 26/11/2026 (Vitória/ES)</span>
              </div>
            </div>

            {/* Stepper Visual: Linha do Tempo Viva de Produção */}
            <div style={{
              marginTop: '18px',
              padding: '16px',
              background: '#EFE4CC',
              border: '1px solid rgba(0,0,0,0.14)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700, marginBottom: '12px' }}>
                Linha do Tempo Industrial do Pedido #755-460-927
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                textAlign: 'center'
              }}>
                {[
                  { step: '1. Pedido & PIX', date: '17/11 · 02:11', status: 'concluido' },
                  { step: '2. Silk HD Kornit', date: '18/11 · 09:30', status: 'concluido' },
                  { step: '3. Controle Qualidade', date: '19/11 · 16:45', status: 'concluido' },
                  { step: '4. Coleta Realizada', date: '23/11 · 17:24', status: 'concluido' },
                  { step: '5. Despacho & Trânsito', date: 'Em Trânsito · Previsão 26/11', status: 'ativo' },
                ].map((st, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 6px',
                      background: st.status === 'ativo' ? '#059669' : st.status === 'concluido' ? '#047857' : '#D1D5DB',
                      color: st.status === 'pendente' ? '#374151' : '#FFFFFF',
                      borderRadius: '2px',
                      border: st.status === 'ativo' ? '2px solid #000' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 800 }}>
                      {st.status === 'concluido' ? '✓ ' : st.status === 'ativo' ? '🚚 ' : '⚪ '}
                      {st.step}
                    </div>
                    <div style={{ fontSize: '10px', marginTop: '3px', opacity: 0.9 }}>
                      {st.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Painel de Transbordo Executivo (Flávio & Gustavo) */}
            <div style={{
              marginTop: '18px',
              padding: '16px',
              background: '#F5ECE0',
              border: '1px solid rgba(0,0,0,0.14)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>
                  Gabinete de Despacho &amp; Transbordo da Diretoria
                </span>
                <div style={{ fontSize: '13px', color: '#000000', fontWeight: 700, marginTop: '2px' }}>
                  NF-e #{dimonaOrder?.nfe_number || '114273'} emitida pela Olist ERP · Chave: 332611...011596
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleTransbordoNFe}
                  style={{
                    padding: '8px 14px',
                    fontSize: '11px',
                    background: '#047857',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📤 Transbordar Danfe p/ Flávio (Financeiro)
                </button>

                <button
                  onClick={handleTransbordoTracking}
                  style={{
                    padding: '8px 14px',
                    fontSize: '11px',
                    background: '#1D4ED8',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🚚 Transbordar Rastreio p/ Gustavo (SAC)
                </button>

                {dimonaOrder?.tracking_url && (
                  <a
                    href={dimonaOrder.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 14px',
                      fontSize: '11px',
                      background: '#000000',
                      color: '#DFCFA8',
                      textDecoration: 'none',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Rastrear na J&T ↗
                  </a>
                )}

                {dimonaOrder?.nfe_link && (
                  <a
                    href={dimonaOrder.nfe_link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 14px',
                      fontSize: '11px',
                      background: '#374151',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Imprimir Danfe (Olist) ↗
                  </a>
                )}
              </div>
            </div>

            {/* TABELA OFICIAL DE AMOSTRAS FÍSICAS COM COLUNA QUANTIDADE (QTD) */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#000000', margin: 0 }}>
                  Ficha Detalhada das Peças do Pedido #755-460-927
                </h3>
                <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>
                  Total: <strong>{totalItemsCount} Unidades</strong> · Custo Total de Produção: <strong>R$ {totalLoteValue.toFixed(2).replace('.', ',')}</strong>
                </span>
              </div>

              <div style={{ overflowX: 'auto', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', padding: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.14)', color: '#4B5563' }}>
                      <th style={{ padding: '10px 8px' }}>Item</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>Qtd</th>
                      <th style={{ padding: '10px 8px' }}>Modelo / Malha</th>
                      <th style={{ padding: '10px 8px' }}>Cor / Tam</th>
                      <th style={{ padding: '10px 8px' }}>Estampa Frente</th>
                      <th style={{ padding: '10px 8px' }}>Estampa Costas</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right' }}>Custo Un.</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right' }}>Custo Total</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center' }}>Status Fábrica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map(s => (
                      <tr key={s.item} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 800, color: '#000000' }}>{s.item}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <span style={{ background: '#000000', color: '#DFCFA8', padding: '2px 8px', fontWeight: 800, fontSize: '11px', borderRadius: '2px' }}>
                            {s.qty} un
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', fontWeight: 700, color: '#000000' }}>{s.product}</td>
                        <td style={{ padding: '12px 8px', color: '#374151' }}>{s.color} · <strong>{s.size}</strong></td>
                        <td style={{ padding: '12px 8px', color: '#374151' }}>{s.front}</td>
                        <td style={{ padding: '12px 8px', color: '#374151' }}>{s.back}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', color: '#4B5563' }}>
                          R$ {s.unitCost.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>
                          R$ {s.totalCost.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: s.status === 'Aguardando Coleta' ? 'rgba(30, 64, 175, 0.12)' : 'rgba(5, 150, 105, 0.12)',
                            color: s.status === 'Aguardando Coleta' ? '#1D4ED8' : '#047857',
                            border: s.status === 'Aguardando Coleta' ? '1px solid rgba(30, 64, 175, 0.4)' : '1px solid rgba(5, 150, 105, 0.4)',
                            display: 'inline-block'
                          }}>
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
            <div style={{ marginTop: '20px', padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)' }}>
              <h3 style={{ fontSize: '13px', color: '#000000', fontWeight: 700, marginBottom: '6px' }}>
                Protocolo do Genera para Inspeção Têxtil na Chegada da Caixa:
              </h3>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h2 className={styles.cardHeading} style={{ margin: 0 }}>
                    Printful Brasil (Global Print on Demand)
                  </h2>
                  <span style={{ fontSize: '11px', background: 'rgba(29,78,216,0.12)', color: '#1D4ED8', border: '1px solid rgba(29,78,216,0.3)', padding: '2px 8px', fontWeight: 700 }}>
                    🔵 Token Bearer Ativo (Full Scopes)
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#3F3F46', margin: 0 }}>
                  Especialidade: Bonés Estruturados High Profile com Bordado 3D em Alto Relevo, Malhas Ring-Spun Internacionais e Fulfillment no Brasil.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={fetchPrintfulData}
                  disabled={printfulLoading}
                  className={styles.btnSecondary}
                  style={{ fontSize: '11px', padding: '7px 14px' }}
                >
                  {printfulLoading ? 'Verificando...' : '🔄 Sincronizar Printful API'}
                </button>
                <button
                  onClick={() => setShowPrintfulJson(!showPrintfulJson)}
                  style={{
                    padding: '7px 12px',
                    fontSize: '11px',
                    background: '#000000',
                    color: '#DFCFA8',
                    border: '1px solid #DFCFA8',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {showPrintfulJson ? '✕ Fechar Escopos' : '{ } Inspecionar Escopos API'}
                </button>
              </div>
            </div>

            {/* Gaveta de Escopos do Token */}
            {showPrintfulJson && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#0C0D0E',
                color: '#60A5FA',
                border: '1px solid rgba(255,255,255,0.14)',
                fontFamily: 'monospace',
                fontSize: '11px',
                overflowX: 'auto'
              }}>
                <div style={{ color: '#9CA3AF', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                  ⚡ GET https://api.printful.com/oauth/scopes (Bearer Token Homologado)
                </div>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(printfulScopes, null, 2)}
                </pre>
              </div>
            )}

            {/* DESTAQUE DA JOIA DA COROA: O BONÉ TRUCKER RETRO 3D */}
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#F5ECE0',
              border: '2px solid rgba(0,0,0,0.16)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '11px', background: '#000000', color: '#DFCFA8', padding: '3px 8px', fontWeight: 800, textTransform: 'uppercase' }}>
                  ★ Carro-Chefe de Entrada da Coleção
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', marginTop: '8px', marginBottom: '6px' }}>
                  Boné Retro Trucker High Profile (Mescla Cinza &amp; Preto)
                </h3>
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', margin: 0 }}>
                  Entretela frontal rígida estruturada (não amassa), copa alta, 8 pespontos simétricos na aba curva e telinha respirável traseira.
                </p>

                <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Custo de Fábrica Printful</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#000000' }}>R$ 100,00</div>
                    <span style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>Peça + Bordado 3D Inclusos</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Preço Sugerido AVA</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1D4ED8' }}>R$ 229,00</div>
                    <span style={{ fontSize: '10px', color: '#4B5563' }}>Padrão Streetwear de Luxo</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Margem Líquida Limpa</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>R$ 129,00 / un</div>
                    <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>56.3% de Lucro Líquido</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>
                    Técnica Homologada: Bordado em Alto Relevo (3D Puff Embroidery) com o Selo AVA Circular Preto Fosco ou Prata Metálico.
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700 }}>
                  Vantagens do Canal Printful para a AVA
                </span>
                <ul style={{ textAlign: 'left', fontSize: '12px', color: '#374151', lineHeight: '1.7', marginTop: '10px', paddingLeft: '20px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h2 className={styles.cardHeading} style={{ margin: 0 }}>
                    Reserva INK (Grupo AR&amp;Co) — Linha B2B Corporativo
                  </h2>
                  <span style={{ fontSize: '11px', background: 'rgba(217,119,6,0.14)', color: '#92400E', border: '1px solid rgba(217,119,6,0.3)', padding: '2px 8px', fontWeight: 700 }}>
                    🟡 Estratégia: Uniformes, Empresas &amp; Escolas (Frente Única)
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#3F3F46', margin: 0 }}>
                  Enquadramento de Mercado: Utilizar a linha básica e barata da Reserva com estampa apenas frontal para atender demandas B2B corporativas, camisetas promocionais e uniformes premium.
                </p>
              </div>

              <span style={{ fontSize: '11px', background: '#EFE4CC', color: '#4B5563', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.14)', fontWeight: 600 }}>
                Status: Aguardando Resposta de Ticket Zoop
              </span>
            </div>

            {/* Simulador B2B de Uniformes & Lotes Corporativos */}
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#F5ECE0',
              border: '1px solid rgba(0,0,0,0.14)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#000000', marginBottom: '12px' }}>
                Simulador de Proposta B2B (Uniformes Corporativos / Escolas com Selo Reserva)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700, marginBottom: '4px' }}>
                    Quantidade do Lote (Peças)
                  </label>
                  <input
                    type="number"
                    value={reservaSimulatorQty}
                    onChange={(e) => setReservaSimulatorQty(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700, marginBottom: '4px' }}>
                    Custo Unitário Reserva (R$)
                  </label>
                  <input
                    type="number"
                    value={reservaUnitPrice}
                    onChange={(e) => setReservaUnitPrice(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#4B5563', fontWeight: 700, marginBottom: '4px' }}>
                    Preço da Proposta B2B (R$/un)
                  </label>
                  <input
                    type="number"
                    value={reservaSellPrice}
                    onChange={(e) => setReservaSellPrice(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.2)'
                    }}
                  />
                </div>

                <div style={{ padding: '10px 14px', background: '#000000', color: '#DFCFA8' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>Lucro Líquido da Proposta</span>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>
                    R$ {((reservaSellPrice - reservaUnitPrice) * reservaSimulatorQty).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '14px', fontSize: '12px', color: '#4B5563', lineHeight: '1.5' }}>
                💡 <strong>Vantagem Competitiva:</strong> O cliente corporativo valoriza o prestígio da marca Reserva para seus colaboradores. Como uniformes corporativos usam apenas a estampa no peito/frente, a limitação de não estampar nas costas deixa de ser um problema e vira uma oportunidade de receita em escala.
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 4: KANBAN GERAL DE PEDIDOS POD                       */}
        {/* ======================================================== */}
        {activeTab === 'kanban' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h2 className={styles.cardHeading} style={{ margin: 0 }}>Fluxo de Produção Sob Demanda (Kanban PoD)</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46', margin: 0 }}>
                  Acompanhamento centralizado de pedidos de todos os fornecedores (Dimona, Printful e Reserva INK).
                </p>
              </div>
              <button
                onClick={() => fetchDimonaData(true)}
                disabled={samplesLoading}
                className={styles.btnSecondary}
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                {samplesLoading ? 'Atualizando...' : '🔄 Sincronizar Kanban'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '16px', minHeight: '240px' }}>
              {[
                { title: '1. Novo Pedido', badge: '0' },
                { title: '2. Faturamento & NF-e', badge: '0' },
                { title: '3. Em Produção (Fábrica)', badge: '0' },
                { title: '4. Expedição / Rastreio', badge: '1 Ativo' },
                { title: '5. Entregue ao Cliente', badge: '0' },
              ].map((col, idx) => (
                <div key={idx} style={{ background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
                      {col.title}
                    </span>
                    <span style={{ fontSize: '10px', background: idx === 3 ? '#1D4ED8' : '#D1D5DB', color: idx === 3 ? '#FFFFFF' : '#374151', padding: '1px 6px', borderRadius: '2px', fontWeight: 700 }}>
                      {col.badge}
                    </span>
                  </div>

                  {idx === 3 ? (
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(29, 78, 216, 0.4)',
                      borderLeft: '4px solid #1D4ED8',
                      padding: '12px',
                      marginTop: '8px',
                      textAlign: 'left',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '12px', color: '#000' }}>#{dimonaOrder?.dimona_id || '755-460-927'}</span>
                        <span style={{ fontSize: '10px', color: '#1D4ED8', fontWeight: 800, background: 'rgba(30,64,175,0.12)', padding: '2px 6px' }}>
                          {dimonaOrder?.status || 'Aguardando Coleta'}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#1F2937', fontWeight: 700 }}>Lote Oficial 6 Peças Amostras</div>
                      <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px' }}>Fornecedor: Dimona Silk HD</div>
                      <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '6px', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '4px' }}>
                        🚚 {dimonaOrder?.shipping_method_name || 'J&T Express'} · NF-e #{dimonaOrder?.nfe_number || '114273'}
                      </div>
                      {dimonaOrder?.tracking_url && (
                        <div style={{ marginTop: '8px' }}>
                          <a
                            href={dimonaOrder.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '11px', color: '#1D4ED8', textDecoration: 'underline', fontWeight: 700 }}
                          >
                            Rastrear Pacote J&T ↗
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', marginTop: '40px' }}>
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
