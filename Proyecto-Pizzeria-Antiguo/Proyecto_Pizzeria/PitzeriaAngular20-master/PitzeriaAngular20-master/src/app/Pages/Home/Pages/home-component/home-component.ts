import { ChangeDetectionStrategy, Component, signal, computed, effect, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.scss', './responsive.scss'],

})
export class HomeComponent {
  // Signals para controlar animaciones y efectos
  isLoaded = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  statsAnimated = signal<boolean>(false);

  // Signals para datos dinámicos
  pizzasVendidas = signal<number>(0);
  satisfaccion = signal<number>(0);
  tiempoEntrega = signal<number>(0);
  anosExperiencia = signal<number>(0);

  // Computed signals para validaciones
  allStatsLoaded = computed(() => {
    return this.pizzasVendidas() === 5000 &&
           this.satisfaccion() === 98 &&
           this.tiempoEntrega() === 25 &&
           this.anosExperiencia() === 30;
  });

  constructor(private elementRef: ElementRef) {
    // Effect para observar cambios en scroll
    effect(() => {
      if (this.isScrolled()) {
        this.startCounterAnimations();
      }
    });
  }

  ngOnInit(): void {
    // Activar animaciones después de que la página cargue
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 300);

    // Agregar listener para scroll
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngAfterViewInit(): void {
    // Configurar intersección observer para estadísticas
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Limpiar listener de scroll
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  // Método para hacer scroll suave a la sección de contacto
  scrollToContact(): void {
    const contactSection = document.getElementById('contacto-section');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Método para abrir WhatsApp
  openWhatsApp(): void {
    const message = encodeURIComponent('¡Hola! Me gustaría hacer un pedido de pizza 🍕');
    window.open(`https://wa.me/51987654321?text=${message}`, '_blank');
  }

  // Método para llamar
  makeCall(): void {
    window.location.href = 'tel:+51987654321';
  }

  // Método para scroll listener
  private onScroll(): void {
    const scrollPosition = window.scrollY;
    this.isScrolled.set(scrollPosition > 100);
  }

  // Configurar intersection observer para estadísticas
  private setupIntersectionObserver(): void {
    const statsSection = this.elementRef.nativeElement.querySelector('.stats-container');

    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.statsAnimated()) {
            this.startCounterAnimations();
            this.statsAnimated.set(true);
          }
        });
      }, {
        threshold: 0.5
      });

      observer.observe(statsSection);
    }
  }

  // Iniciar animaciones de contador
  private startCounterAnimations(): void {
    // Animar pizzas vendidas
    this.animateCounter(0, 5000, 2000, (value) => this.pizzasVendidas.set(value));

    // Animar satisfacción
    setTimeout(() => {
      this.animateCounter(0, 98, 1500, (value) => this.satisfaccion.set(value));
    }, 200);

    // Animar tiempo de entrega
    setTimeout(() => {
      this.animateCounter(0, 25, 1000, (value) => this.tiempoEntrega.set(value));
    }, 400);

    // Animar años de experiencia
    setTimeout(() => {
      this.animateCounter(0, 30, 1200, (value) => this.anosExperiencia.set(value));
    }, 600);
  }

  // Método auxiliar para animar contadores
  private animateCounter(start: number, end: number, duration: number, callback: (value: number) => void): void {
    const startTime = performance.now();
    const range = end - start;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Función de easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (range * easeOut));

      callback(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
