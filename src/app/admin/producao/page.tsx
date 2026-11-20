'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

const DIMONA_SAMPLES = [
  { item: '01', product: 'Camiseta Oversized Street 20.1 (220g)', color: 'Preto', size: 'G', front: 'Arte Cubista', back: 'Selo AVA Branco 16cm', status: 'Em Produção', gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '02', product: 'T-Shirt Prime 26.1 (180g Pele de Pêssego)', color: 'Branco', size: 'G', front: 'Arte Coruja', back: 'Selo AVA Preto 16cm', status: 'Em Produção', gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '03', product: 'T-Shirt Estonada Vintage 30.1 (170g)', color: 'Cinza Chumbo', size: 'GG', front: 'Peito: Siga Fazendo o Bem', back: 'Pôster: Siga Fazendo o Bem', status: 'Em Produção', gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '04', product: 'T-Shirt Quality 30.1 (165g)', color: 'Vinho', size: 'GG', front: 'Arte Cubista', back: 'Selo AVA Preto 16cm', status: 'Em Produção', gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '05', product: 'Boné Prime Fivela de Metal Confort', color: 'Preto', size: 'Único', front: 'Selo AVA Branco Circular', back: 'Liso', status: 'Em Produção', gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
  { item: '06', product: 'Boné Americano / Trucker Snapback', color: 'Branco', size: 'Único', front: 'Sem Limites AVA Preto', back: 'Liso', status: 'Em Produção', gradeMalha: 'Pendente Entrega', gradeEstampa: 'Pendente Entrega' },
];

export default function ProducaoPage() {
  const [activeTab, setActiveTab] = useState<'samples' | 'suppliers' | 'kanban' | 'stock'>('samples');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  const handleRunPriceSync = async () => {
    setSyncLoading(true);
    setSyncStatus('Executando auditoria preventiva de custos nos fornecedores...');
    try {
      const res = await fetch('/api/production/suppliers/sync-prices', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`✓ Auditoria concluída com sucesso às ${new Date().toLocaleTimeString()}! Itens verificados: ${data.updatedItemsCount}. Tabelas estáveis.`);
      } else {
        setSyncStatus('Erro ao executar sincronização de fornecedores.');
      }
    } catch {
      setSyncStatus('Erro de conexão com o sincronizador.');
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 04 · Produção &amp; Fornecedores</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Armando</strong> · Operações Print on Demand (PoD Silk HD), Amostras Físicas, Sincronizador 2h e Estoque Físico
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Armando
          </span>
        </div>

        {/* Abas Operacionais */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.14)', paddingBottom: '12px', overflowX: 'auto' }}>
          {[
            { id: 'samples', label: '📦 Amostras Físicas (Pedido #755-460-927)' },
            { id: 'suppliers', label: '⚙️ Multi-Supplier Hub & Auditor 2h' },
            { id: 'kanban', label: '📋 Kanban de Pedidos PoD' },
            { id: 'stock', label: '🏢 Estoque Físico Remanescente' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: activeTab === tab.id ? '#000000' : '#EFE4CC',
                color: activeTab === tab.id ? '#DFCFA8' : '#18181B',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#000000' : 'rgba(0, 0, 0, 0.18)',
                cursor: 'pointer',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ABA: AMOSTRAS FÍSICAS */}
        {activeTab === 'samples' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Lote de Amostras Físicas — Dimona Silk HD (Pedido #755-460-927)</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Pedido pago via PIX (R$ 472,80 com Frete Grátis) em 17/11/2026. Lote composto por 6 peças para homologação de malhas e acabamento.
                </p>
              </div>
              <span style={{ fontSize: '12px', background: 'rgba(5,150,105,0.14)', color: '#065F46', border: '1px solid rgba(5,150,105,0.3)', padding: '4px 10px', fontWeight: 700 }}>
                Na Linha de Produção
              </span>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', padding: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.14)', color: '#4B5563' }}>
                    <th style={{ padding: '10px' }}>Item</th>
                    <th style={{ padding: '10px' }}>Modelo / Malha</th>
                    <th style={{ padding: '10px' }}>Cor / Tam</th>
                    <th style={{ padding: '10px' }}>Estampa Frente</th>
                    <th style={{ padding: '10px' }}>Estampa Costas</th>
                    <th style={{ padding: '10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMONA_SAMPLES.map(s => (
                    <tr key={s.item} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#000000' }}>{s.item}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: '#000000' }}>{s.product}</td>
                      <td style={{ padding: '12px 10px', color: '#374151' }}>{s.color} · {s.size}</td>
                      <td style={{ padding: '12px 10px', color: '#374151' }}>{s.front}</td>
                      <td style={{ padding: '12px 10px', color: '#374151' }}>{s.back}</td>
                      <td style={{ padding: '12px 10px', color: '#047857', fontWeight: 600 }}>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '13px', color: '#000000', fontWeight: 700, marginBottom: '8px' }}>Critérios da Mesa Redonda para Avaliação Física na Chegada:</h3>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                1. <strong>Toque &amp; Gramatura:</strong> Sensação ao toque da malha Prime 180g (lixada) vs Oversized 220g pesada.<br/>
                2. <strong>Fidelidade do Silk HD:</strong> Nitidez dos grafismos cubistas e resolução do selo na nuca.<br/>
                3. <strong>Encolhimento &amp; Lavagem:</strong> Teste de lavagem prévia em 1 peça para atestar estabilidade dimensional.
              </p>
            </div>
          </div>
        )}

        {/* ABA: MULTI-SUPPLIER HUB */}
        {activeTab === 'suppliers' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Hub Multi-Supplier &amp; Auditor de Custos 2h</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Audita os catálogos públicos a cada 2 horas para proteger a margem bruta da AVA Sem Limites contra variações de custos de insumos.
                </p>
              </div>
              <button
                onClick={handleRunPriceSync}
                disabled={syncLoading}
                className={styles.btnPrimary}
              >
                {syncLoading ? 'Auditando...' : '⚡ Forçar Auditoria de Custos'}
              </button>
            </div>

            {syncStatus && (
              <div style={{ padding: '12px', background: '#EFE4CC', border: '1px solid rgba(5,150,105,0.4)', color: '#065F46', fontSize: '12px', marginTop: '12px', fontWeight: 600 }}>
                {syncStatus}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#000000' }}>Dimona (Dropsimples)</span>
                  <span style={{ color: '#047857', fontSize: '11px', fontWeight: 700 }}>Principal (Silk HD)</span>
                </div>
                <p style={{ fontSize: '12px', color: '#374151' }}>Frente + Costas, Prime 180g, Oversized 220g e Bonés.</p>
                <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '8px' }}>Chave de API Dropsimples: Integrada</div>
              </div>

              <div style={{ padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#000000' }}>Reserva INK</span>
                  <span style={{ color: '#92400E', fontSize: '11px', fontWeight: 700 }}>Pendente Zoop</span>
                </div>
                <p style={{ fontSize: '12px', color: '#374151' }}>Linha Classic e Algodão Peruano (apenas estampas na frente).</p>
                <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '8px' }}>Cadastro em validação de compliance</div>
              </div>
            </div>
          </div>
        )}

        {/* ABA: KANBAN POD */}
        {activeTab === 'kanban' && (
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Fluxo de Produção Sob Demanda (Kanban PoD)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '12px', minHeight: '220px' }}>
              {['1. Novo Pedido', '2. Aprovação 4 Sócios', '3. Em Produção (Fábrica)', '4. Expedição / Rastreio', '5. Entregue ao Cliente'].map((col, idx) => (
                <div key={idx} style={{ background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '4px' }}>
                    {col}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4B5563', textAlign: 'center', marginTop: '20px' }}>
                    Nenhum pedido nesta coluna
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: ESTOQUE FÍSICO */}
        {activeTab === 'stock' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Estoque Físico Remanescente AVA</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Peças físicas prontas para escoamento na Vitrine Secreta de Cupons (10% a 50% OFF).
                </p>
              </div>
              <Link href="/admin/stock" className={styles.btnPrimary}>
                Abrir Painel Completo de Estoque ↗
              </Link>
            </div>

            <div style={{ padding: '30px', textAlign: 'center', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: '#000000', marginBottom: '12px' }}>
                O módulo dedicado de estoque permite registrar entradas e saídas físicas de cada variante (P, M, G, GG).
              </p>
              <Link href="/admin/stock" className={styles.btnSecondary}>
                Inspecionar Grades de Tamanho ↗
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
