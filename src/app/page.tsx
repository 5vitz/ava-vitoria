import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductGrid from "@/app/components/ProductGrid";
import CartStatus from "@/app/components/CartStatus";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Buscar os produtos ativos e suas respectivas imagens no banco PostgreSQL
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: {
        is_active: true,
      },
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

  // Serializar os produtos para converter objetos Decimal do Prisma em numbers simples (evitando quebras de hidratação)
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
            alt="AVA Sem Limites Banner"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        </section>

        {/* Seção da Vitrine de Produtos */}
        <section id="vitrine" className={styles.collectionSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleMain}>Summer Collection</span>
              <span className={styles.titleYear}> - 2027</span>
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
