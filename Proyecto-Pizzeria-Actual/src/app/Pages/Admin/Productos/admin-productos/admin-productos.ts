import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetApiService } from '../../../../Services/get-api-service';
import { PostApiService } from '../../../../Services/post-api-service';
import { PutApiService } from '../../../../Services/put-api-service';
import { DeleteApiService } from '../../../../Services/delete-api-service';
import { Producto, ProductoPost, ProductoPut } from '../../../../Interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProductos implements OnInit {
  private getService = inject(GetApiService);
  private postService = inject(PostApiService);
  private putService = inject(PutApiService);
  private deleteService = inject(DeleteApiService);

  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  mostrarForm = signal<boolean>(false);
  editando = signal<boolean>(false);
  productoActual = signal<Producto | null>(null);

  nombre = signal<string>('');
  descripcion = signal<string>('');
  precio = signal<number>(0);
  stock = signal<number>(0);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando.set(true);
    this.getService.getProductos().subscribe({
      next: (response: any) => {
        console.log('Respuesta getProductos:', response);
        
        // Manejar diferentes estructuras de respuesta
        let productosArray: Producto[] = [];
        
        if (Array.isArray(response)) {
          productosArray = response;
        } else if (response.data && Array.isArray(response.data)) {
          productosArray = response.data;
        } else if (response.result && Array.isArray(response.result)) {
          productosArray = response.result;
        } else if (response.productos && Array.isArray(response.productos)) {
          productosArray = response.productos;
        } else {
          console.error('Estructura de respuesta desconocida:', response);
          productosArray = [];
        }
        
        console.log('Productos cargados:', productosArray);
        this.productos.set(productosArray);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        this.cargando.set(false);
      }
    });
  }

  nuevo() {
    this.limpiarForm();
    this.editando.set(false);
    this.mostrarForm.set(true);
  }

  editar(producto: Producto) {
    this.productoActual.set(producto);
    this.nombre.set(producto.nombre || '');
    this.descripcion.set(producto.descripcion || '');
    this.precio.set(producto.precio || 0);
    this.stock.set(producto.stock || 0);
    this.editando.set(true);
    this.mostrarForm.set(true);
  }

  guardar() {
    if (!this.nombre().trim() || this.precio() <= 0) {
      Swal.fire('Error', 'Completa todos los campos requeridos', 'error');
      return;
    }

    if (this.editando()) {
      const id = this.productoActual()?.id_producto;
      if (!id) return;

      const data: ProductoPut = {
        nombre: this.nombre(),
        descripcion: this.descripcion(),
        precio: this.precio(),
        stock: this.stock()
      };

      this.putService.actualizarProducto(id, data).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto actualizado', 'success');
          this.mostrarForm.set(false);
          this.cargarProductos();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
    } else {
      const data: ProductoPost = {
        nombre: this.nombre(),
        descripcion: this.descripcion(),
        precio: this.precio(),
        stock: this.stock()
      };

      this.postService.crearProducto(data).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Producto creado', 'success');
          this.mostrarForm.set(false);
          this.cargarProductos();
        },
        error: () => Swal.fire('Error', 'No se pudo crear', 'error')
      });
    }
  }

  eliminar(id: number | undefined) {
    if (!id) return;

    Swal.fire({
      title: '¿Eliminar?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteService.eliminarProducto(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Producto eliminado', 'success');
            this.cargarProductos();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }

  limpiarForm() {
    this.nombre.set('');
    this.descripcion.set('');
    this.precio.set(0);
    this.stock.set(0);
    this.productoActual.set(null);
  }
}
