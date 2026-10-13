
using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de una calificacion en el sistema.
    public class Calificacion
    {
        /// Identificador del registro.
        [Key]
        public int Id { get; set; }

        // Numero de parcial al que pertenece la calificacion.
        [Range(1, 10, ErrorMessage = "El numero de parcial debe estar entre 1 y 10.")]
        public int NumeroParcial { get; set; }

        // Calificacion obtenida en el parcial.
        // Solo permite numeros enteros del 1 al 100.
        [Range(1, 100, ErrorMessage = "La calificacion debe estar entre 1 y 100.")]
        public int Valor { get; set; }

        /// Identificador del estudiante evaluado.
        [Required(ErrorMessage = "El estudiante es obligatorio.")]
        public int EstudianteId { get; set; }

        /// Relacion con el estudiante.
        public Usuario? Estudiante { get; set; }

        /// Identificador del curso evaluado.
        [Required(ErrorMessage = "El curso es obligatorio.")]
        public int CursoId { get; set; }

        /// Relacion con el curso.
        public Curso? Curso { get; set; }
    }
}
