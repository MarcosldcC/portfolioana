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
        // Use UTC boundaries to avoid local timezone shifts during filtering
        const startDate = new Date(Date.UTC(year, month, 1)).toISOString();
        const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59)).toISOString();
        postsQuery = postsQuery.gte("date", startDate).lte("date", endDate);
    }

    const { data: postsData, error: postsError } = await postsQuery;

    if (postsError) {
        console.error("Erro ao buscar posts:", postsError);
    }

    // 2. Fetch events and tasks from all projects
    const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, events, tasks");

    if (projectsError) {
        console.error("Erro ao buscar dados de projetos:", projectsError);
    }

    const manualPosts = (postsData || []) as Post[];
    const projectPosts: Post[] = [];

    if (projectsData) {
        projectsData.forEach(project => {
            // Process manual events
            if (project.events && Array.isArray(project.events)) {
                project.events.forEach((event: any) => {
                    if (!event.date) return;

                    const eventDate = new Date(event.date);
                    if (isNaN(eventDate.getTime())) return;

                    // Filter by month/year if provided
                    if (year !== undefined && month !== undefined) {
                        // Use UTC methods to ensure consistency with how dates are often stored (ISO)
                        // If it's a simple YYYY-MM-DD string, new Date(string) in local vs UTC can shift the day.
                        // We'll check both to be safe or just use the string comparison if it's YYYY-MM-DD
                        const evYear = eventDate.getUTCFullYear();
                        const evMonth = eventDate.getUTCMonth();

                        if (evYear !== year || evMonth !== month) {
                            // Also check local just in case the server is local-time oriented
                            if (eventDate.getFullYear() !== year || eventDate.getMonth() !== month) {
                                return;
                            }
                        }
                    }

                    projectPosts.push({
                        id: event.id || `${project.id}-${event.title}`,
                        client: project.title,
                        type: event.type || "task",
                        status: "agendado",
                        date: event.date,
                        caption: event.title,
                        created_at: new Date().toISOString()
                    });
                });
            }

            // Process tasks with deadlines (Source of Truth)
            if (project.tasks && Array.isArray(project.tasks)) {
                project.tasks.forEach((task: any) => {
                    if (!task.endDate) return;

                    // Avoid duplication if the task is already in events (which page.tsx tries to do)
                    const isAlreadyInEvents = project.events?.some((e: any) => e.title?.includes(task.title));
                    if (isAlreadyInEvents) return;

                    const taskDate = new Date(task.endDate);
                    if (isNaN(taskDate.getTime())) return;

                    if (year !== undefined && month !== undefined) {
                        const tYear = taskDate.getUTCFullYear();
                        const tMonth = taskDate.getUTCMonth();

                        if (tYear !== year || tMonth !== month) {
                            if (taskDate.getFullYear() !== year || taskDate.getMonth() !== month) {
                                return;
                            }
                        }
                    }

                    projectPosts.push({
                        id: task.id || `${project.id}-${task.title}`,
                        client: project.title,
                        type: "task",
                        status: task.status === "done" ? "publicado" : "agendado",
                        date: task.endDate,
                        caption: task.title,
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
