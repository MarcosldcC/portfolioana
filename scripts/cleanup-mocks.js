const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log('Iniciando limpeza de dados mockados...');

    // Cleanup mock projects
    const { error: pError } = await supabase
        .from('projects')
        .delete()
        .in('title', [
            'Branding Café Artesanal',
            'Lançamento Moda Sustentável',
            'Studio de Beleza Premium',
            'Restaurante Gastronômico'
        ]);
    if (pError) console.error('Erro ao deletar projetos:', pError);
    else console.log('Projetos mockados deletados.');

    // Cleanup mock posts
    const { error: poError } = await supabase
        .from('posts')
        .delete()
        .in('client', [
            'Cafe Botanica',
            'Studio Ella',
            'Flora & Co',
            'Maison Belle',
            'Petit Gateau',
            'Atelier Rose'
        ]);
    if (poError) console.error('Erro ao deletar posts:', poError);
    else console.log('Posts mockados deletados.');

    // Cleanup mock messages
    const { error: mError } = await supabase
        .from('messages')
        .delete()
        .in('email', [
            'mariaclara@email.com',
            'fernanda.lima@email.com',
            'rafael@cafebotanica.com',
            'ju.torres@email.com',
            'amanda@floresco.com'
        ]);
    if (mError) console.error('Erro ao deletar mensagens:', mError);
    else console.log('Mensagens mockadas deletadas.');
}

cleanup();
