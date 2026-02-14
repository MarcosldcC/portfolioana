"use client";

import { useState, useEffect, use } from "react";
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
    Pencil,
    ChevronLeft,
    ChevronRight,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type TaskStatus = "todo" | "doing" | "pending" | "done";

interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    startDate?: string;
    endDate?: string;
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
    type: "post" | "story" | "reels" | "task";
}

// Mock Data - Start empty
const initialTasks: Task[] = [];

const initialLinks: LinkResource[] = [];

const initialEvents: CalendarEvent[] = [];

export default function ProjectHubPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [links, setLinks] = useState<LinkResource[]>(initialLinks);
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [notes, setNotes] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
    const [hasDeadline, setHasDeadline] = useState(false);
    const [taskStartDate, setTaskStartDate] = useState<string>("");
    const [taskEndDate, setTaskEndDate] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkResource | null>(null);
    const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Help function to parse date strings safely
    const parseDateSafely = (dateStr: string | Date) => {
        if (dateStr instanceof Date) return dateStr;
        if (!dateStr) return new Date();
        // If it's a YYYY-MM-DD string, append T12:00:00 to avoid UTC timezone shifts
        const cleanDate = dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`;
        return new Date(cleanDate);
    };

    // Load project data
    useEffect(() => {
        async function loadProject() {
            const { getProjectById } = await import("@/app/actions/projects");
            const data = await getProjectById(id);
            if (data) {
                setProject(data);
                // Load tasks, links, events, and notes from database
                if (data.tasks) setTasks(data.tasks);
                if (data.links) setLinks(data.links);
                if (data.events) {
                    // Convert date strings back to Date objects safely
                    const parsedEvents = data.events.map((e: any) => ({
                        ...e,
                        date: parseDateSafely(e.date)
                    }));
                    setEvents(parsedEvents);
                }
                if (data.notes) setNotes(data.notes);
            }
        }
        loadProject();
    }, [id]);

    // Auto-save notes with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (project && notes !== project.notes) {
                saveProjectData({ notes });
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [notes]);

    // Kanban Columns
    const columns: { id: TaskStatus; label: string; color: string }[] = [
        { id: "todo", label: "A Fazer", color: "bg-slate/10 text-slate" },
        { id: "doing", label: "Fazendo", color: "bg-rose/10 text-rose" },
        { id: "pending", label: "Pendente", color: "bg-orange-100 text-orange-600" },
        { id: "done", label: "Concluído", color: "bg-green-100 text-green-600" },
    ];

    // Save project data to database
    const saveProjectData = async (updates: {
        tasks?: Task[];
        links?: LinkResource[];
        events?: CalendarEvent[];
        notes?: string;
    }) => {
        try {
            const { updateProjectData } = await import("@/app/actions/projects");
            const result = await updateProjectData(id, updates);
            if (result.success) {
                router.refresh();
                return true;
            } else {
                toast.error(result.error || "Erro ao salvar dados");
                return false;
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error("Erro de conexão ao salvar dados");
            return false;
        }
    };

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
                saveProjectData({ tasks: newTasks });
                toast.success("Tarefa movida!");
            }
        }
    };

    const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            status: newTaskStatus,
            startDate: hasDeadline && taskStartDate ? taskStartDate : undefined,
            endDate: hasDeadline && taskEndDate ? taskEndDate : undefined,
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);

        // If task has an end date, add it to the calendar
        let updatedEvents = events;
        if (hasDeadline && taskEndDate) {
            const newEvent: CalendarEvent = {
                id: crypto.randomUUID(),
                title: `📋 ${newTask.title}`,
                date: parseDateSafely(taskEndDate),
                type: "task"
            };
            updatedEvents = [...events, newEvent];
            setEvents(updatedEvents);
        }

        // Save to database
        const success = await saveProjectData({ tasks: updatedTasks, events: updatedEvents });

        if (success) {
            toast.success("Tarefa adicionada!");
            (e.target as HTMLFormElement).reset();
            setNewTaskStatus("todo"); // Reset to default
            setHasDeadline(false);
            setTaskStartDate("");
            setTaskEndDate("");
        }
    };

    const deleteTask = async (taskId: string) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
        setSelectedTask(null);
        await saveProjectData({ tasks: updatedTasks });
        toast.success("Tarefa excluída!");
    };

    const openEditDialog = (task: Task) => {
        setEditingTask(task);
        setNewTaskStatus(task.status);
        setHasDeadline(!!(task.startDate || task.endDate));
        setTaskStartDate(task.startDate || "");
        setTaskEndDate(task.endDate || "");
        setIsEditDialogOpen(true);
        setSelectedTask(null);
    };

    const updateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTask) return;

        const formData = new FormData(e.currentTarget);
        const updatedTask: Task = {
            ...editingTask,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            status: newTaskStatus,
            startDate: hasDeadline && taskStartDate ? taskStartDate : undefined,
            endDate: hasDeadline && taskEndDate ? taskEndDate : undefined,
        };

        const updatedTasks = tasks.map(t => t.id === editingTask.id ? updatedTask : t);
        setTasks(updatedTasks);

        // Update calendar event if end date changed
        let updatedEvents = events;
        if (hasDeadline && taskEndDate) {
            const existingEventIndex = events.findIndex(e => e.title.includes(editingTask.title));
            if (existingEventIndex !== -1) {
                updatedEvents = [...events];
                updatedEvents[existingEventIndex] = {
                    ...updatedEvents[existingEventIndex],
                    title: `📋 ${updatedTask.title}`,
                    date: parseDateSafely(taskEndDate)
                };
                setEvents(updatedEvents);
            } else {
                updatedEvents = [...events, {
                    id: crypto.randomUUID(),
                    title: `📋 ${updatedTask.title}`,
                    date: parseDateSafely(taskEndDate),
                    type: "task"
                }];
                setEvents(updatedEvents);
            }
        }


        const success = await saveProjectData({ tasks: updatedTasks, events: updatedEvents });

        if (success) {
            toast.success("Tarefa atualizada!");
            setIsEditDialogOpen(false);
            setEditingTask(null);
            setNewTaskStatus("todo");
            setHasDeadline(false);
            setTaskStartDate("");
            setTaskEndDate("");
        }
    };

    const addLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newLink: LinkResource = {
            id: Math.random().toString(),
            title: formData.get("title") as string,
            url: formData.get("url") as string,
            type: "other",
        };
        const updatedLinks = [...links, newLink];
        setLinks(updatedLinks);
        const success = await saveProjectData({ links: updatedLinks });
        if (success) {
            toast.success("Link salvo!");
            (e.target as HTMLFormElement).reset();
        }
    };

    const deleteLink = async (linkId: string) => {
        const updatedLinks = links.filter(l => l.id !== linkId);
        setLinks(updatedLinks);
        const success = await saveProjectData({ links: updatedLinks });
        if (success) {
            toast.success("Link excluído!");
        }
    };

    const openEditLinkDialog = (link: LinkResource) => {
        setEditingLink(link);
        setIsEditLinkDialogOpen(true);
    };

    const updateLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingLink) return;

        const formData = new FormData(e.currentTarget);
        const updatedLink: LinkResource = {
            ...editingLink,
            title: formData.get("title") as string,
            url: formData.get("url") as string,
        };

        const updatedLinks = links.map(l => l.id === editingLink.id ? updatedLink : l);
        setLinks(updatedLinks);

        const success = await saveProjectData({ links: updatedLinks });

        if (success) {
            toast.success("Link atualizado!");
            setIsEditLinkDialogOpen(false);
            setEditingLink(null);
        }
    };

    const addEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!date) return;

        const newEvent: CalendarEvent = {
            id: Math.random().toString(),
            title: formData.get("title") as string,
            date: date,
            type: "post"
        }
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
        const success = await saveProjectData({ events: updatedEvents });
        if (success) {
            toast.success("Evento agendado!");
            (e.target as HTMLFormElement).reset();
        }
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
                        <h2 className="text-3xl font-bold tracking-tight text-ink">
                            {project ? project.title : "Carregando..."}
                        </h2>
                        <p className="text-muted-foreground">
                            {project ? project.description || "Gerenciamento do Projeto" : "Gerenciamento do Projeto"}
                        </p>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={newTaskStatus} onValueChange={(value) => setNewTaskStatus(value as TaskStatus)}>
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">A Fazer</SelectItem>
                                                <SelectItem value="doing">Fazendo</SelectItem>
                                                <SelectItem value="pending">Pendente</SelectItem>
                                                <SelectItem value="done">Concluído</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Deadline Option */}
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="hasDeadline"
                                            checked={hasDeadline}
                                            onCheckedChange={(checked) => {
                                                setHasDeadline(checked as boolean);
                                                if (!checked) {
                                                    setTaskStartDate("");
                                                    setTaskEndDate("");
                                                }
                                            }}
                                        />
                                        <Label htmlFor="hasDeadline" className="cursor-pointer">
                                            Adicionar prazo
                                        </Label>
                                    </div>

                                    {hasDeadline && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="startDate">Data de Início</Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={taskStartDate}
                                                    onChange={(e) => setTaskStartDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="endDate">Data de Término</Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={taskEndDate}
                                                    min={taskStartDate || undefined}
                                                    onChange={(e) => setTaskEndDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

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
                                                                    className="cursor-pointer shadow-sm transition-all hover:shadow-md bg-white select-none"
                                                                    style={{ ...provided.draggableProps.style }}
                                                                    onClick={() => setSelectedTask(task)}
                                                                >
                                                                    <CardContent className="p-3">
                                                                        <div className="flex justify-between items-start">
                                                                            <h4 className="font-medium text-sm text-ink">{task.title}</h4>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger
                                                                                    className="pt-0.5 hover:bg-muted rounded p-1"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                >
                                                                                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setSelectedTask(task);
                                                                                    }}>
                                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                                        Ver detalhes
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        openEditDialog(task);
                                                                                    }}>
                                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                                        Editar
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        className="text-red-600"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            deleteTask(task.id);
                                                                                        }}
                                                                                    >
                                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                                        Excluir
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                                                        {(task.startDate || task.endDate) && (
                                                                            <div className="mt-2 flex items-center gap-1 text-xs text-rose">
                                                                                <Clock className="h-3 w-3" />
                                                                                <span>
                                                                                    {task.startDate && new Date(task.startDate).toLocaleDateString('pt-BR')}
                                                                                    {task.startDate && task.endDate && ' - '}
                                                                                    {task.endDate && new Date(task.endDate).toLocaleDateString('pt-BR')}
                                                                                </span>
                                                                            </div>
                                                                        )}
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
                                    month={currentMonth}
                                    onMonthChange={setCurrentMonth}
                                    captionLayout="dropdown-buttons"
                                    fromYear={2024}
                                    toYear={2030}
                                    className="rounded-md border p-3 w-fit"
                                    classNames={{
                                        day_selected: "bg-rose text-white hover:bg-rose hover:text-white focus:bg-rose focus:text-white rounded-md",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground",
                                        caption_label: "hidden",
                                        caption_dropdowns: "flex gap-2 justify-center w-full",
                                        vhidden: "hidden",
                                        dropdown: "bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer overflow-y-auto max-h-[200px]"
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
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => window.open(link.url, '_blank')}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditLinkDialog(link)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => deleteLink(link.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Dialog open={isEditLinkDialogOpen} onOpenChange={setIsEditLinkDialogOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Link</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={updateLink} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-link-title">Título</Label>
                                                <Input
                                                    id="edit-link-title"
                                                    name="title"
                                                    key={editingLink?.id}
                                                    defaultValue={editingLink?.title}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-link-url">URL</Label>
                                                <Input
                                                    id="edit-link-url"
                                                    name="url"
                                                    key={editingLink?.id + '-url'}
                                                    defaultValue={editingLink?.url}
                                                    placeholder="https://"
                                                    required
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Salvar Alterações</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
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
                                <Button variant="link" onClick={() => router.push(`/admin/projetos/${id}/edit`)}>Ir para Edição Completa</Button>
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Task Details Modal */}
            <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0">
                        <DialogTitle className="text-2xl">{selectedTask?.title}</DialogTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hover:bg-muted rounded p-2">
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => selectedTask && openEditDialog(selectedTask)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar tarefa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => selectedTask && deleteTask(selectedTask.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir tarefa
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DialogHeader>
                    {selectedTask && (
                        <div className="space-y-4 overflow-y-auto pr-2 max-h-[60vh]">
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Status</h4>
                                <Badge className={
                                    selectedTask.status === "done" ? "bg-green-100 text-green-600" :
                                        selectedTask.status === "doing" ? "bg-rose/10 text-rose" :
                                            selectedTask.status === "pending" ? "bg-orange-100 text-orange-600" :
                                                "bg-slate/10 text-slate"
                                }>
                                    {selectedTask.status === "done" && "Concluído"}
                                    {selectedTask.status === "doing" && "Fazendo"}
                                    {selectedTask.status === "pending" && "Pendente"}
                                    {selectedTask.status === "todo" && "A Fazer"}
                                </Badge>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Descrição</h4>
                                <p className="text-sm whitespace-pre-wrap break-words">{selectedTask.description}</p>
                            </div>

                            {(selectedTask.startDate || selectedTask.endDate) && (
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Prazo</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedTask.startDate && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Início</p>
                                                    <p className="text-sm font-medium">
                                                        {new Date(selectedTask.startDate).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedTask.endDate && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-rose" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Término</p>
                                                    <p className="text-sm font-medium text-rose">
                                                        {new Date(selectedTask.endDate).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedTask(null)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Task Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Tarefa</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={updateTask} className="space-y-4">
                        <div>
                            <Label htmlFor="edit-title">Título</Label>
                            <Input
                                id="edit-title"
                                name="title"
                                defaultValue={editingTask?.title}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-description">Descrição</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                defaultValue={editingTask?.description}
                                className="min-h-[80px]"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={newTaskStatus} onValueChange={(value) => setNewTaskStatus(value as TaskStatus)}>
                                <SelectTrigger id="edit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">A Fazer</SelectItem>
                                    <SelectItem value="doing">Fazendo</SelectItem>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="done">Concluído</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Deadline Option */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-hasDeadline"
                                checked={hasDeadline}
                                onCheckedChange={(checked) => {
                                    setHasDeadline(checked as boolean);
                                    if (!checked) {
                                        setTaskStartDate("");
                                        setTaskEndDate("");
                                    }
                                }}
                            />
                            <Label htmlFor="edit-hasDeadline" className="cursor-pointer">
                                Adicionar prazo
                            </Label>
                        </div>

                        {hasDeadline && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-startDate">Data de Início</Label>
                                    <Input
                                        id="edit-startDate"
                                        type="date"
                                        value={taskStartDate}
                                        onChange={(e) => setTaskStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-endDate">Data de Término</Label>
                                    <Input
                                        id="edit-endDate"
                                        type="date"
                                        value={taskEndDate}
                                        min={taskStartDate || undefined}
                                        onChange={(e) => setTaskEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
