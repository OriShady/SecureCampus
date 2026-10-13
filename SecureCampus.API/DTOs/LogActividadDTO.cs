
namespace SecureCampus.API.DTOs
{
    // Datos que se mostraran en el historial de actividades.
    public class LogActividadDTO
    {
        // Identificador del registro.
        public int Id { get; set; }

        // Fecha y hora de la actividad.
        public DateTime Fecha { get; set; }

        // Categoria del evento.
        public string Categoria { get; set; } = string.Empty;

        // Accion realizada.
        public string Accion { get; set; } = string.Empty;

        // Descripcion de la actividad.
        public string Descripcion { get; set; } = string.Empty;

        // Usuario responsable de la accion.
        public int? UsuarioId { get; set; }

        // Usuario afectado por la accion.
        public int? UsuarioAfectadoId { get; set; }
    }
}
