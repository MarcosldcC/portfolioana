import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: posts } = await supabase.from('posts').select('*');
    const { data: projects } = await supabase.from('projects').select('*');

    return NextResponse.json({
        postsCount: posts?.length,
        projectsCount: projects?.length,
        firstPosts: posts?.slice(0, 5),
        firstProjects: projects?.slice(0, 5)
    });
}
