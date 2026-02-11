"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    ExternalLink,
    FileText,
    LayoutDashboard,
    Link as LinkIcon,
    Plus,
    Settings,
    MoreHorizontal,
    Trash2,
} from "lucide-react";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Types
type TaskStatus = "todo" | "doing" | "pending" | "done";

interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}

interface LinkResource {
    id: string;
    title: string;
    url: string;
    type: "social" | "tool" | "other";
}

interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: "post" | "story" | "reels";
}

// Mock Data
const initialTasks: Task[] = [
    { id: "1", title: "Briefing Inicial", description: "Reunião de alinhamento com cliente", status: "done" },
    { id: "2", title: "Pesquisa de Referências", description: "Buscar inspirações visuais", status: "done" },
    { id: "3", title: "Criação de Moodboard", description: "Definir paleta de cores e tipografia", status: "doing" },
    { id: "4", title: "Desenvolvimento de Logotipo", description: "Esboços iniciais", status: "todo" },
    { id: "5", title: "Aprovação Cliente", description: "Enviar primeira versão para aprovação", status: "pending" },
];

const initialLinks: LinkResource[] = [
    { id: "1", title: "Instagram Cliente", url: "https://instagram.com", type: "social" },
    { id: "2", title: "Drive de Arquivos", url: "https://google.com/drive", type: "tool" },
];

const initialEvents: CalendarEvent[] = [
    { id: "1", title: "Post Carrossel", date: new Date(), type: "post" },
];

