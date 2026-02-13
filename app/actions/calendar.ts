'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type Post = {
    id: string;
    client: string;
    type: string;
    status: string;
    date: string;
    caption: string;
    created_at: string;
};

export async function getPosts(year?: number, month?: number) {
    const supabase = await createClient();

    // 1. Fetch manual posts
    let postsQuery = supabase.from("posts").select("*").order("date", { ascending: true });

    if (year !== undefined && month !== undefined) {
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
        postsQuery = postsQuery.gte("date", startDate).lte("date", endDate);
    }

    const { data: postsData, error: postsError } = await postsQuery;

    if (postsError) {
        console.error("Erro ao buscar posts:", postsError);
    }

    // 2. Fetch events from all projects
    const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, events");

    if (projectsError) {
        console.error("Erro ao buscar eventos de projetos:", projectsError);
    }

    const manualPosts = (postsData || []) as Post[];

    // Transform project events into the Post format
    const projectPosts: Post[] = [];
    if (projectsData) {
        projectsData.forEach(project => {
            if (project.events && Array.isArray(project.events)) {
                project.events.forEach((event: any) => {
                    const eventDate = new Date(event.date);
                    // Filter by month/year if provided
                    if (year !== undefined && month !== undefined) {
                        if (eventDate.getFullYear() !== year || eventDate.getMonth() !== month) {
                            return;
                        }
                    }

                    projectPosts.push({
                        id: event.id || `${project.id}-${event.title}`,
                        client: project.title, // Use project title as client name
                        type: event.type || "task",
                        status: "agendado",
                        date: event.date,
                        caption: event.title,
                        created_at: new Date().toISOString()
                    });
                });
            }
        });
    }

    return [...manualPosts, ...projectPosts].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}


export async function createPost(postData: any) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("posts")
            .insert(postData);

        if (error) throw error;
        revalidatePath("/admin/calendario");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar post:", error);
        return { success: false, error: "Erro ao criar post." };
    }
}

export async function updatePost(id: string, postData: any) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("posts")
            .update(postData)
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/calendario");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar post:", error);
        return { success: false, error: "Erro ao atualizar post." };
    }
}

export async function deletePost(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/calendario");
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar post:", error);
        return { success: false, error: "Erro ao deletar post." };
    }
}
