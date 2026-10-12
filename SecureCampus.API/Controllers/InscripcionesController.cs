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

        /// Inserta un nuevo registro de inscripcion validando que no existan duplicados.
        /// Entidad de inscripcion a registrar.
        /// Confirmacion de la creacion o error de validacion.
        [HttpPost]
        public async Task<ActionResult<Inscripcion>> PostInscripcion(Inscripcion inscripcion)
        {
            var inscripcionDuplicada = await _context.Inscripciones
                .AnyAsync(i => i.CursoId == inscripcion.CursoId && i.EstudianteId == inscripcion.EstudianteId);

            if (inscripcionDuplicada)
            {
                return BadRequest(new { mensaje = "El estudiante ya esta matriculado en este curso." });
            }

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

        /// Elimina un registro de inscripcion existente mediante su identificador.
        /// Identificador de la inscripcion a eliminar.
        /// Estado de la operacion.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInscripcion(int id)
        {
            var inscripcion = await _context.Inscripciones.FindAsync(id);
            if (inscripcion == null)
            {
                return NotFound(new { mensaje = "El registro de inscripcion no existe." });
            }

            _context.Inscripciones.Remove(inscripcion);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "El alumno ha sido dado de baja de la materia exitosamente." });
        }
    }
}