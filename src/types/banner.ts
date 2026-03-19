export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  href?: string;
  active: boolean;
  order: number;
  bg?: string;
  emoji?: string;
  badge?: string;
  badgeColor?: string;
}
