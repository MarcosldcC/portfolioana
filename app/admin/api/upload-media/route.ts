import { handlePortfolioMediaUpload } from "@/lib/handle-portfolio-media-upload";

export const runtime = "nodejs";
/** Tempo máximo da função (upload grande); ajustar no plano Vercel se necessário. */
export const maxDuration = 120;

export async function POST(request: Request) {
  return handlePortfolioMediaUpload(request);
}
