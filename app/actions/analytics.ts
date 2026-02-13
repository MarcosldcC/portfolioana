'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

// Helper para obter período atual
function getCurrentPeriod() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.toLocaleString('pt-BR', { month: 'long' }).toLowerCase();
    return { year, month };
}

async function getClientRegion() {
    try {
        const headerList = await headers();
        const forward = headerList.get('x-forwarded-for');
        const ip = forward ? forward.split(',')[0] : null;

        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
            return 'João Pessoa';
        }

        const res = await fetch(`http://ip-api.com/json/${ip}?fields=city`);
        const data = await res.json();
        return data.city || 'Desconhecido';
    } catch (e) {
        return 'Desconhecido';
    }
}

async function ensureMainRow(supabase: any) {
    const { data: existingData, error } = await supabase
        .from('analytics')
        .select('data')
        .eq('id', 'main');

    if (error) return null;

    if (!existingData || existingData.length === 0) {
        const initialData = {
            total: { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0, service_clicks: {}, project_details_clicks: {}, region_data: {} },
            history: {}
        };
        await supabase.from('analytics').insert({ id: 'main', data: initialData });
        return initialData;
    }

    return existingData[0].data;
}

// Função principal para incrementar qualquer métrica de forma temporal
async function updateMetric(updateFn: (current: any) => any) {
    try {
        const supabase = createAdminClient();
        const data = await ensureMainRow(supabase);
        if (!data) return;

        const { year, month } = getCurrentPeriod();

        // Inicializa estruturas se não existirem
        if (!data.total) data.total = { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0, service_clicks: {}, project_details_clicks: {}, region_data: {} };
        if (!data.history) data.history = {};
        if (!data.history[year]) data.history[year] = {};
        if (!data.history[year][month]) data.history[year][month] = { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0, service_clicks: {}, project_details_clicks: {}, region_data: {} };

        // Aplica atualização no total e no mês atual
        data.total = updateFn(data.total);
        data.history[year][month] = updateFn(data.history[year][month]);

        await supabase.from('analytics').update({ data }).eq('id', 'main');
        revalidatePath('/admin');
    } catch (err) {
        console.error('Error updating metric:', err);
    }
}

export async function incrementPageView() {
    const region = await getClientRegion();
    await updateMetric((curr) => ({
        ...curr,
        page_views: (curr.page_views || 0) + 1,
        unique_visitors: (curr.unique_visitors || 0) + (Math.random() > 0.9 ? 1 : 0),
        region_data: {
            ...(curr.region_data || {}),
            [region]: ((curr.region_data?.[region]) || 0) + 1
        }
    }));
}

export async function incrementClick(type: 'cta' | 'project' | 'contact', label?: string) {
    const region = await getClientRegion();
    await updateMetric((curr) => {
        let newData = { ...curr };
        switch (type) {
            case 'cta': newData.cta_clicks = (newData.cta_clicks || 0) + 1; break;
            case 'project':
                newData.project_clicks = (newData.project_clicks || 0) + 1;
                if (label) {
                    newData.project_details_clicks = newData.project_details_clicks || {};
                    newData.project_details_clicks[label] = (newData.project_details_clicks[label] || 0) + 1;
                }
                break;
            case 'contact': newData.contact_clicks = (newData.contact_clicks || 0) + 1; break;
        }
        newData.region_data = newData.region_data || {};
        newData.region_data[region] = (newData.region_data[region] || 0) + 1;
        return newData;
    });
}

export async function incrementServiceClick(serviceName: string) {
    const region = await getClientRegion();
    await updateMetric((curr) => {
        let newData = { ...curr };
        newData.service_clicks = newData.service_clicks || {};
        newData.service_clicks[serviceName] = (newData.service_clicks[serviceName] || 0) + 1;
        newData.region_data = newData.region_data || {};
        newData.region_data[region] = (newData.region_data[region] || 0) + 1;
        return newData;
    });
}

export async function resetAnalyticsData() {
    try {
        const supabase = createAdminClient();
        const emptyData = {
            total: { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0, service_clicks: {}, project_details_clicks: {}, region_data: {} },
            history: {}
        };
        await supabase.from('analytics').update({ data: emptyData }).eq('id', 'main');
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function getAnalytics(year?: string, month?: string) {
    try {
        const supabase = createAdminClient();
        const data = await ensureMainRow(supabase);
        if (!data) return null;

        // Se filtrar por ano e mês
        if (year && month && month !== 'todos') {
            const monthData = data.history?.[year]?.[month];
            if (monthData) {
                return monthData;
            } else {
                // Se não existir dados para o mês, retorna zerado em vez de cair no fallback
                return {
                    page_views: 0,
                    unique_visitors: 0,
                    cta_clicks: 0,
                    project_clicks: 0,
                    contact_clicks: 0,
                    service_clicks: {},
                    project_details_clicks: {},
                    region_data: {}
                };
            }
        }

        // Se filtrar apenas por ano (agregado)
        if (year && (!month || month === 'todos')) {
            if (!data.history?.[year]) {
                return { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0, service_clicks: {}, project_details_clicks: {}, region_data: {} };
            }

            const aggregated: any = {
                page_views: 0,
                unique_visitors: 0,
                cta_clicks: 0,
                project_clicks: 0,
                contact_clicks: 0,
                service_clicks: {},
                project_details_clicks: {},
                region_data: {}
            };

            const monthsData = Object.values(data.history[year]);

            monthsData.forEach((m: any) => {
                aggregated.page_views += (m.page_views || 0);
                aggregated.unique_visitors += (m.unique_visitors || 0);
                aggregated.cta_clicks += (m.cta_clicks || 0);
                aggregated.project_clicks += (m.project_clicks || 0);
                aggregated.contact_clicks += (m.contact_clicks || 0);

                // Helper to aggregate objects
                const mergeObj = (target: any, source: any) => {
                    if (!source) return;
                    Object.entries(source).forEach(([key, val]) => {
                        target[key] = (target[key] || 0) + (val as number);
                    });
                };

                mergeObj(aggregated.service_clicks, m.service_clicks);
                mergeObj(aggregated.project_details_clicks, m.project_details_clicks);
                mergeObj(aggregated.region_data, m.region_data);
            });
            return aggregated;
        }

        // Retorno total acumulado
        return data.total || data;
    } catch (err) {
        return null;
    }
}

// --- UPLOADS (SUPABASE STORAGE) ---
export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) throw new Error('No file uploaded');

        const supabase = await createClient();
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(filename);

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload image' };
    }
}
