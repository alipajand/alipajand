interface ProjectCardBadgeProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: string;
}

export const ProjectCardBadge = ({ children, ...liProps }: ProjectCardBadgeProps) => {
  return (
    <li {...liProps}>
      <span>{children}</span>
    </li>
  );
};
