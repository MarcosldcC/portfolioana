const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        env[key] = value;
    }
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
    const { data: st, error: se } = await supabase.from('site_content').select('*').eq('id', 'main');
    console.log('Site Content:', JSON.stringify(st, null, 2), se);

    console.log('--- Testing Analytics ---');
    const { data: an, error: ae } = await supabase.from('analytics').select('*').eq('id', 'main');
    console.log('Analytics:', JSON.stringify(an, null, 2), ae);

    if (an && an.length === 0) {
        console.log('Initializing Analytics...');
        const initData = { page_views: 0, unique_visitors: 0, cta_clicks: 0, project_clicks: 0, contact_clicks: 0 };
        const { error } = await supabase.from('analytics').insert({ id: 'main', data: initData });
        if (error) {
            console.log('Init Result Error:', error);
        } else {
            console.log('Init Result: Success');
        }
    } else {
        console.log('Analytics already initialized.');
    }
}

test();
