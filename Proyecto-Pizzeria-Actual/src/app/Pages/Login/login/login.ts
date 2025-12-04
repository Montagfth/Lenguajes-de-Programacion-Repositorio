import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth-service';
import { PostApiService } from '../../../Services/post-api-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private authService = inject(AuthService);
  private postService = inject(PostApiService);
  private router = inject(Router);

  email = signal<string>('');
  password = signal<string>('');
  cargando = signal<boolean>(false);

  login() {
    if (!this.email().trim() || !this.password().trim()) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    this.cargando.set(true);
    this.postService.login({ email: this.email(), password: this.password() })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del login:', response);

          // Intentar diferentes estructuras de respuesta
          let token = null;
          let usuario = null;

          if (response.token) {
            token = response.token;
            usuario = response.usuario || response.user || response.data?.user;
          } else if (response.data?.token) {
            token = response.data.token;
            usuario = response.data.usuario || response.data.user;
          } else if (response.result?.token) {
            token = response.result.token;
            usuario = response.result.usuario || response.result.user;
          }

          if (token) {
            console.log('Token guardado:', token);
            this.authService.setToken(token);

            if (usuario) {
              console.log('Usuario guardado:', usuario);
              this.authService.setUsuario(usuario);
            }

            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Sesión iniciada correctamente',
              timer: 1500,
              showConfirmButton: false
            });

            this.router.navigate(['/admin/dashboard']);
          } else {
            console.error('No se encontró token en la respuesta:', response);
            Swal.fire('Error', 'No se pudo obtener el token de autenticación', 'error');
          }

          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error en login:', error);
          Swal.fire('Error', error.error?.message || 'Credenciales inválidas', 'error');
          this.cargando.set(false);
        }
      });
  }
}
