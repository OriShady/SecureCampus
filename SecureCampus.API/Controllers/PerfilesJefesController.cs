using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerfilesJefesController : ControllerBase
    {
        // Permite acceder a la base de datos
        private readonly SecureCampusContext _context;

        // Recibe la conexión a la base de datos
        public PerfilesJefesController(SecureCampusContext context)
        {
            _context = context;
        }

        // GET: api/PerfilesJefes
        // Obtiene todos los perfiles de jefes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerfilJefe>>> GetPerfiles()
        {
            return await _context.PerfilesJefes.ToListAsync();
        }

        // POST: api/PerfilesJefes
        // Registra un nuevo perfil de jefe
        [HttpPost]
        public async Task<ActionResult<PerfilJefe>> PostPerfil(PerfilJefe perfil)
        {
            _context.PerfilesJefes.Add(perfil);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetPerfiles),
                new { id = perfil.Id },
                perfil
            );
        }
    }
}