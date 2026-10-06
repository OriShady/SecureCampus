# SC-LAB-001: Análisis Inicial de Seguridad
**Proyecto:** SecureCampus API
**Fase:** Kickoff / SDLC Inicial

## 1. Pregunta de Salida
**¿Qué protegerías primero en SecureCampus y por qué?**

Lo primero que protegeríamos es el **Módulo de Autenticación y Autorización (Gestión de Identidad)**. 
*Justificación:* La identidad actúa como el perímetro principal del sistema. Si un atacante logra comprometer la autenticación (por ejemplo, interceptando credenciales en texto plano o falsificando un token) o escalar sus privilegios manipulando su rol a "Administrador" o "Jefe de Carrera", todas las demás medidas de seguridad en las capas inferiores (como el control sobre calificaciones o documentos) quedan anuladas de facto. Sin certeza absoluta sobre "quién" ejecuta la acción, no se puede aplicar el principio de menor privilegio sobre los "activos".

---

## 2. Análisis de Escenarios (Cadena de Seguridad)

A continuación, se presenta la matriz de análisis para cuatro funcionalidades clave del sistema, aplicando el enfoque Shift-Left para identificar vulnerabilidades antes de la implementación final.

### Escenario 1: Autenticación y Perfiles (Obligatorio)
*   **Activo:** Credenciales de acceso de los usuarios (Estudiantes, Profesores, Administradores, Jefes de Carrera).
*   **Amenaza:** Robo, exposición o acceso no autorizado a las cuentas.
*   **Vulnerabilidad:** Almacenamiento de contraseñas en texto plano en la base de datos (como se encuentra actualmente en nuestra primera iteración de la API) y transmisión sin cifrado.
*   **Ataque:** Extracción de la base de datos (SQL Injection) o interceptación del tráfico de red (Man-in-the-Middle).
*   **Impacto:** Compromiso total de la identidad. El atacante podría suplantar a un profesor o administrador y modificar todo el sistema.
*   **Riesgo:** Crítico.
*   **Control:** Implementar funciones de derivación de claves (Hashing) como Argon2 o BCrypt con salt único antes de persistir en SQLite. Exigir cifrado TLS en el servidor (HTTPS).

### Escenario 2: Consulta de Calificaciones (Obligatorio)
*   **Activo:** Historial académico y boletas de calificaciones.
*   **Amenaza:** Visualización o alteración no autorizada del historial académico de otros estudiantes.
*   **Vulnerabilidad:** Autorización rota a nivel de objeto (Insecure Direct Object Reference - IDOR). Un endpoint como `/api/calificaciones/{id}` que confía ciegamente en el ID proporcionado por el cliente sin validar si pertenece al usuario actual.
*   **Ataque:** Manipulación del parámetro ID en la URL a través de un cliente REST (Ej. cambiar `/calificaciones/125` a `/calificaciones/126`).
*   **Impacto:** Violación de la confidencialidad (fuga de datos personales) e integridad (si el endpoint permite POST/PUT).
*   **Riesgo:** Alto.
*   **Control:** El servidor no debe confiar en el ID enviado por la URL para la autorización. Debe extraer el ID directamente del Token criptográfico (JWT) del usuario autenticado y validar en el backend si dicho ID corresponde al recurso solicitado.

### Escenario 3: Gestión de Documentos (Obligatorio)
*   **Activo:** Archivos digitales sensibles (identificaciones, certificados, comprobantes domiciliarios).
*   **Amenaza:** Acceso público a archivos privados.
*   **Vulnerabilidad:** Almacenamiento de documentos en un directorio web estático y predecible sin validación de sesión para la descarga.
*   **Ataque:** Navegación forzada (Path Traversal o Forceful Browsing) hacia rutas conocidas, por ejemplo: `http://servidor/docs/estudiante_matricula.pdf`.
*   **Impacto:** Fuga masiva de Información de Identificación Personal (PII) de la comunidad universitaria.
*   **Riesgo:** Alto.
*   **Control:** Almacenar los archivos fuera del directorio público (`wwwroot`). Implementar un endpoint dedicado para descargas que exija un token válido y verifique los permisos de propiedad antes de retornar el flujo del archivo (File Stream).

### Escenario 4: Asignación de Roles (Elegido por el equipo)
*   **Activo:** Matriz de privilegios y roles del sistema.
*   **Amenaza:** Elevación o escalación de privilegios.
*   **Vulnerabilidad:** Asignación Masiva (Mass Assignment). El endpoint POST actual de `/api/usuarios` acepta el campo `"rol"` proveniente del JSON del cliente sin restricciones.
*   **Ataque:** Un estudiante intercepta la petición de creación de su cuenta y modifica el JSON inyectando `"rol": "Administrador"`.
*   **Impacto:** Toma de control total del entorno. El estudiante adquiere la capacidad de borrar bases de datos, dar de baja profesores o cambiar calificaciones globales.
*   **Riesgo:** Crítico.
*   **Control:** Implementar "Data Transfer Objects" (DTOs). El endpoint de registro público debe ignorar el campo "rol" y forzar en el backend el rol "Estudiante" por defecto. Las modificaciones de roles solo deben ser expuestas en endpoints restringidos exclusivamente para Administradores.

---

## 3. Reflexión del Equipo
A través de este ejercicio inicial, logramos evidenciar que una función correctamente programada no equivale a una función segura. Como comprobamos en nuestra etapa inicial de código, la API puede insertar datos exitosamente y responder a las peticiones con código `201 Created`, pero al confiar ciegamente en la entrada del cliente (como la asignación del rol), el sistema queda expuesto a vulnerabilidades críticas. La seguridad debe integrarse en la etapa de diseño de las reglas de negocio (SDLC) para prevenir que la interfaz se convierta en la única línea de defensa.