# Implementación OpenAPI - Pizzería Angular 20

## 📋 Resumen de Cambios

He realizado una implementación completa del OpenAPI de tu pizzería en el proyecto Angular 20. A continuación detallo lo que se ha creado y configurado:

---

## 🏗️ Estructura Implementada

### 1. **Interfaces/DTOs (Modelos de Datos)**
Creadas en `/src/app/Interfaces/`:

- **Usuario.ts** - Interfaz Usuario, UsuarioPost, UsuarioPut, UserInfo
- **Producto.ts** - Interfaz Producto, ProductoPost, ProductoPut
- **Evento.ts** - Interfaz Evento, EventoPost, EventoPut
- **Local.ts** - Interfaz Local, LocalPost, LocalPut
- **Pedido.ts** - Interfaz Pedido, PedidoPost, PedidoPut
- **DetallePedido.ts** - Interfaz DetallePedido, DetallePedidoPost, DetallePedidoPut
- **Reserva.ts** - Interfaz Reserva, ReservaPost, ReservaPut
- **Mensaje.ts** - Interfaz Mensaje, MensajePost, MensajePut
- **Login.ts** - Interfaz LoginRequest, LoginResponse
- **Response.ts** - Interfaz SuccessResponse, ErrorResponse
- **index.ts** - Exportador central de todas las interfaces

**Convención**: Cada entidad tiene 3 variantes:
- Base (GET) - Incluye ID y campos opcionales
- Post - Sin ID, campos requeridos según OpenAPI
- Put - Con ID obligatorio, campos requeridos

---

### 2. **Servicios API**
Creados en `/src/app/Services/`:

#### **get-api-service.ts**
Métodos para obtener datos (GET):
- `getUsuarios()`, `getUsuarioById(id)`
- `getProductos()`, `getProductoById(id)`
- `getEventos()`, `getEventoById(id)`
- `getLocales()`, `getLocalById(id)`
- `getReservas()`, `getReservaById(id)`, `getReservasByUsuario(usuarioId)`
- `getPedidos()`, `getPedidoById(id)`, `getPedidosByUsuario(usuarioId)`
- `getDetallesPedido(pedidoId)`, `getDetallePedido(pedidoId, productoId)`
- `getMensajes()`, `getMensajeById(id)`, `getMensajesByUsuario(usuarioId)`
- Aliases para compatibilidad: `GetLocales()`, `GetEventos()`, etc.

#### **post-api-service.ts**
Métodos para crear datos (POST):
- `login(credentials)` - Autenticación
- `crearUsuario(usuario)`, `crearProducto(producto)`, `crearEvento(evento)`
- `crearLocal(local)`, `crearReserva(reserva)`, `crearPedido(pedido)`
- `crearDetallePedido(detalle)`, `crearMensaje(mensaje)`

#### **put-api-service.ts** (NUEVO)
Métodos para actualizar datos (PUT):
- `actualizarUsuario(id, usuario)`, `actualizarProducto(id, producto)`, etc.
- Para todas las 8 entidades principales

#### **delete-api-service.ts** (NUEVO)
Métodos para eliminar datos (DELETE):
- `eliminarUsuario(id)`, `eliminarProducto(id)`, etc.
- Para todas las 8 entidades principales

#### **auth-service.ts** (NUEVO)
Gestión de autenticación con Signals:
- `login(email, password)` - Realiza login
- `setToken(token)` - Almacena JWT
- `setUsuario(usuario)` - Guarda datos de usuario
- `getToken()` - Retorna token JWT
- `isLoggedIn()` - Verifica si está autenticado
- `logout()` - Cierra sesión
- Usa Signals para reactividad

---

### 3. **Autenticación e Interceptores**
Creados en `/src/app/Middleware/`:

#### **auth-interceptor.ts** (NUEVO)
Interceptor HTTP que:
- Agrega automáticamente el header `Authorization: Bearer {token}` a todas las peticiones
- Maneja errores 401 (no autorizado)
- Redirige a login si el token expira
- Integrado en `app.config.ts`

---

### 4. **Configuración de la Aplicación**

#### **app.config.ts** (ACTUALIZADO)
- Agregado `HTTP_INTERCEPTORS` para inyectar `AuthInterceptor`
- Mantiene `provideHttpClient(withFetch())` para optimizar peticiones

#### **app.routes.ts** (ACTUALIZADO)
- Configuradas rutas base
- Rutas preparadas para agregar nuevos componentes

#### **tsconfig.json** (SIN CAMBIOS FINALES)
- Mantiene configuración estándar de Angular 20

---

## 🔌 Conexión a la API

La URL base está configurada en:
```typescript
// src/app/Environments/environments.ts
export const environment = {
  apiUrl: 'https://cobiesscooby.com:51001/api/v1/',
  openApiUrl: 'https://cobiesscooby.com:51001/openapi/swagger.json',
  ...
};
```

---

## 📝 Ejemplo de Uso en Componentes

