---
applyTo: '**'
---
## Angular version
-- Utilizo la version de Angular 20 la ultima actualmente el cual saco la documentacion de esta web [https://angular.dev/overview]
-- Tambien utilizo angular material para los componentes visuales de la web [https://material.angular.io/]

## Libreria estilos
-- Utilizo la libreria de Bootstrap 5.3.2 para los estilos de la web [https://getbootstrap.com/]
-- IMPORTANTE: SIEMPRE usar Bootstrap primero para diseño, orden, responsive y estilos. Solo usar CSS/SCSS cuando Bootstrap no pueda lograr el resultado deseado.
-- Todas las páginas DEBEN ser responsive usando las clases de Bootstrap (container, row, col, d-flex, etc.).
-- Para layout y estructura: Usar grid de Bootstrap (row, col-*, container), flexbox (d-flex, justify-content-*, align-items-*), spacing (m-*, p-*).
-- Para responsive: Usar breakpoints de Bootstrap (col-sm-*, col-md-*, col-lg-*, d-none d-md-block, etc.).
-- Solo agregar SCSS/CSS personalizado cuando sea absolutamente necesario (animaciones, efectos especiales, ajustes muy específicos que Bootstrap no puede hacer).
-- Si agregas CSS personalizado, debe ser mínimo y enfocado solo en lo que Bootstrap no puede lograr.
## Charts
-- Utilizo la libreria de ng2-charts para los graficos de la web [https://valor-software.com/ng2-charts/]
-- Tambien utilizo la libreria de Chart.js para los graficos de la web [https://www.chartjs.org/]

## Alertas
-- Para alertas utilizo sweetalert2 [https://sweetalert2.github.io/]

## Proyecto
-- Para formularios en ves de usar el Formgroup o FormBuilder, utilizo signals de angular y se agrega validaciones del formulario que esta en signals a traves de computed para detectar los cambios en los inputs del formulario.
-- Para el binding de inputs en formularios se usa `[(ngModel)]` con signals normales (`signal()`), no usar `model()`. No usar tag `<form>` ya que puede causar conflictos con ngModel y signals.
-- Los signals SIEMPRE deben declararse con tipo: `usuario = signal<string>('')`, `edad = signal<number>(0)`, `activo = signal<boolean>(false)`. También pueden tener tipos opcionales o múltiples: `dato = signal<string | undefined>(undefined)`, `valor = signal<string | number>('')`.
-- Los signals se usan con `[(ngModel)]="usuario"` en el template (sin paréntesis en el binding).
-- Las validaciones se hacen con computed signals que detectan cambios automáticamente: `isFormValid = computed(() => this.usuario().trim().length >= 3)`.
-- El proyecto esta dividido en modulos para una mejor organizacion y escalabilidad del proyecto.
-- El proyecto esta dividido en componentes para una mejor organizacion y reutilizacion del codigo.

## Creacion de componentes
-- **Comando para componentes**: Usar `ng g c "nombredelcomponente"-component` (usa los generators de Angular porque tienen toda la configuración preestablecida).
-- **Comando para módulos**: Usar `bun ng generate module nombre-modulo` en vez de `ng generate module nombre-modulo`.
-- **Comando para servicios**: Usar `bun ng generate service nombre-servicio` en vez de `ng generate service nombre-servicio`.
-- **Naming convention**: Los nombres de componentes SIEMPRE en español seguidos de `-component`. Ejemplo: `login-component`, `tabla-proveedores-component`.
-- **IMPORTANTE**: En Angular 20 ya no existe `.component` en el nombre del archivo, solo usar el sufijo `-component`.
-- **Standalone**: Todos los componentes deben ser standalone (no usar `module`), configurar con `standalone: true`.
-- **Imports**: Los componentes standalone deben importar explícitamente todos los módulos que usen (CommonModule, FormsModule, Material modules, etc.).

## Funciones y cambios
-- **Sintaxis de control de flujo**: Cuando encuentres `ngIf` o `ngFor` cámbialos por su equivalente más eficiente `@if` y `@for`.
-- **Reactividad con Signals**: Siempre usa `signals`, `computed`, `effect` para la mayoría de los eventos ya que permiten tener un mejor flujo y optimizar mejor.
-- **Optimización de renderizado**: Siempre intenta optimizar la vista con `@defer` y sus distintas funciones para mejorar el tema del renderizado.
-- **Estilos de Angular Material**: No modifiques el style de Angular Material a no ser que te especifique en qué lugar quiero que lo modifiques. Ojo solamente en caso de Angular Material, tengo que especificarte qué componente de material quiero que modifiques, si no, no modifiques nada del Angular Material al menos en style.


## APIs y Backend
-- **Backend**: El backend está desarrollado con .NET 9 y usa OpenAPI (en lugar de Swagger).
-- **URL base**: `http://localhost:8080/api/`
-- **Documentación OpenAPI**: Todos los endpoints y DTOs están disponibles en `http://localhost:8080/openapi/v1.json`
-- **Autenticación**: El backend usa JWT (JSON Web Tokens) para autenticación.

### Conexión HTTP
-- **HttpClient**: Usar `HttpClientModule` de Angular para las peticiones HTTP.
-- **withFetch()**: Usar `withFetch()` en la configuración para optimizar las peticiones HTTP.

### Estructura de servicios
-- **Servicios separados por operación CRUD**: Los endpoints se organizan en servicios específicos:
  - `get-api-service.ts` → Operaciones GET (consultas)
  - `post-api-service.ts` → Operaciones POST (crear)
  - `put-api-service.ts` → Operaciones PUT (actualizar)
  - `delete-api-service.ts` → Operaciones DELETE (eliminar)

-- **Naming de métodos**: El nombre del método debe ser descriptivo y coincidir con el endpoint del OpenAPI. Si hay nombres repetidos, agregar una palabra que describa su función específica.
  - Ejemplo: `getProveedorById()`, `getProveedoresPorEmpresa()`, `crearProveedor()`, `actualizarProveedor()`, `eliminarProveedor()`

### Autenticación y sesión
-- **Login**: Existe una carpeta `Interfaces/Session/` con DTOs para el login (`Login.ts`, `Token.ts`).
-- **AuthService**: Usar `auth-service.ts` para enviar el login, recibir el token JWT, mapearlo y guardarlo en el navegador.
-- **Token storage**: El token se almacena localmente y se envía en cada petición HTTP mediante interceptores.


## Interfaces y DTOs
-- Todas las interfaces se crean basándose en la especificación del OpenAPI del backend (http://localhost:8080/openapi/v1.json).
-- Para cada entidad del backend se crean 3 interfaces: una para GET, una para POST y una para PUT.
-- La interfaz principal (GET) mantiene todos los campos opcionales con `?` e incluye el `id?`, reflejando exactamente lo que retorna el endpoint GET del OpenAPI.
-- La interfaz POST (nombre: `EntidadPost`) se crea según el schema de request body del endpoint POST en OpenAPI. NO incluye el `id` ni campos auto-generados como `fechaCreacion`, `fechaModifica`. Los campos que el OpenAPI marca como required son obligatorios (sin `?`).
-- La interfaz PUT (nombre: `EntidadPut`) se crea según el schema de request body del endpoint PUT en OpenAPI. Requiere el `id` como campo obligatorio (sin `?`) y los campos que el OpenAPI marca como required también son obligatorios.
-- Ejemplo: Para `Comprobante` se crean: `Comprobante` (GET), `ComprobantePost` (POST sin id), `ComprobantePut` (PUT con id obligatorio).
-- Cada interfaz debe tener un comentario descriptivo: `// Interface principal para GET`, `// Interface para POST (sin id)`, `// Interface para PUT (requiere id)`.
-- En el archivo `index.ts` de DTOs, exportar las 3 variantes: `export type { Entidad, EntidadPost, EntidadPut } from './Entidad';`.
-- En `post-api-service.ts`, los métodos `crear*()` deben recibir el tipo `*Post` y retornar el tipo base (GET).
-- En `put-api-service.ts`, los métodos `actualizar*()` deben recibir el tipo `*Put` y retornar el tipo base (GET).
-- Esta separación mejora el control de errores en compile-time y previene el envío de campos no esperados por el backend.
-- IMPORTANTE: Siempre revisar el OpenAPI antes de crear o modificar interfaces para asegurar que coincidan con lo que el backend espera.


## Estructura de carpetas por Pantalla/Vista
-- **Estructura base**: Cada vista/pantalla tiene su propia carpeta con el nombre correspondiente al API (ej: `Proveedores/`, `Productos/`, `Clientes/`).

-- **Subcarpetas obligatorias**: Dentro de cada vista crear 3 carpetas:
  - **`Components/`**: Componentes reutilizables específicos de esta vista (ej: `tabla-productos-component/`, `card-proveedor-component/`)
  - **`Pages/`**: Páginas que se muestran en el router de esta vista (ej: `lista-proveedores-component/`, `detalle-proveedor-component/`)
  - **`Dialogs/`**: Componentes de ventanas modales específicos de esta vista (ej: `form-proveedor-component/`, `confirmar-eliminacion-component/`)

-- **Subcarpeta opcional `Helpers/`**: Si hay funciones o lógica que se reutiliza en varios componentes de la misma vista, crear esta carpeta con un service (ej: `proveedor-helper-service.ts`).

-- **Ejemplo de estructura completa**:
  ```
  Proveedores/
    ├── Components/
    │   ├── tabla-proveedores-component/
    │   └── card-proveedor-component/
    ├── Pages/
    │   ├── lista-proveedores-component/
    │   └── detalle-proveedor-component/
    ├── Dialogs/
    │   └── form-proveedor-component/
    └── Helpers/
        └── proveedor-helper-service.ts
  ```

-- **Layout y navegación**: Todas las páginas (excepto Login/Session) deben ir dentro del Layout para tener navegación compartida.

-- **Naming**: Todos los nombres descriptivos en español. Los componentes siempre terminan en `-component`.

-- **Standalone**: No usar `module`, todo debe ser standalone.

-- **Estilos de Angular Material**: No modificar estilos de componentes de Angular Material a menos que se especifique explícitamente qué componente modificar.

