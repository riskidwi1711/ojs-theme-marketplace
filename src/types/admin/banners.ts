export interface AdminBannerItem {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  icon?: string;
  bg?: string;
  textColor?: string;
  subColor?: string;
  href?: string;
  active: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
