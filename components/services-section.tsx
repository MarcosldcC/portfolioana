import { BarChart3, Camera, MessageCircle, Palette, Target, TrendingUp } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Palette,
  Camera,
  Target,
  MessageCircle,
  BarChart3,
  TrendingUp,
};

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
}

export function ServicesSection({ content }: ServicesSectionProps) {
  const services = content?.items || [
    {
      icon: "Palette",
      title: "Identidade Visual",
      description: "Criação de identidade visual coesa para suas redes sociais, alinhada com a essência da sua marca.",
      color: "rose",
    },
    {
      icon: "Camera",
      title: "Criação de Conteúdo",
      description: "Produção de conteúdo estratégico e visualmente atrativo que gera engajamento e conexão.",
      color: "moss",
    },
    {
      icon: "Target",
      title: "Estratégia Digital",
      description: "Planejamento estratégico personalizado para alcançar seus objetivos de negócio nas redes.",
      color: "slate",
    },
    {
      icon: "MessageCircle",
      title: "Gestão de Redes",
      description: "Gerenciamento completo das suas redes sociais com calendário editorial e interação ativa.",
      color: "rose",
    },
    {
      icon: "BarChart3",
      title: "Análise de Métricas",
      description: "Monitoramento e análise de dados para otimizar resultados e direcionar ações futuras.",
      color: "moss",
    },
    {
      icon: "TrendingUp",
      title: "Tráfego Pago",
      description: "Gestão de campanhas de anúncios no Instagram, Facebook e Google para acelerar resultados.",
      color: "slate",
    },
  ];

  return (
    <section id="servicos" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper className="mb-16 text-center">
          <p className="mb-2 font-script text-2xl text-rose">{content?.subtitle || "O que eu faço"}</p>
          <h2 className="font-serif text-4xl font-black text-ink md:text-5xl">
            <span className="text-balance">{content?.title || "Meus Serviços"}</span>
          </h2>
        </MotionWrapper>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette;
            return (
              <MotionWrapper
                key={index}
                delay={index * 0.1}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-rose/30 hover:shadow-lg"
              >
                <div
                  className={cn(
                    "mb-5 inline-flex items-center justify-center rounded-xl p-3",
                    `bg-${service.color}/10`
                  )}
                >
                  <Icon className={cn("h-6 w-6", `text-${service.color}`)} />
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
