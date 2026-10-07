namespace SecureCampus.API.Models
{
    /// Define el modelo para el perfil del estudiante
    public class PerfilEstudiante
    {
        /// Define el identificador principal
        public int Id { get; set; }

        /// Define el numero de control
        public string NumeroControl { get; set; } = string.Empty;

        /// Define el semestre en curso
        public int SemestreActual { get; set; }

        /// Define la llave foranea hacia el usuario
        public int UsuarioId { get; set; }

        /// Define la llave foranea hacia la carrera
        public int CarreraId { get; set; }
    }
}