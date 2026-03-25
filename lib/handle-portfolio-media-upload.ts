import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  buildPortfolioObjectKey,
  bufferMatchesMime,
  PORTFOLIO_MEDIA_RULES,
  validatePortfolioMediaFile,
} from "@/lib/portfolio-media-upload";

const BUCKET = "portfolio-images";

/** Upload multipart (FormData com campo "file") → Supabase Storage. Sem URL assinada no cliente. */
export async function handlePortfolioMediaUpload(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Nenhum ficheiro recebido." },
        { status: 400 },
      );
    }

    const v = validatePortfolioMediaFile(file);
    if (!v.ok) {
      return NextResponse.json({ success: false, error: v.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const head = buffer.subarray(0, Math.min(buffer.length, 8192));
    if (!bufferMatchesMime(head, v.mime)) {
      return NextResponse.json(
        {
          success: false,
          error: "Conteúdo do ficheiro não corresponde ao tipo declarado.",
        },
        { status: 400 },
      );
    }

    const objectPath = buildPortfolioObjectKey(v.mime, file.name);
    const supabase = createAdminClient();

    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: v.mime,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Falha ao enviar ficheiro." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      kind: PORTFOLIO_MEDIA_RULES[v.mime].kind,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
