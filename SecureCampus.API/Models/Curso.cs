using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de un curso en el sistema.
    public class Curso
    {
        /// Obtiene o establece el identificador del registro.
        [Key]
        public int Id { get; set; }

        /// Obtiene o establece el nombre de la materia o grupo.
        [Required(ErrorMessage = "El nombre del curso es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre del curso no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        /// Obtiene o establece el identificador del usuario asignado como profesor.
        [Required(ErrorMessage = "El profesor es obligatorio.")]
        public int ProfesorId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al profesor.
        public Usuario? Profesor { get; set; }
    }
}