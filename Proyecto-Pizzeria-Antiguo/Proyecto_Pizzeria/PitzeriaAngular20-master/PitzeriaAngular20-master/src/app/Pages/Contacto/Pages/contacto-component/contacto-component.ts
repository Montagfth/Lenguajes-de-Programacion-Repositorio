import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-contacto-component",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto-component.html',
  styleUrl: './contacto-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactoComponent {
  // Signals para el formulario de contacto
  nombre = signal<string>('');
  email = signal<string>('');
  telefono = signal<string>('');
  asunto = signal<string>('');
  mensaje = signal<string>('');

  // Signals para UI
  isLoaded = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);

  // Computed para validaciones del formulario
  isNombreValid = computed(() => this.nombre().trim().length >= 2);
  isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email());
  });
  isTelefonoValid = computed(() => this.telefono().trim().length >= 9);
  isAsuntoValid = computed(() => this.asunto().trim().length >= 3);
  isMensajeValid = computed(() => this.mensaje().trim().length >= 10);

  // Computed para validación completa del formulario
  isFormValid = computed(() =>
    this.isNombreValid() &&
    this.isEmailValid() &&
    this.isTelefonoValid() &&
    this.isAsuntoValid() &&
    this.isMensajeValid()
  );

  ngOnInit(): void {
    // Activar animaciones después de cargar
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 200);
  }

  // Método para enviar el formulario
  onSubmitForm(): void {
    if (!this.isFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    // Simular envío del formulario
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.showSuccessMessage.set(true);
      this.resetForm();

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        this.showSuccessMessage.set(false);
      }, 5000);
    }, 2000);
  }

  // Método para resetear el formulario
  private resetForm(): void {
    this.nombre.set('');
    this.email.set('');
    this.telefono.set('');
    this.asunto.set('');
    this.mensaje.set('');
  }

  // Métodos para contacto directo
  openWhatsApp(): void {
    const message = encodeURIComponent('¡Hola! Me gustaría contactar con Pizzería Deliziosa 🍕');
    window.open(`https://wa.me/51987654321?text=${message}`, '_blank');
  }

  makeCall(): void {
    window.location.href = 'tel:+51987654321';
  }

  sendEmail(): void {
    window.location.href = 'mailto:info@pizzeriadeliziosa.com';
  }

  // Método para abrir mapa
  openMap(): void {
    window.open('https://maps.google.com/?q=Av.+Principal+123,+Lima,+Peru', '_blank');
  }
}
