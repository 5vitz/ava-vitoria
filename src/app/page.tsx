import React from "react";
import { prisma } from "@/lib/db";
import ProductCard from "@/app/components/ProductCard";
import CartStatus from "@/app/components/CartStatus";
import HeroVideo from "@/app/components/HeroVideo";
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
        created_at: "desc",
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
    images: product.images.map((img: any) => ({
      image_url: img.image_url,
    })),
  }));

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Banner Hero Conceitual Limpo com Vídeo Animado */}
        <HeroVideo
          videoSrc="/imagens/IA/Skateboarder_video.mp4"
          posterSrc="/imagens/IA/Frame_Inicial.jpeg"
          sealSrc="/imagens/LOGO/selo_preto.png"
          interruptDelta={0.55} // Ajuste experimental de margem antes do final (aumentado para cortar mais do fim)
        />

        {/* Seção da Vitrine de Produtos */}
        <section className={styles.collectionSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Coleção de Outono - 2026</h3>
          </div>

          {/* Grid de 3 colunas Balenciaga */}
          <div className={styles.grid}>
            {serializedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} AVA VITÓRIA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
