"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { updateProject, createProject } from "@/app/actions/projects";

// Schema without status validation exposed to user, but we'll include it in type
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
    image: z.string().optional().or(z.literal("")),
    // Status is internal now
    status: z.string().optional(),
});

interface Project {
    id: string;
    title: string;
    category: string;
    status: string; // Keep status in type
    date: string;
    image_url?: string;
    description?: string;
}

interface ProjectFormProps {
    initialData?: Project | null;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isNew = !initialData;

    const defaultValues = initialData
        ? {
            title: initialData.title,
            category: initialData.category,
            description: initialData.description || "",
            status: initialData.status,
            image: initialData.image_url || "",
        }
        : {
            title: "",
            category: "",
            description: "",
            status: "Concluído", // Default for new projects
            image: "",
        };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("category", values.category);
            formData.append("description", values.description);
            // Append internal status (either existing or default)
            formData.append("status", values.status || "Concluído");
            if (values.image) {
                formData.append("image_url", values.image);
            }

            let result;
            if (isNew) {
                result = await createProject(formData);
            } else {
                if (initialData?.date) {
                    formData.append("date", initialData.date);
                }
                result = await updateProject(initialData!.id, formData);
            }

            if (result.success) {
                toast.success(isNew ? "Projeto criado com sucesso!" : "Projeto atualizado com sucesso!");
                router.push("/admin/projetos");
                router.refresh();
            } else {
                toast.error("Erro ao salvar projeto.");
                console.error(result.error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
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
                                    {/* Status Config removed from UI as requested */}
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
