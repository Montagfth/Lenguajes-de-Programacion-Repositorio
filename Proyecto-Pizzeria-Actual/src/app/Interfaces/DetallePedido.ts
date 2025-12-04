// Interface principal para GET
export interface DetallePedido {
  fk_id_pedido?: number;
  fk_id_producto?: number;
  cantidad?: number;
  subtotal?: number;
}

// Interface para POST (sin id)
export interface DetallePedidoPost {
  fk_id_pedido: number;
  fk_id_producto: number;
  cantidad: number;
  subtotal: number;
}

// Interface para PUT (requiere id compuesto)
export interface DetallePedidoPut {
  cantidad: number;
  subtotal: number;
}

