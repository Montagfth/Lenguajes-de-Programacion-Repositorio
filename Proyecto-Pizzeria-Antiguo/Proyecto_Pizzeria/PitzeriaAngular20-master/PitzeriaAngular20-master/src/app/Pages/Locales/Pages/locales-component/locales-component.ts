import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface para los locales
interface Local {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  horarios: {
    lunes_viernes: string;
    sabado: string;
    domingo: string;
  };
  imagen: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  servicios: string[];
  capacidad: number;
  destacado: boolean;
  zona: string;
  whatsapp: string;
  email: string;
  descripcion: string;
  caracteristicas: string[];
}

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

  // Data de locales
  locales = signal<Local[]>([
    {
      id: 1,
      nombre: "Pizzería Deliziosa - Centro",
      direccion: "Av. Lima 1234, Lima Centro",
      telefono: "+51 987 654 321",
      horarios: {
        lunes_viernes: "11:00 AM - 11:00 PM",
        sabado: "10:00 AM - 12:00 AM",
        domingo: "11:00 AM - 10:00 PM"
      },
      imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordenadas: {
        lat: -12.0464,
        lng: -77.0428
      },
      servicios: ["Delivery", "Para llevar", "Salon", "Terraza", "Wifi gratis", "Estacionamiento"],
      capacidad: 80,
      destacado: true,
      zona: "centro",
      whatsapp: "51987654321",
      email: "centro@pizzeriadeliziosa.com",
      descripcion: "Nuestro local principal en el corazón de Lima. Ambiente acogedor con terraza al aire libre.",
      caracteristicas: ["Local principal", "Terraza amplia", "Vista panorámica", "Zona WiFi"]
    },
    {
      id: 2,
      nombre: "Pizzería Deliziosa - San Isidro",
      direccion: "Av. Camino Real 456, San Isidro",
      telefono: "+51 987 654 322",
      horarios: {
        lunes_viernes: "12:00 PM - 11:00 PM",
        sabado: "11:00 AM - 12:00 AM",
        domingo: "12:00 PM - 10:00 PM"
      },
      imagen: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordenadas: {
        lat: -12.0950,
        lng: -77.0365
      },
      servicios: ["Delivery", "Para llevar", "Salon", "Valet parking", "Wifi gratis", "Zona kids"],
      capacidad: 60,
      destacado: true,
      zona: "norte",
      whatsapp: "51987654322",
      email: "sanisidro@pizzeriadeliziosa.com",
      descripcion: "Local moderno en San Isidro con zona especial para niños y valet parking gratuito.",
      caracteristicas: ["Zona kids", "Valet parking", "Ambiente familiar", "Decoración moderna"]
    },
    {
      id: 3,
      nombre: "Pizzería Deliziosa - Miraflores",
      direccion: "Malecón de la Reserva 789, Miraflores",
      telefono: "+51 987 654 323",
      horarios: {
        lunes_viernes: "11:30 AM - 11:30 PM",
        sabado: "10:30 AM - 12:30 AM",
        domingo: "11:30 AM - 11:00 PM"
      },
      imagen: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordenadas: {
        lat: -12.1267,
        lng: -77.0297
      },
      servicios: ["Delivery", "Para llevar", "Salon", "Vista al mar", "Wifi gratis", "Terraza"],
      capacidad: 90,
      destacado: true,
      zona: "sur",
      whatsapp: "51987654323",
      email: "miraflores@pizzeriadeliziosa.com",
      descripcion: "Espectacular local frente al mar con la mejor vista de Lima. Perfecto para cenas románticas.",
      caracteristicas: ["Vista al océano", "Terraza romántica", "Puestas de sol", "Ambiente exclusivo"]
    },
    {
      id: 4,
      nombre: "Pizzería Deliziosa - Surco",
      direccion: "Av. Benavides 321, Santiago de Surco",
      telefono: "+51 987 654 324",
      horarios: {
        lunes_viernes: "12:00 PM - 10:30 PM",
        sabado: "11:00 AM - 11:30 PM",
        domingo: "12:00 PM - 10:00 PM"
      },
      imagen: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordenadas: {
        lat: -12.1504,
        lng: -77.0081
      },
      servicios: ["Delivery", "Para llevar", "Salon", "Jardín", "Wifi gratis", "Eventos privados"],
      capacidad: 70,
      destacado: false,
      zona: "sur",
      whatsapp: "51987654324",
      email: "surco@pizzeriadeliziosa.com",
      descripcion: "Local familiar en Surco con amplio jardín para eventos privados y celebraciones.",
      caracteristicas: ["Jardín amplio", "Área de juegos", "Eventos privados", "Ambiente familiar"]
    },
    {
      id: 5,
      nombre: "Pizzería Deliziosa - Los Olivos",
      direccion: "Av. Carlos Izaguirre 567, Los Olivos",
      telefono: "+51 987 654 325",
      horarios: {
        lunes_viernes: "11:00 AM - 10:00 PM",
        sabado: "10:00 AM - 11:00 PM",
        domingo: "11:00 AM - 9:30 PM"
      },
      imagen: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordenadas: {
        lat: -11.9608,
        lng: -77.0717
      },
      servicios: ["Delivery", "Para llevar", "Salon", "Patio", "Wifi gratis", "Zona de juegos"],
      capacidad: 50,
      destacado: false,
      zona: "norte",
      whatsapp: "51987654325",
      email: "losolivos@pizzeriadeliziosa.com",
      descripcion: "Acogedor local en Los Olivos con patio interno y zona de juegos para toda la familia.",
      caracteristicas: ["Patio interno", "Zona de juegos", "Precios accesibles", "Ambiente casual"]
    },
    {
      id: 6,
      nombre: "Pizzería Deliziosa - La Molina",
      direccion: "Av. La Molina 890, La Molina",
      telefono: "+51 987 654 326",
      horarios: {
        lunes_viernes: "12:00 PM - 11:00 PM",
        sabado: "11:00 AM - 12:00 AM",
        domingo: "12:00 PM - 10:30 PM"
      },
      imagen: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      coordenadas: {
        lat: -12.0768,
        lng: -76.9422
      },
      servicios: ["Delivery", "Para llevar", "Salon", "Drive thru", "Wifi gratis", "Estacionamiento"],
      capacidad: 65,
      destacado: false,
      zona: "este",
      whatsapp: "51987654326",
      email: "lamolina@pizzeriadeliziosa.com",
      descripcion: "Moderno local con servicio drive thru, perfecto para ordenar desde tu auto.",
      caracteristicas: ["Drive thru", "Servicio rápido", "Amplio estacionamiento", "Tecnología moderna"]
    }
  ]);

  // Computed properties
  localesDestacados = computed(() =>
    this.locales().filter(local => local.destacado)
  );

  localesPorZona = computed(() => {
    const filtro = this.filtroZona();
    if (filtro === 'todos') {
      return this.locales();
    }
    return this.locales().filter(local => local.zona === filtro);
  });

  totalLocales = computed(() => this.locales().length);

  zonasDisponibles = computed(() => {
    const zonas = [...new Set(this.locales().map(local => local.zona))];
    return zonas.map(zona => ({
      value: zona,
      label: this.getNombreZona(zona),
      count: this.locales().filter(l => l.zona === zona).length
    }));
  });

  ngOnInit() {
    // Simular carga de datos
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 100);
  }

  // Métodos para filtros
  setFiltroZona(zona: string) {
    this.filtroZona.set(zona);
  }

  getNombreZona(zona: string): string {
    const nombres: Record<string, string> = {
      'centro': 'Centro de Lima',
      'norte': 'Lima Norte',
      'sur': 'Lima Sur',
      'este': 'Lima Este',
      'oeste': 'Lima Oeste'
    };
    return nombres[zona] || zona;
  }

  getIconoZona(zona: string): string {
    const iconos: Record<string, string> = {
      'centro': 'bi bi-building',
      'norte': 'bi bi-compass',
      'sur': 'bi bi-geo-alt',
      'este': 'bi bi-sunrise',
      'oeste': 'bi bi-sunset'
    };
    return iconos[zona] || 'bi bi-geo-alt';
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

  contactarWhatsApp(whatsapp: string, nombreLocal: string) {
    const mensaje = encodeURIComponent(`¡Hola! Me interesa información sobre ${nombreLocal}. ¿Podrían ayudarme?`);
    window.open(`https://wa.me/${whatsapp}?text=${mensaje}`, '_blank');
  }

  enviarEmail(email: string, nombreLocal: string) {
    const asunto = encodeURIComponent(`Consulta sobre ${nombreLocal}`);
    const cuerpo = encodeURIComponent(`¡Hola!\n\nMe gustaría recibir más información sobre su local.\n\nGracias.`);
    window.open(`mailto:${email}?subject=${asunto}&body=${cuerpo}`, '_self');
  }

  verEnMapa(coordenadas: {lat: number, lng: number}, nombre: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordenadas.lat},${coordenadas.lng}&query_place_id=${encodeURIComponent(nombre)}`;
    window.open(url, '_blank');
  }

  // Métodos de utilidad
  getEstadoLocal(horarios: any): string {
    const ahora = new Date();
    const diaSemana = ahora.getDay(); // 0 = domingo, 1 = lunes, etc.
    const horaActual = ahora.getHours() * 100 + ahora.getMinutes();

    // Lógica simplificada - en producción sería más compleja
    if (diaSemana >= 1 && diaSemana <= 5) {
      // Lunes a viernes: 11:00 - 23:00 (ejemplo)
      return (horaActual >= 1100 && horaActual <= 2300) ? 'Abierto' : 'Cerrado';
    } else if (diaSemana === 6) {
      // Sábado: 10:00 - 24:00
      return (horaActual >= 1000 && horaActual <= 2400) ? 'Abierto' : 'Cerrado';
    } else {
      // Domingo: 11:00 - 22:00
      return (horaActual >= 1100 && horaActual <= 2200) ? 'Abierto' : 'Cerrado';
    }
  }

  formatearDireccion(direccion: string): string {
    return direccion.replace(/,/g, ',<br>');
  }
}
