import {
  Users,
  FileText,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  MousePointerClick,
  Eye,
  MessageSquare
} from "lucide-react";
import { HalftonePattern } from "@/components/decorative-elements";
import { getAnalytics } from "@/app/actions/analytics";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const analytics = await getAnalytics();

  const stats = [
    {
      label: "Total de Visitas",
      value: analytics.pageViews.toString(),
      change: "Visualizações de página",
      icon: Eye,
    },
    {
      label: "Interesse em Contato",
      value: analytics.contactClicks.toString(),
      change: "Cliques em 'Fale Comigo'",
      icon: MessageSquare,
    },
    {
      label: "Interesse em Projetos",
      value: analytics.projectClicks.toString(),
      change: "Cliques em cases",
      icon: MousePointerClick,
    },
    {
      label: "Conversão CTA",
      value: analytics.ctaClicks.toString(),
      change: "Cliques em botões principais",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">
            Bem-vinda de volta
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Aqui está o resumo do desempenho do seu site.
          </p>
        </div>
        <p className="hidden font-sans text-xs text-muted-foreground sm:block">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-border bg-background/60 p-5 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="font-serif text-2xl font-bold text-ink">
                    {stat.value}
                  </span>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose/10">
                  <Icon className="h-5 w-5 text-rose" />
                </div>
              </div>
              <p className="mt-2 font-sans text-xs text-moss">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Halftone divider */}
      <div className="flex items-center justify-center opacity-20">
        <HalftonePattern className="h-6 w-full" />
      </div>

      {/* Analytics Details - Placeholder for now or simple list */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-serif text-xl font-bold text-ink">Atividade Recente</h2>
          {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {analytics.recentActivity.map((activity: any, i: number) => (
                <li key={i} className="text-sm">{activity}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente registrada.</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-serif text-xl font-bold text-ink">Dicas</h2>
          <p className="text-sm text-muted-foreground">
            Compartilhe seu portfólio no LinkedIn para aumentar o número de visitas e possíveis clientes.
          </p>
        </div>
      </div>
    </div>
  );
}
