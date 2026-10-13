
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    // Gestiona las operaciones relacionadas con los usuarios.
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        // Contexto de la base de datos.
        private readonly SecureCampusContext _context;

        // Inicializa el controlador.
        public UsuariosController(SecureCampusContext context)
        {
            _context = context;
        }

        // Obtiene todos los usuarios registrados.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // Registra un nuevo usuario en el sistema.
        
        // Registra un nuevo usuario y guarda la actividad.
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(
            Usuario usuario)
        {
            // Inicia una transaccion para guardar ambos registros.
            await using var transaccion =
                await _context.Database.BeginTransactionAsync();

            // Registra el nuevo usuario.
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Crea un log con el ID del usuario registrado.
            var log = new LogActividad
            {
                Fecha = DateTime.UtcNow,
                Categoria = "Usuario",
                Accion = "UsuarioRegistrado",
                Descripcion = "Se registro un nuevo usuario en SecureCampus.",
                UsuarioId = null,
                UsuarioAfectadoId = usuario.Id
            };

            // Guarda la actividad en SQLite.
            _context.LogsActividad.Add(log);
            await _context.SaveChangesAsync();

            // Confirma ambos registros.
            await transaccion.CommitAsync();

            // Devuelve el resultado del registro sin contraseña.
            return StatusCode(201, new
            {
                mensaje = "Usuario registrado correctamente.",
                usuario.Id,
                usuario.Nombre,
                usuario.Correo,
                usuario.Rol
            });
        }

    }
}
