"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Instagram,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PostType = "feed" | "stories" | "reels" | "carousel";
type PostStatus = "agendado" | "publicado" | "rascunho";

interface ScheduledPost {
  id: number;
  client: string;
  type: PostType;
  status: PostStatus;
  time: string;
  caption: string;
  day: number;
}

const typeConfig: Record<PostType, { label: string; color: string }> = {
  feed: { label: "Feed", color: "bg-rose" },
  stories: { label: "Stories", color: "bg-moss" },
  reels: { label: "Reels", color: "bg-slate" },
  carousel: { label: "Carousel", color: "bg-ink" },
};

const statusConfig: Record<PostStatus, { label: string; color: string }> = {
  agendado: { label: "Agendado", color: "text-moss" },
  publicado: { label: "Publicado", color: "text-slate" },
  rascunho: { label: "Rascunho", color: "text-muted-foreground" },
};

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const scheduledPosts: ScheduledPost[] = [
  {
    id: 1,
    client: "Cafe Botanica",
    type: "feed",
    status: "agendado",
    time: "09:00",
    caption: "Novo blend especial de inverno...",
    day: 3,
  },
  {
    id: 2,
    client: "Studio Ella",
    type: "stories",
    status: "agendado",
    time: "14:00",
    caption: "Bastidores da nova colecao...",
    day: 3,
  },
  {
    id: 3,
    client: "Cafe Botanica",
    type: "reels",
    status: "rascunho",
    time: "18:00",
    caption: "Processo de preparo do espresso...",
    day: 5,
  },
  {
    id: 4,
    client: "Flora & Co",
    type: "carousel",
    status: "agendado",
    time: "10:00",
    caption: "5 dicas de cuidados com plantas...",
    day: 7,
  },
  {
    id: 5,
    client: "Maison Belle",
    type: "feed",
    status: "publicado",
    time: "11:00",
    caption: "Transformacao do salao completa...",
    day: 1,
  },
  {
    id: 6,
    client: "Petit Gateau",
    type: "stories",
    status: "agendado",
    time: "16:00",
    caption: "Menu degustacao especial...",
    day: 10,
  },
  {
    id: 7,
    client: "Atelier Rose",
    type: "reels",
    status: "rascunho",
    time: "12:00",
    caption: "Tour pelo novo showroom...",
    day: 12,
  },
  {
    id: 8,
    client: "Cafe Botanica",
    type: "carousel",
    status: "agendado",
    time: "09:30",
    caption: "Historia do cafe artesanal...",
    day: 14,
  },
  {
    id: 9,
    client: "Flora & Co",
    type: "feed",
    status: "agendado",
    time: "15:00",
    caption: "Lancamento da linha primavera...",
    day: 17,
  },
  {
    id: 10,
    client: "Studio Ella",
    type: "stories",
    status: "rascunho",
    time: "20:00",
    caption: "Promocao relampago de inverno...",
    day: 20,
  },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarioPage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );

  const getPostsForDay = (day: number) =>
    scheduledPosts.filter((p) => p.day === day);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">
            Calendario de Conteudo
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Planeje e agende publicacoes para seus clientes.
          </p>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-lg bg-rose px-5 py-2.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo Post
        </button>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(typeConfig) as PostType[]).map((type) => (
          <span
            key={type}
            className="flex items-center gap-2 font-sans text-xs text-muted-foreground"
          >
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-sm",
                typeConfig[type].color
              )}
            />
            {typeConfig[type].label}
          </span>
        ))}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-5 py-3 backdrop-blur-sm">
        <button
          onClick={prevMonth}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="font-serif text-lg font-bold capitalize text-ink">
          {monthName}
        </h2>
        <button
          onClick={nextMonth}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Proximo mes"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-xl border border-border bg-background/60 backdrop-blur-sm">
        {/* Days header */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-3 text-center font-sans text-xs font-bold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[100px] border-b border-r border-border bg-muted/30 p-2"
            />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const posts = getPostsForDay(day);
            const isToday =
              day === now.getDate() &&
              currentMonth === now.getMonth() &&
              currentYear === now.getFullYear();

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[100px] border-b border-r border-border p-2 transition-colors",
                  isToday && "bg-rose/5"
                )}
              >
                <span
                  className={cn(
                    "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full font-sans text-xs",
                    isToday
                      ? "bg-rose font-bold text-white"
                      : "text-muted-foreground"
                  )}
                >
                  {day}
                </span>
                <div className="flex flex-col gap-1">
                  {posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={cn(
                        "flex items-center gap-1 rounded px-1.5 py-0.5 text-left text-[10px] font-bold text-white transition-all hover:opacity-80",
                        typeConfig[post.type].color
                      )}
                    >
                      <span className="truncate">{post.client}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post detail modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                    typeConfig[selectedPost.type].color
                  )}
                >
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-ink">
                    {selectedPost.client}
                  </h3>
                  <span
                    className={cn(
                      "font-sans text-xs font-bold",
                      statusConfig[selectedPost.status].color
                    )}
                  >
                    {statusConfig[selectedPost.status].label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedPost.time}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
                    typeConfig[selectedPost.type].color
                  )}
                >
                  {typeConfig[selectedPost.type].label}
                </span>
              </div>
              <p className="font-sans text-sm text-foreground">
                {selectedPost.caption}
              </p>
              <div className="mt-2 flex gap-2">
                <button className="flex-1 rounded-lg bg-rose py-2 font-sans text-sm font-bold text-white transition-all hover:opacity-90">
                  Editar
                </button>
                <button className="flex-1 rounded-lg border border-border bg-background py-2 font-sans text-sm font-bold text-ink transition-all hover:bg-muted">
                  Duplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
