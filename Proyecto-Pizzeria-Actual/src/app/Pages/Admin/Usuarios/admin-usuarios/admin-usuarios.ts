import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetApiService } from '../../../../Services/get-api-service';
import { PostApiService } from '../../../../Services/post-api-service';
import { PutApiService } from '../../../../Services/put-api-service';
import { DeleteApiService } from '../../../../Services/delete-api-service';
import { Usuario, UsuarioPost, UsuarioPut } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AdminUsuarios implements OnInit {
  private getService = inject(GetApiService);
  private postService = inject(PostApiService);
  private putService = inject(PutApiService);
  private deleteService = inject(DeleteApiService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(true);
  mostrarFormulario = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);

  // Formulario
  nombre = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  telefono = signal<string>('');
  direccion = signal<string>('');
  usuarioEditandoId = signal<number | undefined>(undefined);

  // Validaciones
  nombreValido = computed(() => this.nombre().trim().length >= 3);
  emailValido = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });
  passwordValido = computed(() => {
    // En edición, el password es opcional
    if (this.modoEdicion() && this.password().length === 0) {
      return true;
    }
    return this.password().length >= 6;
  });

  formularioValido = computed(() =>
    this.nombreValido() &&
    this.emailValido() &&
    this.passwordValido()
  );

  totalUsuarios = computed(() => this.usuarios().length);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.getService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios'
        });
      }
    });
  }

  abrirFormularioNuevo(): void {
    this.limpiarFormulario();
    this.modoEdicion.set(false);
    this.mostrarFormulario.set(true);
  }

  abrirFormularioEditar(usuario: Usuario): void {
    this.nombre.set(usuario.nombre || '');
    this.email.set(usuario.email || '');
    this.password.set(''); // No mostrar password actual
    this.telefono.set(usuario.telefono || '');
    this.direccion.set(usuario.direccion || '');
    this.usuarioEditandoId.set(usuario.id_usuario);
    this.modoEdicion.set(true);
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nombre.set('');
    this.email.set('');
    this.password.set('');
    this.telefono.set('');
    this.direccion.set('');
    this.usuarioEditandoId.set(undefined);
  }

  guardarUsuario(): void {
    if (!this.formularioValido()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos correctamente'
      });
      return;
    }

    if (this.modoEdicion()) {
      this.actualizarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario(): void {
    const nuevoUsuario: UsuarioPost = {
      nombre: this.nombre(),
      email: this.email(),
      password: this.password(),
      telefono: this.telefono() || undefined,
      direccion: this.direccion() || undefined
    };

    this.postService.crearUsuario(nuevoUsuario).subscribe({
      next: (usuario) => {
        this.usuarios.update(usuarios => [...usuarios, usuario]);
        this.cerrarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario se ha creado exitosamente',
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'No se pudo crear el usuario'
        });
      }
    });
  }

  actualizarUsuario(): void {
    const id = this.usuarioEditandoId();
    if (!id) return;

    const usuarioActualizado: UsuarioPut = {
      nombre: this.nombre(),
      email: this.email(),
      password: this.password() || undefined,
      telefono: this.telefono() || undefined,
      direccion: this.direccion() || undefined
    };

    this.putService.actualizarUsuario(id, usuarioActualizado).subscribe({
      next: (usuario) => {
        this.usuarios.update(usuarios =>
          usuarios.map(u => u.id_usuario === id ? usuario : u)
        );
        this.cerrarFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El usuario se ha actualizado exitosamente',
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el usuario'
        });
      }
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    const id = usuario.id_usuario;
    if (!id) return;

    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Estás seguro que deseas eliminar al usuario "${usuario.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteService.eliminarUsuario(id).subscribe({
          next: () => {
            this.usuarios.update(usuarios =>
              usuarios.filter(u => u.id_usuario !== id)
            );
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El usuario ha sido eliminado',
              timer: 2000
            });
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el usuario'
            });
          }
        });
      }
    });
  }
}
