
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
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            // Agrega el usuario a la base de datos.
            _context.Usuarios.Add(usuario);

            // Guarda los cambios.
            await _context.SaveChangesAsync();

            // Devuelve el usuario registrado.
            return CreatedAtAction(
                nameof(GetUsuarios),
                new { id = usuario.Id },
                usuario
            );
        }
    }
}
