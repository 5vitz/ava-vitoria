import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFilename = `${Date.now()}_${safeOriginalName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "boardroom-docs");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/boardroom-docs/${uniqueFilename}`;

    return NextResponse.json({
      attachmentName: file.name,
      attachmentUrl: publicUrl,
      attachmentSize: file.size,
      attachmentMime: file.type || "application/octet-stream",
    });
  } catch (error) {
    console.error("Erro no upload de documento da Sala de Reuniões:", error);
    return NextResponse.json(
      { error: "Falha ao armazenar documento corporativo." },
      { status: 500 }
    );
  }
}
