using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de inscripcion que relaciona a un usuario con un curso.
    public class Inscripcion
    {
        /// Obtiene o establece el identificador del registro.
        [Key]
        public int Id { get; set; }

        /// Obtiene o establece el identificador del usuario.
        [Required(ErrorMessage = "El estudiante es obligatorio.")]
        public int EstudianteId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario.
        public Usuario? Estudiante { get; set; }

        /// Obtiene o establece el identificador del curso.
        [Required(ErrorMessage = "El curso es obligatorio.")]
        public int CursoId { get; set; }

        /// Propiedad de navegacion hacia la entidad Curso.
        public Curso? Curso { get; set; }
    }
}