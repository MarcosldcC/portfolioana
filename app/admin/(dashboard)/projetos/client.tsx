"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, LayoutDashboard, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger // Added trigger if needed, but managing state manually
} from "@/components/ui/dialog";
import { useState } from "react";
import { deleteProject, createProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";

export interface Project {
    id: string;
    title: string;
    category: string;
    status: string;
    date: string;
    image_url?: string;
    description?: string;
}

interface ProjectsClientProps {
    initialProjects: Project[];
}

const formSchema = z.object({
    title: z.string().min(2, {
        message: "O título deve ter pelo menos 2 caracteres.",
    }),
    category: z.string().min(2, {
        message: "A categoria deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().min(5, {
        message: "A descrição deve ter pelo menos 5 caracteres.",
    }).max(50, {
        message: "A descrição deve ter no máximo 50 caracteres (frase curta).",
    }),
    status: z.enum(["Concluído", "Em andamento", "Pausado", "Rascunho"], {
        required_error: "Selecione um status.",
    }),
    image: z.string().url({
        message: "Por favor, insira uma URL de imagem válida.",
    }).optional().or(z.literal("")),
});

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category: "",
            description: "",
            status: "Concluído",
            image: "",
        },
    });

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const confirmDelete = (id: string) => {
        setDeleteId(id);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const result = await deleteProject(deleteId);
        if (result.success) {
            toast.success("Projeto excluído com sucesso!");
            setProjects(projects.filter(p => p.id !== deleteId));
            router.refresh();
        } else {
            toast.error("Erro ao excluir projeto.");
        }
        setDeleteId(null);
    };

    async function onCreateSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("category", values.category);
        formData.append("description", values.description);
        formData.append("status", values.status);
        if (values.image) formData.append("image_url", values.image);

        const result = await createProject(formData);

        if (result.success && result.project) {
            toast.success("Projeto criado com sucesso!");
            // Add the new project to the state immediately
            setProjects([result.project, ...projects]);
            form.reset();
            setIsCreateOpen(false);
            router.refresh();
        } else {
            toast.error("Erro ao criar projeto.");
            console.error(result.error);
        }
        setIsSubmitting(false);
    }

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-ink">Projetos</h2>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => {
                            form.reset();
                            setIsCreateOpen(true);
                        }}
                        className="bg-rose hover:bg-rose/90 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrar projetos..."
                            className="pl-8 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Data</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Nenhum projeto encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProjects.map((project) => (
                                <TableRow
                                    key={project.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => router.push(`/admin/projetos/${project.id}`)}
                                >
                                    <TableCell className="font-medium">{formatDate(project.date)}</TableCell>
                                    <TableCell>{project.title}</TableCell>
                                    <TableCell>{project.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={project.status === "publicado" || project.status === "Concluído" ? "default" : "secondary"}>
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/admin/projetos/${project.id}`)}>
                                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Gerenciar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/admin/projetos/${project.id}/edit`)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmDelete(project.id);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Project Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Novo Projeto</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do novo projeto abaixo.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título do Projeto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Campanha de Verão" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoria</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Social Media" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição (frase curta)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Identidade visual completa"
                                                maxLength={50}
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            {field.value?.length || 0}/50 caracteres
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Imagem de Capa (Opcional)</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload da imagem de capa do projeto.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                                <Button type="submit" className="bg-rose hover:bg-rose/90 text-white" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Criar Projeto
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Projeto</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir este projeto? Essa ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
