"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createCollectionAction, deleteCollectionAction } from "./grid-manager/actions";
import styles from "./dashboard.module.css";

interface CollectionType {
  id: string;
  name: string;
  slug: string;
  year: number;
  season: string;
}

interface DashboardClientProps {
  initialCollections: CollectionType[];
  initialSearchQuery: string;
  selectingForProduct: string;
}

export default function DashboardClient({
  initialCollections,
  initialSearchQuery,
  selectingForProduct,
}: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estados
  const [searchVal, setSearchVal] = useState(initialSearchQuery);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [colName, setColName] = useState("");
  const [colYear, setColYear] = useState(new Date().getFullYear().toString());
  const [colSeason, setColSeason] = useState("Outono");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handler de pesquisa interativa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);

    const params = new URLSearchParams();
    if (val.trim()) params.set("searchQuery", val);
    if (selectingForProduct) params.set("selectingForProduct", selectingForProduct);

    router.push(`${pathname}?${params.toString()}`);
  };

  // Clique para selecionar projeto (Coleção)
  const handleSelectCollection = (collection: CollectionType) => {
    if (selectingForProduct) {
      // Se estiver no Modo de Seleção, volta para o Grid Manager pré-selecionando o card editado
      router.push(
        `/admin/grid-manager?collection=${collection.id}&selectingForProduct=${selectingForProduct}`
      );
    } else {
      // Acesso padrão ao Grid Manager da Coleção
      router.push(`/admin/grid-manager?collection=${collection.id}`);
    }
  };

  // Clique para deletar projeto (Coleção)
  const handleDeleteCollection = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // Impede o clique de abrir a coleção
    if (window.confirm(`Tem certeza que deseja excluir permanentemente a coleção "${name}" e todos os seus produtos?`)) {
      setLoading(true);
      try {
        const res = await deleteCollectionAction(id);
        if (res.success) {
          router.refresh();
        }
      } catch (err: any) {
        alert(err.message || "Erro ao excluir coleção.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Cadastrar nova coleção
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) {
      setError("Insira o nome do projeto.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const yearInt = parseInt(colYear) || new Date().getFullYear();
      const result = await createCollectionAction({
        name: colName,
        year: yearInt,
        season: colSeason,
      });

      if (result.success && result.collection) {
        setShowCreateForm(false);
        setColName("");
        setColYear(new Date().getFullYear().toString());
        setColSeason("Outono");
        
        // Recarregar os dados na página
        router.refresh();
        
        // Redirecionar direto para a nova coleção se não estiver associando mídia
        if (!selectingForProduct) {
          router.push(`/admin/grid-manager?collection=${result.collection.id}`);
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar nova coleção.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Banner de Modo de Seleção Ativo */}
      {selectingForProduct && (
        <div className={styles.selectionModeBanner}>
          <div className={styles.bannerInfo}>
            <span className={styles.bannerIcon}>⚠️</span>
            <div>
              <strong>Modo de Seleção Ativo</strong>
              <p>Escolha um projeto abaixo para abrir a biblioteca correspondente e associar mídias ao card.</p>
            </div>
          </div>
          <button 
            onClick={() => router.push(`/admin/grid-manager?collection=Todos&selectingForProduct=${selectingForProduct}`)}
            className={styles.bannerCancelBtn}
          >
            Cancelar Seleção
          </button>
        </div>
      )}

      {/* Título de Introdução */}
      <div className={styles.introSection}>
        <h2 className={styles.dashboardTitle}>Centro de Controle de Projetos</h2>
        <p className={styles.dashboardSubtitle}>
          Pesquise por Coleção, Ano, Estação ou pelo Nome de um produto específico para iniciar os trabalhos.
        </p>
      </div>

      {/* Buscador e Botão de Novo Projeto */}
      <div className={styles.searchBarRow}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por Coleção, Ano, Estação ou Produto..."
            value={searchVal}
            onChange={handleSearchChange}
          />
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={styles.newProjectBtn}
        >
          {showCreateForm ? "Cancelar" : "+ Novo Projeto (Coleção)"}
        </button>
      </div>

      {/* Formulário de Criação de Coleção */}
      {showCreateForm && (
        <form onSubmit={handleCreateCollection} className={styles.createForm}>
          <h3 className={styles.formTitle}>Novo Projeto (Coleção)</h3>
          
          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formGridFields}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nome da Coleção</label>
              <input
                type="text"
                placeholder="Ex: Outono 2026, Summer Crew"
                className={styles.textInput}
                value={colName}
                onChange={(e) => setColName(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ano de Lançamento</label>
              <input
                type="number"
                placeholder="2026"
                className={styles.textInput}
                value={colYear}
                onChange={(e) => setColYear(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Estação (Season)</label>
              <select
                className={styles.select}
                value={colSeason}
                onChange={(e) => setColSeason(e.target.value)}
              >
                <option value="Outono">Outono</option>
                <option value="Inverno">Inverno</option>
                <option value="Primavera">Primavera</option>
                <option value="Verão">Verão</option>
                <option value="Especial">Especial (Colab/Cápsula)</option>
              </select>
            </div>
          </div>

          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Criando..." : "Criar e Iniciar"}
          </button>
        </form>
      )}

      {/* Lista de Projetos (Grid de Coleções) */}
      <div className={styles.projectsGrid}>
        {initialCollections.length === 0 ? (
          <div className={styles.emptyGridMessage}>
            Nenhuma Coleção encontrada com o termo pesquisado.
          </div>
        ) : (
          initialCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => handleSelectCollection(col)}
              className={styles.projectCard}
            >
              <div className={styles.cardHeader}>
                <span className={styles.colYear}>{col.year}</span>
                <div className={styles.headerRight}>
                  <span className={styles.colSeason}>{col.season}</span>
                  <button 
                    onClick={(e) => handleDeleteCollection(e, col.id, col.name)}
                    className={styles.deleteColBtn}
                    title="Excluir Coleção"
                  >
                    ×
                  </button>
                </div>
              </div>
              <h3 className={styles.colName}>{col.name}</h3>
              <span className={styles.openCardLabel}>
                {selectingForProduct ? "Selecionar Biblioteca ➔" : "Gerenciar Coleção & Grid ➔"}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
