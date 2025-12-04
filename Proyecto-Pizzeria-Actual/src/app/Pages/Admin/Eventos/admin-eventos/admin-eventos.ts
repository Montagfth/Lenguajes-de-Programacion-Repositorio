import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetApiService } from '../../../../Services/get-api-service';
import { PostApiService } from '../../../../Services/post-api-service';
import { PutApiService } from '../../../../Services/put-api-service';
import { DeleteApiService } from '../../../../Services/delete-api-service';
import { Evento, EventoPost, EventoPut, Local } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-eventos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-eventos.html',
  styleUrl: './admin-eventos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AdminEventos implements OnInit {
  private getService = inject(GetApiService);
  private postService = inject(PostApiService);
  private putService = inject(PutApiService);
  private deleteService = inject(DeleteApiService);

  eventos = signal<Evento[]>([]);
  locales = signal<Local[]>([]);
  cargando = signal<boolean>(true);
  mostrarFormulario = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);

  // Formulario
  titulo = signal<string>('');
  descripcion = signal<string>('');
  precioBase = signal<number>(0);
  eventoEditandoId = signal<number | undefined>(undefined);

  // Validaciones
  tituloValido = computed(() => this.titulo().trim().length >= 3);
  descripcionValida = computed(() => this.descripcion().trim().length >= 10);
  precioValido = computed(() => this.precioBase() > 0);

  formularioValido = computed(() =>
    this.tituloValido() &&
    this.descripcionValida() &&
    this.precioValido()
  );

  ngOnInit(): void {
    this.cargarEventos();
    this.cargarLocales();
  }

  cargarEventos(): void {
    this.cargando.set(true);
    this.getService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos.set(eventos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los eventos'
        });
      }
    });
  }

  cargarLocales(): void {
    this.getService.getLocales().subscribe({
      next: (locales) => {
        this.locales.set(locales);
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
      }
    });
  }

  abrirFormularioNuevo(): void {
    this.limpiarFormulario();
    this.modoEdicion.set(false);
    this.mostrarFormulario.set(true);
  }

  abrirFormularioEditar(evento: Evento): void {
    this.titulo.set(evento.nombre_evento || evento.titulo || '');
    this.descripcion.set(evento.descripcion || '');
    this.precioBase.set(evento.precio_base || 0);
    this.eventoEditandoId.set(evento.id_evento || evento.id);
    this.modoEdicion.set(true);
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.titulo.set('');
    this.descripcion.set('');
    this.precioBase.set(0);
    this.eventoEditandoId.set(undefined);
  }

  guardarEvento(): void {
    if (!this.formularioValido()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente'
      });
      return;
    }

    if (this.modoEdicion()) {
      this.actualizarEvento();
    } else {
      this.crearEvento();
    }
  }

  crearEvento(): void {
    const nuevoEvento: EventoPost = {
      nombre_evento: this.titulo(),
      descripcion: this.descripcion(),
      precio_base: this.precioBase()
    };

    this.postService.crearEvento(nuevoEvento).subscribe({
      next: (evento) => {
        this.eventos.update(eventos => [...eventos, evento]);
        this.cerrarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Evento creado',
          text: 'El evento se ha creado exitosamente',
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al crear evento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el evento'
        });
      }
    });
  }

  actualizarEvento(): void {
    const id = this.eventoEditandoId();
    if (!id) return;

    const eventoActualizado: EventoPut = {
      id_evento: id,
      nombre_evento: this.titulo(),
      descripcion: this.descripcion(),
      precio_base: this.precioBase()
    };

    this.putService.actualizarEvento(id, eventoActualizado).subscribe({
      next: (evento) => {
        this.eventos.update(eventos =>
          eventos.map(e => (e.id_evento === id || e.id === id) ? evento : e)
        );
        this.cerrarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Evento actualizado',
          text: 'El evento se ha actualizado exitosamente',
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al actualizar evento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el evento'
        });
      }
    });
  }

  eliminarEvento(evento: Evento): void {
    const id = evento.id_evento || evento.id;
    if (!id) return;

    Swal.fire({
      title: '¿Eliminar evento?',
      text: `¿Estás seguro que deseas eliminar el evento "${evento.nombre_evento || evento.titulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && id) {
        this.deleteService.eliminarEvento(id).subscribe({
          next: () => {
            this.eventos.update(eventos =>
              eventos.filter(e => (e.id_evento !== id && e.id !== id))
            );
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El evento ha sido eliminado',
              timer: 2000
            });
          },
          error: (error) => {
            console.error('Error al eliminar evento:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el evento'
            });
          }
        });
      }
    });
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '-';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  getEstadoBadgeClass(estado?: string): string {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-success';
      case 'inactivo':
        return 'bg-secondary';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getNombreLocal(localId?: number): string {
    if (!localId) return '-';
    const local = this.locales().find(l => l.id_local === localId || l.id === localId);
    return local?.nombre || `Local #${localId}`;
  }
}
