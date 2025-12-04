import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetApiService } from '../../../../Services/get-api-service';
import { Reserva, Usuario, Local, Evento } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-reservas',
  imports: [CommonModule],
  templateUrl: './admin-reservas.html',
  styleUrl: './admin-reservas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AdminReservas implements OnInit {
  private getService = inject(GetApiService);

  reservas = signal<Reserva[]>([]);
  usuarios = signal<Usuario[]>([]);
  locales = signal<Local[]>([]);
  eventos = signal<Evento[]>([]);
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

  // Computed para estadísticas
  totalReservas = computed(() => this.reservas().length);
  reservasPendientes = computed(() => this.reservas().filter(r => r.estado === 'pendiente').length);
  reservasConfirmadas = computed(() => this.reservas().filter(r => r.estado === 'confirmada').length);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    // Cargar todas las reservas de todos los usuarios
    this.getService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas.set(reservas);
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
      }
    });

    // Cargar usuarios
    this.getService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });

    // Cargar locales
    this.getService.getLocales().subscribe({
      next: (locales) => {
        this.locales.set(locales);
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
      }
    });

    // Cargar eventos
    this.getService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos.set(eventos);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
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

  getNombreUsuario(usuarioId?: number): string {
    if (!usuarioId) return 'Usuario desconocido';
    const usuario = this.usuarios().find(u => u.id_usuario === usuarioId);
    return usuario?.nombre || `Usuario #${usuarioId}`;
  }

  getNombreLocal(localId?: number): string {
    if (!localId) return '-';
    const local = this.locales().find(l => l.id_local === localId);
    return local?.nombre || `Local #${localId}`;
  }

  getNombreEvento(eventoId?: number): string {
    if (!eventoId) return '-';
    const evento = this.eventos().find(e => e.id === eventoId);
    return evento?.titulo || `Evento #${eventoId}`;
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
          <p><strong>👤 Cliente:</strong> ${this.getNombreUsuario(reserva.fk_id_usuario)}</p>
          <p><strong>📅 Fecha:</strong> ${this.formatearFecha(reserva.fecha_reserva)}</p>
          <p><strong>🕐 Hora:</strong> ${this.formatearHora(reserva.hora_reserva)}</p>
          <p><strong>👥 Personas:</strong> ${reserva.cant_personas}</p>
          <p><strong>🏪 Local:</strong> ${this.getNombreLocal(reserva.fk_id_local)}</p>
          ${reserva.fk_id_evento ? `<p><strong>🎉 Evento:</strong> ${this.getNombreEvento(reserva.fk_id_evento)}</p>` : ''}
          <p><strong>Estado:</strong> <span class="badge ${this.getEstadoClass(reserva.estado)}">${reserva.estado}</span></p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }
}
