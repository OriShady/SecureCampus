using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de usuario del sistema.
    public class Usuario
    {
        /// Obtiene o establece el identificador del registro.
        [Key]
        public int Id { get; set; }

        /// Obtiene o establece el nombre o nombres de pila.
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        /// Obtiene o establece el apellido paterno.
        [Required(ErrorMessage = "El apellido paterno es obligatorio.")]
        [StringLength(50, ErrorMessage = "El apellido paterno no puede exceder los 50 caracteres.")]
        public string ApellidoPaterno { get; set; } = string.Empty;

        /// Obtiene o establece el apellido materno.
        [StringLength(50, ErrorMessage = "El apellido materno no puede exceder los 50 caracteres.")]
        public string ApellidoMaterno { get; set; } = string.Empty;

        /// Obtiene o establece el correo electronico.
        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo no es valido.")]
        [StringLength(100, ErrorMessage = "El correo no puede exceder los 100 caracteres.")]
        public string Correo { get; set; } = string.Empty;

        /// Obtiene o establece la clave de acceso.
        [Required(ErrorMessage = "La contrasena es obligatoria.")]
        public string Password { get; set; } = string.Empty;

        /// Obtiene o establece el numero telefonico de contacto.
        [StringLength(15, ErrorMessage = "El telefono no puede exceder los 15 caracteres.")]
        public string Telefono { get; set; } = string.Empty;

        /// Obtiene o establece el nivel de privilegios asignado.
        /// Obtiene o establece el nivel de privilegios asignado.
        [Required(ErrorMessage = "El rol es obligatorio.")]
        public RolUsuario Rol { get; set; }
        
        /// Número de intentos fallidos consecutivos.
        public int IntentosFallidos { get; set; } = 0;

        /// Fecha y hora UTC hasta la que estará bloqueada la cuenta.
        public DateTime? BloqueadoHasta { get; set; }

        /// Fecha y hora UTC del último intento fallido.
        public DateTime? UltimoIntentoFallido { get; set; }

    }
}