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
  { id: 15, label: 'Parametrização RTC 2027 no Bling ERP (NCM 6109.10.00 × cClassTrib/CST de CBS e IBS — LC 214/2025)', checked: false },
];

export default function JuridicoPage() {
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [lexQuestion, setLexQuestion] = useState('');
  const [lexAnswer, setLexAnswer] = useState<string | null>(null);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const askLexTopic = (questionText: string) => {
    setLexQuestion(questionText);
    const q = questionText.toLowerCase();
    let ans = "Dr. Lex orienta: A conformidade jurídica e tributária da AVA Sem Limites deve resguardar os 4 sócios mediante Contrato Social registrado na JUCEES e emissão regular de NF-e (Modelo 55) via Bling ERP.";

    if (
      q.includes('rtc') ||
      q.includes('cbs') ||
      q.includes('ibs') ||
      q.includes('reforma') ||
      q.includes('214') ||
      q.includes('cclasstrib') ||
      q.includes('ncm') ||
      q.includes('b2b')
    ) {
      ans = "Dr. Lex (Reforma Tributária — LC 214/2025 · Motor RFB RTC): 1) Na emissão de NF-e (Modelo 55) via Bling ERP, o NCM padrão de vestuário (6109.10.00) deve estar estritamente vinculado ao código cClassTrib e CST de IBS/CBS para evitar a rejeição fiscal REG-011 da Receita Federal. 2) Estratégia Híbrida Simples Nacional: No Varejo B2C (Site e Marketplaces), recolhemos CBS e IBS por dentro do DAS (Anexo I com alíquota reduzida). Já em grandes contratos B2B Corporativos (Uniformes Reserva INK), a LC 214/2025 permite avaliar o destaque pelo regime regular caso a empresa compradora exija crédito tributário integral de IBS/CBS. 3) Arquitetura Limpa: O motor Java oficial da Receita (calculadora-rtc-simples-nacional) roda na camada do ERP integrador (Bling), poupando 100% de RAM da nossa VPS Contabo.";
    } else if (q.includes('mei') || q.includes('ltda') || q.includes('simples') || q.includes('tribut') || q.includes('imposto')) {
      ans = "Dr. Lex: O desenquadramento de MEI para LTDA no Simples Nacional é mandatório para a escala nacional. O MEI limita o faturamento a R$ 81 mil/ano (média de 38 camisetas/mês na nossa faixa de preço), não comporta os 4 sócios no Contrato Social e bloqueia canais como Dafiti e Reserva. No entanto, com o MEI ativo com Inscrição Estadual (SEFAZ-ES), já podemos validar vendas imediatas emitindo NF-e 55 pelo Bling ERP antes da transformação na JUCEES.";
    } else if (q.includes('inpi') || q.includes('marca') || q.includes('patente') || q.includes('registro')) {
      ans = "Dr. Lex: O registro de marca da AVA deve ser protocolado no INPI em duas classes fundamentais: Classe NCL 25 (Artigos de vestuário, camisetas, regatas e bonés) e Classe NCL 35 (Comércio eletrônico e representação de produtos de moda).";
    } else if (q.includes('troca') || q.includes('devolu') || q.includes('cdc') || q.includes('direito') || q.includes('arrependimento')) {
      ans = "Dr. Lex: O Artigo 49 do Código de Defesa do Consumidor garante 7 dias corridos para devolução sem ônus em compras online. No nosso portal /atendimento, o Agente Discriminador separa desistência legal de vício de fabricação (90 dias de garantia legal sob o Art. 26 do CDC, cobrada do fornecedor PoD).";
    }

    setLexAnswer(ans);
  };

  const handleAskLex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lexQuestion.trim()) return;
    askLexTopic(lexQuestion);
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
              Sócio Titular: <strong>Flávio</strong> · Governança Fiscal, Reforma Tributária (LC 214/2025 — CBS/IBS), Transição MEI ➔ LTDA, INPI e Dr. Lex
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
            <div style={{ padding: '16px', background: '#FFFFFF', border: '1px solid rgba(220,38,38,0.35)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#991B1B', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                ⚠️ Gargalos do MEI Atual
              </div>
              <ul style={{ fontSize: '12px', color: '#18181B', lineHeight: '1.6', paddingLeft: '16px' }}>
                <li>Limite de 38 peças/mês (R$ 81 mil/ano).</li>
                <li>Proibição legal de inclusão dos 4 sócios.</li>
                <li>Bloqueio de cadastro na Dafiti e Reserva.</li>
                <li>Trava de compras de notas fiscais da Dimona.</li>
              </ul>
            </div>

            <div style={{ padding: '16px', background: '#FFFFFF', border: '1px solid rgba(5,150,105,0.35)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#065F46', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
                ✅ Vantagens da LTDA (Simples Nacional)
              </div>
              <ul style={{ fontSize: '12px', color: '#18181B', lineHeight: '1.6', paddingLeft: '16px' }}>
                <li>Teto salta para R$ 360 mil até R$ 4,8 milhões/ano.</li>
                <li>Contrato Social formalizando a diretoria e sociedade na JUCEES.</li>
                <li>Liberação imediata nos 10 canais via Bling ERP.</li>
                <li>Mesmo número de CNPJ preservado na transição.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Inteligência Reforma Tributária do Consumo (RTC — LC 214/2025) */}
        <section className={styles.moduleCard} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <h2 className={styles.cardHeading} style={{ margin: 0 }}>
              ⚖️ Inteligência Reforma Tributária (RTC — LC 214/2025 · CBS &amp; IBS no Simples Nacional)
            </h2>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', background: '#FFFFFF', border: '1px solid #000000', color: '#18181B' }}>
              Ref. Oficial: ReceitaFederal/calculadora-rtc-simples-nacional (v1.0.2)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#18181B', marginBottom: '6px' }}>
                1. Trava Fiscal NCM × cClassTrib (Regra REG-011)
              </div>
              <p style={{ fontSize: '12px', color: '#27272A', lineHeight: '1.55', margin: 0 }}>
                Na virada 2026 ➔ 2027, o motor da Receita valida o vínculo estrito entre o <strong>NCM 6109.10.00</strong> (camisetas e regatas de malha de algodão) e os códigos <strong>cClassTrib</strong> e <strong>CST</strong> do grupo <code>&lt;IBSCBS&gt;</code> na NF-e Modelo 55 para evitar rejeição (HTTP 422 / REG-011).
              </p>
            </div>

            <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#065F46', marginBottom: '6px' }}>
                2. Estratégia B2C (Pelo DAS) vs. B2B (Crédito Integral)
              </div>
              <p style={{ fontSize: '12px', color: '#27272A', lineHeight: '1.55', margin: 0 }}>
                A LC 214/2025 permite recolher CBS/IBS <strong>por dentro do DAS</strong> (Anexo I com alíquota reduzida — ideal para o nosso Varejo B2C) ou pelo <strong>regime regular</strong> para transferir crédito integral de CBS/IBS em grandes lotes corporativos B2B (Uniformes Reserva INK).
              </p>
            </div>

            <div style={{ padding: '14px', background: '#FFFFFF', border: '1px solid #000000' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#18181B', marginBottom: '6px' }}>
                3. Zero Overhead na VPS Contabo (Delegado ao Bling)
              </div>
              <p style={{ fontSize: '12px', color: '#27272A', lineHeight: '1.55', margin: 0 }}>
                O motor Java 25 / Spring Boot da Receita Federal é processado nativamente pelo <strong>Bling ERP v3</strong> na emissão do XML da NF-e 55, mantendo nosso servidor Next.js/PostgreSQL 100% leve e sem consumo extra de memória RAM.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Checklist de Documentação */}
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.cardHeading}>Checklist Bling ERP &amp; 10 Canais</h2>
              <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>{progressPercent}% Completo</span>
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
                    color: item.checked ? '#18181B' : '#52525B',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                  />
                  <span style={{ textDecoration: item.checked ? 'line-through' : 'none', opacity: item.checked ? 0.75 : 1 }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chat Dr. Lex */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Consultoria Jurídica IA · Dr. Lex</h2>
            <p style={{ fontSize: '12px', color: '#3F3F46' }}>
              Tire dúvidas rápidas sobre contratos, Reforma Tributária (CBS/IBS — LC 214/2025), Simples Nacional, proteção de marca no INPI e direito do consumidor.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => askLexTopic('Como funciona a Reforma Tributária (RTC — CBS, IBS e cClassTrib) na AVA?')}
                style={{ fontSize: '11px', padding: '5px 9px', background: '#FFFFFF', border: '1px solid #000000', cursor: 'pointer', color: '#18181B', fontWeight: 600 }}
              >
                ⚖️ Reforma Tributária (CBS/IBS &amp; cClassTrib)
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Qual a estratégia de transição MEI para LTDA no Simples Nacional?')}
                style={{ fontSize: '11px', padding: '5px 9px', background: '#FFFFFF', border: '1px solid #000000', cursor: 'pointer', color: '#18181B', fontWeight: 600 }}
              >
                🏛️ Transição MEI ➔ LTDA
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Como registrar a marca AVA no INPI nas classes 25 e 35?')}
                style={{ fontSize: '11px', padding: '5px 9px', background: '#FFFFFF', border: '1px solid #000000', cursor: 'pointer', color: '#18181B', fontWeight: 600 }}
              >
                ®️ Marca INPI (Classes 25 e 35)
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Como funciona a regra de trocas CDC Art. 49 vs defeito PoD?')}
                style={{ fontSize: '11px', padding: '5px 9px', background: '#FFFFFF', border: '1px solid #000000', cursor: 'pointer', color: '#18181B', fontWeight: 600 }}
              >
                🛡️ Trocas CDC Art. 49
              </button>
            </div>

            <form onSubmit={handleAskLex} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <textarea
                rows={3}
                placeholder="Ex: Como funciona a Reforma Tributária (CBS/IBS e cClassTrib) no Simples Nacional?"
                value={lexQuestion}
                onChange={(e) => setLexQuestion(e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #000000',
                  padding: '12px',
                  color: '#000000',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.04)'
                }}
              />
              <button type="submit" className={styles.btnPrimary} style={{ alignSelf: 'flex-start' }}>
                Consultar Dr. Lex
              </button>
            </form>

            {lexAnswer && (
              <div style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #000000', fontSize: '13px', lineHeight: '1.5', color: '#18181B', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)' }}>
                {lexAnswer}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
