"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

// Auxiliar para verificar autenticação
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Não autorizado. Você precisa estar autenticado.");
  }
  return session;
}

// 1. Criar novo produto vazio (card no grid) associado a uma coleção
export async function createProductCard(collectionId: string) {
  await requireAuth();

  // Encontrar o maior display_order atual da coleção correspondente para colocar o card no final
  const lastProduct = await prisma.product.findFirst({
    where: {
      collection_id: collectionId,
    },
    orderBy: {
      display_order: "desc",
    },
  });
  const newOrder = lastProduct ? lastProduct.display_order + 1 : 0;

  const timestamp = Date.now();
  const product = await prisma.product.create({
    data: {
      name: "Novo Produto",
      slug: `novo-produto-${timestamp}`,
      description: "Edite a descrição deste produto.",
      price: 0,
      is_active: true,
      display_order: newOrder,
      collection_id: collectionId,
    },
  });

  // Criar uma variante padrão (ex: tamanho M, cor Preto) com estoque 0 para integridade de checkout
  await prisma.stockVariant.create({
    data: {
      product_id: product.id,
      size: "M",
      color: "Preto",
      quantity: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  return { success: true, product };
}

// 2. Deletar produto
export async function deleteProductCard(productId: string) {
  await requireAuth();

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  return { success: true };
}

// 3. Persistir a ordenação dos produtos
export async function reorderProductCards(orderedIds: string[]) {
  await requireAuth();

  // Executar as atualizações em uma transação do Prisma
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { display_order: index },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  return { success: true };
}

// 4. Salvar detalhes editados do produto (metadados apenas para o Grid Manager)
export async function saveProductDetails(
  productId: string,
  data: {
    name: string;
    price: number;
    description: string;
  }
) {
  await requireAuth();

  // Gerar slug a partir do nome
  const cleanSlug = data.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Garantir unicidade do slug se já existir outro
  let slug = cleanSlug || `produto-${productId.slice(0, 8)}`;
  const existingProduct = await prisma.product.findFirst({
    where: {
      slug,
      NOT: { id: productId },
    },
  });
  if (existingProduct) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      slug,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  revalidatePath("/admin/stock");
  return { success: true };
}

// 4b. Salvar estoque e configurações de variações (página dedicada /admin/stock)
export async function saveProductStockAndVariants(
  productId: string,
  data: {
    sizes: string[];
    colors: string[];
    variantsStock: { [key: string]: number }; // chave "tamanho:cor" -> quantidade
  }
) {
  await requireAuth();

  // Armazenar os tamanhos e cores ativos no campo JSONB size_chart para facilidade de carregamento
  const sizeChartConfig = {
    sizes: data.sizes,
    colors: data.colors,
  };

  await prisma.product.update({
    where: { id: productId },
    data: {
      size_chart: sizeChartConfig as any,
    },
  });

  // Atualizar/Criar as variantes de estoque
  const existingVariants = await prisma.stockVariant.findMany({
    where: { product_id: productId },
  });

  // 1. Atualizar ou Criar para as combinações ativas
  for (const size of data.sizes) {
    for (const color of data.colors) {
      const key = `${size}:${color}`;
      const qty = typeof data.variantsStock[key] === "number" ? data.variantsStock[key] : 0;

      const existing = existingVariants.find((v) => v.size === size && v.color === color);

      if (existing) {
        await prisma.stockVariant.update({
          where: { id: existing.id },
          data: { quantity: qty },
        });
      } else {
        await prisma.stockVariant.create({
          data: {
            product_id: productId,
            size,
            color,
            quantity: qty,
          },
        });
      }
    }
  }

  // 2. Limpar ou desativar variações antigas que não estão mais nas combinações ativas
  for (const extVar of existingVariants) {
    const isStillActive = data.sizes.includes(extVar.size) && data.colors.includes(extVar.color);
    if (!isStillActive) {
      try {
        await prisma.stockVariant.delete({
          where: { id: extVar.id },
        });
      } catch (err) {
        // Se houver pedidos vinculados e falhar a deleção por restrição física, zeramos o estoque
        await prisma.stockVariant.update({
          where: { id: extVar.id },
          data: { quantity: 0 },
        });
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  revalidatePath("/admin/stock");
  return { success: true };
}

// 5. Obter biblioteca de mídias por coleção
export async function getMediaAssets(collectionId?: string) {
  await requireAuth();

  const where = collectionId && collectionId !== "Todos" ? { collection_id: collectionId } : {};
  return await prisma.mediaAsset.findMany({
    where,
    orderBy: { created_at: "desc" },
  });
}

// 6. Criar Coleção (Projeto)
export async function createCollectionAction(data: { name: string; year: number; season: string }) {
  await requireAuth();

  const cleanSlug = data.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      year: data.year,
      season: data.season,
      slug: cleanSlug || `collection-${Date.now()}`,
    },
  });

  revalidatePath("/admin");
  return { success: true, collection };
}

// 7. Obter Coleções com Busca Inteligente Cruzada (nome, ano, season, nome de produto)
export async function getCollections(searchQuery?: string) {
  await requireAuth();

  if (!searchQuery || searchQuery.trim() === "") {
    return await prisma.collection.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  const query = searchQuery.trim();
  const parsedYear = parseInt(query);

  const orConditions: any[] = [
    { name: { contains: query, mode: "insensitive" } },
    { season: { contains: query, mode: "insensitive" } },
    {
      products: {
        some: {
          name: { contains: query, mode: "insensitive" },
        },
      },
    },
  ];

  if (!isNaN(parsedYear)) {
    orConditions.push({ year: parsedYear });
  }

  return await prisma.collection.findMany({
    where: {
      OR: orConditions,
    },
    orderBy: { created_at: "desc" },
  });
}

// 8. Deletar mídia da biblioteca
export async function deleteMediaAsset(assetId: string) {
  await requireAuth();

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: assetId },
  });

  if (asset) {
    // Tentar remover o arquivo físico
    try {
      const filePath = path.join(process.cwd(), "public", asset.file_url);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Erro ao apagar arquivo físico, prosseguindo com exclusão no banco:", err);
    }

    await prisma.mediaAsset.delete({
      where: { id: assetId },
    });
  }

  return { success: true };
}

// 9. Vincular mídia da biblioteca a um produto
export async function associateMediaToProduct(productId: string, mediaUrl: string) {
  await requireAuth();

  // Achar o display_order máximo das imagens atuais deste produto
  const lastImage = await prisma.productImage.findFirst({
    where: { product_id: productId },
    orderBy: { display_order: "desc" },
  });

  const nextOrder = lastImage ? lastImage.display_order + 1 : 0;

  const productImage = await prisma.productImage.create({
    data: {
      product_id: productId,
      image_url: mediaUrl,
      display_order: nextOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  return { success: true, productImage };
}

// 10. Desvincular/deletar mídia de um produto
export async function disassociateMediaFromProduct(productImageId: string) {
  await requireAuth();

  await prisma.productImage.delete({
    where: { id: productImageId },
  });

  revalidatePath("/");
  revalidatePath("/admin/grid-manager");
  return { success: true };
}

// 11. Upload em lote de mídias para uma Coleção
export async function uploadMediaAction(collectionId: string, formData: FormData) {
  await requireAuth();

  const files = formData.getAll("files") as File[];
  if (!files || files.length === 0) {
    throw new Error("Nenhum arquivo enviado.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const savedAssets = [];

  for (const file of files) {
    if (!file.name) continue;

    const sanitizeFilename = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "_");
    
    // Evitar colisões de nomes de arquivos anexando um hash/timestamp
    const ext = path.extname(sanitizeFilename);
    const base = path.basename(sanitizeFilename, ext);
    const uniqueFilename = `${base}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Escrever arquivo no disco local
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;

    // Registrar na tabela do banco
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        file_url: fileUrl,
        mime_type: file.type || "application/octet-stream",
        collection_id: collectionId && collectionId !== "Todos" ? collectionId : null,
      },
    });

    savedAssets.push(asset);
  }

  return { success: true, assets: savedAssets };
}
