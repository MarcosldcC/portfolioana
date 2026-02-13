"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Instagram,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Post } from "@/app/actions/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPost, updatePost, deletePost } from "@/app/actions/calendar";

type PostType = "feed" | "stories" | "reels" | "carousel" | "task" | "event";
type PostStatus = "agendado" | "publicado" | "rascunho";

const typeConfig: Record<string, { label: string; color: string }> = {
    feed: { label: "Feed", color: "bg-rose" },
    stories: { label: "Stories", color: "bg-moss" },
    reels: { label: "Reels", color: "bg-secondary" }, // Changed slate (grey) to secondary (pink/soft)
    carousel: { label: "Carousel", color: "bg-ink" },
    task: { label: "Tarefa", color: "bg-amber-500" },
    event: { label: "Evento", color: "bg-blue-500" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
    agendado: { label: "Agendado", color: "text-moss" },
    publicado: { label: "Publicado", color: "text-secondary" }, // Changed slate to secondary
    rascunho: { label: "Rascunho", color: "text-muted-foreground" }, // Muted-foreground is now dark grey-ish (#6B6B6B) which is allowed as Text Secondary
};

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

interface CalendarioClientProps {
    initialPosts: Post[];
    currentMonth: number;
    currentYear: number;
}

export default function CalendarioClient({ initialPosts, currentMonth, currentYear }: CalendarioClientProps) {
    const router = useRouter();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const now = new Date(); // Client-side "today" for highlighting

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        router.push(`?month=${newMonth}&year=${newYear}`);
    };

    const nextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        router.push(`?month=${newMonth}&year=${newYear}`);
    };

    const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
        "pt-BR",
        { month: "long", year: "numeric" }
    );

    const getPostsForDay = (day: number) => {
        return initialPosts.filter(p => {
            const postDate = new Date(p.date);
            return postDate.getDate() === day;
        });
    };

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return "";
        }
    }

    const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const postData = {
            client: formData.get("client"),
            type: formData.get("type"),
            status: formData.get("status"),
            date: `${formData.get("date")}T${formData.get("time") || "00:00"}:00`,
            caption: formData.get("caption"),
        };

        const result = await createPost(postData);
        setLoading(false);
        if (result.success) {
            toast.success("Post criado com sucesso!");
            setIsCreateDialogOpen(false);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };

    const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedPost) return;
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const postData = {
            client: formData.get("client"),
            type: formData.get("type"),
            status: formData.get("status"),
            date: `${formData.get("date")}T${formData.get("time") || "00:00"}:00`,
            caption: formData.get("caption"),
        };

        const result = await updatePost(selectedPost.id, postData);
        setLoading(false);
        if (result.success) {
            toast.success("Post atualizado com sucesso!");
            setIsEditing(false);
            setSelectedPost(null);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };

    const handleDeletePost = async () => {
        if (!selectedPost) return;
        if (!confirm("Tem certeza que deseja excluir este post?")) return;

        setLoading(true);
        const result = await deletePost(selectedPost.id);
        setLoading(false);
        if (result.success) {
            toast.success("Post excluído com sucesso!");
            setSelectedPost(null);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-ink">
                        Calendario de Conteudo
                    </h1>
                    <p className="mt-1 font-sans text-sm text-muted-foreground">
                        Planeje e agende publicacoes para seus clientes.
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="flex w-fit items-center gap-2 rounded-lg bg-rose px-5 py-2.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90">
                            <Plus className="h-4 w-4" />
                            Novo Post
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Novo Post</DialogTitle>
                            <DialogDescription>Agende um novo conteúdo para o calendário.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreatePost} className="space-y-4 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="client">Cliente</Label>
                                <Input id="client" name="client" required placeholder="Nome do cliente" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Select name="type" defaultValue="feed">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(typeConfig).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" defaultValue="agendado">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statusConfig).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Data</Label>
                                    <Input id="date" name="date" type="date" required
                                        defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Hora</Label>
                                    <Input id="time" name="time" type="time" required defaultValue="12:00" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="caption">Legenda / Descrição</Label>
                                <Textarea id="caption" name="caption" placeholder="O que será postado?" />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-rose hover:bg-rose/90 text-white" disabled={loading}>
                                    {loading ? "Salvando..." : "Criar Post"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Type legend */}
            <div className="flex flex-wrap gap-3">
                {(Object.keys(typeConfig) as PostType[]).map((type) => (
                    <span
                        key={type}
                        className="flex items-center gap-2 font-sans text-xs text-muted-foreground"
                    >
                        <span
                            className={cn(
                                "inline-block h-2.5 w-2.5 rounded-sm",
                                typeConfig[type].color
                            )}
                        />
                        {typeConfig[type].label}
                    </span>
                ))}
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-5 py-3 backdrop-blur-sm">
                <button
                    onClick={prevMonth}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Mes anterior"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Select
                        value={currentMonth.toString()}
                        onValueChange={(val) => {
                            router.push(`?month=${val}&year=${currentYear}`);
                        }}
                    >
                        <SelectTrigger className="w-[140px] border-none bg-transparent font-serif text-lg font-bold capitalize text-ink focus:ring-0">
                            <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                    {new Date(2024, i).toLocaleDateString("pt-BR", { month: "long" })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={currentYear.toString()}
                        onValueChange={(val) => {
                            router.push(`?month=${currentMonth}&year=${val}`);
                        }}
                    >
                        <SelectTrigger className="w-[100px] border-none bg-transparent font-serif text-lg font-bold text-ink focus:ring-0">
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 11 }).map((_, i) => {
                                const year = 2024 + i;
                                return (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <button
                    onClick={nextMonth}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Proximo mes"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Calendar grid */}
            <div className="overflow-hidden rounded-xl border border-border bg-background/60 backdrop-blur-sm">
                {/* Days header */}
                <div className="grid grid-cols-7 border-b border-border">
                    {DAYS_OF_WEEK.map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center font-sans text-xs font-bold text-muted-foreground"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7">
                    {/* Empty cells for offset */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="min-h-[100px] border-b border-r border-border bg-muted/30 p-2"
                        />
                    ))}
                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const posts = getPostsForDay(day);
                        const isToday =
                            day === now.getDate() &&
                            currentMonth === now.getMonth() &&
                            currentYear === now.getFullYear();

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "min-h-[100px] border-b border-r border-border p-2 transition-colors",
                                    isToday && "bg-rose/5"
                                )}
                            >
                                <span
                                    className={cn(
                                        "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full font-sans text-xs",
                                        isToday
                                            ? "bg-rose font-bold text-white"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {day}
                                </span>
                                <div className="flex flex-col gap-1">
                                    {posts.map((post) => (
                                        <button
                                            key={post.id}
                                            onClick={() => setSelectedPost(post)}
                                            className={cn(
                                                "flex items-center gap-1 rounded px-1.5 py-0.5 text-left text-[10px] font-bold text-white transition-all hover:opacity-80",
                                                typeConfig[post.type]?.color || "bg-gray-500"
                                            )}
                                        >
                                            <span className="truncate">{post.client}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Post detail modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg text-white",
                                        typeConfig[selectedPost.type]?.color || "bg-gray-500"
                                    )}
                                >
                                    <Instagram className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-sans text-sm font-bold text-ink">
                                        {selectedPost.client}
                                    </h3>
                                    <span
                                        className={cn(
                                            "font-sans text-xs font-bold",
                                            statusConfig[selectedPost.status]?.color || "text-gray-500"
                                        )}
                                    >
                                        {statusConfig[selectedPost.status]?.label || selectedPost.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedPost(null);
                                    setIsEditing(false);
                                }}
                                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label="Fechar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 font-sans text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatTime(selectedPost.date)}
                                </span>
                                <span
                                    className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
                                        typeConfig[selectedPost.type]?.color || "bg-gray-500"
                                    )}
                                >
                                    {typeConfig[selectedPost.type]?.label || selectedPost.type}
                                </span>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdatePost} className="space-y-4 pt-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-client">Cliente</Label>
                                        <Input id="edit-client" name="client" defaultValue={selectedPost.client} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-type">Tipo</Label>
                                            <Select name="type" defaultValue={selectedPost.type}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(typeConfig).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-status">Status</Label>
                                            <Select name="status" defaultValue={selectedPost.status}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(statusConfig).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-date">Data</Label>
                                            <Input id="edit-date" name="date" type="date" required
                                                defaultValue={new Date(selectedPost.date).toISOString().split('T')[0]} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-time">Hora</Label>
                                            <Input id="edit-time" name="time" type="time" required
                                                defaultValue={new Date(selectedPost.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-caption">Legenda / Descrição</Label>
                                        <Textarea id="edit-caption" name="caption" defaultValue={selectedPost.caption} />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button type="submit" className="flex-1 bg-rose hover:bg-rose/90 text-white" disabled={loading}>
                                            {loading ? "Salvando..." : "Salvar Alterações"}
                                        </Button>
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="font-sans text-sm text-foreground">
                                        {selectedPost.caption}
                                    </p>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1 rounded-lg bg-rose py-2 font-sans text-sm font-bold text-white transition-all hover:opacity-90"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={handleDeletePost}
                                            disabled={loading}
                                            className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2 font-sans text-sm font-bold text-red-600 transition-all hover:bg-red-100"
                                        >
                                            {loading ? "Excluindo..." : "Excluir"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
