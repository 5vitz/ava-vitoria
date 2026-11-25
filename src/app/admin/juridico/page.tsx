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
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
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

  const completedCount = checklist.filter((c) => c.checked).length;
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
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Flávio
          </span>
        </div>

        {/* Diagnóstico MEI vs LTDA */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <h2 className={styles.cardHeading}>Diagnóstico Fiscal Crítico: MEI vs. LTDA (Simples Nacional)</h2>
          <div className={styles.autoGridCards}>
            <div className={`${styles.innerCard} ${styles.innerCardDanger}`}>
              <div className={`${styles.decisionTitle} ${styles.textDanger}`}>
                ⚠️ Gargalos do MEI Atual
              </div>
              <ul className={styles.textBodySmall}>
                <li>Limite de 38 peças/mês (R$ 81 mil/ano).</li>
                <li>Proibição legal de inclusão dos 4 sócios.</li>
                <li>Bloqueio de cadastro na Dafiti e Reserva.</li>
                <li>Trava de compras de notas fiscais da Dimona.</li>
              </ul>
            </div>

            <div className={`${styles.innerCard} ${styles.innerCardSuccess}`}>
              <div className={`${styles.decisionTitle} ${styles.textSuccess}`}>
                ✅ Vantagens da LTDA (Simples Nacional)
              </div>
              <ul className={styles.textBodySmall}>
                <li>Teto salta para R$ 360 mil até R$ 4,8 milhões/ano.</li>
                <li>Contrato Social formalizando a diretoria e sociedade na JUCEES.</li>
                <li>Liberação imediata nos 10 canais via Bling ERP.</li>
                <li>Mesmo número de CNPJ preservado na transição.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Inteligência Reforma Tributária do Consumo (RTC — LC 214/2025) */}
        <section className={`${styles.moduleCard} ${styles.moduleCardSpaced}`}>
          <div className={styles.flexRowBetween}>
            <h2 className={styles.cardHeadingNoBorder}>
              ⚖️ Inteligência Reforma Tributária (RTC — LC 214/2025 · CBS &amp; IBS no Simples Nacional)
            </h2>
            <span className={styles.statusPill}>
              Ref. Oficial: ReceitaFederal/calculadora-rtc-simples-nacional (v1.0.2)
            </span>
          </div>
          <div className={styles.autoGridCards}>
            <div className={styles.innerCard}>
              <div className={styles.decisionTitle}>
                1. Trava Fiscal NCM × cClassTrib (Regra REG-011)
              </div>
              <p className={styles.textBodySmall}>
                Na virada 2026 ➔ 2027, o motor da Receita valida o vínculo estrito entre o <strong>NCM 6109.10.00</strong> (camisetas e regatas de malha de algodão) e os códigos <strong>cClassTrib</strong> e <strong>CST</strong> do grupo <code>&lt;IBSCBS&gt;</code> na NF-e Modelo 55 para evitar rejeição (HTTP 422 / REG-011).
              </p>
            </div>

            <div className={styles.innerCard}>
              <div className={`${styles.decisionTitle} ${styles.textSuccess}`}>
                2. Estratégia B2C (Pelo DAS) vs. B2B (Crédito Integral)
              </div>
              <p className={styles.textBodySmall}>
                A LC 214/2025 permite recolher CBS/IBS <strong>por dentro do DAS</strong> (Anexo I com alíquota reduzida — ideal para o nosso Varejo B2C) ou pelo <strong>regime regular</strong> para transferir crédito integral de CBS/IBS em grandes lotes corporativos B2B (Uniformes Reserva INK).
              </p>
            </div>

            <div className={styles.innerCard}>
              <div className={styles.decisionTitle}>
                3. Zero Overhead na VPS Contabo (Delegado ao Bling)
              </div>
              <p className={styles.textBodySmall}>
                O motor Java 25 / Spring Boot da Receita Federal é processado nativamente pelo <strong>Bling ERP v3</strong> na emissão do XML da NF-e 55, mantendo nosso servidor Next.js/PostgreSQL 100% leve e sem consumo extra de memória RAM.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.moduleGrid2Cols}>
          {/* Checklist de Documentação */}
          <div className={styles.moduleCard}>
            <div className={styles.flexRowBetween}>
              <h2 className={styles.cardHeadingNoBorder}>Checklist Bling ERP &amp; 10 Canais</h2>
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>{progressPercent}% Completo</span>
            </div>

            <div className={styles.flexColTight}>
              {checklist.map((item) => (
                <label key={item.id} className={styles.innerRowItem}>
                  <span className={styles.flexRowStart}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                    />
                    <span>{item.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chat Dr. Lex */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Consultoria Jurídica IA · Dr. Lex</h2>
            <p className={styles.textBodySmall}>
              Tire dúvidas rápidas sobre contratos, Reforma Tributária (CBS/IBS — LC 214/2025), Simples Nacional, proteção de marca no INPI e direito do consumidor.
            </p>

            <div className={styles.flexRowStart}>
              <button
                type="button"
                onClick={() => askLexTopic('Como funciona a Reforma Tributária (RTC — CBS, IBS e cClassTrib) na AVA?')}
                className={styles.btnSecondary}
              >
                ⚖️ Reforma Tributária (CBS/IBS &amp; cClassTrib)
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Qual a estratégia de transição MEI para LTDA no Simples Nacional?')}
                className={styles.btnSecondary}
              >
                🏛️ Transição MEI ➔ LTDA
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Como registrar a marca AVA no INPI nas classes 25 e 35?')}
                className={styles.btnSecondary}
              >
                ®️ Marca INPI (Classes 25 e 35)
              </button>
              <button
                type="button"
                onClick={() => askLexTopic('Como funciona a regra de trocas CDC Art. 49 vs defeito PoD?')}
                className={styles.btnSecondary}
              >
                🛡️ Trocas CDC Art. 49
              </button>
            </div>

            <form onSubmit={handleAskLex} className={styles.flexColStack}>
              <textarea
                rows={3}
                placeholder="Ex: Como funciona a Reforma Tributária (CBS/IBS e cClassTrib) no Simples Nacional?"
                value={lexQuestion}
                onChange={(e) => setLexQuestion(e.target.value)}
                className={styles.formTextarea}
              />
              <div>
                <button type="submit" className={styles.btnPrimary}>
                  Consultar Dr. Lex
                </button>
              </div>
            </form>

            {lexAnswer && (
              <div className={styles.innerCard}>
                <p className={styles.textBodySmall}>{lexAnswer}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
