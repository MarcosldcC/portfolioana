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

async function reset() {
    console.log('--- Cleaning Analytics Data (Removing Mocks) ---');
    const emptyData = {
        page_views: 0,
        unique_visitors: 0,
        cta_clicks: 0,
        project_clicks: 0,
        contact_clicks: 0,
        service_clicks: {},
        project_details_clicks: {},
        region_data: {}
    };

    const { error } = await supabase
        .from('analytics')
        .update({ data: emptyData })
        .eq('id', 'main');

    if (error) {
        console.error('Error during reset:', error);
    } else {
        console.log('Analytics data has been successfully reset. Clean state ready!');
    }
}

reset();
