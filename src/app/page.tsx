import React from "react";
import { prisma } from "@/lib/db";
import ProductCard from "@/app/components/ProductCard";
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

  // Mapeamento 1-para-1 com os cards configurados no Painel (/admin/grid-manager)
  const cardItems = serializedProducts.map((product) => {
    const primary = product.images[0]?.image_url || "/imagens/COLECAO/01.jpg";
    const hover = product.images[1] ? product.images[1].image_url : primary;
    return {
      cardId: product.id,
      product,
      primaryImage: primary,
      hoverImage: hover,
    };
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Seção da Vitrine de Produtos */}
        <section id="vitrine" className={styles.collectionSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Summer Collection - 2027
            </h2>
          </div>
          {/* Grid de 4 colunas em sintonia total com o Painel */}
          <div className={styles.grid}>
            {cardItems.map((item) => (
              <ProductCard
                key={item.cardId}
                product={item.product}
                primaryImage={item.primaryImage}
                hoverImage={item.hoverImage}
              />
            ))}
          </div>
        </section>
      </main>

      <footer id="footer" className={styles.footer}>
        © {new Date().getFullYear()} AVA VITÓRIA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
