import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductGrid from "@/app/components/ProductGrid";
import CartStatus from "@/app/components/CartStatus";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Identificar qual Coleção está definida como a vitrine ativa da loja
  let activeCollection: any = null;
  let activeCollectionId: string | null = null;

  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { config_key: "active_collection" },
    });
    if (setting && (setting.config_value as any)?.collection_id) {
      activeCollectionId = (setting.config_value as any).collection_id;
    }

    if (activeCollectionId) {
      activeCollection = await prisma.collection.findUnique({
        where: { id: activeCollectionId },
      });
    }

    // Fallback: se não houver coleção explicitamente chaveada, usa a mais recente
    if (!activeCollection) {
      activeCollection = await prisma.collection.findFirst({
        orderBy: { created_at: "desc" },
      });
      activeCollectionId = activeCollection?.id || null;
    }
  } catch (error) {
    console.error("Erro ao buscar coleção ativa:", error);
  }

  // 2. Buscar os produtos ativos exclusivamente da Coleção selecionada
  let products: any[] = [];
  try {
    const whereClause: any = {
      is_active: true,
    };
    if (activeCollectionId) {
      whereClause.collection_id = activeCollectionId;
    }

    products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: {
            display_order: "asc",
          },
        },
      },
      orderBy: {
        display_order: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos do PostgreSQL:", error);
  }

  // Serializar os produtos para converter objetos Decimal do Prisma em numbers simples
  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    card_type: product.card_type,
    images: product.images.map((img: any) => ({
      image_url: img.image_url,
    })),
  }));

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Seção Hero / Banner Principal */}
        <section className={styles.hero}>
          <Image
            src="/imagens/CAPA/BANNER1.png"
            alt="AVA Sem Limites Banner Desktop"
            fill
            priority
            sizes="(max-width: 768px) 0vw, 100vw"
            className={styles.heroImageDesktop}
          />

          {/* Versão Card para Celular (Mesmo padrão dos cards de produto) */}
          <div className={styles.heroCardMobile}>
            <div className={styles.heroImageContainerMobile}>
              <Image
                src="/imagens/CAPA/CapaCelular.png"
                alt="AVA Sem Limites Banner Mobile"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 0vw"
                className={styles.heroImageMobile}
              />
            </div>
          </div>
        </section>

        {/* Seção da Vitrine de Produtos */}
        <section id="vitrine" className={styles.collectionSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleMain}>
                {activeCollection ? activeCollection.name : "Summer Collection"}
              </span>
              <span className={styles.titleYear}>
                {" "}{activeCollection ? `${activeCollection.season} ${activeCollection.year}` : "2027"}
              </span>
            </h2>
          </div>
          {/* Grid de 3 colunas com controle de inspeção ativa e vidro fumê nos 8 vizinhos */}
          <ProductGrid products={serializedProducts} />
        </section>
      </main>

      <footer id="footer" className={styles.footer}>
        © {new Date().getFullYear()} AVA VITÓRIA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
