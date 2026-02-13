'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { incrementClick } from "./analytics";

export async function sendMessage(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { success: false, error: "Todos os campos são obrigatórios." };
    }

    try {
        const { error } = await supabase
            .from("messages")
            .insert({ name, email, message });

        if (error) throw error;

        // Incrementar interesse em contato nos analytics
        await incrementClick('contact');

        revalidatePath("/admin/briefings");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return { success: false, error: "Erro ao enviar mensagem. Tente novamente." };
    }
}

export async function getMessages(status?: string) {
    const supabase = await createClient();

    let query = supabase.from("messages").select("*").order("created_at", { ascending: false });

    if (status && status !== "todos") {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro ao buscar mensagens:", error);
        return [];
    }

    return data;
}

export async function updateMessageStatus(id: string, status: string) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("messages")
            .update({ status })
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/admin/briefings");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return { success: false, error: "Erro ao atualizar status." };
    }
}
