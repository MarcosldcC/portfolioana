"use client";

import Image from "next/image";
import { StarburstDecoration } from "./decorative-elements";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";

interface PortfolioSectionProps {
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
}

export function PortfolioSection({ content }: PortfolioSectionProps) {
  const projects = content?.items || [
    {
      title: "Branding Café Artesanal",
      category: "Identidade Visual",
      description: "Redesign completo da presença digital com aumento de 180% no engajamento.",
      image: "/images/portfolio-1.jpg",
    },
    {
      title: "Lançamento Moda Sustentável",
      category: "Estratégia & Conteúdo",
      description: "Campanha de lançamento com alcance orgânico de 50k em 30 dias.",
      image: "/images/portfolio-2.jpg",
    },
    {
      title: "Studio de Beleza Premium",
      category: "Gestão de Redes",
      description: "Crescimento de 300% em seguidores qualificados em 6 meses.",
      image: "/images/portfolio-3.jpg",
    },
    {
      title: "Restaurante Gastronômico",
      category: "Criação de Conteúdo",
      description: "Produção de conteúdo visual que triplicou as reservas online.",
      image: "/images/portfolio-4.jpg",
    },
  ];

  return (
    <section id="portfolio" className="relative bg-ink px-6 py-24 md:py-32">
      <StarburstDecoration className="absolute top-16 left-8 opacity-20 md:left-20" />

      <div className="mx-auto max-w-6xl">
        <MotionWrapper className="mb-16 text-center">
          <p className="mb-2 font-script text-2xl text-rose">{content?.subtitle || "Meu trabalho"}</p>
          <h2 className="font-serif text-4xl font-black text-sand md:text-5xl">
            <span className="text-balance">{content?.title || "Portfólio"}</span>
          </h2>
        </MotionWrapper>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <MotionWrapper
              key={index}
              delay={index * 0.1}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              <div onClick={() => incrementClick('project')}>
                <div className="aspect-[4/3] bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6 md:p-8">
                  <span className="mb-2 text-xs font-semibold tracking-widest text-rose uppercase">
                    {project.category}
                  </span>
                  <h3 className="mb-1 font-serif text-xl font-bold text-sand md:text-2xl">
                    {project.title}
                  </h3>
                  <p className="text-sm text-sand/70">{project.description}</p>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
