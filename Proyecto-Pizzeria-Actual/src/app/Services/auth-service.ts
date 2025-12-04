import { Injectable, signal, effect, inject } from '@angular/core';
import { PostApiService } from './post-api-service';
import { LoginRequest, LoginResponse } from '../Interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private postService = inject(PostApiService);
  private http = inject(HttpClient);

  // Signals para estado de autenticación
  token = signal<string | null>(localStorage.getItem('token') || null);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  usuario = signal<any>(localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')!) : null);

  constructor() {
    // Verificar token al iniciar
    effect(() => {
      if (this.token()) {
        localStorage.setItem('token', this.token() || '');
      }
    });
  }

  login(email: string, password: string) {
    const credentials: LoginRequest = { email, password };
    return this.postService.login(credentials);
  }

  setToken(token: string) {
    this.token.set(token);
    localStorage.setItem('token', token);
    this.isAuthenticated.set(true);
  }

  setUsuario(usuario: any) {
    this.usuario.set(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  logout() {
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.usuario.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getToken(): string | null {
    return this.token();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getUsuario(): any {
    return this.usuario();
  }
}

