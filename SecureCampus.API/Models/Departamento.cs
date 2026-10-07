namespace SecureCampus.API.Models
{
    /// Define el modelo de departamento
    public class Departamento
    {
        /// Define el identificador principal
        public int Id { get; set; }

        /// Define el nombre
        public string Nombre { get; set; } = string.Empty;
    }
}