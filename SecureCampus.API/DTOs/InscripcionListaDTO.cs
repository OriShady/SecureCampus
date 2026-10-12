namespace SecureCampus.API.DTOs
{
    public class InscripcionListaDTO
    {
        public int Id { get; set; }
        public int EstudianteId { get; set; }
        public int CursoId { get; set; }
        public EstudianteListaDTO? Estudiante { get; set; }
    }

    public class EstudianteListaDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string ApellidoPaterno { get; set; } = string.Empty;
        public string ApellidoMaterno { get; set; } = string.Empty;
    }
}
