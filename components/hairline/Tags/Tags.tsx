import styles from "components/hairline/Tags/Tags.module.css";

interface TagsProps {
  tags: readonly string[];
  label?: string;
}

/** Pill chips for a stack or capability list. Rendered as a list so the count is announced. */
export const Tags = ({ tags, label }: TagsProps) => (
  <ul className={styles.tags} aria-label={label}>
    {tags.map((tag) => (
      <li key={tag}>{tag}</li>
    ))}
  </ul>
);
