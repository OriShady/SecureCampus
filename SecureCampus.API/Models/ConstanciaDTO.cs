
namespace SecureCampus.API.Models
{
    // Contiene la informacion necesaria para generar
    // la constancia de estudios del estudiante.
    public class ConstanciaDTO
    {
        public string NombreEstudiante { get; set; } = string.Empty;

        public string NumeroControl { get; set; } = string.Empty;

        public string Carrera { get; set; } = string.Empty;

        public int Semestre { get; set; }

        public DateTime FechaExpedicion { get; set; }
    }
}
