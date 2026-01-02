🎨 Guía de Desarrollo Frontend (React + Vite)

Este documento describe la arquitectura, las decisiones de diseño y las estrategias de prueba de la interfaz de usuario de **PersonCatalog**.

## 1. Stack Tecnológico

| Herramienta | Propósito |
| :--- | :--- |
| React 19 (Hooks functional style) | Librería |
| TypeScript | Lenguaje |
| Vite | Bundler (Build rápido y HMR) |
| TailwindCSS | Framework (Utility-first) |
| Axios | Cliente HTTP (Instancia centralizada) |
| Recharts | Gráficos (Visualización de datos en Dashboard) |
| Vitest + React Testing Library | Testing |

## 2. Estructura de Carpetas

La aplicación está organizada modularmente para facilitar la escalabilidad:

```plaintext
src/frontend/src/
├── assets/            # 🖼️ Recursos estáticos (Imágenes, Iconos)
├── components/        # 🧩 Bloques de construcción de UI
│   ├── layout/        # (Sidebar, Navbar, MainLayout)
│   ├── ui/            # (Button, Input, Modal, Card, Badge)
│   └── person/        # (PersonForm, PersonTable)
├── context/           # 📦 Estado Global (Auth, Theme - si aplica)
├── hooks/             # 🪝 Lógica de Negocio (Custom Hooks)
│   ├── usePersonas.ts # CRUD y estado de personas
│   └── useDashboard.ts # Lógica de métricas
├── pages/             # 📄 Vistas (Rutas)
│   ├── Dashboard.tsx
│   └── Catalog.tsx
├── services/          # 📡 Comunicación API (Axios setup)
└── __tests__/         # 🧪 Tests de integración/unitarios
```

## 3. Guía de Inicio (Ejecución Local)

Pasos necesarios para levantar el entorno de desarrollo frontend en local.

#### Prerrequisitos

- **Node.js**: v22.
- **NPM**: Incluido con Node.js.

### 3.1. Instalación y Ejecución

- **Instalar dependencias**: Nos posicionamos en la ruta del frontend `src/frontend/` y ejecutamos:

    ```bash
    npm install
    ```

- **Configurar Backend** (*Opcional*): Por defecto, el frontend busca el backend en `http://localhost:5268/api`. Si por algún motivo esto es cambiado, se deberá enviar el `url`:`puerto` específico en un archivo `.env` en la raíz de `src/frontend/`:

    ```properties
    VITE_API_URL=http://localhost:<puerto>/api
    ```    

- **Iniciar Servidor de Desarrollo**: Levantamos Vite con Hot Module Replacement (HMR) para ver cambios en tiempo real.

    ```bash
    npm run dev
    ```

- **Acceso**: Una vez iniciado, se nos presentará la URL en la terminal:
    - **Local**: `http://localhost:5173` (Puerto por defecto de Vite)    

### 3.2 Compilación (Build)

Para generar los archivos estáticos optimizados para producción:

```bash
# Genera la carpeta /dist con HTML/CSS/JS minificados
npm run build
```

## 4. Gestión de Estado y Lógica

La gestión del estado se aborda de forma pragmática sin introducir complejidad innecesaria (como Redux) a menos que sea vital.

*   **Estado Local:** `useState` para interactividad simple de UI (abrir/cerrar modales, inputs).
*   **Estado del Servidor (Server State):** Utilizamos Custom Hooks (`usePersonas`) que encapsulan:
    *   Fetching de datos con Axios.
    *   Estados de carga (`loading`).
    *   Manejo de errores (`error`).
    *   Operaciones transaccionales (Create, Update, Soft-Delete).
*   **Estado Global:** `Context API` para datos transversales (ej. `Configuración de Usuario`).

## 5. Comunicación con la API

Se utiliza una instancia centralizada de Axios en `src/services/api.ts`.

**Configuración Dinámica:**
```typescript
const api = axios.create({
  // Detecta si existe un .env con url al servicio, si no, carga como Localhost automáticamente
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5268/api',
});
```

**Interceptores:** Preparado para manejar respuestas globales (ej. redirigir a login en 401 o mostrar alertas en 500).

## 6. Dashboard Analítico

El frontend no solo muestra tablas; consume endpoints analíticos optimizados.

*   **Librería:** Recharts.
*   **Visualización:** Gráfico de Dona (Donut Chart) para la distribución de estados y Tarjetas de KPI para métricas rápidas.
*   **Integración:** Consume datos calculados vía Stored Procedures en el backend para evitar procesar arrays gigantes en el cliente.

## 7. Estrategia de Pruebas (Vitest)

La calidad del frontend se asegura mediante pruebas unitarias y de integración de componentes.

*   **Runner:** Vitest (Nativo de Vite).
*   **Utilidades:** React Testing Library (`@testing-library/react`) y `jest-dom`.

### 7.1. Ejecución de Pruebas

```bash
npm test
```

## 8. Despliegue en AWS Amplify

La aplicación está optimizada para AWS Amplify Hosting.

*   **Build:** Vite genera archivos estáticos optimizados en `/dist`.
*   **Variables de Entorno:**
    *   **En Local:** `.env.development`
    *   **En AWS:** Se configuran en la consola de Amplify (`VITE_API_URL`).
*   **CI/CD:**
    *   **Opción A (Git):** Conectar repo de GitHub -> Push a `main` -> Despliegue automático.
    *   **Opción B (Manual):** `npm run build` -> Zip de `/dist` -> Drag & Drop en Amplify Console.