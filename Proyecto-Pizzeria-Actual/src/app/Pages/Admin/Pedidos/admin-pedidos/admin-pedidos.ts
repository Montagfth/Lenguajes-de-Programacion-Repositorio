import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetApiService } from '../../../../Services/get-api-service';
import { PutApiService } from '../../../../Services/put-api-service';
import { Pedido, Usuario, PedidoPut } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-pedidos',
  imports: [CommonModule],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AdminPedidos implements OnInit {
  private getService = inject(GetApiService);
  private putService = inject(PutApiService);

  pedidos = signal<Pedido[]>([]);
  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(true);
  filtroEstado = signal<string>('todos');

  // Computed para filtrar pedidos
  pedidosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'todos') {
      return this.pedidos();
    }
    return this.pedidos().filter(p => p.estado_pedido === filtro);
  });

  // Computed para estadísticas
  totalPedidos = computed(() => this.pedidos().length);
  pedidosPendientes = computed(() => this.pedidos().filter(p => p.estado_pedido === 'pendiente').length);
  pedidosEnProceso = computed(() => this.pedidos().filter(p => p.estado_pedido === 'procesando').length);
  totalVentas = computed(() =>
    this.pedidos().reduce((sum, p) => sum + (p.total || 0), 0)
  );

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    // Cargar todos los pedidos de todos los usuarios
    this.getService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los pedidos'
        });
      }
    });

    // Cargar usuarios para mostrar nombres
    this.getService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  setFiltroEstado(estado: string): void {
    this.filtroEstado.set(estado);
  }

  getEstadoClass(estado?: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-warning text-dark';
      case 'procesando':
        return 'bg-info';
      case 'enviado':
        return 'bg-primary';
      case 'entregado':
        return 'bg-success';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getNombreUsuario(usuarioId?: number): string {
    if (!usuarioId) return 'Usuario desconocido';
    const usuario = this.usuarios().find(u => u.id_usuario === usuarioId);
    return usuario?.nombre || `Usuario #${usuarioId}`;
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return 'Sin fecha';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  }

  verDetallePedido(pedido: Pedido): void {
    Swal.fire({
      title: `Pedido #${pedido.id_pedido}`,
      html: `
        <div class="text-start">
          <p><strong>👤 Cliente:</strong> ${this.getNombreUsuario(pedido.fk_id_usuario)}</p>
          <p><strong>📅 Fecha:</strong> ${this.formatearFecha(pedido.fecha_pedido)}</p>
          <p><strong>💵 Total:</strong> $${pedido.total?.toFixed(2)}</p>
          <p><strong>Estado:</strong> <span class="badge ${this.getEstadoClass(pedido.estado_pedido)}">${pedido.estado_pedido}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  cambiarEstado(pedido: Pedido): void {
    if (!pedido.id_pedido) return;

    Swal.fire({
      title: 'Actualizar Estado',
      input: 'select',
      inputOptions: {
        'pendiente': 'Pendiente',
        'procesando': 'Procesando',
        'enviado': 'Enviado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
      },
      inputValue: pedido.estado_pedido,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un estado';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevoEstado = result.value;

        const pedidoPut: PedidoPut = {
          fk_id_usuario: pedido.fk_id_usuario!,
          estado_pedido: nuevoEstado,
          total: pedido.total || 0
        };

        this.putService.actualizarPedido(pedido.id_pedido!, pedidoPut).subscribe({
          next: () => {
            this.pedidos.update(ps =>
              ps.map(p => p.id_pedido === pedido.id_pedido ? { ...p, estado_pedido: nuevoEstado } : p)
            );
            Swal.fire('Actualizado', `El pedido ahora está ${nuevoEstado}`, 'success');
          },
          error: (error) => {
            console.error('Error al actualizar estado:', error);
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
          }
        });
      }
    });
  }
}
