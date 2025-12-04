import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../Environments/environments';
import {
  UsuarioPut,
  ProductoPut,
  EventoPut,
  LocalPut,
  ReservaPut,
  PedidoPut,
  DetallePedidoPut,
  MensajePut,
  Usuario,
  Producto,
  Evento,
  Local,
  Reserva,
  Pedido,
  DetallePedido,
  Mensaje,
} from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class PutApiService {
  protected http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  // Usuarios
  actualizarUsuario(id: number, usuario: UsuarioPut) {
    return this.http.put<Usuario>(`${this.apiUrl}usuarios/${id}`, usuario);
  }

  // Productos
  actualizarProducto(id: number, producto: ProductoPut) {
    return this.http.put(`${this.apiUrl}productos/${id}`, producto);
  }

  // Eventos
  actualizarEvento(id: number, evento: EventoPut) {
    return this.http.put(`${this.apiUrl}eventos/${id}`, evento);
  }

  // Locales
  actualizarLocal(id: number, local: LocalPut) {
    return this.http.put(`${this.apiUrl}locales/${id}`, local);
  }

  // Reservas
  actualizarReserva(id: number, reserva: ReservaPut) {
    return this.http.put(`${this.apiUrl}reservas/${id}`, reserva);
  }

  // Pedidos
  actualizarPedido(id: number, pedido: PedidoPut) {
    return this.http.put(`${this.apiUrl}pedidos/${id}`, pedido);
  }

  // Detalles de Pedido
  actualizarDetallePedido(pedidoId: number, productoId: number, detalle: DetallePedidoPut) {
    return this.http.put(`${this.apiUrl}detalles-pedido/${pedidoId}/${productoId}`, detalle);
  }

  // Mensajes
  actualizarMensaje(id: number, mensaje: MensajePut) {
    return this.http.put(`${this.apiUrl}mensajes/${id}`, mensaje);
  }
}

