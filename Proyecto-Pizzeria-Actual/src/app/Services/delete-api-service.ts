import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DeleteApiService {
  protected http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  // Usuarios
  eliminarUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}usuarios/${id}`);
  }

  // Productos
  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}productos/${id}`);
  }

  // Eventos
  eliminarEvento(id: number) {
    return this.http.delete(`${this.apiUrl}eventos/${id}`);
  }

  // Locales
  eliminarLocal(id: number) {
    return this.http.delete(`${this.apiUrl}locales/${id}`);
  }

  // Reservas
  eliminarReserva(id: number) {
    return this.http.delete(`${this.apiUrl}reservas/${id}`);
  }

  // Pedidos
  eliminarPedido(id: number) {
    return this.http.delete(`${this.apiUrl}pedidos/${id}`);
  }

  // Detalles de Pedido
  eliminarDetallePedido(pedidoId: number, productoId: number) {
    return this.http.delete(`${this.apiUrl}detalles-pedido/${pedidoId}/${productoId}`);
  }

  // Mensajes
  eliminarMensaje(id: number) {
    return this.http.delete(`${this.apiUrl}mensajes/${id}`);
  }
}

