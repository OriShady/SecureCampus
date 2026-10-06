# Arquitectura de Datos - SecureCampus

## Propósito
Este documento define la estructura de entidades y sus relaciones operativas para la base de datos del proyecto SecureCampus. Representa el esquema implementado mediante Entity Framework Core y SQLite.

## Entidades y Relaciones

### Usuario
Representa a los individuos registrados en la plataforma. La diferenciación de acceso y permisos se gestiona a través de la propiedad de rol.
* **Propiedades:** Id, Nombre, Correo, Password, Rol.
* **Relaciones:** Entidad principal. Permite la vinculación mediante llaves foráneas con cursos, calificaciones y documentos, dependiendo del valor de su rol.

### Curso
Define las materias o grupos académicos registrados.
* **Propiedades:** Id, Nombre.
* **Llave Foránea:** `ProfesorId`. Identifica al usuario encargado del grupo.

### Calificacion
Almacena el registro de las evaluaciones numéricas. Funciona como entidad transaccional para vincular estudiantes con materias.
* **Propiedades:** Id, Valor.
* **Llaves Foráneas:**
  * `EstudianteId`: Identifica al usuario que recibe la evaluación.
  * `CursoId`: Identifica la materia evaluada.

### Documento
Gestiona los metadatos y la ubicación de los archivos almacenados en el sistema de archivos del servidor.
* **Propiedades:** Id, NombreArchivo, RutaFisica, FechaCarga.
* **Llave Foránea:** `EstudianteId`. Identifica al usuario propietario del archivo.