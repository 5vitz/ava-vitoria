'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './atendimento.module.css';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

const FAQ_KNOWLEDGE: Record<string, string> = {
  modelagens: "Nossas peças são confeccionadas em padrão streetwear de luxo: a linha Oversized possui gramatura pesada de 220g e caimento amplo; a T-Shirt Prime 180g possui toque lixado 'Pele de Pêssego' ultra-macio; e a T-Shirt Estonada 30.1 passa por lavagem especial vintage pré-encolhida.",
  prazos: "Cada peça da AVA Sem Limites é produzida sob demanda com tecnologia de estamparia digital Silk HD (DTG). O prazo médio de confecção e controle de qualidade é de 3 a 5 dias úteis, mais o tempo de frete até o seu endereço.",
  trocas: "Garantimos o direito de arrependimento em até 7 dias corridos após o recebimento (Art. 49 do CDC). Para defeitos de confecção ou estampa, você tem até 90 dias de garantia com troca imediata sem custos na nossa aba 'Trocas e Devoluções'.",
  lavagem: "Para preservar a alta definição do Silk HD e o algodão penteado: lave a peça sempre pelo avesso, em ciclo suave com água fria, não use alvejante e seque à sombra. Ao passar ferro, nunca passe diretamente sobre a estampa.",
};

