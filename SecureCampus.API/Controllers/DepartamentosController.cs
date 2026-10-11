using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la ruta de acceso al controlador
    [Route("api/[controller]")]
    [ApiController]
    public class DepartamentosController : ControllerBase
    {
        /// Almacena la referencia al contexto
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto
        public DepartamentosController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Departamento>>> GetDepartamentos()
        {
            // Retorna el registro de la base de datos
            return await _context.Departamentos.ToListAsync();
        }

        /// Configura la peticion POST
        [HttpPost]
        public async Task<ActionResult<Departamento>> PostDepartamento(Departamento departamento)
        {
            // Agrega la entidad al contexto
            _context.Departamentos.Add(departamento);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetDepartamentos), new { id = departamento.Id }, departamento);
        }
    }
}