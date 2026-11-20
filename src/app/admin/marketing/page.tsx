'use client';

import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

export default function MarketingPage() {
  const [couponCode, setCouponCode] = useState('3AMIGOSAVA');
  const [discountSimulated, setDiscountSimulated] = useState<number | null>(null);

  const testCoupon = () => {
    const firstChar = couponCode.trim().charAt(0);
    const num = parseInt(firstChar, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      setDiscountSimulated(num * 10);
    } else {
      setDiscountSimulated(null);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 07 · Marketing &amp; Branding</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Tripoint</strong> · Trios 3x3 Balenciaga no Instagram, Posicionamento de Marca e Campanha &quot;EU TENHO CUPOM!&quot;
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Tripoint
          </span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Postagens em Trios 3x3 no Instagram */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Estratégia de Feed Instagram (Trios 3x3 Balenciaga)</h2>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
              Para reproduzir o impacto visual da vitrine da AVA no Instagram, todas as publicações no feed devem ser lançadas em <strong>blocos de 3 postagens simultâneas (Trios 3x3)</strong>:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '16px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ aspectRatio: '9/16', background: '#DFCFA8', border: '1px solid rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '8px', color: '#000000', fontWeight: 600 }}>
                Post 1<br/>Modelo Lookbook
              </div>
              <div style={{ aspectRatio: '9/16', background: '#DFCFA8', border: '1px solid rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '8px', color: '#000000', fontWeight: 600 }}>
                Post 2<br/>Close da Arte Silk HD
              </div>
              <div style={{ aspectRatio: '9/16', background: '#DFCFA8', border: '1px solid rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '8px', color: '#000000', fontWeight: 600 }}>
                Post 3<br/>Conceito / Detalhes
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#4B5563' }}>
              * Formato vertical 9:16 ou 4:5 rigoroso, eliminando bordas brancas e mantendo a harmonia com o site.
            </div>
          </div>

          {/* Sacolinha Instagram & Meta Commerce */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Sacolinha do Instagram (Feed Meta Commerce)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                O backend da AVA gera em tempo real o catálogo de produtos no formato XML RSS 2.0 homologado pela Meta para alimentar o Instagram Shopping e o Gerenciador de Comércio do Facebook.
              </p>

              <div style={{ padding: '12px 14px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#000000', fontFamily: 'monospace', fontWeight: 600 }}>
                  /api/catalog/meta
                </span>
                <a href="/api/catalog/meta" target="_blank" className={styles.btnSecondary} style={{ fontSize: '10px' }}>
                  Ver XML ↗
                </a>
              </div>

              <div style={{ padding: '12px', background: '#EFE4CC', border: '1px solid rgba(5,150,105,0.4)', fontSize: '12px', color: '#065F46', fontWeight: 600 }}>
                ✓ Feed validado e pronto para apontamento no Meta Business Suite.
              </div>
            </div>
          </div>
        </div>

        {/* Simulador da Campanha "EU TENHO CUPOM!" */}
        <section className={styles.moduleCard} style={{ marginTop: '24px' }}>
          <h2 className={styles.cardHeading}>Campanha Viral: &quot;EU TENHO CUPOM!&quot; (Senhas Prefixadas 1... a 5...)</h2>
          <p style={{ fontSize: '13px', color: '#3F3F46' }}>
            Mecanismo para escoar o estoque físico já produzido sem queimar o valor da Nova Coleção PoD. O 1º dígito da senha única gerada no direct define a faixa de desconto concedida:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', margin: '16px 0' }}>
            {[
              { prefix: '1...', friends: '1 Amigo marcado', discount: '10% OFF' },
              { prefix: '2...', friends: '2 Amigos marcados', discount: '20% OFF' },
              { prefix: '3...', friends: '3 Amigos marcados', discount: '30% OFF' },
              { prefix: '4...', friends: '4 Amigos marcados', discount: '40% OFF' },
              { prefix: '5...', friends: '5 Amigos marcados', discount: '50% OFF (Teto)' },
            ].map((tier, i) => (
              <div key={i} style={{ padding: '12px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>{tier.prefix}</div>
                <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700, marginTop: '2px' }}>{tier.discount}</div>
                <div style={{ fontSize: '10px', color: '#4B5563', marginTop: '4px' }}>{tier.friends}</div>
              </div>
            ))}
          </div>

          {/* Testador Rápido de Senha */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Digite uma senha de cupom (Ex: 4AMIGOSVIP)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              style={{
                background: '#EFE4CC',
                border: '1px solid rgba(0,0,0,0.22)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                padding: '10px 14px',
                color: '#000000',
                fontFamily: 'monospace',
                fontSize: '13px',
                outline: 'none',
                maxWidth: '300px'
              }}
            />
            <button onClick={testCoupon} className={styles.btnPrimary}>
              Validar Faixa de Desconto
            </button>
            {discountSimulated !== null && (
              <span style={{ fontSize: '13px', color: '#065F46', fontWeight: 700 }}>
                ✓ Senha válida: {discountSimulated}% de desconto destravado na Vitrine Secreta!
              </span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
