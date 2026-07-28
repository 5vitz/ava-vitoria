'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulação do envio, depois associamos o e-mail de destino
    setTimeout(() => {
      setStatus('success');
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Lado Esquerdo: Info da Marca */}
          <div className={styles.infoSection}>
            <div className={styles.brandTitleContainer}>
              <h1 className={styles.sectionTitle}>Contato</h1>
              <p className={styles.brandSubtitle}>AVA Vitória — Sem Limites</p>
            </div>
            
            <div className={styles.infoDetails}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Suporte & Vendas</span>
                <span className={styles.infoValue}>contato@avasemlimites.com.br</span>
              </div>
              
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Localização</span>
                <span className={styles.infoValue}>Vitória, Espírito Santo — Brasil</span>
              </div>
              
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Social</span>
                <a href="https://instagram.com/ava.vitoria" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  @ava.vitoria
                </a>
              </div>
            </div>
          </div>

          {/* Lado Direito: Formulário Moderno */}
          <div className={styles.formSection}>
            <div className={styles.formCard}>
              {status === 'success' ? (
                <div className={styles.successMessage}>
                  <svg viewBox="0 0 24 24" className={styles.successIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <h3 className={styles.successTitle}>Mensagem Enviada</h3>
                  <p className={styles.successText}>Obrigado pelo contato. Sua mensagem foi recebida e responderemos o mais breve possível.</p>
                  <button onClick={() => setStatus('idle')} className={styles.resetButton}>
                    Enviar Outra Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className={styles.input}
                    />
                    <label htmlFor="nome" className={styles.label}>Seu Nome</label>
                  </div>

                  <div className={styles.inputGroup}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className={styles.input}
                    />
                    <label htmlFor="email" className={styles.label}>Seu E-mail</label>
                  </div>

                  <div className={styles.inputGroup}>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder=" "
                      className={styles.input}
                    />
                    <label htmlFor="telefone" className={styles.label}>Telefone (Opcional)</label>
                  </div>

                  <div className={styles.inputGroup}>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className={styles.textarea}
                      rows={5}
                    ></textarea>
                    <label htmlFor="mensagem" className={styles.label}>Sua Mensagem</label>
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer da Página */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} AVA VITÓRIA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
