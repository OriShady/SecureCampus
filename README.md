# SecureCampus API

Sistema de gestión académica para el registro y manejo de perfiles de estudiantes, calificaciones y documentos. 

Este proyecto se desarrolla para la asignatura de Desarrollo Seguro. En su etapa inicial, la API se construye de manera estrictamente funcional e insegura (sin controles de acceso, cifrado de datos ni saneamiento de entradas). Posteriormente, el sistema será sometido a metodologías de modelado de amenazas y pruebas de seguridad (SAST e IAST) para identificar vulnerabilidades e integrar los controles correspondientes en el SDLC.

## Estructura del Proyecto

El sistema está construido bajo una arquitectura N-Tier utilizando el patrón MVC para la exposición de endpoints REST.

*   **Framework:** ASP.NET Core Web API (.NET 10.0)
*   **Base de Datos:** SQLite
*   **ORM:** Entity Framework Core

## Configuración del Entorno de Desarrollo

El proyecto no requiere de entornos virtuales. La gestión de paquetes se realiza a través de NuGet utilizando el archivo `.csproj`.

### 1. Requisitos Previos

Asegúrate de tener instalado el SDK de .NET 10.0 en tu sistema operativo:
*   **Linux (Arch/CachyOS):** `sudo pacman -S dotnet-sdk`
*   **Windows:** Descargar el instalador oficial de .NET 10.0 SDK.

### 2. Instalación de Dependencias

Clona el repositorio, ingresa a la carpeta `SecureCampus.API` y ejecuta el siguiente comando en la terminal. Este comando leerá el archivo `.csproj` y descargará automáticamente todas las herramientas y paquetes necesarios de Entity Framework:

```bash
dotnet restore