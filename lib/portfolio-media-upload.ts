import { randomBytes } from "crypto";

/** MIME permitidos + extensão gravada no storage (nunca confiar na extensão do nome original). */
export const PORTFOLIO_MEDIA_RULES: Record<
  string,
  { ext: string; kind: "image" | "video" }
> = {
  "image/jpeg": { ext: "jpg", kind: "image" },
  "image/png": { ext: "png", kind: "image" },
  "image/webp": { ext: "webp", kind: "image" },
  "image/gif": { ext: "gif", kind: "image" },
  "image/svg+xml": { ext: "svg", kind: "image" },
  "video/mp4": { ext: "mp4", kind: "video" },
  "video/webm": { ext: "webm", kind: "video" },
  "video/quicktime": { ext: "mov", kind: "video" },
};

const DEFAULT_MAX_IMAGE = 12 * 1024 * 1024; // 12 MiB
const DEFAULT_MAX_VIDEO = 100 * 1024 * 1024; // 100 MiB — pode falhar no body limit da Vercel; usar env mais baixo em Hobby

function parseSizeEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getMaxBytesForKind(kind: "image" | "video"): number {
  if (kind === "video") {
    return parseSizeEnv("PORTFOLIO_UPLOAD_MAX_VIDEO_BYTES", DEFAULT_MAX_VIDEO);
  }
  return parseSizeEnv("PORTFOLIO_UPLOAD_MAX_IMAGE_BYTES", DEFAULT_MAX_IMAGE);
}

/** Normaliza nome para uso seguro como parte do path (sem path traversal). */
export function sanitizeFilenameStem(originalName: string): string {
  const base = originalName.split(/[/\\]/).pop() ?? "file";
  const withoutExt = base.replace(/\.[^.]+$/, "");
  const ascii = withoutExt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return ascii || "file";
}

export function buildPortfolioObjectKey(mime: string, originalName: string): string {
  const rule = PORTFOLIO_MEDIA_RULES[mime];
  if (!rule) throw new Error("MIME não permitido");
  const stem = sanitizeFilenameStem(originalName);
  const unique = randomBytes(4).toString("hex");
  return `${Date.now()}-${unique}-${stem}.${rule.ext}`;
}

/** Verificação leve: conteúdo condiz com o MIME declarado. */
export function bufferMatchesMime(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;

  switch (mime) {
    case "image/jpeg":
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      );
    case "image/gif":
      return (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
      );
    case "image/webp": {
      const riff = buffer.subarray(0, 4).toString("ascii");
      const webp = buffer.subarray(8, 12).toString("ascii");
      return riff === "RIFF" && webp === "WEBP";
    }
    case "image/svg+xml": {
      const head = buffer
        .subarray(0, Math.min(512, buffer.length))
        .toString("utf8")
        .trimStart()
        .toLowerCase();
      return head.includes("<svg") || head.startsWith("<?xml");
    }
    case "video/mp4":
    case "video/quicktime":
      return buffer.subarray(4, 8).toString("ascii") === "ftyp";
    case "video/webm":
      return (
        buffer[0] === 0x1a &&
        buffer[1] === 0x45 &&
        buffer[2] === 0xdf &&
        buffer[3] === 0xa3
      );
    default:
      return false;
  }
}

export function normalizeClientMime(file: File): string | null {
  const raw = (file.type || "").split(";")[0].trim().toLowerCase();
  if (!raw) return null;
  return PORTFOLIO_MEDIA_RULES[raw] ? raw : null;
}

export function validatePortfolioMediaFile(file: File): { ok: false; error: string } | { ok: true; mime: string } {
  const mime = normalizeClientMime(file);
  if (!mime) {
    return { ok: false, error: "Tipo de ficheiro não permitido ou desconhecido." };
  }
  const kind = PORTFOLIO_MEDIA_RULES[mime].kind;
  const max = getMaxBytesForKind(kind);
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024));
    return {
      ok: false,
      error: `Ficheiro demasiado grande. Limite para ${kind === "video" ? "vídeo" : "imagem"}: ~${mb} MB.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, error: "Ficheiro vazio." };
  }
  return { ok: true, mime };
}
