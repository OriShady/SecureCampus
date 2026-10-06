# SecureCampus API

### Contexto del Proyecto
SecureCampus es un sistema de gestión académica diseñado para la administración de perfiles de usuarios, consulta de calificaciones y gestión de documentos.

Este proyecto se desarrolla como parte práctica de la asignatura de Desarrollo Seguro. La metodología de construcción consta de dos fases estratégicas:
1. **Fase Funcional:** Construcción inicial de la API de manera estrictamente funcional e insegura. Se omiten deliberadamente controles de acceso, cifrado de datos, manejo seguro de sesiones y saneamiento de entradas.
2. **Fase de Aseguramiento:** El sistema es sometido a metodologías de modelado de amenazas y pruebas de seguridad (análisis estático SAST, análisis dinámico DAST y análisis interactivo IAST) para identificar las vulnerabilidades resultantes de la primera fase. Posteriormente, se implementan los controles correspondientes y la gobernanza de seguridad a lo largo del Ciclo de Vida de Desarrollo de Software (SDLC).

## Alcance del Proyecto

### Requisitos Funcionales
El sistema permite las siguientes operaciones principales:
*   **Gestión de Usuarios:** Registro, autenticación y administración de perfiles, con diferenciación entre Estudiantes, Docentes y Administradores.
*   **Gestión de Calificaciones:** Captura y modificación de calificaciones por parte del personal docente, y consulta del historial académico para estudiantes.
*   **Gestión de Documentos:** Carga, almacenamiento y descarga de archivos vinculados al perfil del estudiante.
*   **Gestión de Cursos/Materias:** Creación de asignaturas y asignación de estudiantes y docentes a los grupos correspondientes.

### Requisitos No Funcionales (Fase Funcional Inicial)
*   **Arquitectura:** Sistema cliente-servidor basado en una API REST (ASP.NET Core 10.0) y una interfaz de usuario independiente.
*   **Persistencia:** Almacenamiento estructurado mediante SQLite.
*   **Ausencia Intencional de Seguridad:** El sistema opera temporalmente almacenando contraseñas en texto plano, sin tokens de autorización robustos (JWT) ni validación estricta de entradas. Requerimiento pedagógico para el descubrimiento de vulnerabilidades.

### Requisitos No Funcionales (Fase de Aseguramiento SDLC)
*   **Auditoría de Código:** Compatibilidad del repositorio con la integración de herramientas de análisis estático (SAST) y análisis dinámico (DAST).
*   **Mitigación y Cumplimiento:** Refactorización del sistema tras la auditoría para implementar controles criptográficos, saneamiento de datos y políticas de control de acceso alineadas a los estándares de OWASP.

## Requisitos del Sistema
Para ejecutar y colaborar en el desarrollo de este proyecto, es necesario contar con el siguiente entorno instalado:
*   **SDK de .NET 10.0** (Entorno de ejecución y herramientas de compilación).
*   **Git** (Control de versiones).
*   **Editor de código** (Se recomienda Visual Studio Code o Visual Studio 2022).
*   **Cliente REST** (Extensión Thunder Client en VS Code, Postman o similar para la prueba de endpoints).

## Estructura del Proyecto

El sistema está construido bajo una arquitectura cliente-servidor, separando la lógica de negocio de la interfaz gráfica.

*   **Backend (SecureCampus.API):** Construido con ASP.NET Core Web API (.NET 10.0), Entity Framework Core y SQLite. Se encarga de la persistencia de datos, autorización y reglas de negocio.
*   **Frontend (SecureCampus.UI):** Interfaz gráfica de usuario encargada de consumir los endpoints REST expuestos por la API para la interacción final.

## Estructura Tecnológica
El sistema está construido bajo una arquitectura N-Tier utilizando el patrón MVC (Modelo-Vista-Controlador) para la exposición de endpoints REST.
*   **Framework:** ASP.NET Core Web API (.NET 10.0)
*   **Lenguaje:** C#
*   **Base de Datos:** SQLite (Implementación local multiplataforma)
*   **ORM:** Entity Framework Core

## Configuración del Entorno de Desarrollo
El ecosistema de .NET no requiere la configuración de entornos virtuales aislados. La gestión de dependencias y paquetes se realiza nativamente a través de NuGet utilizando el archivo `.csproj`.

### 1. Instalación de Requisitos Previos
*   **Windows:** Descargar e instalar el SDK de .NET 10.0 desde el portal oficial de Microsoft.
*   **Linux (Arch Linux / CachyOS):** Ejecutar en la terminal el comando `sudo pacman -S dotnet-sdk aspnet-runtime`.

### 2. Clonación e Instalación de Dependencias
Clonar el repositorio en el equipo local y acceder al directorio principal de la API. Posteriormente, ejecutar el comando de restauración. Este comando (válido para Símbolo del Sistema en Windows, PowerShell o Bash en Linux) leerá el archivo `.csproj` y descargará automáticamente todas las librerías necesarias.

```bash
git clone https://github.com/OriShady/SecureCampus.git
cd SecureCampus/SecureCampus.API
dotnet restore
```

### 3. Configuración de la Base de Datos Local

El repositorio no incluye el archivo físico de la base de datos. Para generarlo en el entorno local, es necesario contar con las herramientas de Entity Framework y aplicar las migraciones correspondientes. Ejecutar los siguientes comandos en la terminal, asegurando estar dentro del directorio `SecureCampus.API`:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update
```

### 4. Pruebas de Endpoints

Las peticiones hacia la API deben realizarse mediante un cliente REST. Se recomienda utilizar la extensión **Thunder Client** en Visual Studio Code o Postman.

*   **Ruta Base:** `http://localhost:5110/api/usuarios`
*   **GET:** Recupera el listado completo de usuarios registrados.
*   **POST:** Inserta un nuevo registro. Requiere estructurar la carga útil en la pestaña Body estableciendo el formato como JSON. A continuación se muestra un ejemplo de la estructura esperada:

```json
{
  "nombre": "Ana Lopez",
  "correo": "ana.lopez@campus.edu",
  "password": "DocentePassword456",
  "rol": "Docente"
}
```