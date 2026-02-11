import Image from "next/image";
import { HalftonePattern } from "./decorative-elements";
import { MotionWrapper } from "./motion-wrapper";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  content?: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    stats: Array<{
      label: string;
      value: string;
      color: "rose" | "moss" | "slate" | "ink" | string;
    }>;
  };
}

export function AboutSection({ content }: AboutSectionProps) {
  const stats = content?.stats || [
    { label: "Clientes atendidos", value: "50+", color: "rose" },
    { label: "Anos de experiência", value: "3+", color: "moss" },
    { label: "Crescimento médio", value: "200%", color: "slate" },
  ];

  return (
    <section id="sobre" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image side */}
          <MotionWrapper direction="right" delay={0.2} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={content?.image || "/images/about-photo.jpg"}
                alt="Sobre mim"
                fill
                className="object-cover mix-blend-multiply"
              />
            </div>
            <HalftonePattern className="absolute -bottom-6 -right-6 opacity-30" />
          </MotionWrapper>

          {/* Text side */}
          <MotionWrapper direction="left" delay={0.4}>
            <p className="mb-2 font-script text-2xl text-rose">{content?.title || "Sobre mim"}</p>
            <h2 className="mb-6 font-serif text-4xl font-black text-ink md:text-5xl">
              <span className="text-balance text-rose">
                {content?.subtitle || "Criando conexões autênticas"}
              </span>
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground whitespace-pre-line">
              {content?.description || `Sou apaixonada por transformar marcas em histórias que conectam.
              Com experiência em estratégia digital, criação de conteúdo e
              gestão de redes sociais, ajudo negócios a encontrarem sua voz
              única no mundo digital.`}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className={cn("font-serif text-3xl font-black", `text-${stat.color}`)}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
