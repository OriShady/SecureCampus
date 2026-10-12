using SecureCampus.API.Models;

namespace SecureCampus.API.DTOs
{
    public class UsuarioResumenDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string ApellidoMaterno { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public RolUsuario Rol { get; set; }
    }
}
