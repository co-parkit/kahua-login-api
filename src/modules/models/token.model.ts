interface UserBase {
  id?: number;
  name?: string;
  email?: string;
  role?: number;
  status?: number;
}

export interface PayloadToken extends UserBase {
  sub: number;
  lastName: string;
}

export interface LoginUser extends UserBase {
  last_name: string;
  id_role: number;
  id_status: number;
}
