import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import {
  WritingMatrix26,
  DEFAULT_MATRIX_JAZZ_3D,
  DEFAULT_MATRIX_CUBISTA,
  DEFAULT_MATRIX_CORUJA,
  DEFAULT_MATRIX_ALTINHA,
} from "@/lib/artworks";

export const dynamic = "force-dynamic";

function generateSha256Hash(code: string, title: string, matrix: WritingMatrix26): string {
  const payload = JSON.stringify({
    code: code.trim().toUpperCase(),
    title: title.trim(),
    matrix,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function persistMatrixJsonToDisk(
  projectFolder: string,
  code: string,
  title: string,
  mutatedKeysCount: number,
  previewImageUrl: string,
  sha256: string,
  matrix: WritingMatrix26
) {
  try {
    const safeFolder = (projectFolder || "Testes").replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeCode = code.replace(/[^a-zA-Z0-9_-]/g, "_");
    const dirPath = path.join(process.cwd(), "public", "imagens", "projetos", safeFolder);
    await fs.mkdir(dirPath, { recursive: true });
    const filePath = path.join(dirPath, `${safeCode}_writing_matrix26.json`);
    const filePayload = {
      $schema: "https://ava-vitoria.com.br/schemas/mdv_writing_matrix.v26.json",
      artwork_code: code,
      title,
      project_folder: projectFolder,
      mutated_keys_count: mutatedKeysCount,
      coa_hash_sha256: sha256,
      preview_image_url: previewImageUrl,
      writing_matrix_26: matrix,
    };
    await fs.writeFile(filePath, JSON.stringify(filePayload, null, 2), "utf-8");
  } catch (err) {
    console.warn("Aviso: Não foi possível gravar backup físico do JSON 26 chaves:", err);
  }
}

const INITIAL_SEED_ARTWORKS = [
  {
    code: "AVA-TEST-001",
    title: "Bailarina de Jazz em Salto 3D (75° Z-Axis)",
    concept:
      "Experimento inaugural do MDV (Motor de Decomposição Visual) a partir da referência Dancer.png: mutação controlada de 9 das 26 chaves canônicas (Zona 1 Identidade + Zona 2 Escorço 3D 75° no Eixo Z) preservando 63% de espaço negativo, rosto 100% em sombra preta anônima, feixes diagonais em preto/ouro ocre (#C29E5D) e cortina gravitacional de fios verticais de 1px a 90°.",
    project_folder: "Testes",
    is_registered: true,
    mutated_keys_count: 9,
    writing_matrix_26: DEFAULT_MATRIX_JAZZ_3D,
    master_print_dimona_url: "3435 × 4680 px (300 DPI — Zero Margem)",
    master_print_reserva_url: "4200 × 4800 px (300 DPI — PNG Transparente)",
    preview_image_url: "/imagens/projetos/Testes/AVA-TEST-001_jazz_dancer_3d_75deg.jpg",
    default_supplier: "DIMONA",
  },
  {
    code: "ART-CUBISTA-01",
    title: "Arte Cubista Urbana Vitória",
    concept:
      "Composição cubista desconstruindo os relevos da baía de Vitória com elementos do grafite autoral de galeria sob a Estética da Subtração.",
    project_folder: "Coleção Sem Limites",
    is_registered: true,
    mutated_keys_count: 8,
    writing_matrix_26: DEFAULT_MATRIX_CUBISTA,
    master_print_dimona_url: "/imagens/AMOSTRAS/Dimona_Frente_Arte_FundoEscuro_SemMargem_300dpi.png",
    master_print_reserva_url: "4200 × 4800 px (300 DPI — PNG Transparente)",
    preview_image_url: "/imagens/AMOSTRAS/Dimona_Frente_Arte_FundoEscuro_SemMargem_300dpi.png",
    default_supplier: "DIMONA",
  },
  {
    code: "ART-CORUJA-02",
    title: "Coruja Guardiã da Noite",
    concept:
      "Ilustração geométrica da fauna capixaba sob a perspectiva noturna do streetwear contemporâneo em traço fino 1px hairline.",
    project_folder: "Coleção Sem Limites",
    is_registered: true,
    mutated_keys_count: 8,
    writing_matrix_26: DEFAULT_MATRIX_CORUJA,
    master_print_dimona_url: "/imagens/AMOSTRAS/Dimona_Costas_Arte_FundoEscuro_SemMargem_300dpi.png",
    master_print_reserva_url: "4200 × 4800 px (300 DPI — PNG Transparente)",
    preview_image_url: "/imagens/AMOSTRAS/Dimona_Costas_Arte_FundoEscuro_SemMargem_300dpi.png",
    default_supplier: "DIMONA",
  },
  {
    code: "ART-ALTINHA-03",
    title: "Passa a Bola — Altinha Addict",
    concept:
      "Extração autoral do arquivo mestre ALTA.ai com 4 quadros acrobáticos (Escorpião, Bicicleta, Shark Attack e Chapa) e selo oficial.",
    project_folder: "Testes",
    is_registered: false,
    mutated_keys_count: 7,
    writing_matrix_26: DEFAULT_MATRIX_ALTINHA,
    master_print_dimona_url: "3435 × 4680 px (300 DPI — Zero Margem)",
    master_print_reserva_url: "4200 × 4800 px (300 DPI — PNG Transparente)",
    preview_image_url: "/imagens/AMOSTRAS/Dimona_Selo_Bola_FundoEscuro_SemMargem_300dpi.png",
    default_supplier: "DIMONA",
  },
];

export async function GET() {
  try {
    let dbArtworks = await prisma.artwork.findMany({
      orderBy: { created_at: "asc" },
    });

    // Se o banco estiver vazio ou sem o experimento inaugural AVA-TEST-001, garante a semeadura canônica
    const hasTest001 = dbArtworks.some((a) => a.code === "AVA-TEST-001");
    if (dbArtworks.length === 0 || !hasTest001) {
      for (const seed of INITIAL_SEED_ARTWORKS) {
        const exists = dbArtworks.find((a) => a.code === seed.code);
        if (!exists) {
          const sha256 = generateSha256Hash(seed.code, seed.title, seed.writing_matrix_26);
          await prisma.artwork.create({
            data: {
              code: seed.code,
              title: seed.title,
              concept: seed.concept,
              project_folder: seed.project_folder,
              is_registered: seed.is_registered,
              coa_hash_sha256: sha256,
              mutated_keys_count: seed.mutated_keys_count,
              writing_matrix_26: seed.writing_matrix_26 as any,
              master_print_dimona_url: seed.master_print_dimona_url,
              master_print_reserva_url: seed.master_print_reserva_url,
              preview_image_url: seed.preview_image_url,
              default_supplier: seed.default_supplier,
            },
          });
        }
      }
      dbArtworks = await prisma.artwork.findMany({
        orderBy: { created_at: "asc" },
      });
    }

    const normalized = dbArtworks.map((a) => {
      const matrix: WritingMatrix26 =
        a.writing_matrix_26 && typeof a.writing_matrix_26 === "object"
          ? { ...DEFAULT_MATRIX_JAZZ_3D, ...(a.writing_matrix_26 as any) }
          : DEFAULT_MATRIX_JAZZ_3D;

      const sha256 =
        a.coa_hash_sha256 || generateSha256Hash(a.code, a.title, matrix);

      return {
        id: a.id,
        code: a.code,
        title: a.title,
        concept: a.concept || "",
        project_folder: a.project_folder || "Testes",
        is_registered: Boolean(a.is_registered),
        coa_hash_sha256: sha256,
        mutated_keys_count: a.mutated_keys_count ?? 8,
        writing_matrix_26: matrix,
        master_print_dimona_url: a.master_print_dimona_url || "3435 × 4680 px (300 DPI)",
        master_print_reserva_url: a.master_print_reserva_url || "4200 × 4800 px (300 DPI)",
        preview_image_url: a.preview_image_url || "",
        default_supplier: a.default_supplier || "DIMONA",
        created_at: a.created_at.toISOString(),
        updated_at: a.updated_at.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      artworks: normalized,
    });
  } catch (error: any) {
    console.error("Erro em GET /api/artworks:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao carregar artes matrizes." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      code,
      title,
      concept,
      project_folder = "Testes",
      is_registered = false,
      mutated_keys_count = 8,
      writing_matrix_26,
      master_print_dimona_url = "3435 × 4680 px (300 DPI)",
      master_print_reserva_url = "4200 × 4800 px (300 DPI)",
      preview_image_url = "",
      default_supplier = "DIMONA",
    } = body;

    if (!code || !title) {
      return NextResponse.json(
        { success: false, error: "Código e Título da Arte Matriz são obrigatórios." },
        { status: 400 }
      );
    }

    const matrix: WritingMatrix26 =
      writing_matrix_26 && typeof writing_matrix_26 === "object"
        ? { ...DEFAULT_MATRIX_JAZZ_3D, ...writing_matrix_26 }
        : DEFAULT_MATRIX_JAZZ_3D;

    const sha256 = generateSha256Hash(code, title, matrix);

    let saved;
    if (id && !id.startsWith("new-")) {
      saved = await prisma.artwork.update({
        where: { id },
        data: {
          code: code.trim().toUpperCase(),
          title: title.trim(),
          concept: concept || "",
          project_folder: project_folder || "Testes",
          is_registered: Boolean(is_registered),
          coa_hash_sha256: sha256,
          mutated_keys_count: Number(mutated_keys_count) || 8,
          writing_matrix_26: matrix as any,
          master_print_dimona_url,
          master_print_reserva_url,
          preview_image_url,
          default_supplier,
        },
      });
    } else {
      saved = await prisma.artwork.upsert({
        where: { code: code.trim().toUpperCase() },
        update: {
          title: title.trim(),
          concept: concept || "",
          project_folder: project_folder || "Testes",
          is_registered: Boolean(is_registered),
          coa_hash_sha256: sha256,
          mutated_keys_count: Number(mutated_keys_count) || 8,
          writing_matrix_26: matrix as any,
          master_print_dimona_url,
          master_print_reserva_url,
          preview_image_url,
          default_supplier,
        },
        create: {
          code: code.trim().toUpperCase(),
          title: title.trim(),
          concept: concept || "",
          project_folder: project_folder || "Testes",
          is_registered: Boolean(is_registered),
          coa_hash_sha256: sha256,
          mutated_keys_count: Number(mutated_keys_count) || 8,
          writing_matrix_26: matrix as any,
          master_print_dimona_url,
          master_print_reserva_url,
          preview_image_url,
          default_supplier,
        },
      });
    }

    await persistMatrixJsonToDisk(
      saved.project_folder,
      saved.code,
      saved.title,
      saved.mutated_keys_count,
      saved.preview_image_url || "",
      sha256,
      matrix
    );

    return NextResponse.json({
      success: true,
      artwork: {
        ...saved,
        writing_matrix_26: matrix,
        coa_hash_sha256: sha256,
      },
    });
  } catch (error: any) {
    console.error("Erro em POST /api/artworks:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao salvar Arte Matriz no banco." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, is_registered } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID da arte é obrigatório." }, { status: 400 });
    }

    const existing = await prisma.artwork.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Arte Matriz não encontrada." }, { status: 404 });
    }

    const matrix: WritingMatrix26 =
      existing.writing_matrix_26 && typeof existing.writing_matrix_26 === "object"
        ? { ...DEFAULT_MATRIX_JAZZ_3D, ...(existing.writing_matrix_26 as any) }
        : DEFAULT_MATRIX_JAZZ_3D;

    const sha256 = generateSha256Hash(existing.code, existing.title, matrix);

    const updated = await prisma.artwork.update({
      where: { id },
      data: {
        is_registered: typeof is_registered === "boolean" ? is_registered : !existing.is_registered,
        coa_hash_sha256: sha256,
      },
    });

    return NextResponse.json({
      success: true,
      artwork: updated,
    });
  } catch (error: any) {
    console.error("Erro em PATCH /api/artworks:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao atualizar registro da Arte Matriz." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID não informado." }, { status: 400 });
    }

    await prisma.artwork.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro em DELETE /api/artworks:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao excluir Arte Matriz." },
      { status: 500 }
    );
  }
}
