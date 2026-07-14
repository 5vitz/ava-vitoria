'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

const muralImages = Array.from({ length: 32 }, (_, i) => `/imagens/mural/mural_${i + 1}.png`);

export default function SobreNos() {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % muralImages.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + muralImages.length) % muralImages.length);
    }
  };

  return (
    <div className={styles.page}>
      {/* Cabeçalho da Página */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <nav className={styles.navigation}>
            <Link href="/" className={styles.navLink}>
              Loja
            </Link>
            <Link href="/sobre-nos" className={`${styles.navLink} ${styles.navActive}`}>
              Sobre Nós
            </Link>
            <Link href="/contato" className={styles.navLink}>
              Contato
            </Link>
          </nav>

          <div className={styles.logoContainer}>
            <Link href="/">
              <Image
                src="/imagens/LOGO/logo_black.png"
                alt="AVA Vitória Logo"
                width={120}
                height={35}
                className={styles.logoImage}
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Cabeçalho da Seção */}
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>Mural Ava</h1>
          <p className={styles.sectionSubtitle}>
            A nossa história registrada nas ruas, na música, no skate e na comunidade.
          </p>
        </div>

        {/* Grid de Imagens do Mural */}
        <div className={styles.grid}>
          {muralImages.map((src, index) => (
            <div 
              key={index} 
              className={styles.card}
              onClick={() => openLightbox(index)}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={src}
                  alt={`Mural AVA - Registro ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay}>
                  <span className={styles.overlayText}>Ver Registro {index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox / Visualizador de Imagens */}
      {activeImageIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeButton} onClick={closeLightbox} aria-label="Fechar">
            &times;
          </button>
          
          <button className={styles.navButtonPrev} onClick={showPrev} aria-label="Anterior">
            &#10094;
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={muralImages[activeImageIndex]}
              alt={`Mural AVA - Registro Ampliado ${activeImageIndex + 1}`}
              width={1200}
              height={800}
              style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '85vh' }}
              priority
            />
            <div className={styles.lightboxCaption}>
              Registro {activeImageIndex + 1} de {muralImages.length}
            </div>
          </div>

          <button className={styles.navButtonNext} onClick={showNext} aria-label="Próximo">
            &#10095;
          </button>
        </div>
      )}

      {/* Footer da Página */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} AVA VITÓRIA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
