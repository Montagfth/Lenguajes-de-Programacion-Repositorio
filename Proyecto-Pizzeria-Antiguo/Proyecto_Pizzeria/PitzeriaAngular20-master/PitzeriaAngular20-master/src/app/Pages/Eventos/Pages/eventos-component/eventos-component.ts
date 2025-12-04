import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface para los eventos
interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  imagen: string;
  precio: number;
  categoria: 'cumpleanos' | 'corporativo' | 'familiar' | 'especial';
  capacidad: number;
  disponible: boolean;
  destacado: boolean;
  incluye: string[];
}

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

  // Signal con los eventos (simulando datos de una API)
  eventos = signal<Evento[]>([
    {
      id: 1,
      titulo: "Cumpleaños Familiar",
      descripcion: "Celebra el cumpleaños de tu ser querido con nuestro paquete familiar especial. Incluye decoración, pizza personalizada y torta.",
      fecha: "2024-12-15",
      hora: "18:00",
      imagen: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      precio: 150,
      categoria: "cumpleanos",
      capacidad: 20,
      disponible: true,
      destacado: true,
      incluye: ["3 Pizzas familiares", "Decoración temática", "Torta de cumpleaños", "Gaseosas ilimitadas", "Animación"]
    },
    {
      id: 2,
      titulo: "Evento Corporativo",
      descripcion: "Organiza tu reunión corporativa o celebración de empresa en nuestro local. Ambiente profesional y menú ejecutivo.",
      fecha: "2024-12-20",
      hora: "12:00",
      imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      precio: 300,
      categoria: "corporativo",
      capacidad: 50,
      disponible: true,
      destacado: false,
      incluye: ["Menú ejecutivo", "Sala privada", "Proyector y sonido", "Coffee break", "Servicio de meseros"]
    },
    {
      id: 3,
      titulo: "Noche de Pizza y Karaoke",
      descripcion: "Disfruta de una noche divertida con karaoke, pizza ilimitada y buena música. Perfecto para grupos de amigos.",
      fecha: "2024-12-22",
      hora: "20:00",
      imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      precio: 80,
      categoria: "especial",
      capacidad: 30,
      disponible: true,
      destacado: true,
      incluye: ["Pizza ilimitada", "Karaoke", "DJ en vivo", "Bebidas", "Ambiente festivo"]
    },
    {
      id: 4,
      titulo: "Almuerzo Familiar Dominical",
      descripcion: "Reúne a toda la familia en nuestro almuerzo dominical especial. Menú tradicional y ambiente acogedor.",
      fecha: "2024-12-17",
      hora: "13:00",
      imagen: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      precio: 120,
      categoria: "familiar",
      capacidad: 25,
      disponible: true,
      destacado: false,
      incluye: ["Menú familiar", "Juegos para niños", "Área de juegos", "Postres", "Ambiente familiar"]
    },
    {
      id: 5,
      titulo: "Cena Romántica",
      descripcion: "Una velada especial para parejas con cena romántica, música en vivo y ambiente íntimo.",
      fecha: "2024-12-25",
      hora: "19:30",
      imagen: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      precio: 200,
      categoria: "especial",
      capacidad: 10,
      disponible: false,
      destacado: true,
      incluye: ["Cena de 3 tiempos", "Música en vivo", "Decoración romántica", "Copa de vino", "Postre especial"]
    },
    {
      id: 6,
      titulo: "Graduación Escolar",
      descripcion: "Celebra el logro académico con nuestro paquete especial de graduación. Perfecto para estudiantes.",
      fecha: "2024-12-28",
      hora: "16:00",
      imagen: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      precio: 180,
      categoria: "cumpleanos",
      capacidad: 40,
      disponible: true,
      destacado: false,
      incluye: ["Buffet de pizzas", "Ceremonia especial", "Fotografía", "Diploma simbólico", "Brindis"]
    }
  ]);

  // Computed signals para filtros
  eventosDestacados = computed(() =>
    this.eventos().filter(evento => evento.destacado)
  );

  eventosFiltrados = computed(() => {
    const filtro = this.filtroActivo();
    if (filtro === 'todos') return this.eventos();
    if (filtro === 'disponibles') return this.eventos().filter(e => e.disponible);
    return this.eventos().filter(e => e.categoria === filtro);
  });

  eventosDisponibles = computed(() =>
    this.eventos().filter(evento => evento.disponible).length
  );

  ngOnInit(): void {
    // Activar animaciones después de cargar
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 200);
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
      `¡Hola! Me interesa reservar el evento: "${evento.titulo}" para el ${evento.fecha} a las ${evento.hora}. ¿Podrían darme más información?`
    );
    window.open(`https://wa.me/51987654321?text=${mensaje}`, '_blank');
  }

  // Método para obtener el color de la categoría
  getColorCategoria(categoria: string): string {
    const colores = {
      'cumpleanos': 'success',
      'corporativo': 'primary',
      'familiar': 'warning',
      'especial': 'danger'
    };
    return colores[categoria as keyof typeof colores] || 'secondary';
  }

  // Método para obtener el icono de la categoría
  getIconoCategoria(categoria: string): string {
    const iconos = {
      'cumpleanos': 'bi-gift',
      'corporativo': 'bi-briefcase',
      'familiar': 'bi-house-heart',
      'especial': 'bi-star'
    };
    return iconos[categoria as keyof typeof iconos] || 'bi-calendar-event';
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
