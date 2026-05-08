export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featured?: boolean;
  tags?: string[];
}
