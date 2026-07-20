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

  // Agrupar imagens em pares de 2 (frente/zoom e costas/zoom) para gerar cards independentes
  const cardItems = serializedProducts.flatMap((product) => {
    const images = product.images;
    if (images.length === 0) {
      return [{
        cardId: `${product.id}-0`,
        product,
        primaryImage: "/imagens/COLECAO/01.jpg",
        hoverImage: "/imagens/COLECAO/01.jpg"
      }];
    }

    const pairs = [];
    for (let i = 0; i < images.length; i += 2) {
      const primary = images[i].image_url;
      const hover = images[i + 1] ? images[i + 1].image_url : primary;
      pairs.push({
        cardId: `${product.id}-${i / 2}`,
        product,
        primaryImage: primary,
        hoverImage: hover
      });
    }
    return pairs;
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
          {/* Grid de 4 colunas */}
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
