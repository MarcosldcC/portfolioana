import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();

    // Aggressive cleanup: Delete everything that might be mock
    // Or just delete everything in posts if the user wants a clean slate
    const results = {
        posts: await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000'), // Delete all posts
        projects: await supabase.from('projects').delete().in('title', [
            'Branding Café Artesanal',
            'Lançamento Moda Sustentável',
            'Studio de Beleza Premium',
            'Restaurante Gastronômico'
        ]),
        messages: await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all messages
    };

    return NextResponse.json(results);
}
