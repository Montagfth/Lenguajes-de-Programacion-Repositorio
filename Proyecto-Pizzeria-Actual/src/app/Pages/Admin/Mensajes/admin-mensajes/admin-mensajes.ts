import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetApiService } from '../../../../Services/get-api-service';
import { DeleteApiService } from '../../../../Services/delete-api-service';
import { PutApiService } from '../../../../Services/put-api-service';
import { Mensaje, Usuario, MensajePut } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-mensajes',
  imports: [CommonModule],
  templateUrl: './admin-mensajes.html',
  styleUrl: './admin-mensajes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AdminMensajes implements OnInit {
  private getService = inject(GetApiService);
  private deleteService = inject(DeleteApiService);
  private putService = inject(PutApiService);

  mensajes = signal<Mensaje[]>([]);
  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(true);
  filtroLeido = signal<string>('todos'); // todos, leidos, no-leidos

  // Computed para filtrar mensajes
  mensajesFiltrados = computed(() => {
    const filtro = this.filtroLeido();
    if (filtro === 'todos') {
      return this.mensajes();
    }
    const soloLeidos = filtro === 'leidos';
    return this.mensajes().filter(m => !!m.leido === soloLeidos);
  });

  // Computed para estadísticas
  totalMensajes = computed(() => this.mensajes().length);
  mensajesNoLeidos = computed(() => this.mensajes().filter(m => !m.leido).length);

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);

    // Cargar mensajes
    this.getService.getMensajes().subscribe({
      next: (mensajes) => {
        // Ordenar por fecha descendente (más recientes primero)
        const ordenados = mensajes.sort((a: Mensaje, b: Mensaje) => {
          const fechaA = a.fecha_envio ? new Date(a.fecha_envio).getTime() : 0;
          const fechaB = b.fecha_envio ? new Date(b.fecha_envio).getTime() : 0;
          return fechaB - fechaA;
        });
        this.mensajes.set(ordenados);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.cargando.set(false);
        Swal.fire('Error', 'No se pudieron cargar los mensajes', 'error');
      }
    });

    // Cargar usuarios para mostrar nombres si es necesario
    this.getService.getUsuarios().subscribe({
      next: (usuarios) => this.usuarios.set(usuarios),
      error: (e) => console.error(e)
    });
  }

  setFiltro(filtro: string): void {
    this.filtroLeido.set(filtro);
  }

  getNombreUsuario(usuarioId?: number): string {
    if (!usuarioId) return 'Visitante';
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

  verMensaje(mensaje: Mensaje): void {
    // Marcar como leído si no lo está
    if (!mensaje.leido && mensaje.id_mensaje) {
      this.marcarComoLeido(mensaje);
    }

    Swal.fire({
      title: mensaje.asunto || 'Sin asunto',
      html: `
        <div class="text-start">
          <p><strong>De:</strong> ${mensaje.remitente || this.getNombreUsuario(mensaje.fk_id_usuario)}</p>
          <p><strong>Para:</strong> ${mensaje.destinatario || 'Administración'}</p>
          <p><strong>Fecha:</strong> ${this.formatearFecha(mensaje.fecha_envio)}</p>
          <hr>
          <p class="mt-3">${mensaje.contenido}</p>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Cerrar'
    });
  }

  marcarComoLeido(mensaje: Mensaje): void {
    if (!mensaje.id_mensaje) return;

    const mensajePut: MensajePut = {
      fk_id_usuario: mensaje.fk_id_usuario,
      asunto: mensaje.asunto || '',
      contenido: mensaje.contenido || '',
      remitente: mensaje.remitente,
      destinatario: mensaje.destinatario,
      leido: true
    };

    this.putService.actualizarMensaje(mensaje.id_mensaje, mensajePut).subscribe({
      next: () => {
        // Actualizar estado local
        this.mensajes.update(msgs =>
          msgs.map(m => m.id_mensaje === mensaje.id_mensaje ? { ...m, leido: true } : m)
        );
      },
      error: (err) => console.error('Error al marcar como leído', err)
    });
  }

  eliminarMensaje(mensaje: Mensaje): void {
    if (!mensaje.id_mensaje) return;

    Swal.fire({
      title: '¿Eliminar mensaje?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteService.eliminarMensaje(mensaje.id_mensaje!).subscribe({
          next: () => {
            this.mensajes.update(msgs => msgs.filter(m => m.id_mensaje !== mensaje.id_mensaje));
            Swal.fire('Eliminado', 'El mensaje ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el mensaje', 'error');
          }
        });
      }
    });
  }
}
