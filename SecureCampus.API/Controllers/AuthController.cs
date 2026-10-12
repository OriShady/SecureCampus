using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la estructura de datos para recibir las credenciales de acceso.
    public class LoginRequest
    {
        public string Correo { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    /// Define la ruta de acceso al controlador de autenticacion.
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        /// Almacena la referencia al contexto.
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto.
        public AuthController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion POST para validar el acceso.
        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> Login([FromBody] LoginRequest request)
        {
            // Busca el registro que coincida con las credenciales proporcionadas.
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == request.Correo && u.Password == request.Password);

            // Retorna un estado no autorizado si el registro no existe.
            if (usuario == null)
            {
                return Unauthorized(new { mensaje = "Credenciales invalidas." });
            }

            // Oculta la clave de acceso antes de retornar el registro al cliente.
            usuario.Password = string.Empty;

            // Retorna el registro con estado exitoso.
            return Ok(usuario);
        }
    }
}