using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Define el modelo de la carrera.
    public class Carrera
    {
        /// Define el identificador.
        [Key]
        public int Id { get; set; }

        /// Define el nombre.
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;
    }
}