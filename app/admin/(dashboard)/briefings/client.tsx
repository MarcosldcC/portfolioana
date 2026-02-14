"use client";

import { useState } from "react";
import {
    FileText,
    Search,
    ChevronDown,
    ChevronUp,
    Mail,
    Calendar,
    User,
    MessageSquare,
    Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HalftonePattern } from "@/components/decorative-elements";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendEmail } from "@/app/actions/send-email";
import { updateMessageStatus } from "@/app/actions/contact";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBriefingReplyTemplate } from "@/lib/email-templates";

type BriefingStatus = "novo" | "lido" | "arquivado";

export interface Briefing {
    id: string; // Changed to string (UUID)
    name: string;
    email: string;
    created_at: string; // Changed from date string to created_at
    message: string;
    status: BriefingStatus;
}

const statusConfig: Record<
    string, // relaxed type to handle potential database values
    { label: string; bg: string; text: string }
> = {
    novo: { label: "Novo", bg: "bg-rose/15", text: "text-rose" },
    lido: { label: "Lido", bg: "bg-moss/15", text: "text-moss" },
    arquivado: { label: "Arquivado", bg: "bg-muted", text: "text-muted-foreground" },
};

interface BriefingsClientProps {
    initialBriefings: Briefing[];
}

export default function BriefingsClient({ initialBriefings }: BriefingsClientProps) {
    // We can use local state for immediate updates, but we should also rely on revalidation
    const [briefings, setBriefings] = useState<Briefing[]>(initialBriefings);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<BriefingStatus | "todos">("todos");
    const router = useRouter();

    // Reply Dialog State
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Briefing | null>(null);
    const [replySubject, setReplySubject] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Sync state with props if server data changes (optional, but good for revalidation)
    // useEffect(() => { setBriefings(initialBriefings); }, [initialBriefings]);

    const filtered = briefings.filter((b) => {
        const matchesSearch =
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "todos" || b.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const markAsRead = async (id: string) => {
        // Optimistic update
        setBriefings((prev) =>
            prev.map((b) =>
                b.id === id && b.status === "novo" ? { ...b, status: "lido" as BriefingStatus } : b
            )
        );

        // Server update
        const result = await updateMessageStatus(id, "lido");
        if (!result.success) {
            toast.error("Erro ao atualizar status");
            // Revert if error? For now simple optimistic
        } else {
            router.refresh(); // Refresh server data
        }
    };

    const archiveBriefing = async (id: string) => {
        // Optimistic update
        setBriefings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "arquivado" as BriefingStatus } : b))
        );

        // Server update
        const result = await updateMessageStatus(id, "arquivado");
        if (!result.success) {
            toast.error("Erro ao arquivar");
        } else {
            router.refresh();
        }
    };

    const newCount = briefings.filter((b) => b.status === "novo").length;

    const handleReplyClick = (briefing: Briefing) => {
        setReplyingTo(briefing);
        setReplySubject(`Re: Contato Portfolio`);
        setReplyMessage(`Obrigado pelo seu contato.\n\n`);
        setReplyOpen(true);
    };

    const handleSendEmail = async () => {
        if (!replyingTo || !replyMessage || !replySubject) return;

        setIsSending(true);
        try {
            const htmlContent = getBriefingReplyTemplate(replyingTo.name, replyMessage);

            const result = await sendEmail({
                to: replyingTo.email,
                subject: replySubject,
                message: replyMessage,
                replyTo: "no-reply@portfolio.com",
                html: htmlContent
            });

            if (!result.success) {
                console.error(result.error);
                toast.error("Erro ao enviar. Verifique as credenciais no console/servidor.");
            } else {
                toast.success("Resposta enviada com sucesso!");
                setReplyOpen(false);
                setReplyingTo(null);
                markAsRead(replyingTo.id);
            }

        } catch (error) {
            toast.error("Erro ao enviar e-mail.");
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-ink">
                    Area de Briefings
                </h1>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                    Briefings recebidos pelo formulario de contato do portfolio.
                    {newCount > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-rose/15 px-2 py-0.5 font-bold text-rose">
                            {newCount} {newCount === 1 ? "novo" : "novos"}
                        </span>
                    )}
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou mensagem..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 font-sans text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-rose focus:ring-2 focus:ring-rose/20"
                    />
                </div>
                <div className="flex gap-2">
                    {(["todos", "novo", "lido", "arquivado"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "rounded-lg px-3 py-2 font-sans text-xs font-bold transition-all",
                                filterStatus === status
                                    ? "bg-ink text-white"
                                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {status === "todos"
                                ? "Todos"
                                : statusConfig[status].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Halftone divider */}
            <div className="flex items-center justify-center opacity-15">
                <HalftonePattern className="h-4 w-full" />
            </div>

            {/* Briefing list */}
            <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background/60 py-16 backdrop-blur-sm">
                        <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="font-sans text-sm text-muted-foreground">
                            Nenhum briefing encontrado.
                        </p>
                    </div>
                ) : (
                    filtered.map((briefing) => {
                        const isExpanded = expandedId === briefing.id;
                        const config = statusConfig[briefing.status] || statusConfig['novo'];

                        return (
                            <div
                                key={briefing.id}
                                className={cn(
                                    "overflow-hidden rounded-xl border bg-background/60 backdrop-blur-sm transition-all",
                                    briefing.status === "novo"
                                        ? "border-rose/30"
                                        : "border-border"
                                )}
                            >
                                {/* Summary row */}
                                <button
                                    onClick={() => {
                                        setExpandedId(isExpanded ? null : briefing.id);
                                        if (!isExpanded && briefing.status === 'novo') markAsRead(briefing.id);
                                    }}
                                    className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/30"
                                >
                                    {/* Info */}
                                    <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                                        <span
                                            className={cn(
                                                "font-sans text-sm text-ink",
                                                briefing.status === "novo" ? "font-bold" : ""
                                            )}
                                        >
                                            {briefing.name}
                                        </span>
                                    </div>

                                    {/* Status + date */}
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn(
                                                "hidden rounded-full px-2 py-0.5 font-sans text-[10px] font-bold sm:inline",
                                                config.bg,
                                                config.text
                                            )}
                                        >
                                            {config.label}
                                        </span>
                                        <span className="font-sans text-xs text-muted-foreground">
                                            {formatDate(briefing.created_at)}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded content */}
                                {isExpanded && (
                                    <div className="border-t border-border px-4 pb-4 pt-4">
                                        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-sans text-[10px] text-muted-foreground">
                                                        Nome
                                                    </p>
                                                    <p className="font-sans text-sm font-bold text-ink">
                                                        {briefing.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-sans text-[10px] text-muted-foreground">
                                                        E-mail
                                                    </p>
                                                    <p className="font-sans text-sm text-ink">
                                                        {briefing.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex items-start gap-2">
                                            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="mb-1 font-sans text-[10px] text-muted-foreground">
                                                    Mensagem
                                                </p>
                                                <p className="font-sans text-sm leading-relaxed text-foreground">
                                                    {briefing.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-sans text-xs text-muted-foreground">
                                                Recebido em {formatDate(briefing.created_at)}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleReplyClick(briefing)}
                                                className="rounded-lg bg-rose px-4 py-2 font-sans text-sm font-bold text-white transition-all hover:opacity-90"
                                            >
                                                Responder
                                            </button>
                                            <button
                                                onClick={() => archiveBriefing(briefing.id)}
                                                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 font-sans text-sm font-bold text-ink transition-all hover:bg-muted"
                                            >
                                                <Archive className="h-4 w-4" />
                                                Arquivar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Reply Dialog */}
            <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Responder Briefing</DialogTitle>
                        <DialogDescription>
                            Enviando resposta para {replyingTo?.name} ({replyingTo?.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subject">Assunto</Label>
                            <Input
                                id="subject"
                                value={replySubject}
                                onChange={(e) => setReplySubject(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Mensagem</Label>
                            <Textarea
                                id="message"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="min-h-[200px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSendEmail} disabled={isSending} className="bg-rose hover:bg-rose/90 text-white">
                            {isSending ? "Enviando..." : "Enviar Resposta"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
