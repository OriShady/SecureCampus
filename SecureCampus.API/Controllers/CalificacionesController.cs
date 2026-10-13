using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.DTOs;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la ruta de acceso al controlador
    [Route("api/[controller]")]
    [ApiController]
    public class CalificacionesController : ControllerBase
    {
        /// Almacena la referencia al contexto
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto
        public CalificacionesController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Calificacion>>> GetCalificaciones()
        {
            // Retorna el registro de la base de datos
            return await _context.Calificaciones.ToListAsync();
        }

        /// Configura la peticion POST
       
        [HttpPost]
        public async Task<ActionResult<Calificacion>> PostCalificacion(Calificacion calificacion)
        {
            // Busca el curso al que pertenece la calificacion.
            var curso = await _context.Cursos.FindAsync(calificacion.CursoId);

            // Verifica que el curso exista.
            if (curso == null)
            {
                return NotFound(new { mensaje = "El curso no existe." });
            }

            // Comprueba que el parcial corresponda a los configurados.
            if (calificacion.NumeroParcial < 1 ||
                calificacion.NumeroParcial > curso.CantidadParciales)
            {
                return BadRequest(new
                {
                    mensaje = $"El curso permite parciales del 1 al {curso.CantidadParciales}."
                });
            }

            // Evita registrar dos calificaciones para el mismo parcial.
            bool existeCalificacion = await _context.Calificaciones.AnyAsync(c =>
                c.EstudianteId == calificacion.EstudianteId &&
                c.CursoId == calificacion.CursoId &&
                c.NumeroParcial == calificacion.NumeroParcial);

            if (existeCalificacion)
            {
                return Conflict(new
                {
                    mensaje = "Este estudiante ya tiene una calificacion registrada para ese parcial."
                });
            }
            
            // Comprueba que el estudiante este inscrito en el curso.
            bool estaInscrito = await _context.Inscripciones.AnyAsync(i =>
                i.EstudianteId == calificacion.EstudianteId &&
                i.CursoId == calificacion.CursoId);

            if (!estaInscrito)
            {
                return BadRequest(new
                {
                    mensaje = "El estudiante no esta inscrito en este curso."
                });
            }

            // Guarda la calificacion parcial.
            _context.Calificaciones.Add(calificacion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCalificaciones),
                new { id = calificacion.Id },
                calificacion);
        }

        
        // Permite corregir el valor de una calificacion parcial.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCalificacion(
            int id, [FromBody] int nuevoValor)
        {
            // Busca la calificacion registrada.
            var calificacion = await _context.Calificaciones.FindAsync(id);

            if (calificacion == null)
            {
                return NotFound(new
                {
                    mensaje = "La calificacion no existe."
                });
            }

            // Valida que la nueva calificacion este entre 1 y 100.
            if (nuevoValor < 1 || nuevoValor > 100)
            {
                return BadRequest(new
                {
                    mensaje = "La calificacion debe estar entre 1 y 100."
                });
            }

            // Actualiza solamente el valor.
            calificacion.Valor = nuevoValor;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Calificacion actualizada correctamente.",
                calificacion.Id,
                calificacion.EstudianteId,
                calificacion.CursoId,
                calificacion.NumeroParcial,
                calificacion.Valor
            });
        }

        /// Recupera el historial de calificaciones asociado a un estudiante especifico.
        [HttpGet("estudiante/{estudianteId}")]
        public async Task<ActionResult<IEnumerable<Calificacion>>> GetCalificacionesPorEstudiante(int estudianteId)
        {
            return await _context.Calificaciones
                .Where(c => c.EstudianteId == estudianteId)
                .ToListAsync();
        }

        
        // Calcula la calificacion final de un estudiante en un curso.
        [HttpGet("promedio/estudiante/{estudianteId}/curso/{cursoId}")]
        public async Task<IActionResult> GetPromedioCurso(int estudianteId, int cursoId)
        {
            // Busca el curso.
            var curso = await _context.Cursos.FindAsync(cursoId);

            if (curso == null)
            {
                return NotFound(new { mensaje = "El curso no existe." });
            }

            // Obtiene las calificaciones parciales del estudiante.
            var calificaciones = await _context.Calificaciones
                .Where(c => c.EstudianteId == estudianteId &&
                            c.CursoId == cursoId)
                .ToListAsync();

            // Comprueba que todos los parciales esten registrados.
            if (calificaciones.Count != curso.CantidadParciales)
            {
                return Ok(new
                {
                    mensaje = "Aun faltan parciales por registrar.",
                    parcialesRegistrados = calificaciones.Count,
                    totalParciales = curso.CantidadParciales,
                    promedioFinal = (int?)null
                });
            }

            // Calcula y redondea el promedio al entero mas cercano.
            decimal promedio = calificaciones.Average(c => (decimal)c.Valor);
            int promedioFinal = (int)Math.Round(
                promedio, 0, MidpointRounding.AwayFromZero);

            return Ok(new
            {
                estudianteId,
                cursoId,
                parcialesRegistrados = calificaciones.Count,
                totalParciales = curso.CantidadParciales,
                promedioFinal
            });
        }

    
        // Calcula el promedio general de un estudiante.
        [HttpGet("promedio-general/estudiante/{estudianteId}")]
        public async Task<IActionResult> GetPromedioGeneral(int estudianteId)
        {
            // Obtiene las calificaciones y la cantidad de parciales
            // configurada para cada curso.
            var calificaciones = await (
                from c in _context.Calificaciones
                join curso in _context.Cursos on c.CursoId equals curso.Id
                where c.EstudianteId == estudianteId
                select new
                {
                    c.CursoId,
                    curso.CantidadParciales,
                    c.Valor
                }
            ).ToListAsync();

            // Agrupa las calificaciones por curso.
            var promediosCursos = calificaciones
                .GroupBy(c => c.CursoId)
                .Where(grupo =>
                    grupo.Count() == grupo.First().CantidadParciales)
                .Select(grupo =>
                    (int)Math.Round(
                        grupo.Average(c => (decimal)c.Valor),
                        0,
                        MidpointRounding.AwayFromZero))
                .ToList();

            // Comprueba que exista al menos un curso terminado.
            if (!promediosCursos.Any())
            {
                return Ok(new
                {
                    mensaje = "El estudiante aun no tiene cursos con todos sus parciales registrados.",
                    promedioGeneral = (decimal?)null
                });
            }

            // Calcula el promedio general con dos decimales.
            decimal promedioGeneral = Math.Round(
                promediosCursos.Average(c => (decimal)c),
                2,
                MidpointRounding.AwayFromZero);

            return Ok(new
            {
                estudianteId,
                cursosCompletados = promediosCursos.Count,
                promedioGeneral
            });
        }

        /// Recupera las calificaciones de cursos impartidos por profesores del departamento del jefe.
        [HttpGet("departamento/{jefeUsuarioId}")]
        public async Task<ActionResult<IEnumerable<ReporteCalificacionDTO>>> GetCalificacionesPorDepartamento(int jefeUsuarioId)
        {
            var jefe = await _context.PerfilesJefes
                .Where(p => p.UsuarioId == jefeUsuarioId)
                .Select(p => new { p.DepartamentoId })
                .SingleOrDefaultAsync();

            if (jefe == null)
            {
                return NotFound(new { mensaje = "No se encontro el perfil de jefe de carrera." });
            }

            var reporte = await (
                from calificacion in _context.Calificaciones
                join curso in _context.Cursos on calificacion.CursoId equals curso.Id
                join perfilProfesor in _context.PerfilesProfesores on curso.ProfesorId equals perfilProfesor.UsuarioId
                join estudiante in _context.Usuarios on calificacion.EstudianteId equals estudiante.Id
                where perfilProfesor.DepartamentoId == jefe.DepartamentoId
                orderby curso.Nombre, estudiante.ApellidoPaterno, estudiante.ApellidoMaterno, estudiante.Nombre
                select new ReporteCalificacionDTO
                {
                    CalificacionId = calificacion.Id,
                    CursoId = curso.Id,
                    Curso = curso.Nombre,
                    EstudianteId = estudiante.Id,
                    Estudiante = estudiante.Nombre + " " + estudiante.ApellidoPaterno + " " + estudiante.ApellidoMaterno,
                    Valor = calificacion.Valor
                })
                .ToListAsync();

            return Ok(reporte);
        }
    }
}