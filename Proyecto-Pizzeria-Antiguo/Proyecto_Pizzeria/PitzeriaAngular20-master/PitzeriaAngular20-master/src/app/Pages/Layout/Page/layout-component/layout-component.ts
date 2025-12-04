import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

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
export class LayoutComponent {
  // Signals para el estado del navbar
  isMenuOpen = signal<boolean>(false);
  cartItemsCount = signal<number>(0);
  currentUser = signal<string | null>(null);

  // Computed para validaciones
  isLoggedIn = computed(() => this.currentUser() !== null);
  hasCartItems = computed(() => this.cartItemsCount() > 0);

  // Método para toggle del menú móvil
  toggleMobileMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  // Método para logout
  logout(): void {
    this.currentUser.set(null);
    // Aquí iría la lógica de logout con el auth service
  }

  // Método para ir al carrito
  goToCart(): void {
    // Navegación al carrito
  }
}
