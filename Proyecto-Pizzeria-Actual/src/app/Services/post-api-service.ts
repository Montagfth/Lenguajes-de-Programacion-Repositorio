import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../Environments/environments';
import {
  UsuarioPost,
  ProductoPost,
  EventoPost,
  LocalPost,
  ReservaPost,
  PedidoPost,
  DetallePedidoPost,
  MensajePost,
  LoginRequest,
  Usuario,
  Producto,
  Evento,
  Local,
  Reserva,
  Pedido,
  DetallePedido,
  Mensaje,
} from '../Interfaces';
import { SuccessResponse } from '../Interfaces/Response';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {
  protected http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  // Autenticación
  login(credentials: LoginRequest) {
    return this.http.post<SuccessResponse>(`${this.apiUrl}auth/login`, credentials);
  }

  // Usuarios
  crearUsuario(usuario: UsuarioPost) {
    return this.http.post<Usuario>(`${this.apiUrl}usuarios`, usuario);
  }

  // Productos
  crearProducto(producto: ProductoPost) {
    return this.http.post(`${this.apiUrl}productos`, producto);
  }

  // Eventos
  crearEvento(evento: EventoPost) {
    return this.http.post(`${this.apiUrl}eventos`, evento);
  }

  // Locales
  crearLocal(local: LocalPost) {
    return this.http.post(`${this.apiUrl}locales`, local);
  }

  // Reservas
  crearReserva(reserva: ReservaPost) {
    return this.http.post(`${this.apiUrl}reservas`, reserva);
  }

  // Pedidos
  crearPedido(pedido: PedidoPost) {
    return this.http.post(`${this.apiUrl}pedidos`, pedido);
  }

  // Detalles de Pedido
  crearDetallePedido(detalle: DetallePedidoPost) {
    return this.http.post(`${this.apiUrl}detalles-pedido`, detalle);
  }

  // Mensajes
  crearMensaje(mensaje: MensajePost) {
    return this.http.post(`${this.apiUrl}mensajes`, mensaje);
  }
}

