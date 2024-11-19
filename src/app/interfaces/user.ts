import { Page } from './page';

export interface User {
  id: number;
  email: string;
  role: string;
  emailVerified: boolean;
  pages?: Page[];
  dateCreated?: string;
  dateLastModified?: string;
}
