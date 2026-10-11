using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del estudiante
    public class PerfilEstudiante
    {
        /// Define el identificador principal
        [Key]
        public int Id { get; set; }

        /// Define el numero de control
        [Required(ErrorMessage = "El numero de control es obligatorio.")]
        [StringLength(20, ErrorMessage = "El numero de control no puede exceder los 20 caracteres.")]
        public string NumeroControl { get; set; } = string.Empty;

        /// Define el semestre en curso
        [Required(ErrorMessage = "El semestre es obligatorio.")]
        [Range(1, 12, ErrorMessage = "El semestre debe ser un valor valido entre 1 y 12.")]
        public int SemestreActual { get; set; }

        /// Define la llave foranea hacia el usuario
        [Required]
        public int UsuarioId { get; set; }

        /// Define la llave foranea hacia la carrera
        [Required]
        public int CarreraId { get; set; }
    }
}