import { getProjectById } from "@/app/actions/projects";
import ProjectForm from "./client-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isNew = id === "new";
    let project = null;

    if (!isNew) {
        project = await getProjectById(id);
    }

    return <ProjectForm initialData={project} />;
}
