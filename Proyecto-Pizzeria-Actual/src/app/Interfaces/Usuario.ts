// Interface principal para GET
export interface Usuario {
  id_usuario?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

// Interface para POST (sin id)
export interface UsuarioPost {
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
}

// Interface para PUT (requiere id)
export interface UsuarioPut {
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
}

// Interface para información del usuario en sesión
export interface UserInfo {
  id_usuario?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

