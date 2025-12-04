import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetApiService } from '../../../../Services/get-api-service';
import { AuthService } from '../../../../Services/auth-service';
import { Reserva } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MisReservas implements OnInit {
  private getService = inject(GetApiService);
  private authService = inject(AuthService);

  reservas = signal<Reserva[]>([]);
  cargando = signal<boolean>(true);
  filtroEstado = signal<string>('todos');

  // Computed para filtrar reservas
  reservasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'todos') {
      return this.reservas();
    }
    return this.reservas().filter(r => r.estado === filtro);
  });

  // Computed para contadores
  totalReservas = computed(() => this.reservas().length);
  reservasPendientes = computed(() => this.reservas().filter(r => r.estado === 'pendiente').length);
  reservasConfirmadas = computed(() => this.reservas().filter(r => r.estado === 'confirmada').length);

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    const usuario = this.authService.getUsuario();
    if (!usuario?.id_usuario) {
      this.cargando.set(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario no autenticado'
      });
      return;
    }

    this.getService.getReservas().subscribe({
      next: (reservas: Reserva[]) => {
        // Filtrar solo las reservas del usuario actual
        const reservasUsuario = reservas.filter((r: Reserva) => r.fk_id_usuario === usuario.id_usuario);
        this.reservas.set(reservasUsuario);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las reservas'
        });
      },
      complete: () => {
        // Asegurar que siempre se detenga la carga
        this.cargando.set(false);
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
      case 'confirmada':
        return 'bg-success';
      case 'cancelada':
        return 'bg-danger';
      case 'completada':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getEstadoIcono(estado?: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return '⏳';
      case 'confirmada':
        return '✅';
      case 'cancelada':
        return '❌';
      case 'completada':
        return '🎉';
      default:
        return '📋';
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return 'Sin fecha';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  formatearHora(hora?: string): string {
    if (!hora) return 'Sin hora';
    return hora;
  }

  verDetalleReserva(reserva: Reserva): void {
    Swal.fire({
      title: `Reserva #${reserva.id_reserva}`,
      html: `
        <div class="text-start">
          <p><strong>📅 Fecha:</strong> ${this.formatearFecha(reserva.fecha_reserva)}</p>
          <p><strong>🕐 Hora:</strong> ${this.formatearHora(reserva.hora_reserva)}</p>
          <p><strong>👥 Personas:</strong> ${reserva.cant_personas}</p>
          <p><strong>📍 Local ID:</strong> ${reserva.fk_id_local}</p>
          ${reserva.fk_id_evento ? `<p><strong>🎉 Evento ID:</strong> ${reserva.fk_id_evento}</p>` : ''}
          <p><strong>Estado:</strong> <span class="badge ${this.getEstadoClass(reserva.estado)}">${reserva.estado}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  cancelarReserva(reserva: Reserva): void {
    Swal.fire({
      title: '¿Cancelar reserva?',
      text: `¿Estás seguro que deseas cancelar la reserva #${reserva.id_reserva}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'info',
          title: 'Función en desarrollo',
          text: 'La cancelación de reservas estará disponible próximamente'
        });
      }
    });
  }
}
