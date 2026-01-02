# 📘 PersonCatalog - Paynau Full-Stack Serverless Solution

![Build Status](https://img.shields.io/badge/Build-Passing-success)
![Platform](https://img.shields.io/badge/Platform-AWS%20Serverless-orange)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/.NET%208-React%2019-purple)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20%2B%20CQRS-green)

**PersonCatalog** es una solución **Full Stack Cloud-Native** diseñada para demostrar la implementación de patrones de diseño avanzados en un entorno empresarial. El sistema gestiona un catálogo de personas con capacidades de auditoría completa, *soft-delete*, y análisis estadístico en tiempo real, todo orquestado bajo una **Clean Architecture** estricta.

![Imágen del Dashboard de la solución](./docs/images/portal-dashboard.png)

## 📑 Centro de Documentación

La documentación técnica se ha modularizado para facilitar la navegación. Haz clic en cada módulo para profundizar:

| Módulo | Descripción | Enlace |
| :--- | :--- | :---: |
| **🏛️ Arquitectura** | Decisiones de diseño, Patrones (CQRS, Mediator) y Flujo de datos. | [Ver Documento](./docs/ARCHITECTURE.md) |
| **🛠️ Backend API** | Guía .NET 8, Clean Architecture, Endpoints y Swagger. | [Ver Documento](./docs/BACKEND.md) |
| **🎨 Frontend UI** | Arquitectura React 19, Hooks, TailwindCSS y Gráficos. | [Ver Documento](./docs/FRONTEND.md) |
| **☁️ Despliegue** | Guía paso a paso: Docker Local y AWS Serverless (Lambda/RDS). | [Ver Documento](./docs/DEPLOY.md) |

#### Si se desea correr el proyecto para testearlo, dirigete de inmediato a la sección de [**☁️ Despliegue**](./docs/DEPLOY.md). Ahí está detallado el proceso para levantarlo con docker-compose.

## 🚀 Stack Tecnológico

El proyecto utiliza tecnologías de vanguardia para asegurar escalabilidad, mantenibilidad y rendimiento.

| Área | Tecnología | Propósito y Detalles |
| :--- | :--- | :--- |
| **Backend** | .NET 8 / ASP.NET Core | Core de la API RESTful. |
| | Entity Framework Core | ORM para acceso a datos (Code-First) con MySQL 8.0. |
| | MediatR | Implementación de los patrones CQRS y Mediator. |
| | FluentValidation | Declaración de reglas de negocio robustas. |
| | xUnit + Moq | Frameworks para pruebas unitarias y de integración. |
| **Frontend**| React 19 (con Vite) | Librería de UI con TypeScript y compilación ultrarrápida. |
| | Hooks / Context API | Gestión de estado del servidor y estado global. |
| | TailwindCSS | Framework CSS Utility-First para diseño responsivo. |
| | Recharts | Creación de gráficos y visualizaciones para el dashboard. |
| | Axios | Cliente HTTP para la comunicación con el Backend. |
| | Vitest + RTL | Pruebas unitarias y de integración de componentes. |
| **Infraestructura & DevOps** | Docker / Docker Compose | Orquestación del entorno de desarrollo local. |
| | AWS Lambda + API Gateway | Despliegue serverless del Backend en producción. |
| | AWS Amplify Hosting | Hosting CI/CD para el Frontend. |
| | Amazon RDS for MySQL | Base de datos relacional gestionada en la nube. |

## 🏗 Arquitectura del Sistema

El sistema está diseñado siguiendo los principios de **Clean Architecture** para garantizar una separación clara de responsabilidades y la **Regla de Dependencia**, donde las dependencias solo apuntan hacia el núcleo del negocio.

El flujo general es el siguiente:
1.  El **Cliente (React)** realiza peticiones HTTP a un **API Gateway (Nginx)**.
2.  Nginx redirige la petición al **Backend (.NET 8 Web API)**.
3.  La API recibe la petición y la delega a la capa de **Aplicación** usando el patrón **Mediator (MediatR)** para procesar Comandos o Consultas (CQRS).
4.  La capa de Aplicación orquesta la lógica, utilizando entidades del **Dominio** y las interfaces de la capa de **Infraestructura**.
5.  La capa de Infraestructura implementa el acceso a la base de datos **MySQL** a través de Entity Framework Core.

Para una explicación visual y detallada de los patrones y diagramas, por favor consulta el documento de arquitectura: **[Ver Documento de Arquitectura](./docs/ARCHITECTURE.md)**.

## 📂 Estructura del Repositorio

La estructura es un monorepositorio y está diseñada para ser intuitiva y escalable, separando claramente las responsabilidades.

```mermaid
graph TD
    subgraph Repositorio Principal
        Root("person-catalog-clean-arch")
    end

    Root --> Docs("docs/<br/><i>Documentación Técnica</i>")
    Root --> Src("src/<br/><i>Código Fuente</i>")
    Root --> Docker("docker/<br/><i>Configs. de Nginx</i>")
    Root --> DockerCompose("docker-compose.yml<br/><i>Orquestador Local</i>")

    subgraph "Código Fuente (src)"
        direction LR
        Src --> Backend("backend/")
        Src --> Frontend("frontend/")
    end

    subgraph "Backend (.NET 8)"
        Backend --> BackendSrc("src/")
        Backend --> BackendTests("tests/")
        subgraph "Capas (Clean Architecture)"
            BackendSrc --> Api("API<br/><i>Presentación</i>")
            BackendSrc --> Application("Application<br/><i>Lógica de Casos de Uso</i>")
            BackendSrc --> Domain("Domain<br/><i>Núcleo del Negocio</i>")
            BackendSrc --> Infrastructure("Infrastructure<br/><i>Persistencia y Servicios</i>")
        end
    end

    subgraph "Frontend (React)"
        Frontend --> FrontendSrc("src/")
        Frontend --> FrontendPublic("public/")
        subgraph "Estructura React"
            FrontendSrc --> Components("components/")
            FrontendSrc --> Hooks("hooks/")
            FrontendSrc --> Pages("pages/")
            FrontendSrc --> Services("services/")
        end
    end

    style Root fill:#8E44AD,stroke:#fff,stroke-width:2px,color:#fff
    style Docs fill:#2980B9,stroke:#fff,stroke-width:2px,color:#fff
    style Src fill:#27AE60,stroke:#fff,stroke-width:2px,color:#fff
    style Docker fill:#F39C12,stroke:#fff,stroke-width:2px,color:#fff
    style DockerCompose fill:#F39C12,stroke:#fff,stroke-width:2px,color:#fff
```