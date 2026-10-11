using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerfilesAdministradoresController : ControllerBase
    {
        // Permite acceder a la base de datos.
        private readonly SecureCampusContext _context;

        // Recibe la conexión a la base de datos.
        public PerfilesAdministradoresController(SecureCampusContext context)
        {
            _context = context;
        }

        // GET: api/PerfilesAdministradores
        // Obtiene todos los perfiles de administradores.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerfilAdministrador>>> GetPerfiles()
        {
            return await _context.PerfilesAdministradores.ToListAsync();
        }

        // POST: api/PerfilesAdministradores
        // Registra un nuevo perfil de administrador.
        [HttpPost]
        public async Task<ActionResult<PerfilAdministrador>> PostPerfil(
            PerfilAdministrador perfil)
        {
            _context.PerfilesAdministradores.Add(perfil);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetPerfiles),
                new { id = perfil.Id },
                perfil
            );
        }
    }
}