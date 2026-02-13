'use server';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// server.ts implementation handles cookies, but sometimes redirect happens before cookies are set in response.
// Let's try to be explicit or just ensure we are waiting.
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/admin/login");
}
