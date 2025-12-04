import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostApiService } from '../../../Services/post-api-service';
import { UsuarioPost } from '../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Registro {
  private postService = inject(PostApiService);
  private router = inject(Router);

  // Signals para el formulario
  nombre = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  telefono = signal<string>('');
  direccion = signal<string>('');

  cargando = signal<boolean>(false);

  // Validaciones
  isNombreValid = computed(() => this.nombre().trim().length >= 3);
  isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  isPasswordValid = computed(() => this.password().length >= 6);
  isTelefonoValid = computed(() => this.telefono().trim().length >= 9);

  isFormValid = computed(() =>
    this.isNombreValid() &&
    this.isEmailValid() &&
    this.isPasswordValid() &&
    this.isTelefonoValid()
  );

  registrarse() {
    if (!this.isFormValid() || this.cargando()) return;

    this.cargando.set(true);

    const nuevoUsuario: UsuarioPost = {
      nombre: this.nombre(),
      email: this.email(),
      password: this.password(),
      telefono: this.telefono(),
      direccion: this.direccion()
    };

    this.postService.crearUsuario(nuevoUsuario).subscribe({
      next: (response) => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'success',
          title: '¡Registro Exitoso!',
          text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
          confirmButtonText: 'Ir al Login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.cargando.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la cuenta. Intenta con otro correo o verifica tus datos.'
        });
      }
    });
  }
}
