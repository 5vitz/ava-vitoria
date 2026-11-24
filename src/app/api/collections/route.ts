import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveStoreCollectionId, setActiveStoreCollection } from "@/app/admin/grid-manager/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [collections, activeCollectionId] = await Promise.all([
      prisma.collection.findMany({
        orderBy: { created_at: "desc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      getActiveStoreCollectionId(),
    ]);

    return NextResponse.json({
      success: true,
      collections: collections.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        year: c.year,
        season: c.season,
        productsCount: c._count.products,
        isActiveStorefront: c.id === activeCollectionId,
        created_at: c.created_at,
      })),
      activeCollectionId,
    });
  } catch (error: any) {
    console.error("Erro ao buscar coleções:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno ao buscar coleções." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, year, season } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Nome é obrigatório." }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCollection = await prisma.collection.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        year: parseInt(year) || new Date().getFullYear(),
        season: season || "Especial",
      },
    });

    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error: any) {
    console.error("Erro ao criar coleção:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao criar coleção." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { collectionId } = body;

    if (!collectionId) {
      return NextResponse.json({ success: false, error: "collectionId é obrigatório." }, { status: 400 });
    }

    await prisma.siteSettings.upsert({
      where: { config_key: "active_collection" },
      update: {
        config_value: { collection_id: collectionId },
      },
      create: {
        config_key: "active_collection",
        config_value: { collection_id: collectionId },
      },
    });

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/admin/media");
      revalidatePath("/admin/grid-manager");
      revalidatePath("/admin/atelier");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, activeCollectionId: collectionId });
  } catch (error: any) {
    console.error("Erro ao definir vitrine ativa:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao atualizar vitrine ativa." },
      { status: 500 }
    );
  }
}
