'use client';

import {
  Users,
  FileText,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  MousePointerClick,
  Eye,
  MessageSquare,
  Loader2,
  Trash2,
  AlertTriangle,
  Lock
} from "lucide-react";
import { HalftonePattern } from "@/components/decorative-elements";
import { getAnalytics, resetAnalyticsData } from "@/app/actions/analytics";
import { AdvancedAnalytics } from "@/components/advanced-analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonthName = new Date().toLocaleString('pt-BR', { month: 'long' }).toLowerCase();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthName);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const months = [
    { value: "todos", label: "Ano Inteiro" },
    { value: "janeiro", label: "Janeiro" },
    { value: "fevereiro", label: "Fevereiro" },
    { value: "março", label: "Março" },
    { value: "abril", label: "Abril" },
    { value: "maio", label: "Maio" },
    { value: "junho", label: "Junho" },
    { value: "julho", label: "Julho" },
    { value: "agosto", label: "Agosto" },
    { value: "setembro", label: "Setembro" },
    { value: "outubro", label: "Outubro" },
    { value: "novembro", label: "Novembro" },
    { value: "dezembro", label: "Dezembro" },
  ];

  const years = [
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  const fetchData = async () => {
    setLoading(true);
    const data = await getAnalytics(year, month);
    setAnalytics(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const handleReset = async () => {
    // Por simplicidade aqui, vamos usar uma senha padrão de admin.
    // Em um sistema real, isso validaria via Supabase Auth ou variável de ambiente segura.
    if (password !== process.env.NEXT_PUBLIC_ANALYTICS_RESET_PASSWORD) {
      toast.error("Senha administrativa incorreta!");
      return;
    }

    setResetting(true);
    const res = await resetAnalyticsData();
    if (res.success) {
      toast.success("Dados de performance resetados com sucesso!");
      setIsResetOpen(false);
      setPassword("");
      await fetchData();
    } else {
      toast.error("Erro ao resetar dados.");
    }
    setResetting(false);
  };

  if (loading && !analytics) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose" />
      </div>
    );
  }

  const stats = [
    {
      label: "Visualizações",
      value: (analytics?.page_views || 0).toString(),
      change: "Páginas carregadas",
      icon: Eye,
    },
    {
      label: "Interesse em Contato",
      value: (analytics?.contact_clicks || 0).toString(),
      change: "Cliques no formulário",
      icon: MessageSquare,
    },
    {
      label: "Interesse em Projetos",
      value: (analytics?.project_clicks || 0).toString(),
      change: "Cliques em cases",
      icon: MousePointerClick,
    },
    {
      label: "Cliques em Serviços",
      value: Object.values(analytics?.service_clicks || {}).reduce((a: any, b: any) => a + (b as number), 0).toString(),
      change: "Cotações de serviço",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">
            Painel de Performance
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground uppercase tracking-widest font-bold">
            Análise Temporal {month !== 'todos' ? `• ${month.charAt(0).toUpperCase() + month.slice(1)}` : ''} {year}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsResetOpen(true)}
            className="border-rose/20 text-rose hover:bg-rose hover:text-white transition-all"
            title="Resetar KPIs"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px] bg-background/60 backdrop-blur-md border-rose/20">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px] bg-background/60 backdrop-blur-md border-rose/20">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border">
          <Loader2 className="h-6 w-6 animate-spin text-rose/50" />
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-xl border border-border bg-background/60 p-5 backdrop-blur-sm shadow-sm hover:border-rose/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className="font-serif text-2xl font-bold text-ink">
                        {stat.value}
                      </span>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose/10 group-hover:bg-rose/20 transition-colors">
                      <Icon className="h-5 w-5 text-rose" />
                    </div>
                  </div>
                  <p className="mt-2 font-sans text-[10px] text-moss font-medium">↑ {stat.change}</p>
                </div>
              );
            })}
          </div>

          {/* Advanced Analytics - Charts */}
          <AdvancedAnalytics data={analytics} />
        </>
      )}

      {/* Halftone divider */}
      <div className="flex items-center justify-center opacity-10">
        <HalftonePattern className="h-6 w-full" />
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Resetar Dados
            </DialogTitle>
            <DialogDescription>
              Esta ação irá apagar permanentemente todas as visualizações, cliques e registros de localização. Para confirmar, digite a senha administrativa.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha Admin"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsResetOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleReset}
              disabled={resetting || !password}
            >
              {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
