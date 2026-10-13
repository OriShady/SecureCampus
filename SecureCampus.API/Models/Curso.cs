
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

        // Cantidad de parciales que tendra el curso.
        // Cada curso puede definir su propia cantidad.
        [Range(1, 10, ErrorMessage = "La cantidad de parciales debe estar entre 1 y 10.")]
        public int CantidadParciales { get; set; } = 3;

        /// Obtiene o establece el identificador del usuario asignado como profesor.
        [Required(ErrorMessage = "El profesor es obligatorio.")]
        public int ProfesorId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al profesor.
        public Usuario? Profesor { get; set; }
    }
}
