interface ProjectsSidebarNavLinkProps {
  projectId: string;
  navLabel: string;
}

export function ProjectsSidebarNavLink({ projectId, navLabel }: ProjectsSidebarNavLinkProps) {
  return (
    <li>
      <a
        href={`#project-${projectId}`}
        className="block py-1 text-muted hover:text-foreground transition-colors leading-snug"
      >
        {navLabel}
      </a>
    </li>
  );
}
