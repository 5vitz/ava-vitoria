import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

export async function GET(request: Request) {
  try {
    // 1. Obter o host e protocolo dinamicamente para construir URLs absolutas
    const host = request.headers.get("host") || "localhost:3000";
    const proto = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;

    // 2. Buscar produtos ativos com imagens e variantes de estoque
    const products = await prisma.product.findMany({
      where: {
        is_active: true,
      },
      include: {
        images: {
          orderBy: {
            display_order: "asc",
          },
        },
        variants: true,
      },
    });

    // 3. Montar a estrutura XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml("AVA Vitória")}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml("Feed de produtos oficiais da marca AVA Vitória para Meta Commerce / Instagram Shopping")}</description>
`;

    for (const product of products) {
      const productPrice = Number(product.price).toFixed(2);
      const productDescription = product.description || "Peça conceitual exclusiva da marca AVA Vitória.";
      const productLink = `${baseUrl}/produtos/${product.slug}`;

      // Obter a imagem principal (display_order = 0 ou primeira disponível)
      const primaryImage = product.images.length > 0 
        ? (product.images[0].image_url.startsWith("http") ? product.images[0].image_url : `${baseUrl}${product.images[0].image_url}`)
        : `${baseUrl}/imagens/COLECAO/01.jpg`;

      // Obter imagens adicionais
      const additionalImages = product.images.slice(1);

      for (const variant of product.variants) {
        const title = `${product.name} - ${variant.color} - ${variant.size}`;
        const availability = variant.quantity > 0 ? "in stock" : "out of stock";

        xml += `    <item>
      <g:id>${variant.id}</g:id>
      <g:item_group_id>${product.id}</g:item_group_id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(productDescription)}</g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${primaryImage}</g:image_link>
`;

        // Incluir imagens adicionais se houverem (limite de 10)
        for (const addImg of additionalImages.slice(0, 10)) {
          const imgUrl = addImg.image_url.startsWith("http") ? addImg.image_url : `${baseUrl}${addImg.image_url}`;
          xml += `      <g:additional_image_link>${imgUrl}</g:additional_image_link>\n`;
        }

        xml += `      <g:availability>${availability}</g:availability>
      <g:price>${productPrice} BRL</g:price>
      <g:brand>${escapeXml("AVA Vitória")}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing</g:google_product_category>
      <g:size>${escapeXml(variant.size)}</g:size>
      <g:color>${escapeXml(variant.color)}</g:color>
    </item>
`;
      }
    }

    xml += `  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Erro ao gerar feed XML:", error);
    
    // Retornar um XML simples de erro para conformidade de parse
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Erro</title>
    <description>${escapeXml(error.message || "Erro desconhecido ao gerar feed")}</description>
  </channel>
</rss>`;

    return new Response(errorXml, {
      status: 500,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }
}
