export interface UserState {
  email?: string | undefined | null;
  name?: string | undefined | null;
  firstName?: string | undefined | null;
  lastName?: string | undefined | null;
  isAdmin?: boolean | null;
  isLogin: boolean;
}

export interface LoginResult {
  email: string;
  name: string;
  is_admin: boolean;
  first_name?: string | undefined | null;
  last_name?: string | undefined | null;
}

export interface LoginRequest {
  email: string;
  rememberMe: boolean;
}

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  organization?: string;
  tel: string;
};

export type RegisterResult = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  organization?: string;
  tel: string;
};
