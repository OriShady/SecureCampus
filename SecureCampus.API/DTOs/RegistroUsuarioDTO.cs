using SecureCampus.API.Models;

namespace SecureCampus.API.DTOs
{
    /// Define la estructura de datos recibida desde el cliente para registrar un usuario completo.
    public class RegistroUsuarioDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string ApellidoMaterno { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        
        /// Define el nivel de privilegios asignado utilizando el enumerador.
        public RolUsuario Rol { get; set; }
        
        /// Define el identificador de la carrera asignada si el rol corresponde a un estudiante.
        public int? CarreraId { get; set; }

        /// Define el departamento de profesores y jefes de carrera.
        public int? DepartamentoId { get; set; }
    }
}