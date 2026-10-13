
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.DTOs;
using SecureCampus.API.Models;


using SecureCampus.API.Services;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
    private readonly SecureCampusContext _context;
    private readonly JwtService _jwtService;

    // Recibe el contexto y el servicio JWT.
    public AuthController(
        SecureCampusContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }


        
        // Registra las actividades de acceso en la base de datos.
        private void RegistrarLog(
            string accion,
            string descripcion,
            int? usuarioId = null)
        {
            var log = new LogActividad
            {
                Fecha = DateTime.UtcNow,
                Categoria = "Acceso",
                Accion = accion,
                Descripcion = descripcion,
                UsuarioId = usuarioId,
                UsuarioAfectadoId = usuarioId
            };

            // Prepara el registro para guardarlo en SQLite.
            _context.LogsActividad.Add(log);
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
                // Registrar el intento de acceso durante el bloqueo.
                RegistrarLog(
                    "AccesoDenegado",
                    "Intento de acceso a una cuenta bloqueada.",
                    usuario.Id
                );

                // Guardar el registro de actividad en SQLite.
                await _context.SaveChangesAsync();

                return StatusCode(423, new
                {
                    mensaje = "Cuenta bloqueada temporalmente. Intenta mas tarde."
                });
            }


            
            // Reiniciar contador si el bloqueo ya termino.
            if (usuario.BloqueadoHasta != null &&
                usuario.BloqueadoHasta <= ahora)
            {   
                // Registrar que el bloqueo de 15 minutos termino.
                RegistrarLog(
                    "CuentaDesbloqueada",
                    "La cuenta quedo disponible despues de 15 minutos de bloqueo.",
                    usuario.Id
                );

                // Reiniciar los intentos fallidos.
                usuario.IntentosFallidos = 0;
                usuario.BloqueadoHasta = null;

                // Guardar el desbloqueo en SQLite.
                await _context.SaveChangesAsync();
            }


            // Comparacion provisional de contraseña.
            // La proteccion de contraseñas queda pendiente.
            if (usuario.Password != request.Password)
            {
                usuario.IntentosFallidos++;
                usuario.UltimoIntentoFallido = ahora;
                
                // Registrar el intento fallido.
                RegistrarLog(
                    "LoginFallido",
                    "Intento de inicio de sesion con contraseña incorrecta.",
                    usuario.Id
                );


                // Bloquear al llegar a tres intentos.
                
                if (usuario.IntentosFallidos >= 3)
                {
                    // Bloquear la cuenta durante 15 minutos.
                    usuario.BloqueadoHasta =
                        ahora.AddMinutes(15);

                    // Registrar el bloqueo en el historial.
                    RegistrarLog(
                        "CuentaBloqueada",
                        "Cuenta bloqueada por 3 intentos fallidos durante 15 minutos.",
                        usuario.Id
                    );

                    // Guardar el bloqueo y los logs en SQLite.
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

            // Registrar el inicio de sesion exitoso.
            RegistrarLog(
                "LoginExitoso",
                "El usuario inicio sesion correctamente.",
                usuario.Id
            );

            // Guardar los cambios y el registro de actividad.
            await _context.SaveChangesAsync();


           
        // Generar un token JWT para el usuario autenticado.
        var token = _jwtService.GenerarToken(usuario);

        // Responder con los datos del usuario y su token.
        // La contraseña no se incluye en la respuesta.
        return Ok(new
        {
            mensaje = "Inicio de sesion correcto.",
            usuario.Id,
            usuario.Nombre,
            usuario.Correo,
            usuario.Rol,
            token
        });

        }
    }
}
