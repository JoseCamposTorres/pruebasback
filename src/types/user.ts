export type UserRole = 'admin' | 'user';
export type UserStatus = 'activo' | 'inactivo' | 'bloqueado';

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  dateCreate?: Date;
}
