namespace SecureCampus.API.Models
{
    /// Representa la entidad de un curso en el sistema.
    public class Curso
    {
        /// Obtiene o establece el identificador del registro.
        public int Id { get; set; }

        /// Obtiene o establece el nombre de la materia o grupo.
        public string Nombre { get; set; } = string.Empty;

        /// Obtiene o establece el identificador del usuario asignado como profesor.
        public int ProfesorId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al profesor.
        public Usuario? Profesor { get; set; }
    }
}