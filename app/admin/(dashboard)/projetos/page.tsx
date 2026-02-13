import { getProjects } from "@/app/actions/projects";
import ProjectsClient, { Project } from "./client";

export default async function ProjectsPage() {
    const projectsData = await getProjects();

    const projects: Project[] = projectsData.map((p: any) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        status: p.status,
        date: p.date,
        image_url: p.image_url,
        description: p.description
    }));

    return <ProjectsClient initialProjects={projects} />;
}
