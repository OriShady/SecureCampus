using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    /// Define la ruta de acceso al controlador
    [Route("api/[controller]")]
    // Indica el comportamiento de la clase
    [ApiController] 
    public class CarrerasController : ControllerBase
    {
        /// Almacena la referencia al contexto
        private readonly SecureCampusContext _context;

        /// Inicializa el contexto
        public CarrerasController(SecureCampusContext context)
        {
            _context = context;
        }

        /// Configura la peticion GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Carrera>>> GetCarreras()
        {
            // Retorna el registro de la base de datos
            return await _context.Carreras.ToListAsync();
        }

        /// Configura la peticion POST
        [HttpPost]
        public async Task<ActionResult<Carrera>> PostCarrera(Carrera carrera)
        {
            // Agrega la entidad al contexto
            _context.Carreras.Add(carrera);
            // Aplica la transaccion en la base de datos
            await _context.SaveChangesAsync();

            // Retorna el estado de creacion
            return CreatedAtAction(nameof(GetCarreras), new { id = carrera.Id }, carrera);
        }
    }
}