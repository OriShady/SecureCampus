
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.DTOs;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SecureCampusContext _context;

        public AuthController(SecureCampusContext context)
        {
            _context = context;
        }

        // Inicio de sesion con bloqueo temporal.
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginDTO request)
        {
            // Buscar usuario por correo, sin comprobar
            // todavia la contraseña.
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>
                    u.Correo == request.Correo);

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensaje = "Credenciales invalidas."
                });
            }

            var ahora = DateTime.UtcNow;

            // Comprobar si la cuenta sigue bloqueada.
            if (usuario.BloqueadoHasta > ahora)
            {
                return StatusCode(423, new
                {
                    mensaje = "Cuenta bloqueada temporalmente. Intenta mas tarde."
                });
            }

            // Reiniciar contador si el bloqueo ya termino.
            if (usuario.BloqueadoHasta != null)
            {
                usuario.IntentosFallidos = 0;
                usuario.BloqueadoHasta = null;
            }

            // Comparacion provisional de contraseña.
            // La proteccion de contraseñas queda pendiente.
            if (usuario.Password != request.Password)
            {
                usuario.IntentosFallidos++;
                usuario.UltimoIntentoFallido = ahora;

                // Bloquear al llegar a tres intentos.
                if (usuario.IntentosFallidos >= 3)
                {
                    usuario.BloqueadoHasta =
                        ahora.AddMinutes(15);

                    await _context.SaveChangesAsync();

                    return StatusCode(423, new
                    {
                        mensaje = "Cuenta bloqueada durante 15 minutos."
                    });
                }

                await _context.SaveChangesAsync();

                return Unauthorized(new
                {
                    mensaje = "Credenciales invalidas."
                });
            }

            // Reiniciar contador si el acceso es correcto.
            usuario.IntentosFallidos = 0;
            usuario.BloqueadoHasta = null;

            await _context.SaveChangesAsync();

            // Responder sin incluir la contraseña.
            return Ok(new
            {
                mensaje = "Inicio de sesion correcto.",
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                usuario.Rol
            });
        }
    }
}
