namespace SecureCampus.API.Models
{
    /// Representa la entidad de usuario del sistema.
    public class Usuario
    {
        /// Obtiene o establece el identificador del registro.
        public int Id { get; set; }

        /// Obtiene o establece el nombre completo.
        public string Nombre { get; set; } = string.Empty;

        /// Obtiene o establece el correo electronico.

        public string Correo { get; set; } = string.Empty;

        /// Obtiene o establece la clave de acceso.

        public string Password { get; set; } = string.Empty;
 
        /// Obtiene o establece el nivel de privilegios asignado.
   
        public RolUsuario Rol { get; set; }
    }
}