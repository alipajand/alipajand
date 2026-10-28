import styles from "components/hairline/Tags/Tags.module.css";

interface TagsProps {
  tags: readonly string[];
  label?: string;
}

export const Tags = ({ tags, label }: TagsProps) => (
  <ul className={styles.tags} aria-label={label}>
    {tags.map((tag) => (
      <li key={tag}>{tag}</li>
    ))}
  </ul>
);
