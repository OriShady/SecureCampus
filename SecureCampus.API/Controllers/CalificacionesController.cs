using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
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
            // Agrega la entidad al contexto
            _context.Calificaciones.Add(calificacion);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetCalificaciones), new { id = calificacion.Id }, calificacion);
        }

        /// Recupera el historial de calificaciones asociado a un estudiante especifico.
        [HttpGet("estudiante/{estudianteId}")]
        public async Task<ActionResult<IEnumerable<Calificacion>>> GetCalificacionesPorEstudiante(int estudianteId)
        {
            return await _context.Calificaciones
                .Where(c => c.EstudianteId == estudianteId)
                .ToListAsync();
        }
    }
}