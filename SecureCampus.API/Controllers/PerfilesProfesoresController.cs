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
            var profesorValido = await _context.Usuarios
                .AnyAsync(u => u.Id == perfilProfesor.UsuarioId && u.Rol == RolUsuario.Profesor);
            if (!profesorValido)
            {
                return BadRequest(new { mensaje = "La cuenta seleccionada no tiene el rol de profesor." });
            }

            if (!await _context.Departamentos.AnyAsync(d => d.Id == perfilProfesor.DepartamentoId))
            {
                return BadRequest(new { mensaje = "El departamento seleccionado no existe." });
            }

            if (await _context.PerfilesProfesores.AnyAsync(p => p.UsuarioId == perfilProfesor.UsuarioId))
            {
                return BadRequest(new { mensaje = "El profesor ya tiene un perfil departamental asignado." });
            }

            // Agrega la entidad al contexto
            _context.PerfilesProfesores.Add(perfilProfesor);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetPerfilesProfesores), new { id = perfilProfesor.Id }, perfilProfesor);
        }
    }
}