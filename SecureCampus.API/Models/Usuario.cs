using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de usuario del sistema.
    public class Usuario
    {
        /// Obtiene o establece el identificador del registro.
        [Key]
        public int Id { get; set; }

        /// Obtiene o establece el nombre completo.
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        /// Obtiene o establece el correo electronico.
        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo no es valido.")]
        [StringLength(100, ErrorMessage = "El correo no puede exceder los 100 caracteres.")]
        public string Correo { get; set; } = string.Empty;

        /// Obtiene o establece la clave de acceso.
        [Required(ErrorMessage = "La contrasena es obligatoria.")]
        public string Password { get; set; } = string.Empty;
 
        /// Obtiene o establece el nivel de privilegios asignado.
        [Required(ErrorMessage = "El rol es obligatorio.")]
        public RolUsuario Rol { get; set; }
    }
}