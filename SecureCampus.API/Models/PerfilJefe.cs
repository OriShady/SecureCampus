namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del jefe
    public class PerfilJefe
    {
        /// Define el identificador principal
        public int Id { get; set; }

        /// Define el numero de empleado
        public string NumeroEmpleado { get; set; } = string.Empty;

        /// Define la fecha del nombramiento
        public DateTime FechaNombramiento { get; set; }

        /// Define la llave foranea hacia el usuario
        public int UsuarioId { get; set; }

        /// Define la llave foranea hacia el departamento
        public int DepartamentoId { get; set; }
    }
}