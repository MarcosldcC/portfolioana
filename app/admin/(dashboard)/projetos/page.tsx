"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, LayoutDashboard } from "lucide-react";
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

// Mock data based on portfolio-section.tsx
const projects = [
    {
        id: 1,
        title: "Branding Café Artesanal",
        category: "Identidade Visual",
        status: "Concluído",
        date: "10/02/2024",
    },
    {
        id: 2,
        title: "Lançamento Moda Sustentável",
        category: "Estratégia & Conteúdo",
        status: "Em andamento",
        date: "05/03/2024",
    },
    {
        id: 3,
        title: "Studio de Beleza Premium",
        category: "Gestão de Redes",
        status: "Concluído",
        date: "20/01/2024",
    },
    {
        id: 4,
        title: "Restaurante Gastronômico",
        category: "Criação de Conteúdo",
        status: "Pausado",
        date: "15/12/2023",
    },
];

export default function ProjectsPage() {
    const router = useRouter();

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-ink">Projetos</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/admin/projetos/new">
                        <Button className="bg-rose hover:bg-rose/90 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Novo Projeto
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrar projetos..."
                            className="pl-8 bg-white"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow
                                key={project.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/admin/projetos/${project.id}`)}
                            >
                                <TableCell className="font-medium">{project.id}</TableCell>
                                <TableCell>{project.title}</TableCell>
                                <TableCell>{project.category}</TableCell>
                                <TableCell>
                                    <Badge variant={project.status === "Concluído" ? "default" : "secondary"}>
                                        {project.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{project.date}</TableCell>
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
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
