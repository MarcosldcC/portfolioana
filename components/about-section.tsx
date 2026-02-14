import Image from "next/image";
import { HalftonePattern } from "./decorative-elements";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  content?: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    showStats?: boolean;
    stats: Array<{
      label: string;
      value: string;
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

export function AboutSection({ content, theme }: AboutSectionProps & { theme?: any }) {
  const isHex = (val?: string) => val?.startsWith("#");

  const bgClass = !isHex(theme?.background) ? bgColorMap[theme?.background || ""] || "bg-transparent" : "";
  const bgStyle = isHex(theme?.background) ? { backgroundColor: theme?.background } : {};

  // General Defaults
  const defaultText = theme?.text || "ink";
  const defaultAccent = theme?.accent || "rose";

  // Title Color (Script "Sobre Mim")
  const titleColor = theme?.titleColor || defaultAccent;
  const titleClass = !isHex(titleColor) ? textColorMap[titleColor] || "text-rose" : "";
  const titleStyle = isHex(titleColor) ? { color: titleColor } : {};

  // Subtitle Color (H2 "Criando conexões")
  const subtitleColor = theme?.subtitleColor || defaultText; // Changed default to text for contrast, user can set to accent
  const subtitleClass = !isHex(subtitleColor) ? textColorMap[subtitleColor] || "text-ink" : "";
  const subtitleStyle = isHex(subtitleColor) ? { color: subtitleColor } : {};

  // Description Color
  const descColor = theme?.descriptionColor || defaultText;
  const descClass = !isHex(descColor) ? textColorMap[descColor] || "text-ink" : "";
  const descStyle = isHex(descColor) ? { color: descColor } : {};

  const stats = content?.stats || [
    { label: "Clientes atendidos", value: "50+", color: "rose" },
    { label: "Anos de experiência", value: "3+", color: "moss" },
    { label: "Crescimento médio", value: "200%", color: "slate" },
  ];

  return (
    <section id="sobre" className="relative px-6 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image side */}
          <MotionWrapper direction="right" delay={0.2} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted ring-8 ring-offset-4 ring-muted/5 shadow-xl">
              <Image
                src={content?.image || "/images/about-photo.jpg"}
                alt="Sobre mim"
                fill
                className="object-cover"
              />
            </div>
            <HalftonePattern className="absolute -bottom-6 -right-6 text-rose opacity-30" />
          </MotionWrapper>

          {/* Text side */}
          <MotionWrapper direction="left" delay={0.4}>
            <p className="mb-2 font-script text-2xl text-rose">
              {content?.title || "Sobre mim"}
            </p>
            <h2 className="mb-6 font-serif text-4xl font-black md:text-5xl text-ink">
              {content?.subtitle || "Criando conexões autênticas"}
            </h2>
            <div className="space-y-4 leading-relaxed whitespace-pre-line text-muted-foreground text-lg">
              {content?.description || `Sou apaixonada por transformar marcas em histórias que conectam.
              Com experiência em estratégia digital, criação de conteúdo e
              gestão de redes sociais, ajudo negócios a encontrarem sua voz
              única no mundo digital.`}
            </div>

            {content?.showStats !== false && (
              <div className="mt-8 grid grid-cols-3 gap-6">
                {(content?.stats && content.stats.length > 0 ? content.stats : [
                  { label: "Clientes atendidos", value: "50+" },
                  { label: "Anos de experiência", value: "3+" },
                  { label: "Crescimento médio", value: "200%" },
                ]).map((stat: any, index: number) => {
                  const colors = ["text-pink", "text-rose", "text-blush"];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={index}>
                      <p className={cn("font-serif text-3xl font-black", colorClass)}>
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground font-bold uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}

