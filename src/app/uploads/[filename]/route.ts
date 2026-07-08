import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Determinar o Content-Type correto
    let contentType = "application/octet-stream";
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.endsWith(".png")) {
      contentType = "image/png";
    } else if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerFilename.endsWith(".webp")) {
      contentType = "image/webp";
    } else if (lowerFilename.endsWith(".gif")) {
      contentType = "image/gif";
    } else if (lowerFilename.endsWith(".mp4")) {
      contentType = "video/mp4";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache longo de 1 ano
      },
    });
  } catch (error) {
    return new NextResponse("Arquivo não encontrado", { status: 404 });
  }
}
