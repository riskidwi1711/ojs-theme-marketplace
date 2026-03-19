export interface AuthProfile {
  id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  role?: string;
}

export interface AdminProfile {
  id?: string;
  name: string;
  email: string;
  role?: string;
}
