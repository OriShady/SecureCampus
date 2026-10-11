using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la ruta de acceso al controlador
    [Route("api/[controller]")]
    
    [ApiController]
    public class PerfilesEstudiantesController : ControllerBase
    {
        /// Almacena la referencia al contexto
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto
        public PerfilesEstudiantesController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerfilEstudiante>>> GetPerfilesEstudiantes()
        {
            // Retorna el registro de la base de datos
            return await _context.PerfilesEstudiantes.ToListAsync();
        }

        /// Configura la peticion POST
        [HttpPost]
        public async Task<ActionResult<PerfilEstudiante>> PostPerfilEstudiante(PerfilEstudiante perfilEstudiante)
        {
            // Agrega la entidad al contexto
            _context.PerfilesEstudiantes.Add(perfilEstudiante);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetPerfilesEstudiantes), new { id = perfilEstudiante.Id }, perfilEstudiante);
        }
    }
}