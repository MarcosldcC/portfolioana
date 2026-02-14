"use client";
import * as LucideIcons from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { cn, formatIconName } from "@/lib/utils";
import { incrementServiceClick } from "@/app/actions/analytics";

interface ServicesSectionProps {
  content?: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
      color: string;
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

export function ServicesSection({ content, theme }: ServicesSectionProps & { theme?: any }) {
  const isHex = (val?: string) => val?.startsWith("#");

  const bgClass = !isHex(theme?.background) ? bgColorMap[theme?.background || ""] || "bg-transparent" : "";
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

  // Card Text Color (if different from global text)
  // const cardTextColor = theme?.cardTextColor || defaultText;
  // const cardTextClass = !isHex(cardTextColor) ? textColorMap[cardTextColor] || "text-ink" : "";
  // const cardTextStyle = isHex(cardTextColor) ? { color: cardTextColor } : {};

  const services = content?.items || [];

  return (
    <section id="servicos" className="relative px-6 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper className="mb-16 text-center">
          <p className="mb-2 font-script text-2xl text-rose">
            {content?.subtitle || "O que eu faço"}
          </p>
          <h2 className="font-serif text-4xl font-black md:text-5xl text-ink">
            <span className="text-balance">{content?.title || "Meus Serviços"}</span>
          </h2>
        </MotionWrapper>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const formattedName = formatIconName(service.icon);
            const Icon = (LucideIcons as any)[formattedName] || LucideIcons.Palette;

            // Alternating colors logic: Rose, Moss, Slate
            const colorCycle = ["rose", "moss", "slate"];
            const colorName = colorCycle[index % 3];

            const colorMap = {
              rose: "text-rose bg-rose/10",
              moss: "text-moss bg-moss/10",
              slate: "text-slate bg-slate/10"
            };

            const colors = colorMap[colorName as keyof typeof colorMap];

            return (
              <MotionWrapper
                key={index}
                delay={index * 0.1}
                onClick={() => incrementServiceClick(service.title)}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg cursor-pointer hover:border-rose/30"
              >
                <div
                  className={cn(
                    "mb-5 inline-flex items-center justify-center rounded-xl p-3",
                    colors.split(" ")[1] // bg-color
                  )}
                >
                  <Icon className={cn("h-6 w-6", colors.split(" ")[0])} />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-ink">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}



