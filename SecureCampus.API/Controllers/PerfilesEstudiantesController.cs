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

        
        // Actualiza el estado academico de un estudiante.
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstadoAcademico(
            int id, [FromBody] EstadoAcademico nuevoEstado)
        {
            // Busca el perfil academico.
            var perfil = await _context.PerfilesEstudiantes.FindAsync(id);

            if (perfil == null)
            {
                return NotFound(new
                {
                    mensaje = "El perfil del estudiante no existe."
                });
            }

            // Comprueba que el estado recibido sea valido.
            if (!Enum.IsDefined(typeof(EstadoAcademico), nuevoEstado))
            {
                return BadRequest(new
                {
                    mensaje = "El estado academico no es valido."
                });
            }

            // Actualiza solamente el estado academico.
            perfil.EstadoAcademico = nuevoEstado;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Estado academico actualizado correctamente.",
                perfil.Id,
                perfil.UsuarioId,
                estadoAcademico = perfil.EstadoAcademico.ToString()
            });
        }


    }
}