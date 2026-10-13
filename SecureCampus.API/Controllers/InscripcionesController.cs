using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.DTOs;
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
    public async Task<ActionResult<Inscripcion>> PostInscripcion(
        Inscripcion inscripcion)
    {
        // Verificar que el estudiante no esté inscrito.
        var inscripcionDuplicada = await _context.Inscripciones
            .AnyAsync(i =>
                i.CursoId == inscripcion.CursoId &&
                i.EstudianteId == inscripcion.EstudianteId);

        if (inscripcionDuplicada)
        {
            return BadRequest(new
            {
                mensaje = "El estudiante ya esta matriculado en este curso."
            });
        }

        // Iniciar una transaccion.
        await using var transaccion =
            await _context.Database.BeginTransactionAsync();

        // Registrar la inscripcion.
        _context.Inscripciones.Add(inscripcion);
        await _context.SaveChangesAsync();

        // Registrar la actividad en el historial.
        var log = new LogActividad
        {
            Fecha = DateTime.UtcNow,
            Categoria = "Inscripcion",
            Accion = "InscripcionRegistrada",
            Descripcion =
                $"Se registro la inscripcion del estudiante {inscripcion.EstudianteId} " +
                $"al curso {inscripcion.CursoId}.",

            // No inventamos quien realizo la operacion.
            UsuarioId = null,

            // Estudiante relacionado con la inscripcion.
            UsuarioAfectadoId = inscripcion.EstudianteId
        };

        _context.LogsActividad.Add(log);
        await _context.SaveChangesAsync();

        // Confirmar la inscripcion y su log.
        await transaccion.CommitAsync();

        return Ok(inscripcion);
    }


        /// Recupera el listado de inscripciones asociadas a un curso especifico.
        /// Identificador del curso.
        /// Coleccion de objetos tipo Inscripcion.
        [HttpGet("curso/{cursoId}")]
        public async Task<ActionResult<IEnumerable<InscripcionListaDTO>>> GetInscripcionesPorCurso(int cursoId)
        {
            return await _context.Inscripciones
                .Where(i => i.CursoId == cursoId)
                .Select(i => new InscripcionListaDTO
                {
                    Id = i.Id,
                    EstudianteId = i.EstudianteId,
                    CursoId = i.CursoId,
                    Estudiante = i.Estudiante == null ? null : new EstudianteListaDTO
                    {
                        Id = i.Estudiante.Id,
                        Nombre = i.Estudiante.Nombre,
                        ApellidoPaterno = i.Estudiante.ApellidoPaterno,
                        ApellidoMaterno = i.Estudiante.ApellidoMaterno
                    }
                })
                .ToListAsync();
        }

        /// Recupera las inscripciones de una materia solo si pertenece al profesor indicado.
        [HttpGet("profesor/{profesorId}/curso/{cursoId}")]
        public async Task<ActionResult<IEnumerable<InscripcionListaDTO>>> GetInscripcionesPorProfesorYCurso(int profesorId, int cursoId)
        {
            var cursoAsignado = await _context.Cursos
                .AnyAsync(c => c.Id == cursoId && c.ProfesorId == profesorId);

            if (!cursoAsignado)
            {
                return NotFound(new { mensaje = "La materia no pertenece al profesor indicado." });
            }

            return await _context.Inscripciones
                .Where(i => i.CursoId == cursoId)
                .OrderBy(i => i.Estudiante!.ApellidoPaterno)
                .ThenBy(i => i.Estudiante!.ApellidoMaterno)
                .ThenBy(i => i.Estudiante!.Nombre)
                .Select(i => new InscripcionListaDTO
                {
                    Id = i.Id,
                    EstudianteId = i.EstudianteId,
                    CursoId = i.CursoId,
                    Estudiante = i.Estudiante == null ? null : new EstudianteListaDTO
                    {
                        Id = i.Estudiante.Id,
                        Nombre = i.Estudiante.Nombre,
                        ApellidoPaterno = i.Estudiante.ApellidoPaterno,
                        ApellidoMaterno = i.Estudiante.ApellidoMaterno
                    }
                })
                .ToListAsync();
        }

        /// Elimina un registro de inscripcion existente mediante su identificador.
        /// Identificador de la inscripcion a eliminar.
        /// Estado de la operacion.
        
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInscripcion(int id)
    {
        // Buscar la inscripcion que se desea eliminar.
        var inscripcion = await _context.Inscripciones.FindAsync(id);

        if (inscripcion == null)
        {
            return NotFound(new
            {
                mensaje = "El registro de inscripcion no existe."
            });
        }

        // Guardar los identificadores antes de eliminar.
        int estudianteId = inscripcion.EstudianteId;
        int cursoId = inscripcion.CursoId;

        // Iniciar una transaccion.
        await using var transaccion =
            await _context.Database.BeginTransactionAsync();

        // Eliminar la inscripcion.
        _context.Inscripciones.Remove(inscripcion);

        // Registrar la actividad de cancelacion.
        var log = new LogActividad
        {
            Fecha = DateTime.UtcNow,
            Categoria = "Inscripcion",
            Accion = "InscripcionCancelada",
            Descripcion =
                $"Se dio de baja al estudiante {estudianteId} del curso {cursoId}.",
            UsuarioId = null,
            UsuarioAfectadoId = estudianteId
        };

        _context.LogsActividad.Add(log);

        // Guardar ambos cambios en SQLite.
        await _context.SaveChangesAsync();

        // Confirmar la transaccion.
        await transaccion.CommitAsync();

        return Ok(new
        {
            mensaje = "El alumno ha sido dado de baja de la materia exitosamente."
        });
    }

    }
}