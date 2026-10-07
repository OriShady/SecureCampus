namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del administrador
    public class PerfilAdministrador
    {
        /// Define el identificador principal
        public int Id { get; set; }

        /// Define el numero de empleado
        public string NumeroEmpleado { get; set; } = string.Empty;

        /// Define el nivel de acceso
        public string NivelAcceso { get; set; } = string.Empty;

        /// Define la llave foranea hacia el usuario
        public int UsuarioId { get; set; }
    }
}