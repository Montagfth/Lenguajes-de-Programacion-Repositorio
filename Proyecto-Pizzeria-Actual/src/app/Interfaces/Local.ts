// Interface principal para GET
export interface Local {
  id_local?: number;
  id?: number; // Alias para compatibilidad con componentes existentes
  nombre?: string;
  direccion?: string;
  capacidad?: number;
  ubicacion?: string;
  ciudad?: string;
  telefono?: string;
  email?: string;
  horario?: string;
  horarioApertura?: string;
  horarioCierre?: string;
  activo?: boolean;
}

// Interface para POST (sin id)
export interface LocalPost {
  nombre: string;
  direccion: string;
  capacidad: number;
  ubicacion?: string;
  ciudad?: string;
  telefono?: string;
  email?: string;
  horario?: string;
  horarioApertura?: string;
  horarioCierre?: string;
}

// Interface para PUT (requiere id)
export interface LocalPut {
  nombre: string;
  direccion: string;
  capacidad: number;
  ubicacion?: string;
  ciudad?: string;
  telefono?: string;
  email?: string;
  horario?: string;
  horarioApertura?: string;
  horarioCierre?: string;
}

