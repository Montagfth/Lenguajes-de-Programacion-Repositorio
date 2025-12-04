import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../Environments/environments';
import {
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
export class GetApiService {
  protected http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  // Usuarios
  getUsuarios() {
    return this.http.get<any>(`${this.apiUrl}usuarios`).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getUsuarioById(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}usuarios/${id}`);
  }

  // Productos
  getProductos() {
    return this.http.get<any>(`${this.apiUrl}productos`).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getProductoById(id: number) {
    return this.http.get<Producto>(`${this.apiUrl}productos/${id}`);
  }

  // Eventos
  getEventos() {
    return this.http.get<any>(`${this.apiUrl}eventos`).pipe(
      map(response => {
        // Si la respuesta viene envuelta en un objeto con 'data'
        if (response && response.data) {
          return response.data;
        }
        // Si la respuesta es directamente un array
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getEventoById(id: number) {
    return this.http.get<Evento>(`${this.apiUrl}eventos/${id}`);
  }

  // Locales
  getLocales() {
    return this.http.get<any>(`${this.apiUrl}locales`).pipe(
      map(response => {
        // Si la respuesta viene envuelta en un objeto con 'data'
        if (response && response.data) {
          return response.data;
        }
        // Si la respuesta es directamente un array
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getLocalById(id: number) {
    return this.http.get<Local>(`${this.apiUrl}locales/${id}`);
  }

  // Reservas
  getReservas() {
    return this.http.get<any>(`${this.apiUrl}reservas`).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getReservaById(id: number) {
    return this.http.get<Reserva>(`${this.apiUrl}reservas/${id}`);
  }

  getReservasByUsuario(usuarioId: number) {
    return this.http.get<Reserva[]>(`${this.apiUrl}reservas/usuario/${usuarioId}`);
  }

  // Pedidos
  getPedidos() {
    return this.http.get<any>(`${this.apiUrl}pedidos`).pipe(
      map(response => {
        // Si la respuesta viene envuelta en un objeto con 'data'
        if (response && response.data) {
          return response.data;
        }
        // Si la respuesta es directamente un array
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getPedidoById(id: number) {
    return this.http.get<Pedido>(`${this.apiUrl}pedidos/${id}`);
  }

  getPedidosByUsuario(usuarioId: number) {
    return this.http.get<Pedido[]>(`${this.apiUrl}pedidos/usuario/${usuarioId}`);
  }

  // Detalles de Pedido
  getDetallesPedido(pedidoId: number) {
    return this.http.get<DetallePedido[]>(`${this.apiUrl}detalles-pedido/pedido/${pedidoId}`);
  }

  getDetallePedido(pedidoId: number, productoId: number) {
    return this.http.get<DetallePedido>(`${this.apiUrl}detalles-pedido/${pedidoId}/${productoId}`);
  }

  // Mensajes
  getMensajes() {
    return this.http.get<any>(`${this.apiUrl}mensajes`).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getMensajeById(id: number) {
    return this.http.get<Mensaje>(`${this.apiUrl}mensajes/${id}`);
  }

  getMensajesByUsuario(usuarioId: number) {
    return this.http.get<Mensaje[]>(`${this.apiUrl}mensajes/usuario/${usuarioId}`);
  }

  // Aliases para compatibilidad con código existente (PascalCase)
  GetLocales() { return this.getLocales(); }
  GetEventos() { return this.getEventos(); }
  GetProductos() { return this.getProductos(); }
  GetReservas() { return this.getReservas(); }
  GetPedidos() { return this.getPedidos(); }
  GetUsuarios() { return this.getUsuarios(); }
}

