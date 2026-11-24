'use client';

import React, { useState, useEffect } from 'react';
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

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  year: number;
  season: string;
  productsCount: number;
  isActiveStorefront: boolean;
}

export default function AtelierPage() {
  const [activeTab, setActiveTab] = useState<'artworks' | 'media' | 'collections'>('collections');
  const [artworks, setArtworks] = useState<ArtworkEntry[]>(SAMPLE_ARTWORKS);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkEntry | null>(SAMPLE_ARTWORKS[0]);

  // Coleções reais do banco de dados
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [loadingCols, setLoadingCols] = useState(false);
  const [showCreateCol, setShowCreateCol] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColYear, setNewColYear] = useState(new Date().getFullYear().toString());
  const [newColSeason, setNewColSeason] = useState('Outono');

  const fetchCollections = async () => {
    setLoadingCols(true);
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
        setActiveCollectionId(data.activeCollectionId);
      }
    } catch (err) {
      console.error('Erro ao buscar coleções:', err);
    } finally {
      setLoadingCols(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSetActiveStorefront = async (collectionId: string) => {
    try {
      const res = await fetch('/api/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveCollectionId(collectionId);
        setCollections((prev) =>
          prev.map((c) => ({
            ...c,
            isActiveStorefront: c.id === collectionId,
          }))
        );
      }
    } catch (err) {
      alert('Erro ao ativar coleção na vitrine.');
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newColName,
          year: newColYear,
          season: newColSeason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewColName('');
        setShowCreateCol(false);
        fetchCollections();
      }
    } catch (err) {
      alert('Erro ao criar coleção.');
    }
  };

  const activeOrFirstColId = activeCollectionId || collections[0]?.id || '';

  return (
    <div className={styles.adminLayout}>
      <AdminHeader />

      <main className={styles.mainContainer}>
        <div className={styles.deptModuleHeader}>
          <div>
            <h1 className={styles.moduleTitle}>Depto 08 · Atelier Criativo &amp; Mídias</h1>
            <p className={styles.moduleSubtitle}>
              Sócio Titular: <strong>Tripoint</strong> · Artes Matrizes 300 DPI, Prompts MDV (26 Chaves), Biblioteca de Mídias e Coleções da Vitrine
            </p>
          </div>
          <span className={styles.partnerOwnerBadge} style={{ fontSize: '11px', padding: '6px 12px' }}>
            👤 Titular: Tripoint
          </span>
        </div>

        {/* Seletor de Abas do Atelier */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.14)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('collections')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: activeTab === 'collections' ? '#000000' : '#EFE4CC',
              color: activeTab === 'collections' ? '#DFCFA8' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'collections' ? '#000000' : 'rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
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
              background: activeTab === 'media' ? '#000000' : '#EFE4CC',
              color: activeTab === 'media' ? '#DFCFA8' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'media' ? '#000000' : 'rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
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
              background: activeTab === 'artworks' ? '#000000' : '#EFE4CC',
              color: activeTab === 'artworks' ? '#DFCFA8' : '#18181B',
              border: '1px solid',
              borderColor: activeTab === 'artworks' ? '#000000' : 'rgba(0, 0, 0, 0.18)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            🎨 Artes Matrizes 300 DPI &amp; Prompts (MDV 26)
          </button>
        </div>

        {/* ABA 1: PROJETOS E COLEÇÕES (VITRINE ATIVA) */}
        {activeTab === 'collections' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className={styles.cardHeading}>Gerenciador de Coleções &amp; Vitrine Oficial</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Acesse o painel completo de ordenação do grid de 3 colunas, slots vazios e publicação da coleção ativa na Home.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateCol(!showCreateCol)}
                  className={styles.btnSecondary}
                  style={{ fontSize: '12px', padding: '8px 14px' }}
                >
                  {showCreateCol ? '✕ Fechar Formulário' : '+ Nova Coleção'}
                </button>
                <Link
                  href={activeOrFirstColId ? `/admin/grid-manager?collection=${activeOrFirstColId}` : '/admin/grid-manager'}
                  className={styles.btnPrimary}
                >
                  Abrir Grid Manager da Vitrine ↗
                </Link>
                <Link href="/" target="_blank" className={styles.btnSecondary}>
                  Ver Loja Pública ↗
                </Link>
              </div>
            </div>

            {/* Formulário de Criação de Coleção */}
            {showCreateCol && (
              <form onSubmit={handleCreateCollection} style={{ marginTop: '20px', padding: '16px', background: '#DFCFA8', border: '1px solid rgba(0,0,0,0.18)', borderRadius: '2px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', color: '#000000' }}>
                  + Cadastrar Nova Coleção
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: '#374151' }}>Nome da Coleção</label>
                    <input
                      type="text"
                      placeholder="Ex: Coleção Inverno 2026"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', color: '#000000', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: '#374151' }}>Ano</label>
                    <input
                      type="number"
                      value={newColYear}
                      onChange={(e) => setNewColYear(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', color: '#000000', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: '#374151' }}>Estação</label>
                    <select
                      value={newColSeason}
                      onChange={(e) => setNewColSeason(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.2)', color: '#000000', fontSize: '13px' }}
                    >
                      <option value="Outono">Outono</option>
                      <option value="Inverno">Inverno</option>
                      <option value="Primavera">Primavera</option>
                      <option value="Verão">Verão</option>
                      <option value="Especial">Especial (Colab/Cápsula)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  style={{ marginTop: '14px', fontSize: '11px', padding: '8px 16px' }}
                >
                  Gravar e Iniciar Coleção
                </button>
              </form>
            )}

            {/* Grid de Coleções do Banco */}
            {loadingCols ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#52525B', fontSize: '13px' }}>
                Carregando coleções do catálogo...
              </div>
            ) : collections.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#52525B', fontSize: '13px' }}>
                Nenhuma coleção cadastrada. Clique em "+ Nova Coleção" para começar.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {collections.map((col) => {
                  const isStoreActive = col.isActiveStorefront || col.id === activeCollectionId;

                  return (
                    <div
                      key={col.id}
                      style={{
                        padding: '16px',
                        background: isStoreActive ? '#FAF6EE' : '#EFE4CC',
                        border: isStoreActive ? '2px solid #000000' : '1px solid rgba(0,0,0,0.14)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#000000', fontSize: '15px' }}>{col.name}</span>
                          {isStoreActive ? (
                            <span style={{ fontSize: '10px', background: 'rgba(5,150,105,0.14)', color: '#065F46', border: '1px solid rgba(5,150,105,0.3)', padding: '2px 6px', fontWeight: 700 }}>
                              ★ Vitrine Ativa da Loja
                            </span>
                          ) : (
                            <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.18)', color: '#4B5563', padding: '2px 6px', fontWeight: 600 }}>
                              {col.season} · {col.year}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: '#374151', marginBottom: '14px' }}>
                          {col.productsCount} {col.productsCount === 1 ? 'produto cadastrado' : 'produtos cadastrados'} nesta coleção.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        <Link
                          href={`/admin/grid-manager?collection=${col.id}`}
                          className={styles.btnSecondary}
                          style={{ display: 'block', textAlign: 'center', fontSize: '11px', textDecoration: 'none' }}
                        >
                          Editar Grid &amp; Produtos ↗
                        </Link>
                        {!isStoreActive && (
                          <button
                            type="button"
                            onClick={() => handleSetActiveStorefront(col.id)}
                            style={{
                              padding: '6px 10px',
                              fontSize: '10px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.6px',
                              background: '#FFFFFF',
                              border: '1px solid rgba(0,0,0,0.22)',
                              color: '#000000',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            ⚡ Definir como Vitrine Ativa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABA 2: BIBLIOTECA GERAL DE MÍDIAS (9 COLUNAS) */}
        {activeTab === 'media' && (
          <div className={styles.moduleCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className={styles.cardHeading}>Biblioteca Geral de Mídias (Grid Uniforme de 9 Colunas)</h2>
                <p style={{ fontSize: '13px', color: '#3F3F46' }}>
                  Visualizador de imagens de alta resolução com Lightbox, ordenação e uploads vinculados à coleção ativa.
                </p>
              </div>
              <Link href="/admin/media" className={styles.btnPrimary}>
                Abrir Biblioteca em Tela Cheia ↗
              </Link>
            </div>

            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 4px rgba(0,0,0,0.03)', marginTop: '16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '4px' }}>
                Biblioteca Integrada Ativa
              </div>
              <p style={{ fontSize: '12px', color: '#374151', maxWidth: '450px', margin: '0 auto 16px auto' }}>
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
                      background: '#EFE4CC',
                      border: selectedArtwork?.id === art.id ? '2px solid #000000' : '1px solid rgba(0,0,0,0.12)',
                      boxShadow: selectedArtwork?.id === art.id ? '0 2px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#000000', fontSize: '13px' }}>{art.title}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: art.isRegistered ? '#047857' : '#92400E' }}>
                        {art.isRegistered ? '✓ Registrado' : '○ Não Registrado'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#4B5563' }}>
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
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Conceito Artístico:</span>
                    <p style={{ color: '#000000', marginTop: '4px', lineHeight: '1.4' }}>{selectedArtwork.concept}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '10px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                      <span style={{ color: '#4B5563', fontSize: '10px', fontWeight: 600 }}>Gabarito Dimona (Frente/Costas)</span>
                      <div style={{ color: '#000000', fontWeight: 700, marginTop: '2px' }}>{selectedArtwork.printDimona}</div>
                    </div>

                    <div style={{ padding: '10px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                      <span style={{ color: '#4B5563', fontSize: '10px', fontWeight: 600 }}>Gabarito Reserva INK (Frente)</span>
                      <div style={{ color: '#000000', fontWeight: 700, marginTop: '2px' }}>{selectedArtwork.printReserva}</div>
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                    <span style={{ color: '#4B5563', fontSize: '10px', fontWeight: 600 }}>Registro de Autoria SHA-256</span>
                    <div style={{ color: '#065F46', fontWeight: 700, fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', marginTop: '4px' }}>
                      {selectedArtwork.sha256}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: '#EFE4CC', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                    <span style={{ color: '#4B5563', fontSize: '10px', fontWeight: 600 }}>Matriz de Escrita (MDV 26 Chaves)</span>
                    <div style={{ color: '#000000', marginTop: '4px' }}>
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
