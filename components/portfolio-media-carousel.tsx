"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PortfolioMediaEntry } from "@/lib/portfolio-item-media";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PortfolioDetailImageZoom } from "@/components/portfolio-detail-zoom";

function ModalVideo({
  src,
  poster,
  active,
  title,
}: {
  src: string;
  poster?: string;
  active: boolean;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!active) ref.current?.pause();
  }, [active]);

  return (
    <div className="flex h-[min(52vh,520px)] w-full items-center justify-center bg-black/30 sm:h-[min(58vh,560px)]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="max-h-full max-w-full object-contain"
        aria-label={`Vídeo: ${title}`}
      />
    </div>
  );
}

export function PortfolioCardMediaCarousel({
  media,
  title,
}: {
  media: PortfolioMediaEntry[];
  title: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!media.length) return null;

  return (
    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
      <Carousel
        setApi={setApi}
        className="h-full w-full"
        opts={{ loop: media.length > 1, align: "start" }}
      >
        <CarouselContent className="-ml-0 h-full">
          {media.map((m) => (
            <CarouselItem key={m.id} className="h-full basis-full pl-0">
              <div className="relative aspect-[4/3] w-full">
                {m.kind === "video" ? (
                  <video
                    src={m.url}
                    poster={m.posterUrl}
                    muted
                    playsInline
                    loop
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    aria-label={title}
                  />
                ) : (
                  <Image
                    src={m.url}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border border-white/20 bg-ink/75 text-sand shadow-md hover:bg-ink"
              aria-label="Slide anterior"
              onClick={(e) => {
                e.stopPropagation();
                api?.scrollPrev();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border border-white/20 bg-ink/75 text-sand shadow-md hover:bg-ink"
              aria-label="Próximo slide"
              onClick={(e) => {
                e.stopPropagation();
                api?.scrollNext();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        ) : null}
      </Carousel>
      {media.length > 1 ? (
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5">
          {media.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === current ? "bg-rose" : "bg-white/45",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PortfolioModalMediaCarousel({
  media,
  title,
  dialogOpen,
}: {
  media: PortfolioMediaEntry[];
  title: string;
  dialogOpen: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setSlide(0);
  }, [media, title]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!media.length) return null;

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{ loop: media.length > 1, align: "start" }}
      >
        <CarouselContent className="-ml-0">
          {media.map((m, slideIndex) => (
            <CarouselItem key={m.id} className="basis-full pl-0">
              {m.kind === "video" ? (
                <ModalVideo
                  src={m.url}
                  poster={m.posterUrl}
                  active={dialogOpen && slide === slideIndex}
                  title={title}
                />
              ) : (
                <PortfolioDetailImageZoom
                  src={m.url}
                  alt={title}
                  active={dialogOpen && slide === slideIndex}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-1 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full border border-white/20 bg-ink/85 text-sand shadow-md hover:bg-ink sm:left-2"
              aria-label="Slide anterior"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-10 top-1/2 z-20 h-9 w-9 -translate-y-1/2 rounded-full border border-white/20 bg-ink/85 text-sand shadow-md hover:bg-ink sm:right-12"
              aria-label="Próximo slide"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {media.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i === slide ? "bg-rose" : "bg-white/45",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </Carousel>
    </div>
  );
}
