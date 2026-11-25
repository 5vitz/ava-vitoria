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
            <h1 className={styles.moduleTitle}>Depto 07 · Marketing de Produto</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Tripoint</strong> · Estratégia da Coleção, Tema das Estampas, Visual Merchandising (Trios 3x3 Instagram &amp; Vitrine Canônica)
            </p>
          </div>
          <span className={styles.partnerOwnerBadge}>
            👤 Titular: Tripoint
          </span>
        </div>

        <div className={styles.moduleGrid2Cols}>
          {/* Postagens em Trios 3x3 no Instagram */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Estratégia de Feed Instagram (Trios 3x3 Balenciaga)</h2>
            <p className={styles.textBodySmall}>
              Para reproduzir o impacto visual da vitrine da AVA no Instagram, todas as publicações no feed devem ser lançadas em <strong>blocos de 3 postagens simultâneas (Trios 3x3)</strong>:
            </p>

            <div className={styles.autoGridSmall}>
              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>Post 1</div>
                <div className={styles.textMutedSmall}>Modelo Lookbook 9:16</div>
              </div>
              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>Post 2</div>
                <div className={styles.textMutedSmall}>Close da Arte Silk HD</div>
              </div>
              <div className={styles.innerCard}>
                <div className={styles.decisionTitle}>Post 3</div>
                <div className={styles.textMutedSmall}>Conceito / Detalhes</div>
              </div>
            </div>

            <div className={styles.textMutedSmall}>
              * Formato vertical 9:16 ou 4:5 rigoroso, eliminando bordas brancas e mantendo a harmonia com o site.
            </div>
          </div>

          {/* Sacolinha Instagram & Meta Commerce */}
          <div className={styles.moduleCard}>
            <h2 className={styles.cardHeading}>Sacolinha do Instagram (Feed Meta Commerce)</h2>
            <div className={styles.flexColStack}>
              <p className={styles.textBodySmall}>
                O backend da AVA gera em tempo real o catálogo de produtos no formato XML RSS 2.0 homologado pela Meta para alimentar o Instagram Shopping e o Gerenciador de Comércio do Facebook.
              </p>

              <div className={styles.innerRowItem}>
                <span className={styles.textPrimaryBold}>/api/catalog/meta</span>
                <a href="/api/catalog/meta" target="_blank" className={styles.btnSecondary}>
                  Ver XML ↗
                </a>
              </div>

              <div className={`${styles.innerCardCompact} ${styles.innerCardSuccess} ${styles.textSuccess}`}>
                <strong>✓ Feed validado e pronto para apontamento no Meta Business Suite.</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Simulador da Campanha "EU TENHO CUPOM!" */}
        <section className={`${styles.moduleCard} ${styles.moduleCardTopSpaced}`}>
          <h2 className={styles.cardHeading}>Campanha Viral: &quot;EU TENHO CUPOM!&quot; (Senhas Prefixadas 1... a 5...)</h2>
          <p className={styles.textBodySmall}>
            Mecanismo para escoar o estoque físico já produzido sem queimar o valor da Nova Coleção PoD. O 1º dígito da senha única gerada no direct define a faixa de desconto concedida:
          </p>

          <div className={styles.autoGridSmall}>
            {[
              { prefix: '1...', friends: '1 Amigo marcado', discount: '10% OFF' },
              { prefix: '2...', friends: '2 Amigos marcados', discount: '20% OFF' },
              { prefix: '3...', friends: '3 Amigos marcados', discount: '30% OFF' },
              { prefix: '4...', friends: '4 Amigos marcados', discount: '40% OFF' },
              { prefix: '5...', friends: '5 Amigos marcados', discount: '50% OFF (Teto)' },
            ].map((tier, i) => (
              <div key={i} className={styles.innerCardCompact}>
                <div className={styles.decisionTitle}>{tier.prefix}</div>
                <div className={`${styles.textPrimaryBold} ${styles.textSuccess}`}>{tier.discount}</div>
                <div className={styles.textMutedSmall}>{tier.friends}</div>
              </div>
            ))}
          </div>

          {/* Testador Rápido de Senha */}
          <div className={styles.flexRowStart}>
            <input
              type="text"
              placeholder="Digite uma senha de cupom (Ex: 4AMIGOSVIP)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className={styles.formInput}
            />
            <button onClick={testCoupon} className={styles.btnPrimary}>
              Validar Faixa de Desconto
            </button>
            {discountSimulated !== null && (
              <span className={`${styles.statusPill} ${styles.statusPillSuccess}`}>
                ✓ Senha válida: {discountSimulated}% de desconto destravado na Vitrine Secreta!
              </span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
