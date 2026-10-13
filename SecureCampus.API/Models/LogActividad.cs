
namespace SecureCampus.API.Models
{
    // Representa una actividad registrada en el sistema.
    public class LogActividad
    {
        // Identificador del registro.
        public int Id { get; set; }

        // Fecha y hora en que ocurrio la actividad.
        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        // Categoria: Acceso, Usuario, Calificacion,
        // Inscripcion o Documento.
        public string Categoria { get; set; } = string.Empty;

        // Accion realizada: Login, Bloqueo, Registro, etc.
        public string Accion { get; set; } = string.Empty;

        // Descripcion de lo que ocurrio.
        public string Descripcion { get; set; } = string.Empty;

        // Identificador del usuario que realizo la accion.
        // Puede ser nulo si no se conoce su identidad.
        public int? UsuarioId { get; set; }

        // Identificador del usuario afectado.
        public int? UsuarioAfectadoId { get; set; }
    }
}
