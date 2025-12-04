import { ChangeDetectionStrategy, Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetApiService } from '../../../../Services/get-api-service';
import { Evento } from '../../../../Interfaces/Evento';

@Component({
  selector: 'app-eventos-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos-component.html',
  styleUrl: './eventos-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventosComponent implements OnInit {
  // Signals para el estado de la página
  isLoaded = signal<boolean>(false);
  filtroActivo = signal<string>('todos');
  eventoSeleccionado = signal<Evento | null>(null);
  private getApiService = inject(GetApiService);

  // Signal con los eventos
  eventos = signal<Evento[]>([]);

  // Computed signals para filtros
  eventosDestacados = computed(() =>
    this.eventos().slice(0, 3) // Primeros 3 como destacados
  );

  eventosFiltrados = computed(() => {
    const filtro = this.filtroActivo();
    // Como ya no hay estado ni categorías, retornamos todos los eventos
    return this.eventos();
  });

  eventosDisponibles = computed(() =>
    this.eventos().length
  );

  ngOnInit(): void {
    // Cargar eventos desde el backend
    this.cargarEventos();

    // Activar animaciones después de cargar
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 200);
  }

  // Array de imágenes para usar de forma cíclica
  private imagenesEventos = [
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  // Método para cargar eventos desde el backend
  private cargarEventos(): void {
    this.getApiService.getEventos().subscribe({
      next: (response: any) => {
        const eventosApi = Array.isArray(response) ? response : (response.data || response.result || response.eventos || []);
        console.log('Eventos cargados:', eventosApi);
        const eventosMapeados = eventosApi.map((evento: any, index: number) => this.mapearEvento(evento, index));
        this.eventos.set(eventosMapeados);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        // Mantener eventos de ejemplo en caso de error
        this.eventos.set([]);
      }
    });
  }

  // Método para mapear evento del API (solo retorna el evento sin modificar)
  private mapearEvento(evento: Evento, index: number): Evento {
    return evento;
  }

  // Métodos para filtros
  setFiltro(filtro: string): void {
    this.filtroActivo.set(filtro);
  }

  // Método para seleccionar evento
  seleccionarEvento(evento: Evento): void {
    this.eventoSeleccionado.set(evento);
  }

  cerrarModal(): void {
    this.eventoSeleccionado.set(null);
  }

  // Método para reservar evento
  reservarEvento(evento: Evento): void {
    const mensaje = encodeURIComponent(
      `¡Hola! Me interesa reservar el evento: "${evento.nombre_evento || evento.titulo}". ¿Podrían darme más información?`
    );
    window.open(`https://wa.me/51987654321?text=${mensaje}`, '_blank');
  }

  // Método para obtener imagen según índice
  getImagenEvento(index: number): string {
    return this.imagenesEventos[index % this.imagenesEventos.length];
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha por confirmar';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Método para extraer hora de una fecha
  getHora(fecha: string): string {
    if (!fecha) return 'Por confirmar';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  // Método para extraer día del mes
  getDia(fecha: string): string {
    if (!fecha) return '00';
    return new Date(fecha).getDate().toString().padStart(2, '0');
  }

  // Método para extraer mes
  getMes(fecha: string): string {
    if (!fecha) return 'MES';
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return meses[new Date(fecha).getMonth()];
  }
}
