import { ProjectCard } from "components/Projects/ProjectCard";
import type { Project } from "data/projects";

interface ProjectsListItemProps {
  project: Project;
}

export function ProjectsListItem({ project }: ProjectsListItemProps) {
  return (
    <li>
      <ProjectCard project={project} />
    </li>
  );
}
