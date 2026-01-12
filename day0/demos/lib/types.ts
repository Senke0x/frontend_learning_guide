export interface User {
  id: number;
  name: string;
  email?: string;
}

export type Role = 'admin' | 'editor' | 'viewer';
