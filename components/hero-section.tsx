"use client";

import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";
import { cn } from "@/lib/utils";
import { HalftonePattern, ArcDecoration, StarburstDecoration } from "./decorative-elements";

interface HeroSectionProps {
  content?: {
    greeting: string;
    title: string;
    description: string;
    ctaPortfolio: string;
    ctaContact: string;
    image: string;
    stats: Array<{
      label: string;
      value: string;
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

const accentColorMap: Record<string, string> = {
  rose: "bg-rose text-white",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-white",
  moss: "bg-moss text-white",
  slate: "bg-slate text-white",
};

export function HeroSection({ content }: { content?: any }) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20"
    >
      <HalftonePattern className="absolute top-20 left-10 text-rose opacity-20 animate-pulse" />
      <ArcDecoration className="absolute bottom-20 right-10 text-rose opacity-20" />
      <StarburstDecoration className="absolute top-40 right-20 text-rose opacity-15" />

      {/* Main content */}
      <div className="relative z-10 text-center">
        <MotionWrapper delay={0.2}>
          <p className="mb-4 font-script text-2xl md:text-3xl text-rose">
            {content?.greeting || "Olá, eu sou"}
          </p>
        </MotionWrapper>

        <MotionWrapper delay={0.4}>
          <h1 className="mb-6 font-serif text-5xl font-black tracking-tight md:text-7xl lg:text-8xl text-ink">
            <span className="text-balance">{content?.title || "Ana Carolina"}</span>
          </h1>
        </MotionWrapper>

        <MotionWrapper delay={0.6}>
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed md:text-lg text-muted-foreground">
            {content?.description ||
              "Transformando marcas em experiências digitais memoráveis. Estratégia, criatividade e resultados que conectam."}
          </p>
        </MotionWrapper>

        <MotionWrapper delay={0.8}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#portfolio"
              onClick={() => incrementClick("cta")}
              className="inline-flex items-center rounded-full px-8 py-3 text-sm font-bold tracking-wider uppercase transition-all shadow-sm bg-rose text-primary-foreground hover:opacity-90 hover:scale-105 duration-300"
            >
              {content?.ctaPortfolio || "Ver Portfólio"}
            </a>
            <a
              href="#contato"
              onClick={() => incrementClick("contact")}
              className="inline-flex items-center rounded-full border-2 px-8 py-3 text-sm font-bold tracking-wider uppercase transition-all border-ink text-ink hover:bg-ink hover:text-sand duration-300"
            >
              {content?.ctaContact || "Fale Comigo"}
            </a>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}


