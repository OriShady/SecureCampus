using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del profesor.
    public class PerfilProfesor
    {
        /// Define el identificador principal.
        [Key]
        public int Id { get; set; }

        /// Define el numero de empleado.
        [Required(ErrorMessage = "El numero de empleado es obligatorio.")]
        [StringLength(20, ErrorMessage = "El numero de empleado no puede exceder los 20 caracteres.")]
        public string NumeroEmpleado { get; set; } = string.Empty;

        /// Define la llave foranea hacia el usuario.
        [Required]
        public int UsuarioId { get; set; }

        /// Define la llave foranea hacia el departamento.
        [Required]
        public int DepartamentoId { get; set; }
    }
}