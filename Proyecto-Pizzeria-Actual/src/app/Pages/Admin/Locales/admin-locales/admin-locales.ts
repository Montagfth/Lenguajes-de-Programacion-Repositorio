import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetApiService } from '../../../../Services/get-api-service';
import { PostApiService } from '../../../../Services/post-api-service';
import { PutApiService } from '../../../../Services/put-api-service';
import { DeleteApiService } from '../../../../Services/delete-api-service';
import { Local, LocalPost, LocalPut } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-locales',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-locales.html',
  styleUrl: './admin-locales.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AdminLocales implements OnInit {
  private getService = inject(GetApiService);
  private postService = inject(PostApiService);
  private putService = inject(PutApiService);
  private deleteService = inject(DeleteApiService);

  locales = signal<Local[]>([]);
  cargando = signal<boolean>(true);
  mostrarFormulario = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);

  // Formulario
  nombre = signal<string>('');
  direccion = signal<string>('');
  capacidad = signal<number>(0);
  ubicacion = signal<string>('');
  ciudad = signal<string>('');
  telefono = signal<string>('');
  email = signal<string>('');
  horario = signal<string>(''); // Campo agregado
  horarioApertura = signal<string>('');
  horarioCierre = signal<string>('');
  localEditandoId = signal<number | undefined>(undefined);

  // Validaciones
  nombreValido = computed(() => this.nombre().trim().length >= 3);
  direccionValida = computed(() => this.direccion().trim().length >= 5);
  capacidadValida = computed(() => this.capacidad() > 0);
  ciudadValida = computed(() => this.ciudad().trim().length >= 3);

  formularioValido = computed(() =>
    this.nombreValido() &&
    this.direccionValida() &&
    this.capacidadValida() &&
    this.ciudadValida()
  );

  totalLocales = computed(() => this.locales().length);

  ngOnInit(): void {
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.cargando.set(true);
    this.getService.getLocales().subscribe({
      next: (locales) => {
        this.locales.set(locales);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los locales'
        });
      }
    });
  }

  abrirFormularioNuevo(): void {
    this.limpiarFormulario();
    this.modoEdicion.set(false);
    this.mostrarFormulario.set(true);
  }

  abrirFormularioEditar(local: Local): void {
    this.nombre.set(local.nombre || '');
    this.direccion.set(local.direccion || '');
    this.capacidad.set(local.capacidad || 0);
    this.ubicacion.set(local.ubicacion || '');
    this.ciudad.set(local.ciudad || '');
    this.telefono.set(local.telefono || '');
    this.email.set(local.email || '');
    this.horario.set(local.horario || ''); // Campo agregado
    this.horarioApertura.set(local.horarioApertura || '');
    this.horarioCierre.set(local.horarioCierre || '');
    this.localEditandoId.set(local.id_local || local.id);
    this.modoEdicion.set(true);
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nombre.set('');
    this.direccion.set('');
    this.capacidad.set(0);
    this.ubicacion.set('');
    this.ciudad.set('');
    this.telefono.set('');
    this.email.set('');
    this.horario.set(''); // Campo agregado
    this.horarioApertura.set('');
    this.horarioCierre.set('');
    this.localEditandoId.set(undefined);
  }

  guardarLocal(): void {
    if (!this.formularioValido()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    if (this.modoEdicion()) {
      this.actualizarLocal();
    } else {
      this.crearLocal();
    }
  }

  crearLocal(): void {
    const nuevoLocal: LocalPost = {
      nombre: this.nombre(),
      direccion: this.direccion(),
      capacidad: this.capacidad(),
      ubicacion: this.ubicacion(),
      ciudad: this.ciudad(),
      telefono: this.telefono(),
      email: this.email(),
      horario: this.horario(), // Campo agregado
      horarioApertura: this.horarioApertura(),
      horarioCierre: this.horarioCierre()
    };

    this.postService.crearLocal(nuevoLocal).subscribe({
      next: (local) => {
        this.locales.update(locales => [...locales, local]);
        this.cerrarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Local creado',
          text: 'El local se ha creado exitosamente',
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al crear local:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el local'
        });
      }
    });
  }

  actualizarLocal(): void {
    const id = this.localEditandoId();
    if (!id) return;

    const localActualizado: LocalPut = {
      nombre: this.nombre(),
      direccion: this.direccion(),
      capacidad: this.capacidad(),
      ubicacion: this.ubicacion(),
      ciudad: this.ciudad(),
      telefono: this.telefono(),
      email: this.email(),
      horario: this.horario(), // Campo agregado
      horarioApertura: this.horarioApertura(),
      horarioCierre: this.horarioCierre()
    };

    this.putService.actualizarLocal(id, localActualizado).subscribe({
      next: (local) => {
        this.locales.update(locales =>
          locales.map(l => (l.id_local === id || l.id === id) ? local : l)
        );
        this.cerrarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Local actualizado',
          text: 'El local se ha actualizado exitosamente',
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al actualizar local:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el local'
        });
      }
    });
  }

  eliminarLocal(local: Local): void {
    const id = local.id_local || local.id;
    if (!id) return;

    Swal.fire({
      title: '¿Eliminar local?',
      text: `¿Estás seguro que deseas eliminar el local "${local.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteService.eliminarLocal(id).subscribe({
          next: () => {
            this.locales.update(locales =>
              locales.filter(l => (l.id_local || l.id) !== id)
            );
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El local ha sido eliminado',
              timer: 2000
            });
          },
          error: (error) => {
            console.error('Error al eliminar local:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el local'
            });
          }
        });
      }
    });
  }

  formatearHorario(apertura?: string, cierre?: string): string {
    if (!apertura || !cierre) return '-';
    return `${apertura} - ${cierre}`;
  }

  getActivoBadgeClass(activo?: boolean): string {
    return activo ? 'bg-success' : 'bg-secondary';
  }
}
