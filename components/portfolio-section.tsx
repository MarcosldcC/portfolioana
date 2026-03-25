"use client";
import Image from "next/image";
import { StarburstDecoration } from "./decorative-elements";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";

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

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <MotionWrapper
              key={project.id ?? index}
              delay={index * 0.1}
              className="group flex min-h-0 flex-col overflow-hidden rounded-2xl bg-ink/80 shadow-md ring-1 ring-white/10 cursor-pointer"
            >
              <div
                role="button"
                tabIndex={0}
                className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                onClick={() => incrementClick("project", project.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    incrementClick("project", project.title);
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
                <div className="flex min-h-0 flex-1 flex-col gap-2 border-t border-white/10 p-6 md:p-8">
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
                  <p className="text-sm leading-relaxed text-sand/80">{project.description}</p>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}


