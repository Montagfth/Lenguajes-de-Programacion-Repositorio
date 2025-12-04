import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetApiService } from '../../../../Services/get-api-service';
import { AuthService } from '../../../../Services/auth-service';
import { Pedido, DetallePedido } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-pedidos',
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MisPedidos implements OnInit {
  private getService = inject(GetApiService);
  private authService = inject(AuthService);

  pedidos = signal<Pedido[]>([]);
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

  // Computed para contar pedidos por estado
  totalPedidos = computed(() => this.pedidos().length);
  pedidosPendientes = computed(() =>
    this.pedidos().filter(p => p.estado_pedido === 'pendiente').length
  );
  pedidosEnProceso = computed(() =>
    this.pedidos().filter(p => p.estado_pedido === 'procesando').length
  );

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    const usuario = this.authService.getUsuario();
    if (!usuario?.id_usuario) {
      Swal.fire('Error', 'No se pudo identificar el usuario', 'error');
      this.cargando.set(false);
      return;
    }

    this.getService.getPedidos().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || response.pedidos || []);
        // Filtrar solo los pedidos del usuario actual
        const pedidosUsuario = data.filter((p: Pedido) => p.fk_id_usuario === usuario.id_usuario);
        console.log('Pedidos del usuario:', pedidosUsuario);
        this.pedidos.set(pedidosUsuario);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
        this.cargando.set(false);
      }
    });
  }

  setFiltroEstado(estado: string) {
    this.filtroEstado.set(estado);
  }

  getEstadoClass(estado?: string): string {
    switch (estado) {
      case 'pendiente': return 'bg-warning text-dark';
      case 'procesando': return 'bg-info text-white';
      case 'enviado': return 'bg-primary text-white';
      case 'entregado': return 'bg-success text-white';
      case 'cancelado': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getEstadoIcono(estado?: string): string {
    switch (estado) {
      case 'pendiente': return '⏳';
      case 'procesando': return '🔄';
      case 'enviado': return '🚚';
      case 'entregado': return '✅';
      case 'cancelado': return '❌';
      default: return '📦';
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  verDetallePedido(pedido: Pedido) {
    Swal.fire({
      title: `Pedido #${pedido.id_pedido}`,
      html: `
        <div class="text-start">
          <p><strong>Fecha:</strong> ${this.formatearFecha(pedido.fecha_pedido)}</p>
          <p><strong>Estado:</strong> <span class="badge ${this.getEstadoClass(pedido.estado_pedido)}">${pedido.estado_pedido}</span></p>
          <p><strong>Total:</strong> $${pedido.total?.toFixed(2)}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }
}

