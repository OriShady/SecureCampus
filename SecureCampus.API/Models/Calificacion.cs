namespace SecureCampus.API.Models
{
    /// Representa la entidad de una calificacion en el sistema.
    public class Calificacion
    {
        /// Obtiene o establece el identificador del registro.
        public int Id { get; set; }

        /// Obtiene o establece el valor numerico de la evaluacion.
        public decimal Valor { get; set; }

        /// Obtiene o establece el identificador del usuario evaluado.
        public int EstudianteId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al estudiante.
        public Usuario? Estudiante { get; set; }

        /// Obtiene o establece el identificador del curso evaluado.
        public int CursoId { get; set; }

        /// Propiedad de navegacion hacia la entidad Curso correspondiente.
        public Curso? Curso { get; set; }
    }
}