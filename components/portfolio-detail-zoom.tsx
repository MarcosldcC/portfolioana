"use client";

import Image from "next/image";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type WheelEvent } from "react";
import { Button } from "@/components/ui/button";

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

function pinchDistance(touches: TouchList) {
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}

function clampZoom(z: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

/** Imagem do modal com zoom (botões, Ctrl+scroll, pinça no touch) e área rolável para ver detalhes. */
export function PortfolioDetailImageZoom({
  src,
  alt,
  active,
}: {
  src: string;
  alt: string;
  active: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  zoomRef.current = zoom;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 896, h: 520 });
  const pinchRef = useRef<{ d0: number; z0: number } | null>(null);

  useEffect(() => {
    if (active) setZoom(1);
  }, [active, src]);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el || !active) return;
    const apply = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setBox({ w: r.width, h: r.height });
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, src]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !active) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const d0 = pinchDistance(e.touches);
        if (d0 > 8) {
          pinchRef.current = { d0, z0: zoomRef.current };
        }
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const d = pinchDistance(e.touches);
        const z = pinchRef.current.z0 * (d / pinchRef.current.d0);
        setZoom(clampZoom(z));
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [active, src]);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => clampZoom(z + delta));
  };

  const innerW = Math.max(1, Math.round(box.w * zoom));
  const innerH = Math.max(1, Math.round(box.h * zoom));

  return (
    <div className="relative h-[min(52vh,520px)] w-full shrink-0 sm:h-[min(58vh,560px)]">
      <div
        ref={viewportRef}
        onWheel={onWheel}
        className="relative h-full w-full overflow-auto overscroll-contain bg-black/30 [scrollbar-width:thin]"
      >
        <div className="relative shrink-0 bg-black/20" style={{ width: innerW, height: innerH }}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes={`${Math.min(Math.max(innerW, innerH), 2048)}px`}
            className="object-contain object-center select-none"
            draggable={false}
          />
        </div>
      </div>
      <p className="pointer-events-none absolute left-2 top-11 max-w-[58%] rounded-md bg-ink/90 px-2 py-0.5 text-[10px] leading-tight text-sand/85 ring-1 ring-white/10 sm:top-2 sm:max-w-[65%] sm:py-1 sm:text-xs">
        <span className="sm:hidden">Pinça ou botões + / −</span>
        <span className="hidden sm:inline">Ctrl + scroll (ou pinça) para ampliar</span>
      </p>
      <div className="absolute right-10 top-2 z-10 flex items-center gap-0.5 rounded-lg bg-ink/92 p-0.5 ring-1 ring-white/15 sm:right-12">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-sand hover:bg-white/10 hover:text-white"
          aria-label="Diminuir zoom"
          onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
          disabled={zoom <= ZOOM_MIN}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="min-w-[2.85rem] text-center text-[11px] tabular-nums text-sand/90 sm:text-xs">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-sand hover:bg-white/10 hover:text-white"
          aria-label="Aumentar zoom"
          onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
          disabled={zoom >= ZOOM_MAX}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-sand hover:bg-white/10 hover:text-white"
          aria-label="Restaurar zoom"
          onClick={() => setZoom(1)}
          disabled={zoom <= ZOOM_MIN}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
