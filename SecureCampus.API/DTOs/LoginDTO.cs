
namespace SecureCampus.API.DTOs
{
    // Datos necesarios para iniciar sesión.
    public class LoginDTO
    {
        // Correo del usuario.
        public string Correo { get; set; } = string.Empty;

        // Contraseña ingresada.
        public string Password { get; set; } = string.Empty;
    }
}
