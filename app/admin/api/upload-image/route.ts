import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo recebido." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabase.storage
      .from("portfolio-images")
      .upload(filename, buffer, {
        cacheControl: "0",
        upsert: false,
        contentType: file.type || "image/png",
      });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Falha ao enviar imagem." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio-images").getPublicUrl(filename);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

