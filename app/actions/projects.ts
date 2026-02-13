'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProjects() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("projects").select("*").order("date", { ascending: false });

    if (error) {
        console.error("Erro ao buscar projetos:", error);
        return [];
    }

    return data;
}

export async function getProjectById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar projeto:", error);
        return null;
    }

    return data;
}

export async function createProject(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;
    const status = formData.get("status") as string || "rascunho";
    const date = formData.get("date") as string || new Date().toISOString().split('T')[0];

    try {
        const { data, error } = await supabase
            .from("projects")
            .insert({ title, category, description, image_url, status, date })
            .select()
            .single();

        if (error) throw error;
        revalidatePath("/admin/projetos");
        revalidatePath("/");
        return { success: true, project: data };
    } catch (error) {
        console.error("Erro ao criar projeto:", error);
        return { success: false, error: "Erro ao criar projeto." };
    }
}

export async function updateProject(id: string, formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;
    const status = formData.get("status") as string;
    const date = formData.get("date") as string;

    try {
        const { error } = await supabase
            .from("projects")
            .update({ title, category, description, image_url, status, date })
            .eq("id", id);

        if (error) throw error;
        revalidatePath("/admin/projetos");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        return { success: false, error: "Erro ao atualizar projeto." };
    }
}

export async function deleteProject(id: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
        revalidatePath("/admin/projetos");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        return { success: false, error: "Erro ao deletar projeto." };
    }
}

export async function updateProjectData(
    id: string,
    data: {
        tasks?: any[];
        links?: any[];
        events?: any[];
        notes?: string;
    }
) {
    const supabase = await createClient();

    try {
        console.log(`[Server Action] Atualizando projeto ${id}:`, Object.keys(data));

        const { data: updatedData, error, count } = await supabase
            .from("projects")
            .update(data)
            .eq("id", id)
            .select();

        if (error) {
            console.error("Erro Supabase ao atualizar dados:", error);
            return { success: false, error: `Erro no Banco de Dados: ${error.message}` };
        }

        if (!updatedData || updatedData.length === 0) {
            console.warn(`Nenhum projeto encontrado com ID ${id} para atualizar.`);
            return { success: false, error: "Projeto não encontrado ou sem permissão de edição." };
        }

        console.log(`[Server Action] Projeto ${id} atualizado com sucesso.`);
        revalidatePath(`/admin/projetos/${id}`);
        revalidatePath("/admin/calendario");
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao atualizar dados do projeto:", error);
        return { success: false, error: error.message || "Erro inesperado ao salvar dados." };
    }
}

