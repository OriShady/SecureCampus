using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la ruta de acceso al controlador
    [Route("api/[controller]")]
    [ApiController]
    public class PerfilesProfesoresController : ControllerBase
    {
        /// Almacena la referencia al contexto
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto
        public PerfilesProfesoresController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PerfilProfesor>>> GetPerfilesProfesores()
        {
            // Retorna el registro de la base de datos
            return await _context.PerfilesProfesores.ToListAsync();
        }

        /// Configura la peticion POST
        [HttpPost]
        public async Task<ActionResult<PerfilProfesor>> PostPerfilProfesor(PerfilProfesor perfilProfesor)
        {
            // Agrega la entidad al contexto
            _context.PerfilesProfesores.Add(perfilProfesor);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetPerfilesProfesores), new { id = perfilProfesor.Id }, perfilProfesor);
        }
    }
}