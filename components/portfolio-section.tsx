"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { StarburstDecoration } from "./decorative-elements";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface PortfolioSectionProps {
  projects?: any[];
  content?: {
    title: string;
    subtitle: string;
    items: Array<{
      id?: string;
      title: string;
      category: string;
      description: string;
      image: string;
    }>;
  };
  theme?: {
    background: string;
    text: string;
    accent: string;
  };
}

const bgColorMap: Record<string, string> = {
  rose: "bg-rose",
  sand: "bg-sand",
  ink: "bg-ink",
  moss: "bg-moss",
  slate: "bg-slate",
  white: "bg-white",
  card: "bg-card",
  transparent: "bg-transparent",
};

const textColorMap: Record<string, string> = {
  rose: "text-rose",
  sand: "text-sand",
  ink: "text-ink",
  moss: "text-moss",
  slate: "text-slate",
  white: "text-white",
};

type PortfolioItem = NonNullable<PortfolioSectionProps["content"]>["items"][number];

export function PortfolioSection({ content, theme }: PortfolioSectionProps & { theme?: any }) {
  const isHex = (val?: string) => val?.startsWith("#");

  const bgClass = !isHex(theme?.background) ? bgColorMap[theme?.background || ""] || "bg-card" : "";
  const bgStyle = isHex(theme?.background) ? { backgroundColor: theme?.background } : {};

  // General Defaults
  const defaultText = theme?.text || "ink";
  const defaultAccent = theme?.accent || "rose";

  // Title & Subtitle Colors
  const titleColor = theme?.titleColor || defaultText;
  const titleClass = !isHex(titleColor) ? textColorMap[titleColor] || "text-ink" : "";
  const titleStyle = isHex(titleColor) ? { color: titleColor } : {};

  const subtitleColor = theme?.subtitleColor || defaultAccent;
  const subtitleClass = !isHex(subtitleColor) ? textColorMap[subtitleColor] || "text-rose" : "";
  const subtitleStyle = isHex(subtitleColor) ? { color: subtitleColor } : {};

  // Card Colors
  const cardTitleColor = theme?.cardTitleColor || "sand"; // Default to light on dark gradient
  const cardTitleClass = !isHex(cardTitleColor) ? textColorMap[cardTitleColor] || "text-sand" : "";
  const cardTitleStyle = isHex(cardTitleColor) ? { color: cardTitleColor } : {};

  const cardCatColor = theme?.cardCategoryColor || defaultAccent;
  const cardCatClass = !isHex(cardCatColor) ? textColorMap[cardCatColor] || "text-rose" : "";
  const cardCatStyle = isHex(cardCatColor) ? { color: cardCatColor } : {};

  const projects = content?.items && content.items.length > 0 ? content.items : [];

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<PortfolioItem | null>(null);
  const closeDetailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openProject = (project: PortfolioItem) => {
    if (closeDetailTimerRef.current) {
      clearTimeout(closeDetailTimerRef.current);
      closeDetailTimerRef.current = null;
    }
    void incrementClick("project", project.title);
    setDetailProject(project);
    setDetailOpen(true);
  };

  return (
    <section id="portfolio" className="relative px-6 py-24 md:py-32 bg-ink">
      <StarburstDecoration className="absolute top-16 left-8 opacity-20 md:left-20 text-rose" />

      <div className="mx-auto max-w-6xl">
        <MotionWrapper className="mb-16 text-center">
          <p className="mb-2 font-script text-2xl text-rose">
            {content?.subtitle || "Meu trabalho"}
          </p>
          <h2 className="font-serif text-4xl font-black md:text-5xl text-sand">
            <span className="text-balance">{content?.title || "Portfólio"}</span>
          </h2>
        </MotionWrapper>

        <Dialog
          open={detailOpen}
          onOpenChange={(open) => {
            setDetailOpen(open);
            if (!open) {
              if (closeDetailTimerRef.current) clearTimeout(closeDetailTimerRef.current);
              closeDetailTimerRef.current = setTimeout(() => {
                setDetailProject(null);
                closeDetailTimerRef.current = null;
              }, 250);
            }
          }}
        >
          <DialogContent
            className="flex max-h-[min(90vh,920px)] w-[calc(100vw-1.5rem)] max-w-4xl flex-col gap-0 overflow-hidden border-white/15 bg-ink p-0 text-sand shadow-2xl sm:rounded-2xl [&>button]:text-sand/90 [&>button]:ring-offset-ink [&>button]:hover:text-white"
          >
            {detailProject ? (
              <>
                <div className="relative h-[min(52vh,520px)] w-full shrink-0 bg-black/30 sm:h-[min(58vh,560px)]">
                  <Image
                    src={detailProject.image || "/placeholder.svg"}
                    alt={detailProject.title}
                    fill
                    priority
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-contain object-center"
                  />
                </div>
                <div className="flex max-h-[40vh] flex-col gap-3 overflow-y-auto border-t border-white/15 px-6 py-6 md:px-8 md:py-7">
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest ${cardCatClass}`}
                    style={cardCatStyle}
                  >
                    {detailProject.category}
                  </span>
                  <DialogTitle
                    className={`font-serif text-2xl font-bold leading-tight md:text-3xl ${cardTitleClass} pr-8 text-left`}
                    style={cardTitleStyle}
                  >
                    {detailProject.title}
                  </DialogTitle>
                  {detailProject.description ? (
                    <DialogDescription asChild>
                      <p className="text-left text-base leading-relaxed text-sand/95 [text-wrap:pretty]">
                        {detailProject.description}
                      </p>
                    </DialogDescription>
                  ) : (
                    <DialogDescription className="text-left text-sm text-sand/70">
                      Sem descrição para este projeto.
                    </DialogDescription>
                  )}
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <MotionWrapper
              key={project.id ?? index}
              delay={index * 0.1}
              className="group flex flex-col overflow-hidden rounded-2xl bg-ink/80 shadow-md ring-1 ring-white/10 cursor-pointer"
            >
              <div
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                className="flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                onClick={() => openProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProject(project);
                  }
                }}
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Bloco em fluxo normal (sem flex-1/min-h-0) para o grid não “esmagar” a descrição no Safari/outros */}
                <div className="flex flex-col gap-2 border-t border-white/15 bg-ink p-6 md:p-8">
                  <span
                    className={`mb-0.5 text-xs font-semibold uppercase tracking-widest ${cardCatClass}`}
                    style={cardCatStyle}
                  >
                    {project.category}
                  </span>
                  <h3
                    className={`font-serif text-xl font-bold md:text-2xl ${cardTitleClass}`}
                    style={cardTitleStyle}
                  >
                    {project.title}
                  </h3>
                  {project.description ? (
                    <p className="text-base leading-relaxed text-sand [text-wrap:pretty]">
                      {project.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}


