// Interface principal para GET
export interface Mensaje {
  id_mensaje?: number;
  fk_id_usuario?: number;
  asunto?: string;
  contenido?: string;
  fecha_envio?: string;
  remitente?: string;
  destinatario?: string;
  leido?: boolean;
}

// Interface para POST (sin id)
export interface MensajePost {
  fk_id_usuario?: number;
  asunto: string;
  contenido: string;
  fecha_envio?: string;
  remitente?: string;
  destinatario?: string;
}

// Interface para PUT (requiere id)
export interface MensajePut {
  fk_id_usuario?: number;
  asunto: string;
  contenido: string;
  remitente?: string;
  destinatario?: string;
  leido?: boolean;
}

