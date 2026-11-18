'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminHeader from '../AdminHeader';
import styles from '../admin-cockpit.module.css';

interface ArtworkEntry {
  id: string;
  code: string;
  title: string;
  concept: string;
  folder: string;
  isRegistered: boolean;
  sha256: string;
  supplier: string;
  printDimona: string;
  printReserva: string;
  mutatedKeysCount: number;
}

const SAMPLE_ARTWORKS: ArtworkEntry[] = [
  {
    id: 'art-1',
    code: 'ART-CUBISTA-01',
    title: 'Arte Cubista Urbana Vitória',
    concept: 'Composição cubista desconstruindo os relevos da baía de Vitória com elementos do grafite local.',
    folder: 'Coleção Sem Limites',
    isRegistered: true,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    supplier: 'DIMONA',
    printDimona: '3435 × 4680 px (300 DPI)',
    printReserva: '4200 × 4800 px (300 DPI)',
    mutatedKeysCount: 4
  },
  {
    id: 'art-2',
    code: 'ART-CORUJA-02',
    title: 'Coruja Guardiã da Noite',
    concept: 'Ilustração geométrica da fauna capixaba sob a perspectiva noturna do streetwear contemporâneo.',
    folder: 'Coleção Sem Limites',
    isRegistered: true,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    supplier: 'DIMONA',
    printDimona: '3435 × 4680 px (300 DPI)',
    printReserva: '4200 × 4800 px (300 DPI)',
    mutatedKeysCount: 2
  },
  {
    id: 'art-3',
    code: 'ART-ALTINHA-03',
    title: 'Passa a Bola — Altinha Addict',
    concept: 'Extração autoral do arquivo mestre ALTA.ai com 4 quadros (Escorpião, Bicicleta, Shark Attack e Chapa).',
    folder: 'Testes de Verão',
    isRegistered: false,
    sha256: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    supplier: 'DIMONA',
    printDimona: '3435 × 4680 px (300 DPI)',
    printReserva: '4200 × 4800 px (300 DPI)',
    mutatedKeysCount: 0
  }
];

