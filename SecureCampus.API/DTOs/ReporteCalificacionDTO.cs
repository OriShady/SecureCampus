namespace SecureCampus.API.DTOs
{
    public class ReporteCalificacionDTO
    {
        public int CalificacionId { get; set; }
        public int CursoId { get; set; }
        public string Curso { get; set; } = string.Empty;
        public int EstudianteId { get; set; }
        public string Estudiante { get; set; } = string.Empty;
        public decimal Valor { get; set; }
    }
}
