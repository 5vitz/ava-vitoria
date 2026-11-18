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
            <h1 className={styles.moduleTitle}>Depto 06 · Marketing &amp; Branding</h1>
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
            <p style={{ fontSize: '13px', color: '#D1D2D6', lineHeight: '1.6' }}>
              Para reproduzir o impacto visual da vitrine da AVA no Instagram, todas as publicações no feed devem ser lançadas em <strong>blocos de 3 postagens simultâneas (Trios 3x3)</strong>:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '16px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ aspectRatio: '9/16', background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                Post 1<br/>Modelo Lookbook
              </div>
              <div style={{ aspectRatio: '9/16', background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                Post 2<br/>Close da Arte Silk HD
              </div>
              <div style={{ aspectRatio: '9/16', background: '#1A1B1E', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                Post 3<br/>Conceito / Detalhes
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#8E8F94' }}>
              * Formato vertical 9:16 ou 4:5 rigoroso, eliminando bordas brancas e mantendo a harmonia com o site.
            </div>
          </div>

          {/* Sacolinha Instagram & Meta Commerce */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Sacolinha do Instagram (Feed Meta Commerce)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: '#D1D2D6', lineHeight: '1.5' }}>
                O backend da AVA gera em tempo real o catálogo de produtos no formato XML RSS 2.0 homologado pela Meta para alimentar o Instagram Shopping e o Gerenciador de Comércio do Facebook.
              </p>

              <div style={{ padding: '12px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#FFFFFF', fontFamily: 'monospace' }}>
                  /api/catalog/meta
                </span>
                <a href="/api/catalog/meta" target="_blank" className={styles.btnSecondary} style={{ fontSize: '10px' }}>
                  Ver XML ↗
                </a>
              </div>

              <div style={{ padding: '12px', background: '#0F1814', border: '1px solid rgba(16,185,129,0.2)', fontSize: '12px', color: '#10B981' }}>
                ✓ Feed validado e pronto para apontamento no Meta Business Suite.
              </div>
            </div>
          </div>
        </div>

        {/* Simulador da Campanha "EU TENHO CUPOM!" */}
        <section className={styles.moduleCard} style={{ marginTop: '24px' }}>
          <h2 className={styles.cardHeading}>Campanha Viral: &quot;EU TENHO CUPOM!&quot; (Senhas Prefixadas 1... a 5...)</h2>
          <p style={{ fontSize: '13px', color: '#8E8F94' }}>
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
              <div key={i} style={{ padding: '12px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{tier.prefix}</div>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>{tier.discount}</div>
                <div style={{ fontSize: '10px', color: '#8E8F94', marginTop: '4px' }}>{tier.friends}</div>
              </div>
            ))}
          </div>

          {/* Testador Rápido de Senha */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <input
              type="text"
              placeholder="Digite uma senha de cupom (Ex: 4AMIGOSVIP)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              style={{
                background: '#0E0F10',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '10px 14px',
                color: '#FFFFFF',
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
              <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>
                ✓ Senha válida: {discountSimulated}% de desconto destravado na Vitrine Secreta!
              </span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
