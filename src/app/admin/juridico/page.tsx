'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

const CHECKLIST_ITEMS = [
  { id: 1, label: 'Cartão CNPJ atualizado (CNAE 4781-4/00 vestuário)', checked: true },
  { id: 2, label: 'Inscrição Estadual (IE) ativa na SEFAZ-ES (SINTEGRA)', checked: false },
  { id: 3, label: 'Certificado Digital e-CNPJ Tipo A1 (.pfx + senha)', checked: false },
  { id: 4, label: 'Regime Tributário CRT 1 (Simples Nacional) definido', checked: false },
  { id: 5, label: 'Contrato Social consolidado dos 4 Sócios (Jucees)', checked: false },
  { id: 6, label: 'Conta Bancária PJ aberta no mesmo CNPJ da empresa', checked: false },
  { id: 7, label: 'Documento oficial com foto (CIN/CNH) do Sócio Administrador', checked: true },
  { id: 8, label: 'Comprovante de endereço recente da empresa e do sócio', checked: true },
  { id: 9, label: 'Disponibilidade para biometria facial nos marketplaces', checked: true },
  { id: 10, label: 'E-mail corporativo de operações (ex: integracoes@avasemlimites.com.br)', checked: false },
  { id: 11, label: 'Protocolo de registro da marca no INPI (Classes 25 e 35)', checked: false },
  { id: 12, label: 'Termos de Uso, Política de Trocas (CDC 49) e LGPD no ar', checked: true },
  { id: 13, label: 'Feed XML Meta Catalog ativo para Instagram Shopping', checked: true },
  { id: 14, label: 'Chave de API Dropsimples Dimona configurada', checked: true },
];

export default function JuridicoPage() {
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [lexQuestion, setLexQuestion] = useState('');
  const [lexAnswer, setLexAnswer] = useState<string | null>(null);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAskLex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lexQuestion.trim()) return;

    const q = lexQuestion.toLowerCase();
    let ans = "Dr. Lex orienta: A conformidade jurídica e tributária da AVA Sem Limites deve resguardar os 4 sócios mediante Contrato Social registrado na JUCEES e emissão regular de NF-e (Modelo 55) via Bling ERP.";

    if (q.includes('mei') || q.includes('ltda') || q.includes('simples') || q.includes('tribut') || q.includes('imposto')) {
      ans = "Dr. Lex: O desenquadramento de MEI para LTDA no Simples Nacional é mandatório. O MEI limita o faturamento a R$ 81 mil/ano (média de 38 camisetas/mês na nossa faixa de preço), proíbe a inclusão de sócios e bloqueia a aprovação em canais premium como Dafiti e Reserva.";
    } else if (q.includes('inpi') || q.includes('marca') || q.includes('patente') || q.includes('registro')) {
      ans = "Dr. Lex: O registro de marca da AVA deve ser protocolado no INPI em duas classes fundamentais: Classe NCL 25 (Artigos de vestuário, camisetas, regatas e bonés) e Classe NCL 35 (Comércio eletrônico e representação de produtos de moda).";
    } else if (q.includes('troca') || q.includes('devolu') || q.includes('cdc') || q.includes('direito') || q.includes('arrependimento')) {
      ans = "Dr. Lex: O Artigo 49 do Código de Defesa do Consumidor garante 7 dias corridos para devolução sem ônus em compras online. No nosso portal /atendimento, o Agente Discriminador separa desistência legal de vício de fabricação (90 dias de garantia legal).";
    }

    setLexAnswer(ans);
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 01 · Jurídico &amp; Compliance</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Flávio</strong> · Governança Fiscal, Transição Societária (MEI ➔ LTDA), INPI e Consultoria Dr. Lex
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Flávio
          </span>
        </div>

        {/* Diagnóstico MEI vs LTDA */}
        <section className={styles.moduleCard} style={{ marginBottom: '24px' }}>
          <h2 className={styles.cardHeading}>Diagnóstico Fiscal Crítico: MEI vs. LTDA (Simples Nacional)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#1B1112', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ color: '#EF4444', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
                ⚠️ Gargalos do MEI Atual
              </div>
              <ul style={{ fontSize: '12px', color: '#D1D2D6', lineHeight: '1.6', paddingLeft: '16px' }}>
                <li>Limite de 38 peças/mês (R$ 81 mil/ano).</li>
                <li>Proibição legal de inclusão dos 4 sócios.</li>
                <li>Bloqueio de cadastro na Dafiti e Reserva.</li>
                <li>Trava de compras de notas fiscais da Dimona.</li>
              </ul>
            </div>

            <div style={{ padding: '16px', background: '#0F1814', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ color: '#10B981', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
                ✅ Vantagens da LTDA (Simples Nacional)
              </div>
              <ul style={{ fontSize: '12px', color: '#D1D2D6', lineHeight: '1.6', paddingLeft: '16px' }}>
                <li>Teto salta para R$ 360 mil até R$ 4,8 milhões/ano.</li>
                <li>Contrato Social formalizando os 4 sócios (25% cada).</li>
                <li>Liberação imediata nos 10 canais via Bling ERP.</li>
                <li>Mesmo número de CNPJ preservado na transição.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Checklist de Documentação */}
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.cardHeading}>Checklist Bling ERP & 10 Canais</h2>
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>{progressPercent}% Completo</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {checklist.map(item => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: item.checked ? '#FFFFFF' : '#8E8F94',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
                  />
                  <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chat Dr. Lex */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Consultoria Jurídica IA · Dr. Lex</h2>
            <p style={{ fontSize: '12px', color: '#8E8F94' }}>
              Tire dúvidas rápidas sobre contratos, tributação Simples Nacional, proteção de marca no INPI e direito do consumidor.
            </p>

            <form onSubmit={handleAskLex} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={3}
                placeholder="Ex: Como funciona o registro da marca AVA no INPI nas classes 25 e 35?"
                value={lexQuestion}
                onChange={(e) => setLexQuestion(e.target.value)}
                style={{
                  background: '#0E0F10',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '12px',
                  color: '#FFFFFF',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button type="submit" className={styles.btnPrimary} style={{ alignSelf: 'flex-start' }}>
                Consultar Dr. Lex
              </button>
            </form>

            {lexAnswer && (
              <div style={{ padding: '16px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', lineHeight: '1.5', color: '#E0E0E0' }}>
                {lexAnswer}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
