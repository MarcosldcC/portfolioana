"use client";
import { useRef, useState, type MouseEvent } from "react";
import { ExternalLink } from "lucide-react";
import { StarburstDecoration } from "./decorative-elements";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PortfolioCardMediaCarousel,
  PortfolioModalMediaCarousel,
} from "@/components/portfolio-media-carousel";
import type { PortfolioContentItem, PortfolioMediaEntry } from "@/lib/portfolio-item-media";
import { normalizePortfolioMedia } from "@/lib/portfolio-item-media";

interface PortfolioSectionProps {
  projects?: any[];
  content?: {
    title: string;
    subtitle: string;
    items: PortfolioContentItem[];
  };
  theme?: {
    background: string;
    text: string;
    accent: string;
  };
}

const textColorMap: Record<string, string> = {
  rose: "text-rose",
  sand: "text-sand",
  ink: "text-ink",
  moss: "text-moss",
  slate: "text-slate",
  white: "text-white",
};

function ProjectLinkButton({
  url,
  className,
  onClick,
}: {
  url: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const trimmed = url.trim();
  if (!trimmed) return null;
  const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  return (
    <Button asChild variant="outline" size="sm" className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        Ver projeto
        <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-80" />
      </a>
    </Button>
  );
}

export function PortfolioSection({ content, theme }: PortfolioSectionProps & { theme?: any }) {
  const isHex = (val?: string) => val?.startsWith("#");

  // Card Colors (tema)
  const defaultAccent = theme?.accent || "rose";
  const cardTitleColor = theme?.cardTitleColor || "sand";
  const cardTitleClass = !isHex(cardTitleColor) ? textColorMap[cardTitleColor] || "text-sand" : "";
  const cardTitleStyle = isHex(cardTitleColor) ? { color: cardTitleColor } : {};

  const cardCatColor = theme?.cardCategoryColor || defaultAccent;
  const cardCatClass = !isHex(cardCatColor) ? textColorMap[cardCatColor] || "text-rose" : "";
  const cardCatStyle = isHex(cardCatColor) ? { color: cardCatColor } : {};

  const projects = content?.items && content.items.length > 0 ? content.items : [];

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<PortfolioContentItem | null>(null);
  const closeDetailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openProject = (project: PortfolioContentItem) => {
    if (closeDetailTimerRef.current) {
      clearTimeout(closeDetailTimerRef.current);
      closeDetailTimerRef.current = null;
    }
    void incrementClick("project", project.title);
    setDetailProject(project);
    setDetailOpen(true);
  };

  const modalMedia: PortfolioMediaEntry[] = detailProject
    ? normalizePortfolioMedia(detailProject)
    : [];

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
                <PortfolioModalMediaCarousel
                  key={detailProject.id ?? detailProject.title}
                  media={modalMedia}
                  title={detailProject.title}
                  dialogOpen={detailOpen}
                />
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
                  {detailProject.showProjectLink && detailProject.projectUrl?.trim() ? (
                    <ProjectLinkButton
                      url={detailProject.projectUrl}
                      className="mt-1 w-fit border-white/25 bg-transparent text-sand hover:bg-white/10"
                    />
                  ) : null}
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => {
            const media = normalizePortfolioMedia(project);
            return (
              <MotionWrapper
                key={project.id ?? index}
                delay={index * 0.1}
                className="group flex flex-col overflow-hidden rounded-2xl bg-ink/80 shadow-md ring-1 ring-white/10"
              >
                <div className="flex flex-col">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                    onClick={() => openProject(project)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openProject(project);
                      }
                    }}
                  >
                    <PortfolioCardMediaCarousel media={media} title={project.title} />
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
                  {project.showProjectLink && project.projectUrl?.trim() ? (
                    <div className="border-t border-white/10 bg-ink/90 px-6 pb-6 pt-0 md:px-8 md:pb-8">
                      <ProjectLinkButton
                        url={project.projectUrl}
                        className="w-full border-white/25 bg-transparent text-sand hover:bg-white/10 sm:w-auto"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ) : null}
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