export default function AtendimentoPage() {
  const [activeTab, setActiveTab] = useState<'concierge' | 'trocas' | 'faq'>('concierge');

  // Estado do Concierge
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Olá! Seja bem-vindo ao Concierge AVA Sem Limites. Sou o seu assistente 24 horas. Como posso te orientar hoje sobre nossas coleções, modelagens, prazos ou trocas?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Estado do Formulário de Trocas
  const [trocaForm, setTrocaForm] = useState({
    nome: '',
    email: '',
    pedido: '',
    tipo: 'TAMANHO',
    motivo: '',
    fotoUrl: ''
  });
  const [trocaEnviada, setTrocaEnviada] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    if (!textToSend) setInputText('');

    // Lógica do Concierge
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Obrigado por sua pergunta! Nossa equipe de atendimento e os diretores da AVA também monitoram todas as solicitações. Para suporte personalizado, envie um e-mail para contato@avasemlimites.com.br.";

      if (lower.includes('modelagem') || lower.includes('tamanho') || lower.includes('medida') || lower.includes('oversized') || lower.includes('tecido')) {
        reply = FAQ_KNOWLEDGE.modelagens;
      } else if (lower.includes('prazo') || lower.includes('entrega') || lower.includes('frete') || lower.includes('rastreio') || lower.includes('demora')) {
        reply = FAQ_KNOWLEDGE.prazos;
      } else if (lower.includes('troca') || lower.includes('devolver') || lower.includes('garantia') || lower.includes('defeito')) {
        reply = FAQ_KNOWLEDGE.trocas;
      } else if (lower.includes('lavar') || lower.includes('lavagem') || lower.includes('cuidar') || lower.includes('passar')) {
        reply = FAQ_KNOWLEDGE.lavagem;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  const handleTrocaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrocaEnviada(true);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Central de Atendimento</h1>
          <p className={styles.subtitle}>Concierge Virtual 24/7, Portal de Trocas & Políticas Oficiais</p>
        </div>

        {/* Abas */}
        <div className={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`${styles.tabBtn} ${activeTab === 'concierge' ? styles.activeTabBtn : ''}`}
          >
            Concierge Virtual 24/7
          </button>
          <button
            onClick={() => setActiveTab('trocas')}
            className={`${styles.tabBtn} ${activeTab === 'trocas' ? styles.activeTabBtn : ''}`}
          >
            Trocas & Devoluções
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`${styles.tabBtn} ${activeTab === 'faq' ? styles.activeTabBtn : ''}`}
          >
            Dúvidas & Políticas Legais
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className={styles.contentCard}>
          {activeTab === 'concierge' && (
            <div className={styles.chatContainer}>
              <div className={styles.chatMessages}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`${styles.messageItem} ${m.sender === 'bot' ? styles.botMessage : styles.userMessage}`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Botões Rápidos */}
              <div className={styles.quickQuestions}>
                <button onClick={() => handleSendMessage("Como são as modelagens e tecidos?")} className={styles.quickBtn}>
                  👕 Modelagens e Tecidos
                </button>
                <button onClick={() => handleSendMessage("Qual o prazo de produção e entrega?")} className={styles.quickBtn}>
                  ⏱️ Prazos e Envio
                </button>
                <button onClick={() => handleSendMessage("Como funciona a política de trocas?")} className={styles.quickBtn}>
                  🔄 Política de Troca
                </button>
                <button onClick={() => handleSendMessage("Como devo lavar minha camiseta?")} className={styles.quickBtn}>
                  🧼 Cuidados de Lavagem
                </button>
              </div>

              <div className={styles.chatInputArea}>
                <input
                  type="text"
                  placeholder="Digite sua dúvida para o Concierge AVA..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className={styles.chatInput}
                />
                <button onClick={() => handleSendMessage()} className={styles.sendBtn}>
                  Enviar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'trocas' && (
            <div>
              {trocaEnviada ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '12px', textTransform: 'uppercase' }}>Solicitação Registrada</h3>
                  <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '14px', maxWidth: '500px', margin: '0 auto 24px auto' }}>
                    Seu chamado foi encaminhado para a Diretoria da AVA e para a fábrica. Em até 24 horas úteis você receberá as instruções com o código de postagem reversa em seu e-mail.
                  </p>
                  <button onClick={() => setTrocaEnviada(false)} className={styles.submitBtn}>
                    Abrir Nova Solicitação
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTrocaSubmit} className={styles.trocasForm}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={trocaForm.nome}
                      onChange={(e) => setTrocaForm({ ...trocaForm, nome: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>E-mail da Compra</label>
                    <input
                      type="email"
                      required
                      value={trocaForm.email}
                      onChange={(e) => setTrocaForm({ ...trocaForm, email: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Número do Pedido ou CPF</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: #AVA-1042 ou seu CPF"
                      value={trocaForm.pedido}
                      onChange={(e) => setTrocaForm({ ...trocaForm, pedido: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Tipo de Solicitação</label>
                    <select
                      value={trocaForm.tipo}
                      onChange={(e) => setTrocaForm({ ...trocaForm, tipo: e.target.value })}
                      className={styles.select}
                    >
                      <option value="TAMANHO">Troca por Tamanho / Caimento (Art. 49 CDC)</option>
                      <option value="ARREPENDIMENTO">Arrependimento de Compra (Até 7 dias corridos)</option>
                      <option value="DEFEITO">Defeito de Costura / Estampa (Garantia de Fábrica)</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Detalhes do Motivo</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Descreva o que ocorreu ou o novo tamanho desejado..."
                      value={trocaForm.motivo}
                      onChange={(e) => setTrocaForm({ ...trocaForm, motivo: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    Enviar Solicitação de Troca
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.6' }}>
              <div>
                <h4 style={{ textTransform: 'uppercase', marginBottom: '8px', fontSize: '15px' }}>1. Direito de Arrependimento (Art. 49 do CDC)</h4>
                <p style={{ color: 'rgba(0,0,0,0.7)' }}>
                  O consumidor tem até 7 (sete) dias corridos a partir da data de entrega da encomenda para desistir da compra realizada online, sem qualquer ônus, recebendo estorno integral do valor pago.
                </p>
              </div>

              <div>
                <h4 style={{ textTransform: 'uppercase', marginBottom: '8px', fontSize: '15px' }}>2. Garantia Legal de Fábrica (90 Dias)</h4>
                <p style={{ color: 'rgba(0,0,0,0.7)' }}>
                  Todas as nossas peças de vestuário contam com garantia legal de 90 dias contra vícios ou defeitos ocultos de fabricação (costura, malha ou descolamento de estampa).
                </p>
              </div>

              <div>
                <h4 style={{ textTransform: 'uppercase', marginBottom: '8px', fontSize: '15px' }}>3. Privacidade e Proteção de Dados (LGPD)</h4>
                <p style={{ color: 'rgba(0,0,0,0.7)' }}>
                  Os dados cadastrados em nosso site são utilizados estritamente para o processamento de pedidos, faturamento de notas fiscais e logística de entrega, sob rigorosa criptografia e em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                </p>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <p>Precisa de suporte urgente? Fale diretamente com a diretoria: <strong>contato@avasemlimites.com.br</strong> ou pelo Instagram <strong>@ava.vitoria</strong>.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} AVA VITÓRIA — Sem Limites. Todos os direitos reservados.
      </footer>
    </div>
  );
}
