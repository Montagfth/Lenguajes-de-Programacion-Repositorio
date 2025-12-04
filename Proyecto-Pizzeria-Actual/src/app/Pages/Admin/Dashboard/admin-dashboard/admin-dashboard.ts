import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetApiService } from '../../../../Services/get-api-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard implements OnInit {
  private getService = inject(GetApiService);

  totalProductos = signal<number>(0);
  totalEventos = signal<number>(0);
  totalPedidos = signal<number>(0);
  totalReservas = signal<number>(0);
  totalUsuarios = signal<number>(0);
  totalLocales = signal<number>(0);
  cargando = signal<boolean>(true);

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.getService.getProductos().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || []);
        this.totalProductos.set(data.length);
      }
    });
    
    this.getService.getEventos().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || []);
        this.totalEventos.set(data.length);
      }
    });
    
    this.getService.getPedidos().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || []);
        this.totalPedidos.set(data.length);
      }
    });
    
    this.getService.getReservas().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || []);
        this.totalReservas.set(data.length);
      }
    });
    
    this.getService.getUsuarios().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || []);
        this.totalUsuarios.set(data.length);
      }
    });
    
    this.getService.getLocales().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || []);
        this.totalLocales.set(data.length);
        this.cargando.set(false);
      }
    });
  }
}
