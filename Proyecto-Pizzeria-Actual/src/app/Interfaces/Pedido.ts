// Interface principal para GET
export interface Pedido {
  id_pedido?: number;
  fk_id_usuario?: number;
  fecha_pedido?: string;
  estado_pedido?: string;
  total?: number;
}

// Interface para POST (sin id)
export interface PedidoPost {
  fk_id_usuario: number;
  estado_pedido: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
}

// Interface para PUT (requiere id)
export interface PedidoPut {
  fk_id_usuario: number;
  estado_pedido: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
}

