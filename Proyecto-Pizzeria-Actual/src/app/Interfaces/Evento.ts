// Interface principal para GET
export interface Evento {
  id_evento?: number;
  id?: number; // Alias para compatibilidad
  nombre_evento?: string;
  titulo?: string; // Alias para compatibilidad
  descripcion?: string;
  precio_base?: number;
}

// Interface para POST (sin id)
export interface EventoPost {
  nombre_evento: string;
  descripcion: string;
  precio_base: number;
}

// Interface para PUT (requiere id)
export interface EventoPut {
  id_evento: number;
  nombre_evento: string;
  descripcion: string;
  precio_base: number;
}