### Inyectar y usar servicios:
```typescript
import { GetApiService } from '@app/Services/get-api-service';
import { PostApiService } from '@app/Services/post-api-service';
import { Producto } from '@app/Interfaces';

@Component(...)
export class MiComponente {
  private getService = inject(GetApiService);
  private postService = inject(PostApiService);

  productos = signal<Producto[]>([]);

  cargarProductos() {
    this.getService.getProductos().subscribe({
      next: (productos) => this.productos.set(productos),
      error: (error) => console.error(error)
    });
  }

  crearProducto(nombre: string, precio: number) {
    const nuevoProducto: ProductoPost = {
      nombre,
      precio,
      descripcion: 'Descripción',
      stock: 10
    };
    this.postService.crearProducto(nuevoProducto).subscribe({
      next: (producto) => console.log('Creado:', producto)
    });
  }
}
```

---

## 🔐 Flujo de Autenticación

1. **Login**: Usuario entra credenciales
2. **Token**: Backend retorna JWT en `LoginResponse.data.token`
3. **AuthService**: Guarda el token en `localStorage` y Signals
4. **Interceptor**: Añade automáticamente el token a todas las peticiones
5. **Protected Routes**: Los servicios requieren autenticación

```typescript
import { AuthService } from '@app/Services/auth-service';

@Component(...)
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.setToken(response.data.token);
        this.authService.setUsuario(response.data.user);
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
```

---

## 📦 Entidades Implementadas

| Entidad | GET | POST | PUT | DELETE | Endpoints |
|---------|-----|------|-----|--------|-----------|
| Usuario | ✓ | ✓ | ✓ | ✓ | /usuarios, /usuarios/{id} |
| Producto | ✓ | ✓ | ✓ | ✓ | /productos, /productos/{id} |
| Evento | ✓ | ✓ | ✓ | ✓ | /eventos, /eventos/{id} |
| Local | ✓ | ✓ | ✓ | ✓ | /locales, /locales/{id} |
| Reserva | ✓ | ✓ | ✓ | ✓ | /reservas, /reservas/{id}, /reservas/usuario/{id} |
| Pedido | ✓ | ✓ | ✓ | ✓ | /pedidos, /pedidos/{id}, /pedidos/usuario/{id} |
| DetallePedido | ✓ | ✓ | ✓ | ✓ | /detalles-pedido, /detalles-pedido/{pedidoId}/{productoId} |
| Mensaje | ✓ | ✓ | ✓ | ✓ | /mensajes, /mensajes/{id}, /mensajes/usuario/{id} |

---

## 🚀 Próximos Pasos

Para completar la aplicación, necesitas:

1. **Crear componentes para Admin**:
   - Dashboard de administrador
   - Tablas CRUD para cada entidad
   - Formularios de creación/edición

2. **Crear vistas de Cliente**:
   - Catálogo de productos
   - Carrito de compras
   - Formulario de reservas
   - Panel de pedidos

3. **Agregar Guards de Rutas**:
   - Guard para autenticación
   - Guard para roles (admin/cliente)

4. **Mejorar Manejo de Errores**:
   - Error handling global
   - Mensajes de éxito/error con SweetAlert2
   - Validaciones mejoradas

5. **Integración de Componentes**:
   - Material Design para UI
   - Responsive con Bootstrap 5
   - Signals para estado reactivo

---

## 📚 Referencias

- **OpenAPI**: https://cobiesscooby.com:51001/openapi/swagger.json
- **API Base**: https://cobiesscooby.com:51001/api/v1/
- **Angular 20 Docs**: https://angular.dev
- **TypeScript Signals**: https://angular.dev/guide/signals

---

## ✅ Estado del Proyecto

- ✓ Interfaces/DTOs completas según OpenAPI
- ✓ Servicios GET, POST, PUT, DELETE implementados
- ✓ Autenticación con JWT
- ✓ Interceptor HTTP para agregar token automáticamente
- ✓ Almacenamiento en localStorage
- ✓ Signals para estado reactivo
- ✓ Configuración de URL base de API
- ⏳ Componentes UI (próximo paso)
- ⏳ Guards de rutas (próximo paso)
- ⏳ Validaciones avanzadas (próximo paso)

---

## 📋 Archivos Creados

```
src/app/
├── Interfaces/
│   ├── Usuario.ts
│   ├── Producto.ts
│   ├── Evento.ts
│   ├── Local.ts
│   ├── Pedido.ts
│   ├── DetallePedido.ts
│   ├── Reserva.ts
│   ├── Mensaje.ts
│   ├── Login.ts
│   ├── Response.ts
│   └── index.ts
├── Services/
│   ├── get-api-service.ts (ampliado)
│   ├── post-api-service.ts (completado)
│   ├── put-api-service.ts (NUEVO)
│   ├── delete-api-service.ts (NUEVO)
│   └── auth-service.ts (NUEVO)
└── Middleware/
    └── auth-interceptor.ts (NUEVO)
```

---

¡El proyecto está listo para crear los componentes UI y completar la aplicación! 🎉
