'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'app/data/site-content.json');

export async function getSiteContent() {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('id', 'main');

        if (error || !data || data.length === 0) {
            if (error) console.warn('Supabase fetch error for site_content:', error.message);

            try {
                const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
                const json = JSON.parse(fileContent);

                if (!data || data.length === 0) {
                    console.log('Site content not found in DB. Seeding from local file...');
                    await supabase
                        .from('site_content')
                        .upsert({ id: 'main', content: json });
                }

                return json;
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
                return {};
            }
        }

        return data[0].content;
    } catch (error) {
        console.error('Error reading site content:', error);
        try {
            const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
            return JSON.parse(fileContent);
        } catch (e) {
            return {};
        }
    }
}

export async function updateSiteContent(newData: any, note?: string) {
    try {
        const supabase = createAdminClient();

        // 1. Update main content
        const { error: updateError } = await supabase
            .from('site_content')
            .upsert({ id: 'main', content: newData, updated_at: new Date().toISOString() });

        if (updateError) throw new Error(`Supabase update error: ${updateError.message}`);

        // 2. Save to history
        const { error: versionError } = await supabase
            .from('site_content_versions')
            .insert({
                content: newData,
                note: note || `Update at ${new Date().toLocaleString()}`
            });

        if (versionError) console.error('Error saving version:', versionError);

        // 3. Sync local file (optional fallback - might fail in read-only environments like Vercel)
        try {
            await fs.writeFile(DATA_FILE_PATH, JSON.stringify(newData, null, 2), 'utf-8');
        } catch (fileError) {
            console.warn('Could not sync local file, but DB update was successful:', fileError);
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating site content:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getSiteVersions() {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('site_content_versions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching versions:', error);
        return [];
    }
}

export async function restoreVersion(versionId: string) {
    try {
        const supabase = createAdminClient();

        // Get the specific version
        const { data: versionData, error: fetchError } = await supabase
            .from('site_content_versions')
            .select('content')
            .eq('id', versionId)
            .single();

        if (fetchError) throw fetchError;

        // Update main content with this version's content
        const result = await updateSiteContent(versionData.content, `Restored version ${versionId}`);

        return result;
    } catch (error) {
        console.error('Error restoring version:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteVersion(versionId: string) {
    try {
        const supabase = createAdminClient();
        const { error } = await supabase
            .from('site_content_versions')
            .delete()
            .eq('id', versionId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting version:', error);
        return { success: false, error: (error as Error).message };
    }
}
