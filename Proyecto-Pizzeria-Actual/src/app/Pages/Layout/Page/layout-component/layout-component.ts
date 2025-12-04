import { Component, signal, computed, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../../Services/auth-service';

@Component({
  selector: 'app-layout-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss'
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para el estado del navbar
  isMenuOpen = signal<boolean>(false);
  isUserMenuOpen = signal<boolean>(false);
  cartItemsCount = signal<number>(0);
  isScrolled = signal<boolean>(false);

  // Computed para obtener el usuario actual
  currentUser = computed(() => this.authService.usuario());
  isLoggedIn = computed(() => this.authService.isAuthenticated());
  hasCartItems = computed(() => this.cartItemsCount() > 0);
  isAdmin = computed(() => {
    const user = this.currentUser();
    // Simple check for admin, ideally should be a role check
    return user?.email?.includes('admin') || user?.nombre?.toLowerCase() === 'admin';
  });

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  ngOnInit() {
    // Cargar datos de carrito si existen en localStorage
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        this.cartItemsCount.set(cart.length || 0);
      } catch (e) {
        this.cartItemsCount.set(0);
      }
    }
  }

  // Método para toggle del menú móvil
  toggleMobileMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  // Método para toggle del menú de usuario
  toggleUserMenu(): void {
    this.isUserMenuOpen.set(!this.isUserMenuOpen());
  }

  // Método para logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Método para ir al carrito
  goToCart(): void {
    this.router.navigate(['/plataforma/productos']);
  }

  // Método para ir a login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Método para ir al panel admin
  goToAdmin(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
