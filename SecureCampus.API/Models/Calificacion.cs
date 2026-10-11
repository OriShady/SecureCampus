using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de una calificacion en el sistema.
    public class Calificacion
    {
        /// Obtiene o establece el identificador del registro.
        [Key]
        public int Id { get; set; }

        /// Obtiene o establece el valor numerico de la evaluacion.
        [Required(ErrorMessage = "El valor de la calificacion es obligatorio.")]
        [Range(0, 100, ErrorMessage = "La calificacion debe estar entre 0 y 100.")]
        public decimal Valor { get; set; }

        /// Obtiene o establece el identificador del usuario evaluado.
        [Required(ErrorMessage = "El estudiante es obligatorio.")]
        public int EstudianteId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al estudiante.
        public Usuario? Estudiante { get; set; }

        /// Obtiene o establece el identificador del curso evaluado.
        [Required(ErrorMessage = "El curso es obligatorio.")]
        public int CursoId { get; set; }

        /// Propiedad de navegacion hacia la entidad Curso correspondiente.
        public Curso? Curso { get; set; }
    }
}