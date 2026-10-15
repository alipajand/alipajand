export interface WritingIndexPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featured?: boolean;
  upcoming?: boolean;
  tags?: string[];
}
