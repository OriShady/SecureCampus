using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Define el modelo de departamento.
    public class Departamento
    {
        /// Define el identificador principal.
        [Key]
        public int Id { get; set; }

        /// Define el nombre.
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;
    }
}