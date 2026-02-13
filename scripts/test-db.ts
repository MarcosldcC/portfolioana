import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
    console.log('--- Testing Site Content ---');
    const { data: st, error: se } = await supabase.from('site_content').select('*');
    console.log('Site Content:', st, se);

    console.log('--- Testing Analytics ---');
    const { data: an, error: ae } = await supabase.from('analytics').select('*');
    console.log('Analytics:', an, ae);

    if (an && an.length === 0) {
        console.log('Initializing Analytics...');
        const initData = { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0 };
        const { error } = await supabase.from('analytics').insert({ id: 'main', data: initData });
        console.log('Init Result:', error);
    }
}

test();