export default function ProjectHubPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [links, setLinks] = useState<LinkResource[]>(initialLinks);
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [notes, setNotes] = useState("Observações importantes sobre o projeto:\n- O cliente prefere tons pastéis.\n- Evitar uso de fontes serifadas em excesso.");
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Kanban Columns
    const columns: { id: TaskStatus; label: string; color: string }[] = [
        { id: "todo", label: "A Fazer", color: "bg-slate/10 text-slate" },
        { id: "doing", label: "Fazendo", color: "bg-rose/10 text-rose" },
        { id: "pending", label: "Pendente", color: "bg-orange-100 text-orange-600" },
        { id: "done", label: "Concluído", color: "bg-green-100 text-green-600" },
    ];

    // Handlers
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newTasks = Array.from(tasks);

        // If moving between columns
        if (source.droppableId !== destination.droppableId) {
            const task = newTasks.find(t => t.id === draggableId);
            if (task) {
                task.status = destination.droppableId as TaskStatus;
                setTasks(newTasks);
                toast.success("Tarefa movida!");
            }
        }
    };

    const addTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newTask: Task = {
            id: Math.random().toString(),
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            status: "todo",
        };
        setTasks([...tasks, newTask]);
        toast.success("Tarefa adicionada!");
        (e.target as HTMLFormElement).reset();
    };

    const addLink = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newLink: LinkResource = {
            id: Math.random().toString(),
            title: formData.get("title") as string,
            url: formData.get("url") as string,
            type: "other",
        };
        setLinks([...links, newLink]);
        toast.success("Link salvo!");
        (e.target as HTMLFormElement).reset();
    };

    const addEvent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!date) return;

        const newEvent: CalendarEvent = {
            id: Math.random().toString(),
            title: formData.get("title") as string,
            title: formData.get("title") as string,
            date: date,
            type: "post"
        }
        setEvents([...events, newEvent]);
        toast.success("Evento agendado!");
        (e.target as HTMLFormElement).reset();
    }

    // Ensure client-side rendering for DND
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex flex-col space-y-6 p-8 pt-6 pb-16">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-ink">Branding Café Artesanal</h2>
                        <p className="text-muted-foreground">Gerenciamento do Projeto</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="kanban" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="kanban" className="gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Quadro de Tarefas
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="gap-2">
                        <CalendarIcon className="h-4 w-4" /> Calendário Editorial
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="gap-2">
                        <LinkIcon className="h-4 w-4" /> Recursos & Anotações
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="h-4 w-4" /> Configurações
                    </TabsTrigger>
                </TabsList>

                {/* KANBAN TAB */}
                <TabsContent value="kanban" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Quadro Kanban</h3>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Nova Tarefa</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={addTask} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título</Label>
                                        <Input id="title" name="title" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrição</Label>
                                        <Textarea id="description" name="description" required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Adicionar</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {columns.map((col) => (
                                <div key={col.id} className="flex flex-col rounded-lg bg-muted/40 p-4">
                                    <div className={`mb-3 flex items-center justify-between rounded-md px-2 py-1 ${col.color}`}>
                                        <span className="font-semibold text-sm">{col.label}</span>
                                        <Badge variant="secondary" className="bg-white/50">{tasks.filter(t => t.status === col.id).length}</Badge>
                                    </div>

                                    <Droppable droppableId={col.id}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex flex-1 flex-col gap-3 min-h-[150px]"
                                            >
                                                {tasks
                                                    .filter(t => t.status === col.id)
                                                    .map((task, index) => (
                                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                                            {(provided) => (
                                                                <Card
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab shadow-sm transition-all hover:shadow-md bg-white select-none"
                                                                    style={{ ...provided.draggableProps.style }}
                                                                >
                                                                    <CardContent className="p-3">
                                                                        <div className="flex justify-between items-start">
                                                                            <h4 className="font-medium text-sm text-ink">{task.title}</h4>
                                                                            <div className="pt-0.5"><MoreHorizontal className="h-3 w-3 text-muted-foreground" /></div>
                                                                        </div>
                                                                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                                                    </CardContent>
                                                                </Card>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                {provided.placeholder}

                                                {tasks.filter(t => t.status === col.id).length === 0 && (
                                                    <div className="flex h-full items-center justify-center border border-dashed border-muted-foreground/20 rounded-md p-4">
                                                        <p className="text-xs text-muted-foreground">Arraste aqui</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </TabsContent>

                {/* CALENDAR TAB */}
                <TabsContent value="calendar" className="space-y-4">
                    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Planejamento</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center p-2 sm:p-6 gap-6">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border p-3 w-fit"
                                    classNames={{
                                        day_selected: "bg-rose text-white hover:bg-rose hover:text-white focus:bg-rose focus:text-white rounded-md",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground"
                                    }}
                                />
                                <div className="w-full max-w-xs space-y-4">
                                    <h4 className="font-medium text-sm text-center">Adicionar Evento em {date?.toLocaleDateString()}</h4>
                                    <form onSubmit={addEvent} className="space-y-3">
                                        <Input name="title" placeholder="Título do post..." required />
                                        <Button type="submit" size="sm" className="w-full bg-rose hover:bg-rose/90 text-white">Agendar</Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Próximos Posts</CardTitle>
                                <CardDescription>Visualização dos conteúdos agendados para este projeto.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    {events.sort((a, b) => a.date.getTime() - b.date.getTime()).map(event => (
                                        <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose/10 text-rose">
                                                    <CalendarIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-ink">{event.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {event.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">Agendado</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* RESOURCES TAB */}
                <TabsContent value="resources" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Links */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Links Úteis</CardTitle>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline"><Plus className="mr-2 h-4 w-4" /> Novo Link</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Adicionar Link</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={addLink} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="link-title">Título</Label>
                                                <Input id="link-title" name="title" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="link-url">URL</Label>
                                                <Input id="link-url" name="url" placeholder="https://" required />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Salvar Link</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {links.map(link => (
                                        <div key={link.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-md bg-muted p-2">
                                                    <LinkIcon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{link.title}</p>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-rose hover:underline">{link.url}</a>
                                                </div>
                                            </div>
                                            <Button size="icon" variant="ghost">
                                                <ExternalLink className="h-4 w-4" onClick={() => window.open(link.url, '_blank')} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Anotações Gerais</CardTitle>
                                <CardDescription>Bloco de notas rápido para o projeto.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    className="min-h-[300px]"
                                    placeholder="Digite suas anotações aqui..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="mt-2 text-right">
                                    <span className="text-xs text-muted-foreground">Alterações salvas automaticamente</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* SETTINGS TAB (Original Form Placeholder) */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações do Projeto</CardTitle>
                            <CardDescription>Edite as informações básicas do projeto.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center border-dashed border-2 rounded-lg m-6">
                            <p className="text-muted-foreground text-center">
                                Para editar os detalhes do projeto (título, status, etc.), <br />
                                utilize o formulário completo.
                                <br />
                                <Button variant="link" onClick={() => router.push(`/admin/projetos/${params.id}/edit`)}>Ir para Edição Completa</Button>
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
