import { UserInfo } from './Usuario';

// Interface para request de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface para response de login
export interface LoginResponse {
  token?: string;
  user?: UserInfo;
}

