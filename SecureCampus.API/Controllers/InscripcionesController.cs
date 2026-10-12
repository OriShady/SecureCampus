using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Gestiona las operaciones de red para la entidad Inscripcion.
    [Route("api/[controller]")]
    [ApiController]
    public class InscripcionesController : ControllerBase
    {
        private readonly SecureCampusContext _context;

        /// Inicializa el controlador asignando el contexto de la base de datos.
        /// Contexto inyectado por el framework.
        public InscripcionesController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Inserta un nuevo registro de inscripcion en el sistema.
        /// Entidad de inscripcion a registrar.
        /// Confirmacion de la creacion y datos de la inscripcion.
        [HttpPost]
        public async Task<ActionResult<Inscripcion>> PostInscripcion(Inscripcion inscripcion)
        {
            _context.Inscripciones.Add(inscripcion);
            await _context.SaveChangesAsync();

            return Ok(inscripcion);
        }

        /// Recupera el listado de inscripciones asociadas a un curso especifico.
        /// Identificador del curso.
        /// Coleccion de objetos tipo Inscripcion.
        [HttpGet("curso/{cursoId}")]
        public async Task<ActionResult<IEnumerable<Inscripcion>>> GetInscripcionesPorCurso(int cursoId)
        {
            return await _context.Inscripciones
                .Include(i => i.Estudiante)
                .Where(i => i.CursoId == cursoId)
                .ToListAsync();
        }
    }
}