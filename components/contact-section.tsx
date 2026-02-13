"use client";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";
import { cn } from "@/lib/utils";

interface ContactSectionProps {
  content?: {
    subtitle?: string;
    title?: string;
    description?: string;
    email?: string;
    instagram?: string;
    whatsapp?: string;
    whatsappNumber?: string;
    formTitle?: string;
    formSubtitle?: string;
    whatsappMessage?: string;
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

export function ContactSection({ content, theme }: ContactSectionProps & { theme?: any }) {
  const isHex = (val?: string) => val?.startsWith("#");

  const bgClass = !isHex(theme?.background) ? bgColorMap[theme?.background || ""] || "bg-card" : "";
  const bgStyle = isHex(theme?.background) ? { backgroundColor: theme?.background } : {};

  // General Defaults
  const defaultText = theme?.text || "ink";
  const defaultAccent = theme?.accent || "rose";

  const textClass = !isHex(defaultText) ? textColorMap[defaultText] || "text-ink" : "";
  const textStyle = isHex(defaultText) ? { color: defaultText } : {};

  // Specific Element Colors
  const subtitleColor = theme?.subtitleColor || defaultAccent;
  const subtitleClass = !isHex(subtitleColor) ? textColorMap[subtitleColor] || "text-rose" : "";
  const subtitleStyle = isHex(subtitleColor) ? { color: subtitleColor } : {};

  const titleColor = theme?.titleColor || defaultText;
  const titleClass = !isHex(titleColor) ? textColorMap[titleColor] || "text-ink" : "";
  const titleStyle = isHex(titleColor) ? { color: titleColor } : {};

  const descColor = theme?.descriptionColor || defaultText;
  const descClass = !isHex(descColor) ? textColorMap[descColor] || "text-ink" : "";
  const descStyle = isHex(descColor) ? { color: descColor } : {};

  const accentColor = theme?.accent || "rose";
  const accentTextClass = !isHex(accentColor) ? textColorMap[accentColor] || "text-rose" : "";
  const accentTextStyle = isHex(accentColor) ? { color: accentColor } : {};

  return (
    <section id="contato" className="relative px-6 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Text side */}
          <MotionWrapper direction="right">
            <p className="mb-2 font-script text-2xl text-rose">
              {content?.subtitle || "Vamos conversar"}
            </p>
            <h2 className="mb-6 font-serif text-4xl font-black md:text-5xl text-ink">
              <span className="text-balance">
                {content?.title || "Pronta para transformar sua presença digital?"}
              </span>
            </h2>
            <p className="mb-8 leading-relaxed opacity-80 text-muted-foreground">
              {content?.description || "Entre em contato e vamos criar juntas uma estratégia única para a sua marca. Cada projeto é uma nova oportunidade de conexão."}
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${content?.email || "contato@seudominio.com"}`}
                onClick={() => incrementClick('contact')}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-rose/30"
              >
                <div className="flex items-center justify-center rounded-lg p-3 bg-rose/10">
                  <Mail className="h-5 w-5 text-rose" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">E-mail</p>
                  <p className="text-sm opacity-70 text-ink">
                    {content?.email || "contato@seudominio.com"}
                  </p>
                </div>
              </a>

              <a
                href={content?.instagram?.startsWith("http") ? content.instagram : `https://instagram.com/${content?.instagram?.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementClick('contact')}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-rose/30"
              >
                <div className="flex items-center justify-center rounded-lg p-3 bg-moss/10">
                  <Instagram className="h-5 w-5 text-moss" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Instagram</p>
                  <p className="text-sm opacity-70 text-ink">
                    {content?.instagram || "@seuperfil"}
                  </p>
                </div>
              </a>

              <a
                href={content?.whatsappNumber ? `https://wa.me/${content.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(content.whatsappMessage || "Olá Ana! Vi seu portfólio e gostaria de solicitar um orçamento.")}` : "https://wa.me/5500000000000"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementClick('contact')}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-rose/30"
              >
                <div className="flex items-center justify-center rounded-lg p-3 bg-slate/10">
                  <MessageCircle className="h-5 w-5 text-slate" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">WhatsApp</p>
                  <p className="text-sm opacity-70 text-ink">
                    {content?.whatsapp || "Solicitar Orçamento"}
                  </p>
                </div>
              </a>
            </div>
          </MotionWrapper>

          {/* Form side */}
          <MotionWrapper direction="left" delay={0.2} className="relative flex items-center justify-center">
            <ContactForm
              title={content?.formTitle}
              subtitle={content?.formSubtitle}
            />
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}

