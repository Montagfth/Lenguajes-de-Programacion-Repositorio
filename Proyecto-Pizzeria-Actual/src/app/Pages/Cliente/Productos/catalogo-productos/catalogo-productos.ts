import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetApiService } from '../../../../Services/get-api-service';
import { PostApiService } from '../../../../Services/post-api-service';
import { AuthService } from '../../../../Services/auth-service';
import { Producto, PedidoPost, DetallePedidoPost } from '../../../../Interfaces';
import Swal from 'sweetalert2';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-catalogo-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-productos.html',
  styleUrl: './catalogo-productos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogoProductos implements OnInit {
  private getService = inject(GetApiService);
  private postService = inject(PostApiService);
  private authService = inject(AuthService);

  productos = signal<Producto[]>([]);
  carrito = signal<ItemCarrito[]>([]);
  cargando = signal<boolean>(true);
  filtro = signal<string>('');

  productosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase();
    if (!f) return this.productos();
    return this.productos().filter(p =>
      p.nombre?.toLowerCase().includes(f) || p.descripcion?.toLowerCase().includes(f)
    );
  });

  totalCarrito = computed(() => {
    return this.carrito().reduce((sum, item) => sum + ((item.producto.precio || 0) * item.cantidad), 0);
  });

  cantidadItems = computed(() => {
    return this.carrito().reduce((sum, item) => sum + item.cantidad, 0);
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.getService.getProductos().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response.data || response.result || response.productos || []);
        console.log('Productos cargados en catálogo:', data);
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        this.cargando.set(false);
      }
    });
  }

  agregarAlCarrito(producto: Producto) {
    if (!producto.stock || producto.stock <= 0) {
      Swal.fire('Advertencia', 'Producto sin stock', 'warning');
      return;
    }

    const carritoActual = [...this.carrito()];
    const index = carritoActual.findIndex(item => item.producto.id_producto === producto.id_producto);

    if (index >= 0) {
      if (carritoActual[index].cantidad < producto.stock) {
        carritoActual[index].cantidad++;
      } else {
        Swal.fire('Advertencia', 'Stock insuficiente', 'warning');
        return;
      }
    } else {
      carritoActual.push({ producto, cantidad: 1 });
    }

    this.carrito.set(carritoActual);
    Swal.fire({
      icon: 'success',
      title: 'Agregado',
      text: `${producto.nombre} añadido al carrito`,
      timer: 1500,
      showConfirmButton: false
    });
  }

  removerDelCarrito(index: number) {
    const carritoActual = [...this.carrito()];
    carritoActual.splice(index, 1);
    this.carrito.set(carritoActual);
  }

  cambiarCantidad(index: number, cantidad: number) {
    const carritoActual = [...this.carrito()];
    const maxStock = carritoActual[index].producto.stock || 0;

    if (cantidad <= 0) {
      this.removerDelCarrito(index);
    } else if (cantidad <= maxStock) {
      carritoActual[index].cantidad = cantidad;
      this.carrito.set(carritoActual);
    } else {
      Swal.fire('Advertencia', 'Stock insuficiente', 'warning');
    }
  }

  realizarPedido() {
    if (this.carrito().length === 0) {
      Swal.fire('Advertencia', 'El carrito está vacío', 'warning');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      Swal.fire('Advertencia', 'Debes iniciar sesión', 'warning');
      return;
    }

    const usuario = this.authService.getUsuario();
    if (!usuario?.id_usuario) {
      Swal.fire('Error', 'No se pudo identificar el usuario', 'error');
      return;
    }

    // Mostrar resumen del pedido
    const itemsHtml = this.carrito().map(item =>
      `<div class="text-start">
        <strong>${item.producto.nombre}</strong> x${item.cantidad} = $${(item.producto.precio! * item.cantidad).toFixed(2)}
      </div>`
    ).join('');

    Swal.fire({
      title: 'Confirmar Pedido',
      html: `
        <div class="mb-3">
          ${itemsHtml}
        </div>
        <hr>
        <div class="text-start">
          <strong>Total: $${this.totalCarrito().toFixed(2)}</strong>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar Pedido',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        // Crear el pedido
        const pedido: PedidoPost = {
          fk_id_usuario: usuario.id_usuario!,
          estado_pedido: 'pendiente',
          total: this.totalCarrito()
        };

        return this.postService.crearPedido(pedido).toPromise()
          .then((response: any) => {
            const pedidoCreado = response;
            const idPedido = pedidoCreado.data.id_pedido || pedidoCreado.id;

            if (!idPedido) {
              throw new Error('No se pudo obtener el ID del pedido');
            }

            // Crear los detalles del pedido
            const detallesPromises = this.carrito().map(item => {
              const detalle: DetallePedidoPost = {
                fk_id_pedido: idPedido,
                fk_id_producto: item.producto.id_producto!,
                cantidad: item.cantidad,
                subtotal: item.producto.precio! * item.cantidad
              };
              return this.postService.crearDetallePedido(detalle).toPromise();
            });

            return Promise.all(detallesPromises);
          })
          .catch(error => {
            console.error('Error al crear pedido:', error);
            Swal.showValidationMessage(`Error: ${error.message || 'No se pudo crear el pedido'}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '¡Pedido Creado!',
          text: 'Tu pedido ha sido registrado correctamente',
          timer: 2000
        });
        this.carrito.set([]);
      }
    });
  }

  vaciarCarrito() {
    Swal.fire({
      title: '¿Vaciar carrito?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrito.set([]);
      }
    });
  }

  scrollToCart() {
    const cartElement = document.getElementById('cart-section');
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (this.carrito().length > 0) {
        // Wait for render
        setTimeout(() => {
          const el = document.getElementById('cart-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        Swal.fire('Carrito vacío', 'Agrega productos para ver el carrito', 'info');
      }
    }
  }
}