export default function AtelierPage() {
  const [activeTab, setActiveTab] = useState<'artworks' | 'media' | 'collections'>('collections');
  const [artworks, setArtworks] = useState<ArtworkEntry[]>(SAMPLE_ARTWORKS);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkEntry | null>(SAMPLE_ARTWORKS[0]);

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 07 · Atelier Criativo &amp; Mídias</h1>
            <p className={styles.moduleSubtitle}>
              Estúdio Unificado: Artes Matrizes 300 DPI, Prompts MDV (26 Chaves), Biblioteca de Mídias e Projetos/Coleções da Vitrine
            </p>
          </div>
          <span className={styles.brandBadge}>Atelier Oficial</span>
        </div>

        {/* Seletor de Abas do Atelier */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('collections')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'collections' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'collections' ? '#000000' : '#A0A0A5',
              border: '1px solid',
              borderColor: activeTab === 'collections' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            ★ Projetos &amp; Coleções (Vitrine Ativa)
          </button>

          <button
            onClick={() => setActiveTab('media')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'media' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'media' ? '#000000' : '#A0A0A5',
              border: '1px solid',
              borderColor: activeTab === 'media' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🖼️ Biblioteca Geral de Mídias (9 Colunas)
          </button>

          <button
            onClick={() => setActiveTab('artworks')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'artworks' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'artworks' ? '#000000' : '#A0A0A5',
              border: '1px solid',
              borderColor: activeTab === 'artworks' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🎨 Artes Matrizes 300 DPI &amp; Prompts (MDV 26)
          </button>
        </div>

        {/* ABA 1: PROJETOS E COLEÇÕES (VITRINE ATIVA) */}
        {activeTab === 'collections' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Gerenciador de Coleções &amp; Vitrine Oficial</h2>
                <p style={{ fontSize: '13px', color: '#8E8F94' }}>
                  Acesse o painel completo de ordenação do grid de 3 colunas, slots vazios e publicação da coleção ativa na Home.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/admin/grid-manager" className={styles.btnPrimary}>
                  Abrir Grid Manager da Vitrine ↗
                </Link>
                <Link href="/" target="_blank" className={styles.btnSecondary}>
                  Ver Loja Pública ↗
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ padding: '16px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '14px' }}>Coleção Sem Limites</span>
                  <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.2)', color: '#10B981', padding: '2px 6px', fontWeight: 600 }}>
                    ★ Vitrine Ativa da Loja
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#8E8F94', marginBottom: '12px' }}>
                  Coleção oficial em exibição pública no domínio www.ava-vitoria.com.br.
                </p>
                <Link href="/admin/grid-manager" className={styles.btnSecondary} style={{ display: 'block', textAlign: 'center', fontSize: '11px' }}>
                  Editar Grid &amp; Produtos ↗
                </Link>
              </div>

              <div style={{ padding: '16px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '14px' }}>Coleção Ava Nova Era</span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.08)', color: '#A0A0A5', padding: '2px 6px' }}>
                    Em Produção
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#8E8F94', marginBottom: '12px' }}>
                  Peças e lookbook 9:16 em preparação para futuros drops.
                </p>
                <Link href="/admin/grid-manager" className={styles.btnSecondary} style={{ display: 'block', textAlign: 'center', fontSize: '11px' }}>
                  Editar Grid &amp; Produtos ↗
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: BIBLIOTECA GERAL DE MÍDIAS (9 COLUNAS) */}
        {activeTab === 'media' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Biblioteca Geral de Mídias (Grid Uniforme de 9 Colunas)</h2>
                <p style={{ fontSize: '13px', color: '#8E8F94' }}>
                  Visualizador de imagens de alta resolução com Lightbox, ordenação e uploads vinculados à coleção ativa.
                </p>
              </div>
              <Link href="/admin/media" className={styles.btnPrimary}>
                Abrir Biblioteca em Tela Cheia ↗
              </Link>
            </div>

            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)', marginTop: '16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                Biblioteca Integrada Ativa
              </div>
              <p style={{ fontSize: '12px', color: '#8E8F94', maxWidth: '450px', margin: '0 auto 16px auto' }}>
                Para fazer novos uploads, inspecionar fotos em tamanho original com a lupa ou organizar mídias por coleção, abra o visualizador dedicado.
              </p>
              <Link href="/admin/media" className={styles.btnPrimary}>
                Gerenciar Mídias da Coleção ↗
              </Link>
            </div>
          </div>
        )}

        {/* ABA 3: ARTES MATRIZES 300 DPI & PROMPTS MDV */}
        {activeTab === 'artworks' && (
          <div className={styles.moduleGrid2Cols}>
            {/* Lista de Artes Matrizes */}
            <div className={styles.moduleCard}>
              <h2 className={styles.cardHeading}>Matrizes Cadastradas (300 DPI)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {artworks.map(art => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtwork(art)}
                    style={{
                      padding: '12px',
                      background: selectedArtwork?.id === art.id ? '#1C1D21' : '#0E0F10',
                      border: '1px solid',
                      borderColor: selectedArtwork?.id === art.id ? '#FFFFFF' : 'rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px' }}>{art.title}</span>
                      <span style={{ fontSize: '10px', color: art.isRegistered ? '#10B981' : '#F59E0B' }}>
                        {art.isRegistered ? '✓ Registrado' : '○ Não Registrado'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#A0A0A5' }}>
                      Código: {art.code} · Fornecedor: {art.supplier}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspetor de Detalhes & MDV 26 Chaves */}
            {selectedArtwork && (
              <div className={styles.moduleCard}>
                <h2 className={styles.cardHeading}>Ficha Técnica da Matriz &amp; Prompt MDV</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#8E8F94' }}>Conceito Artístico:</span>
                    <p style={{ color: '#FFFFFF', marginTop: '4px', lineHeight: '1.4' }}>{selectedArtwork.concept}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '8px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#8E8F94', fontSize: '10px' }}>Gabarito Dimona (Frente/Costas)</span>
                      <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedArtwork.printDimona}</div>
                    </div>

                    <div style={{ padding: '8px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ color: '#8E8F94', fontSize: '10px' }}>Gabarito Reserva INK (Frente)</span>
                      <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedArtwork.printReserva}</div>
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#8E8F94', fontSize: '10px' }}>Registro de Autoria SHA-256</span>
                    <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', marginTop: '4px' }}>
                      {selectedArtwork.sha256}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: '#0E0F10', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#8E8F94', fontSize: '10px' }}>Matriz de Escrita (MDV 26 Chaves)</span>
                    <div style={{ color: '#FFFFFF', marginTop: '4px' }}>
                      Chaves mutadas no prompt: <strong>{selectedArtwork.mutatedKeysCount} de 26</strong> (Conforme diretriz do Diretor de Fotografia IA).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
