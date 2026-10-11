using System;
using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Representa la entidad de un documento en el sistema.
    public class Documento
    {
        /// Obtiene o establece el identificador del registro.
        [Key]
        public int Id { get; set; }

        /// Obtiene o establece el nombre original del archivo.
        [Required(ErrorMessage = "El nombre del archivo es obligatorio.")]
        [StringLength(255, ErrorMessage = "El nombre del archivo no puede exceder los 255 caracteres.")]
        public string NombreArchivo { get; set; } = string.Empty;

        /// Obtiene o establece la ruta de almacenamiento en el servidor.
        [Required(ErrorMessage = "La ruta fisica es obligatoria.")]
        [StringLength(500, ErrorMessage = "La ruta fisica no puede exceder los 500 caracteres.")]
        public string RutaFisica { get; set; } = string.Empty;

        /// Obtiene o establece la fecha y hora de la carga del archivo.
        [Required(ErrorMessage = "La fecha de carga es obligatoria.")]
        public DateTime FechaCarga { get; set; }

        /// Obtiene o establece el identificador del usuario propietario.
        [Required(ErrorMessage = "El estudiante es obligatorio.")]
        public int EstudianteId { get; set; }

        /// Propiedad de navegacion hacia la entidad Usuario correspondiente al propietario.
        public Usuario? Estudiante { get; set; }
    }
}