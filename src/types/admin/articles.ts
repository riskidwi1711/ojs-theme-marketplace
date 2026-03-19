export interface AdminArticleItem {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  authorEmail?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  iconColor?: string;
  bg?: string;
  tag?: string;
  tagColor?: string;
  publishedAt?: string;
  active?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
