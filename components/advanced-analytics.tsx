'use client';

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    TrendingUp,
    MapPin,
    MousePointer2,
    Briefcase,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedAnalyticsProps {
    data: any;
}

const COLORS = ['#E11D48', '#0F172A', '#64748B', '#10B981', '#F59E0B'];

export function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
    const [timeFilter, setTimeFilter] = useState<'mes' | 'ano' | 'tudo'>('tudo');

    const serviceData = Object.entries(data.service_clicks || {}).map(([name, value]) => ({
        name,
        value
    })).sort((a: any, b: any) => b.value - a.value);

    const projectData = Object.entries(data.project_details_clicks || {}).map(([name, value]) => ({
        name,
        value
    })).sort((a: any, b: any) => b.value - a.value);

    const regionData = Object.entries(data.region_data || {}).map(([name, value]) => ({
        name,
        value: value as number
    })).sort((a: any, b: any) => b.value - a.value);

    const maxIncidence = regionData.length > 0 ? Math.max(...regionData.map(d => d.value)) : 0;

    return (
        <div className="flex flex-col gap-8 mt-4">
            {/* Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-serif text-2xl font-bold text-ink flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-rose" />
                    Análise de Performance
                </h2>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 p-1">
                    {(['mes', 'ano', 'tudo'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setTimeFilter(f)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                                timeFilter === f
                                    ? "bg-ink text-white shadow-sm"
                                    : "text-muted-foreground hover:text-ink"
                            )}
                        >
                            {f === 'mes' ? 'Mês' : f === 'ano' ? 'Ano' : 'Tudo'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Mapa de Incidência (Ranking Térmico) */}
                <div className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur-sm shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-rose" />
                                Mapa de Incidência
                            </h3>
                            <p className="text-xs text-muted-foreground">Volume de interações por localização</p>
                        </div>
                        <Activity className="h-5 w-5 text-rose opacity-50" />
                    </div>

                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {regionData.length > 0 ? (
                            regionData.map((item, index) => (
                                <div key={index} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                                        <span>{item.name}</span>
                                        <span className="text-rose">{item.value} cliques</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-border/50">
                                        <div
                                            className="h-full bg-rose transition-all duration-1000"
                                            style={{
                                                width: `${(item.value / (maxIncidence || 1)) * 100}%`,
                                                opacity: 0.4 + ((item.value / (maxIncidence || 1)) * 0.6)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-[200px] flex-col items-center justify-center text-center opacity-40">
                                <MapPin className="mb-2 h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">Aguardando dados geográficos...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Serviços por Interesse */}
                <div className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur-sm shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-rose" />
                                Serviços por Interesse
                            </h3>
                            <p className="text-xs text-muted-foreground">Demanda pelos serviços oferecidos</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        {serviceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={serviceData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={100}
                                        style={{ fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                        {serviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
                                <Briefcase className="mb-2 h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">Sem dados de serviços.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance de Cases */}
                <div className="rounded-2xl border border-border bg-background/60 p-6 backdrop-blur-sm shadow-sm lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                                <MousePointer2 className="h-4 w-4 text-rose" />
                                Performance de Cases
                            </h3>
                            <p className="text-xs text-muted-foreground">Cliques nos projetos do portfólio</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        {projectData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        style={{ fontSize: '10px' }}
                                    />
                                    <YAxis axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                        {projectData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[0]} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
                                <MousePointer2 className="mb-2 h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">Seus cases ainda não receberam cliques.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
