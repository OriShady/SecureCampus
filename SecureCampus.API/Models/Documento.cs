using System;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de un documento en el sistema.
    public class Documento
    {
        /// Obtiene o establece el identificador del registro.
        public int Id { get; set; }

        /// Obtiene o establece el nombre original del archivo.
        public string NombreArchivo { get; set; } = string.Empty;

        /// Obtiene o establece la ruta de almacenamiento en el servidor.
        public string RutaFisica { get; set; } = string.Empty;

        /// Obtiene o establece la fecha y hora de la carga del archivo.
        public DateTime FechaCarga { get; set; }

        /// Obtiene o establece el identificador del usuario propietario.
        public int EstudianteId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al propietario.
        public Usuario? Estudiante { get; set; }
    }
}