import * as LucideIcons from "lucide-react";
import { cn, formatIconName } from "@/lib/utils";
import Image from "next/image";

interface FooterProps {
  content?: {
    links: Array<{
      platform: string;
      url: string;
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

export function Footer({ content, theme }: FooterProps) {
  const bgClass = bgColorMap[theme?.background || ""] || "bg-card";
  const textClass = textColorMap[theme?.text || ""] || "text-muted-foreground";
  const accentTextClass = (textColorMap[theme?.accent || ""] || "text-rose");
  const links = content?.links || [
    { platform: "Instagram", url: "https://instagram.com/linagaldin", color: "rose" },
    { platform: "Linkedin", url: "https://linkedin.com/in/anacarolinaniceto", color: "rose" },
  ];

  return (
    <footer className="border-t border-border px-6 py-10 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="block">
          <Image
            src="/Galdino.png"
            alt="Lina Galdino"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="flex items-center gap-6">
          {links.map((link, index) => {
            const formattedName = formatIconName(link.platform);
            const Icon = (LucideIcons as any)[formattedName] || LucideIcons.Globe;
            return (
              <a
                key={index}
                href={link.url}
                target={link.platform === 'Mail' ? undefined : "_blank"}
                rel={link.platform === 'Mail' ? undefined : "noopener noreferrer"}
                aria-label={link.platform}
                className="text-rose transition-all hover:text-rose/70 hover:scale-110 duration-300"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          Feito com{" "}
          <LucideIcons.Heart size={12} className="text-rose fill-rose" fill="currentColor" /> e estrategia
        </p>
      </div>
    </footer>
  );
}
