"use client";

import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";

interface HeroSectionProps {
  content?: {
    greeting: string;
    title: string;
    description: string;
    ctaPortfolio: string;
    ctaContact: string;
  };
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Main content */}
      <div className="relative z-10 text-center">
        <MotionWrapper delay={0.2}>
          <p className="mb-4 font-script text-2xl text-rose md:text-3xl">
            {content?.greeting || "Olá, eu sou"}
          </p>
        </MotionWrapper>

        <MotionWrapper delay={0.4}>
          <h1 className="mb-6 font-serif text-5xl font-black tracking-tight text-ink md:text-7xl lg:text-8xl">
            <span className="text-balance">{content?.title || "Ana Carolina"}</span>
          </h1>
        </MotionWrapper>

        <MotionWrapper delay={0.6}>
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            {content?.description || "Transformando marcas em experiências digitais memoráveis. Estratégia, criatividade e resultados que conectam."}
          </p>
        </MotionWrapper>

        <MotionWrapper delay={0.8}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#portfolio"
              onClick={() => incrementClick('cta')}
              className="inline-flex items-center rounded-full bg-rose px-8 py-3 text-sm font-bold tracking-wider text-primary-foreground uppercase transition-all hover:opacity-90"
            >
              {content?.ctaPortfolio || "Ver Portfólio"}
            </a>
            <a
              href="#contato"
              onClick={() => incrementClick('contact')}
              className="inline-flex items-center rounded-full border-2 border-ink bg-transparent px-8 py-3 text-sm font-bold tracking-wider text-ink uppercase transition-all hover:bg-ink hover:text-sand"
            >
              {content?.ctaContact || "Fale Comigo"}
            </a>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
