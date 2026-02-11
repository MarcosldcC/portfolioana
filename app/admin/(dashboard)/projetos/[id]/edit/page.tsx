"use client";
import EditProjectPage from "@/app/admin/(dashboard)/projetos/[id]/page"; // Reuse the edit page logic if it was a standalone file, but it's not. I need to copy-paste the old logic here.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "O título deve ter pelo menos 2 caracteres.",
    }),
    category: z.string().min(2, {
        message: "A categoria deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().min(10, {
        message: "A descrição deve ter pelo menos 10 caracteres.",
    }),
    status: z.enum(["Concluído", "Em andamento", "Pausado", "Rascunho"], {
        required_error: "Selecione um status.",
    }),
    image: z.string().url({
        message: "Por favor, insira uma URL de imagem válida.",
    }).optional().or(z.literal("")),
});

// Mock data
const mockProjects = {
    "1": {
        title: "Branding Café Artesanal",
        category: "Identidade Visual",
        description: "Redesign completo da presença digital com aumento de 180% no engajamento.",
        status: "Concluído",
        image: "/images/portfolio-1.jpg",
    },
    "2": {
        title: "Lançamento Moda Sustentável",
        category: "Estratégia & Conteúdo",
        description: "Campanha de lançamento com alcance orgânico de 50k em 30 dias.",
        status: "Em andamento",
        image: "/images/portfolio-2.jpg",
    },
    "3": {
        title: "Studio de Beleza Premium",
        category: "Gestão de Redes",
        description: "Crescimento de 300% em seguidores qualificados em 6 meses.",
        status: "Concluído",
        image: "/images/portfolio-3.jpg",
    },
    "4": {
        title: "Restaurante Gastronômico",
        category: "Criação de Conteúdo",
        description: "Produção de conteúdo visual que triplicou as reservas online.",
        status: "Pausado",
        image: "/images/portfolio-4.jpg",
    },
};

export default function EditProjectFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isNew = params.id === "new";
    const defaultValues = !isNew && mockProjects[params.id as keyof typeof mockProjects]
        ? mockProjects[params.id as keyof typeof mockProjects]
        : {
            title: "",
            category: "",
            description: "",
            status: "Rascunho",
            image: "",
        };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues as any,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(values);
        toast.success(isNew ? "Projeto criado com sucesso!" : "Projeto atualizado com sucesso!");
        router.push(`/admin/projetos/${params.id}`);
        setIsSubmitting(false);
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight text-ink">
                        {isNew ? "Novo Projeto" : "Editar Projeto"}
                    </h2>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Detalhes do Projeto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Rascunho">Rascunho</SelectItem>
                                                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                                                        <SelectItem value="Concluído">Concluído</SelectItem>
                                                        <SelectItem value="Pausado">Pausado</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descreva o projeto..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL da Imagem (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Link para a imagem de capa do projeto.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-rose hover:bg-rose/90 text-white" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Salvar Projeto
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
