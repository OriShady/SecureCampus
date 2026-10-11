using System;
using System.ComponentModel.DataAnnotations;

namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del jefe.
    public class PerfilJefe
    {
        /// Define el identificador principal.
        [Key]
        public int Id { get; set; }

        /// Define el numero de empleado.
        [Required(ErrorMessage = "El numero de empleado es obligatorio.")]
        [StringLength(20, ErrorMessage = "El numero de empleado no puede exceder los 20 caracteres.")]
        public string NumeroEmpleado { get; set; } = string.Empty;

        /// Define la fecha del nombramiento.
        [Required(ErrorMessage = "La fecha de nombramiento es obligatoria.")]
        public DateTime FechaNombramiento { get; set; }

        /// Define la llave foranea hacia el usuario.
        [Required]
        public int UsuarioId { get; set; }

        /// Define la llave foranea hacia el departamento.
        [Required]
        public int DepartamentoId { get; set; }
    }
}