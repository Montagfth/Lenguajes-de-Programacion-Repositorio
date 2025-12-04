// Interface principal para GET
export interface Reserva {
  id_reserva?: number;
  fk_id_usuario?: number;
  fk_id_evento?: number;
  fk_id_local?: number;
  fecha_reserva?: string;
  hora_reserva?: string;
  cant_personas?: number;
  estado?: string;
}

// Interface para POST (sin id)
export interface ReservaPost {
  fk_id_usuario: number;
  fk_id_evento: number;
  fk_id_local: number;
  fecha_reserva: string;
  hora_reserva: string;
  cant_personas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}

// Interface para PUT (requiere id)
export interface ReservaPut {
  fk_id_usuario: number;
  fk_id_evento: number;
  fk_id_local: number;
  fecha_reserva: string;
  hora_reserva: string;
  cant_personas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}

