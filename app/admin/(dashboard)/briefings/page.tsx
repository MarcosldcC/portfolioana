import { getMessages } from "@/app/actions/contact";
import BriefingsClient, { Briefing } from "./client";

export default async function BriefingsPage() {
  const messages = await getMessages();

  // Cast the message to Briefing type because database might return types that need validaton
  // In a real app we would use Zod to validate
  const formattedMessages: Briefing[] = messages.map((msg: any) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    created_at: msg.created_at,
    message: msg.message,
    status: msg.status as "novo" | "lido" | "arquivado"
  }));

  return <BriefingsClient initialBriefings={formattedMessages} />;
}
