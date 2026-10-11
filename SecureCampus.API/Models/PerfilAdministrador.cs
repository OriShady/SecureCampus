using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del administrador.
    public class PerfilAdministrador
    {
        /// Define el identificador principal.
        [Key]
        public int Id { get; set; }

        /// Define el numero de empleado.
        [Required(ErrorMessage = "El numero de empleado es obligatorio.")]
        [StringLength(20, ErrorMessage = "El numero de empleado no puede exceder los 20 caracteres.")]
        public string NumeroEmpleado { get; set; } = string.Empty;

        /// Define el nivel de acceso.
        [Required(ErrorMessage = "El nivel de acceso es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nivel de acceso no puede exceder los 50 caracteres.")]
        public string NivelAcceso { get; set; } = string.Empty;

        /// Define la llave foranea hacia el usuario.
        [Required]
        public int UsuarioId { get; set; }
    }
}