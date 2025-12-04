# PitzeriaAngular20

Aplicación web de Pizzería Deliziosa desarrollada con Angular 20, Bootstrap 5.3.2 y Angular Material. Este proyecto presenta una plataforma moderna y responsiva para una pizzería en Lima, Perú.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

### 1. Node.js (versión 18 o superior)
Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/)

Para verificar la instalación:
```bash
node --version
npm --version
```

### 2. Bun (Gestor de paquetes recomendado)
Bun es un gestor de paquetes rápido y moderno que usamos en este proyecto.

**Instalación en Windows:**
```bash
powershell -c "irm bun.sh/install.ps1|iex"
```

**Instalación en macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

Para verificar la instalación:
```bash
bun --version
```

### 3. Angular CLI (versión 20.1.6)
Instala Angular CLI globalmente usando Bun:
```bash
bun add -g @angular/cli
```

Para verificar la instalación:
```bash
ng version
```

## 🚀 Instalación del Proyecto

Sigue estos pasos para configurar el proyecto en tu máquina local:

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/Cobies/PitzeriaAngular20.git
cd PitzeriaAngular20
```

### Paso 2: Instalar dependencias
Usa Bun para instalar todas las dependencias del proyecto:
```bash
bun install
```

Este comando instalará todas las librerías necesarias incluyendo:
- Angular 20
- Angular Material
- Bootstrap 5.3.2
- SweetAlert2
- ng2-charts
- Chart.js
- Y todas las demás dependencias del proyecto

## 🏃‍♂️ Ejecución del Proyecto

### Modo Desarrollo

Para iniciar el servidor de desarrollo, ejecuta:

```bash
bun run start
```

**O también puedes usar:**
```bash
ng serve
```

Una vez que el servidor esté corriendo, abre tu navegador y navega a `http://localhost:4200/`. 

La aplicación se recargará automáticamente cada vez que modifiques algún archivo del código fuente.

### Compilar para Producción

Para construir el proyecto para producción:

```bash
bun run build
```

**O también:**
```bash
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`. Por defecto, la compilación de producción optimiza tu aplicación para rendimiento y velocidad.

## 🛠️ Comandos Adicionales

### Generar Componentes

Para generar un nuevo componente:
```bash
bun ng generate component nombre-component
```

**O usando el shorthand:**
```bash
bun ng g c nombre-component
```

### Generar Servicios

Para generar un nuevo servicio:
```bash
bun ng generate service nombre-servicio
```

**O usando el shorthand:**
```bash
bun ng g s nombre-servicio
```

### Generar Módulos

Para generar un nuevo módulo:
```bash
bun ng generate module nombre-modulo
```

Para una lista completa de generadores disponibles (como `components`, `directives`, o `pipes`), ejecuta:
```bash
ng generate --help
```

## 🧪 Pruebas

### Ejecutar pruebas unitarias

Para ejecutar las pruebas unitarias con [Karma](https://karma-runner.github.io):
```bash
bun run test
```

**O también:**
```bash
ng test
```

### Ejecutar pruebas end-to-end

Para ejecutar pruebas end-to-end (e2e):
```bash
ng e2e
```

> Nota: Angular CLI no incluye un framework de testing e2e por defecto. Puedes elegir el que mejor se adapte a tus necesidades.

## 📁 Estructura del Proyecto

```
PitzeriaAngular20/
├── src/
│   ├── app/
│   │   ├── Pages/           # Páginas de la aplicación
│   │   │   ├── Home/        # Página principal
│   │   │   ├── Eventos/     # Página de eventos
│   │   │   ├── Contacto/    # Página de contacto
│   │   │   ├── Locales/     # Página de locales
│   │   │   └── Layout/      # Layout principal con navbar
│   │   ├── Services/        # Servicios de la aplicación
│   │   ├── Interfaces/      # Interfaces y DTOs
│   │   ├── Middleware/      # Interceptores y guards
│   │   ├── Environments/    # Configuración de entornos
│   │   └── Global/          # Componentes y servicios globales
│   ├── assets/              # Recursos estáticos
│   ├── styles.scss          # Estilos globales
│   └── index.html           # HTML principal
├── .github/
│   └── instructions/        # Instrucciones del proyecto
├── angular.json             # Configuración de Angular
├── package.json             # Dependencias del proyecto
└── tsconfig.json           # Configuración de TypeScript
```

## 🎨 Características del Proyecto

- **Angular 20**: Última versión de Angular con signals y control de flujo moderno
- **Bootstrap 5.3.2**: Framework CSS para diseño responsivo
- **Angular Material**: Componentes UI de Material Design
- **Standalone Components**: Arquitectura moderna sin módulos NgModule
- **Signals**: Manejo reactivo de estado con Angular Signals
- **Responsive Design**: Totalmente adaptable a móviles, tablets y desktop
- **SweetAlert2**: Alertas modernas y elegantes
- **Charts**: Gráficos con ng2-charts y Chart.js

## 🔧 Configuración del Backend

El proyecto está configurado para conectarse a un backend en .NET 9:

- **URL base**: `http://localhost:8080/api/`
- **OpenAPI**: `http://localhost:8080/openapi/v1.json`

Puedes modificar estas URLs en el archivo:
```
src/app/Environments/environments.ts
```

## 🌐 Páginas Disponibles

1. **Inicio** (`/plataforma/home`): Página principal con información de la pizzería
2. **Eventos** (`/plataforma/eventos`): Catálogo de eventos especiales
3. **Locales** (`/plataforma/locales`): Ubicaciones de los restaurantes en Lima
4. **Contacto** (`/plataforma/contacto`): Formulario de contacto e información

## 📝 Convenciones de Código

- **Componentes**: Siempre usar sufijo `-component` (ej: `home-component`)
- **Servicios**: Usar sufijo `-service` (ej: `auth-service`)
- **Nombres**: En español para componentes y archivos
- **Standalone**: Todos los componentes son standalone (sin NgModule)
- **Control de flujo**: Usar `@if`, `@for`, `@defer` en lugar de `*ngIf`, `*ngFor`

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📚 Recursos Adicionales

Para más información sobre el uso de Angular CLI, visita:
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev/overview)
- [Angular Material](https://material.angular.io/)
- [Bootstrap Documentation](https://getbootstrap.com/)

## 📄 Licencia

Este proyecto es privado y pertenece a Pizzería Deliziosa.

## 👨‍💻 Autor

Desarrollado por el equipo de desarrollo de Pizzería Deliziosa.

---

**¡Buen provecho y feliz coding! 🍕**
