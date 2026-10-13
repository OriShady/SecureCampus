
namespace SecureCampus.API.Models
{
    // Contiene los datos que apareceran en el kardex.
    public class KardexDTO
    {
        public string NombreEstudiante { get; set; } = string.Empty;
        public string NumeroControl { get; set; } = string.Empty;
        public string Carrera { get; set; } = string.Empty;
        public int Semestre { get; set; }
        public string Correo { get; set; } = string.Empty;

        // Materias y calificaciones del estudiante.
        public List<MateriaKardexDTO> Materias { get; set; } = new();

        // Es nulo cuando no hay materias con promedio final.
        public decimal? PromedioGeneral { get; set; }
    }

    // Representa una materia dentro del kardex.
    public class MateriaKardexDTO
    {
        public string NombreMateria { get; set; } = string.Empty;
        public List<int?> Parciales { get; set; } = new();
        public int? CalificacionFinal { get; set; }
    }
}
