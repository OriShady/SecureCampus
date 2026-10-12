using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la ruta de acceso al controlador
    [Route("api/[controller]")]
    [ApiController]
    public class CursosController : ControllerBase
    {
        /// Almacena la referencia al contexto
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto
        public CursosController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Curso>>> GetCursos()
        {
            // Retorna el registro de la base de datos
            return await _context.Cursos.ToListAsync();
        }

        /// Configura la peticion POST
        [HttpPost]
        public async Task<ActionResult<Curso>> PostCurso(Curso curso)
        {
            // Agrega la entidad al contexto
            _context.Cursos.Add(curso);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetCursos), new { id = curso.Id }, curso);
        }

        /// Configura la peticion GET para obtener los cursos asignados a un profesor especifico.
        [HttpGet("profesor/{profesorId}")]
        public async Task<ActionResult<IEnumerable<Curso>>> GetCursosPorProfesor(int profesorId)
        {
            return await _context.Cursos
                .Where(c => c.ProfesorId == profesorId)
                .ToListAsync();
        }
    }
}