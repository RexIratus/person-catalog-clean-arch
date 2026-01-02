# 🛠️ Guía de Desarrollo Backend (.NET 8)

Este documento detalla la implementación técnica de la API **PersonCatalog**. Se implementa patrones avanzados de diseño, optimización de consultas y una integración nativa con AWS Lambda.

## 1. Stack Tecnológico

| Componente | Tecnología | Uso en el Proyecto |
| :--- | :--- | :--- |
| **Framework** | .NET 8 (ASP.NET Core) | Web API (Minimal APIs style support) |
| **Arquitectura** | Clean Architecture | Separación estricta de responsabilidades (Domain, App, Infra, API) |
| **Patrón** | CQRS + MediatR | Desacoplamiento de Lectura/Escritura y lógica de controladores |
| **ORM** | EF Core 8 (Pomelo MySQL) | Persistencia, Migraciones y Global Query Filters |
| **Validación** | FluentValidation | Reglas de negocio (emails únicos, formatos, longitudes) |
| **Serverless** | AWS Lambda Hosting | Adaptador nativo para correr ASP.NET Core en Lambda |
| **Testing** | xUnit + Moq | Pruebas unitarias de Handlers y Lógica de Dominio |

## 2. Estructura de la Solución

El proyecto sigue una estructura de carpetas intuitiva donde cada proyecto representa una capa de la arquitectura:

```plaintext
src/backend/
├── PersonCatalog.Domain/          # 🧠 Núcleo (Entidades, Excepciones, Enums)
├── PersonCatalog.Application/     # ⚙️ Lógica (CQRS, Interfaces, DTOs, Validadores)
├── PersonCatalog.Infrastructure/  # 🔌 Conexiones (EF Core, Repositorios, Stored Procedures)
├── PersonCatalog.Api/             # 🌐 Presentación (Controllers, Program.cs, Middlewares)
└── PersonCatalog.UnitTests/       # 🧪 Pruebas Unitarias
```

## 3. Implementaciones Clave

Más allá de lo estándar, el backend incluye características específicas:

### 3.1. Global Exception Handling
Los controladores no tienen bloques `try-catch`. Se implementó un Middleware personalizado (`GlobalExceptionHandler`) que captura cualquier error, lo loguea y devuelve respuestas JSON estandarizadas (RFC 7807).
- `ValidationException` -> **400 Bad Request** (con lista de errores).
- `NotFoundException` -> **404 Not Found**.
- Exception genérica -> **500 Internal Server Error**.

### 3.2. Persistencia Avanzada (EF Core)
- **Soft Delete**: Se implementó mediante un filtro global (`HasQueryFilter`). Al llamar a `Delete`, solo se actualiza el campo `IsActive = false`. EF Core ignora estos registros en las consultas normales automáticamente.
- **Concurrencia**: Uso de `RowVersion` para manejar colisiones de edición optimista.

### 3.3. Alto Rendimiento (Stored Procedures)
Para el Dashboard, evitamos la sobrecarga de traer todas las entidades a memoria.
- **Procedimiento**: `Sp_ObtenerEstadisticasPersonas`
- **Uso**: La capa de infraestructura ejecuta este SP directamente para calcular conteos y estadísticas en el motor de base de datos, devolviendo un resultado instantáneo.

## 4. API & Swagger

La API está documentada con OpenAPI (Swagger).
Debido a la naturaleza Serverless, Swagger se configuró para soportar rutas relativas y el prefijo `/default` que AWS API Gateway suele agregar.

- **URL Local**: `http://localhost:5268/swagger`
- **URL AWS**: `https://<api-id>.execute-api.us-east-1.amazonaws.com/default/swagger`

### Ejemplo de Controlador (Thin Controller)

Los controladores solo delegan a MediatR:

```csharp
[HttpPost]
public async Task<IActionResult> Create(CreatePersonCommand command)
{
    // El controlador no sabe cómo se crea, solo sabe qué devolver.
    var id = await _mediator.Send(command);
    return CreatedAtAction(nameof(GetById), new { id }, id);
}
```

## 5. Integración con AWS Lambda

A diferencia de despliegues tradicionales, esta API está preparada para ser "Cloud Native" sin cambiar el código.

### 5.1. El "Puente" (`Program.cs`)

No usamos un `LambdaEntryPoint` separado. Usamos la librería `Amazon.Lambda.AspNetCoreServer.Hosting` directamente en el arranque:

```csharp
// Program.cs
// Esto detecta automáticamente si corre en Kestrel (Local) o Lambda (AWS)
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);
```

### 5.2. Variables de Entorno Requeridas

Para que el backend funcione en la nube, espera estas variables:


Para que el backend funcione en la nube, espera estas variables:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `ConnectionStrings__DefaultConnection` | Cadena de conexión a RDS | `Server=...;Database=PersonaDb;...` |
| `AllowedOrigins` | URLs permitidas para CORS | `https://mi-app.amplifyapp.com;http://localhost:5173` |
| `ASPNETCORE_ENVIRONMENT` | Entorno de ejecución | `Production` |

## 6. Testing

Se crearon las pruebas unitarias para cada escenario de uso de la API con `xUnit` y `Moq`.

Validan que los Handlers (Casos de Uso) reaccionen correctamente ante inputs válidos e inválidos, mockeando la base de datos.

### 6.1. Comandos para ejecutar:

- Ejecutar todos los tests:
  
  ```bash
  dotnet test
  ```
- Ver resultados detallados:  
  
  ```bash
  dotnet test --logger "console;verbosity=detailed"
  ```

### 6.2. Escenarios

- ✅ **CreatePersonCommandHandler**: Valida mapeo y persistencia.
- ✅ **UpdatePersonCommandHandler**: Valida existencia de ID y concurrencia.
- ✅ **SoftDelete**: Valida que el flag cambie en lugar de borrar el registro.
- ✅ **Validaciones**: FluentValidation asegura que no entren emails inválidos.  