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

  // Preparar os 4 cards de imagens por produto (1: Frente, 2: Frente Detalhe, 3: Costas, 4: Costas Detalhe)
  const productQuads = serializedProducts.map((product) => {
    const images = product.images;
    const frontImage = images[0]?.image_url || "/imagens/COLECAO/01.jpg";
    const frontZoomImage = images[1] ? images[1].image_url : frontImage;
    const backImage = images[2] ? images[2].image_url : (images[1] ? images[1].image_url : frontImage);
    const backZoomImage = images[3] ? images[3].image_url : backImage;

    return {
      product,
      frontImage,
      frontZoomImage,
      backImage,
      backZoomImage,
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
          {/* Grid de 1 produto por linha (4 cards estáticos no total) */}
          <div className={styles.grid}>
            {productQuads.map((item) => (
              <ProductCard
                key={item.product.id}
                product={item.product}
                frontImage={item.frontImage}
                frontZoomImage={item.frontZoomImage}
                backImage={item.backImage}
                backZoomImage={item.backZoomImage}
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
