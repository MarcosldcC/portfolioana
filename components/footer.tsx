import { Instagram, Mail, Heart, Linkedin, Twitter, Facebook, Globe, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Instagram,
  Mail,
  Linkedin,
  LinkedIn: Linkedin, // Handle case sensitivity or variations
  Twitter,
  Facebook,
  Globe,
  Youtube,
  Behance: Globe, // Fallback for Behance if not available in Lucide or use Globe
  TikTok: Globe, // Fallback or use custom icon if available
};

interface FooterProps {
  content?: {
    links: Array<{
      platform: string;
      url: string;
      color: string;
    }>;
  };
}

export function Footer({ content }: FooterProps) {
  const links = content?.links || [
    { platform: "Instagram", url: "https://instagram.com", color: "rose" },
    { platform: "Mail", url: "mailto:contato@seudominio.com", color: "rose" },
  ];

  return (
    <footer className="border-t border-border bg-card px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-baseline gap-1">
          <span className="font-script text-3xl text-rose">Ana Carolina</span>
        </div>

        <div className="flex items-center gap-6">
          {links.map((link, index) => {
            const Icon = iconMap[link.platform] || ((link.platform === 'Mail') ? Mail : Globe);
            return (
              <a
                key={index}
                href={link.url}
                target={link.platform === 'Mail' ? undefined : "_blank"}
                rel={link.platform === 'Mail' ? undefined : "noopener noreferrer"}
                aria-label={link.platform}
                className={cn("text-muted-foreground transition-colors hover:text-rose")}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          Feito com{" "}
          <Heart size={12} className="text-rose" fill="#e28892" /> e estrategia
        </p>
      </div>
    </footer>
  );
}
