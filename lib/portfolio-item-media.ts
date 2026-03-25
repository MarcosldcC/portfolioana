export type PortfolioMediaKind = "image" | "video";

export type PortfolioMediaEntry = {
  id: string;
  kind: PortfolioMediaKind;
  url: string;
  /** Opcional: capa para vídeo (ou primeiro frame). */
  posterUrl?: string;
};

export type PortfolioContentItem = {
  id?: string;
  title: string;
  category: string;
  description: string;
  /** Legado: primeira imagem; mantido sincronizado quando possível. */
  image?: string;
  media?: PortfolioMediaEntry[];
  /** URL externa (site, Instagram, etc.). */
  projectUrl?: string;
  /** Se o botão de link externo deve aparecer no site. */
  showProjectLink?: boolean;
};

export function newMediaId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Lista unificada de mídias: usa `media` ou cai no campo `image` legado. */
export function normalizePortfolioMedia(item: Pick<PortfolioContentItem, "image" | "media">): PortfolioMediaEntry[] {
  const raw = item.media;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .filter((m) => m && typeof m.url === "string" && m.url.length > 0)
      .map((m) => ({
        id: typeof m.id === "string" && m.id ? m.id : newMediaId(),
        kind: m.kind === "video" ? "video" : "image",
        url: m.url,
        posterUrl: typeof m.posterUrl === "string" ? m.posterUrl : undefined,
      }));
  }
  const img = item.image?.trim();
  if (img && img !== "/placeholder.svg") {
    return [{ id: newMediaId(), kind: "image", url: img }];
  }
  return [{ id: newMediaId(), kind: "image", url: "/placeholder.svg" }];
}

/** Sincroniza `image` legado para a primeira imagem do array (útil para dados antigos / SEO). */
export function legacyCoverFromMedia(media: PortfolioMediaEntry[]): string {
  const firstImage = media.find((m) => m.kind === "image");
  if (firstImage) return firstImage.url;
  if (media[0]?.posterUrl) return media[0].posterUrl;
  if (media[0]?.kind === "video") return media[0].posterUrl || "/placeholder.svg";
  return "/placeholder.svg";
}
