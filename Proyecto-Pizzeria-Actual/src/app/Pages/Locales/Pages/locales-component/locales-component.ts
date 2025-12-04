import { ChangeDetectionStrategy, Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetApiService } from '../../../../Services/get-api-service';
import { PostApiService } from '../../../../Services/post-api-service';
import { AuthService } from '../../../../Services/auth-service';
import { Local, Evento, ReservaPost } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-locales-component',
  imports: [CommonModule],
  templateUrl: './locales-component.html',
  styleUrl: './locales-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class LocalesComponent implements OnInit {

  // Estado del componente
  isLoaded = signal<boolean>(false);
  filtroZona = signal<string>('todos');
  localSeleccionado = signal<Local | null>(null);
  private getApiService = inject(GetApiService);
  private postApiService = inject(PostApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Array de imágenes para usar de forma cíclica
  private imagenesLocales = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  // Data de locales
  locales = signal<Local[]>([]);
  eventos = signal<Evento[]>([]);

  // Computed properties
  localesDestacados = computed(() =>
    this.locales().slice(0, 3) // Primeros 3 como destacados
  );

  localesPorZona = computed(() => {
    const filtro = this.filtroZona();
    if (filtro === 'todos') {
      return this.locales();
    }
    // Filtrar por ciudad
    return this.locales().filter(local => local.ciudad?.toLowerCase() === filtro.toLowerCase());
  });

  totalLocales = computed(() => this.locales().length);

  zonasDisponibles = computed(() => {
    const ciudades = [...new Set(this.locales().map(local => local.ciudad).filter(Boolean))];
    return ciudades.map(ciudad => ({
      value: ciudad!.toLowerCase(),
      label: ciudad!,
      count: this.locales().filter(l => l.ciudad?.toLowerCase() === ciudad!.toLowerCase()).length
    }));
  });

  ngOnInit() {
    // Cargar locales desde el backend
    this.cargarLocales();

    // Simular carga de datos
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 100);
  }

  // Método para cargar locales desde el backend
  private cargarLocales(): void {
    this.getApiService.getLocales().subscribe({
      next: (response: any) => {
        const locales = Array.isArray(response) ? response : (response.data || response.result || response.locales || []);
        console.log('Locales cargados:', locales);
        this.locales.set(locales);
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
        this.locales.set([]);
      }
    });

    this.getApiService.getEventos().subscribe({
      next: (response: any) => {
        const eventos = Array.isArray(response) ? response : (response.data || response.result || response.eventos || []);
        console.log('Eventos cargados:', eventos);
        this.eventos.set(eventos);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.eventos.set([]);
      }
    });
  }

  // Métodos para filtros
  setFiltroZona(zona: string) {
    this.filtroZona.set(zona);
  }

  getNombreZona(zona: string): string {
    return zona; // Retorna la ciudad tal cual viene del backend
  }

  // Método para obtener imagen de un local (ciclo de imágenes)
  getImagenLocal(index: number): string {
    return this.imagenesLocales[index % this.imagenesLocales.length];
  }

  // Método para formatear horario
  formatearHorario(apertura?: string, cierre?: string): string {
    if (!apertura || !cierre) return 'Horario no disponible';
    return `${apertura} - ${cierre}`;
  }

  // Método para verificar si el local está activo
  isLocalActivo(local: Local): boolean {
    return local.activo ?? false;
  }

  // Métodos para modal
  seleccionarLocal(local: Local) {
    this.localSeleccionado.set(local);
  }

  cerrarModal() {
    this.localSeleccionado.set(null);
  }

  // Métodos de contacto
  llamarLocal(telefono: string) {
    window.open(`tel:${telefono}`, '_self');
  }

  reservarLocal(local: Local) {
    if (!this.authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para realizar una reserva',
        showCancelButton: true,
        confirmButtonText: 'Ir al Login',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // Filtrar eventos del local
    // Como los eventos no tienen fk_id_local, mostramos todos los eventos disponibles
    const eventosLocal = this.eventos();

    let eventosOptions = '<option value="0">Sin evento (Reserva normal)</option>';
    eventosLocal.forEach(evento => {
      eventosOptions += `<option value="${evento.id_evento || evento.id}">${evento.nombre_evento || evento.titulo}</option>`;
    });

    Swal.fire({
      title: `Reservar en ${local.nombre}`,
      html: `
        <div class="mb-3 text-start">
          <label class="form-label">Evento (Opcional)</label>
          <select id="evento" class="swal2-input mt-0 w-100">
            ${eventosOptions}
          </select>
        </div>
        <div class="mb-3 text-start">
          <label class="form-label">Fecha</label>
          <input type="date" id="fecha" class="swal2-input mt-0 w-100" min="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="mb-3 text-start">
          <label class="form-label">Hora</label>
          <input type="time" id="hora" class="swal2-input mt-0 w-100">
        </div>
        <div class="mb-3 text-start">
          <label class="form-label">Personas</label>
          <input type="number" id="personas" class="swal2-input mt-0 w-100" placeholder="Cantidad de personas" min="1">
        </div>
      `,
      confirmButtonText: 'Confirmar Reserva',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const fecha = (document.getElementById('fecha') as HTMLInputElement).value;
        const hora = (document.getElementById('hora') as HTMLInputElement).value;
        const personas = (document.getElementById('personas') as HTMLInputElement).value;
        const eventoId = (document.getElementById('evento') as HTMLSelectElement).value;

        if (!fecha || !hora || !personas) {
          Swal.showValidationMessage('Por favor completa todos los campos obligatorios');
          return false;
        }
        return { fecha, hora, personas: parseInt(personas), eventoId: parseInt(eventoId) };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const usuario = this.authService.usuario();
        const reserva: ReservaPost = {
          fk_id_usuario: usuario.id_usuario || usuario.id,
          fk_id_evento: result.value.eventoId,
          fk_id_local: local.id_local || local.id || 0,
          fecha_reserva: result.value.fecha,
          hora_reserva: result.value.hora.length === 5 ? result.value.hora + ':00' : result.value.hora,
          cant_personas: result.value.personas,
          estado: 'pendiente'
        };

        this.postApiService.crearReserva(reserva).subscribe({
          next: () => {
            Swal.fire('¡Reserva Exitosa!', 'Tu reserva ha sido registrada correctamente.', 'success');
          },
          error: (error) => {
            console.error('Error al reservar:', error);
            Swal.fire('Error', 'No se pudo realizar la reserva. Intenta nuevamente.', 'error');
          }
        });
      }
    });
  }

  enviarEmail(email: string, nombreLocal: string) {
    const asunto = encodeURIComponent(`Consulta sobre ${nombreLocal}`);
    const cuerpo = encodeURIComponent(`¡Hola!\n\nMe gustaría recibir más información sobre su local.\n\nGracias.`);
    window.open(`mailto:${email}?subject=${asunto}&body=${cuerpo}`, '_self');
  }
}
