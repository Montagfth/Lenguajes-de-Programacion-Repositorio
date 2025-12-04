// Interface principal para GET
export interface Producto {
  id_producto?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
}

// Interface para POST (sin id)
export interface ProductoPost {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// Interface para PUT (requiere id)
export interface ProductoPut {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

