using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentosController : ControllerBase
    {
        // Permite acceder a la base de datos
        private readonly SecureCampusContext _context;

        // Recibe la conexión a la base de datos
        public DocumentosController(SecureCampusContext context)
        {
            _context = context;
        }

        // GET: api/Documentos
        // Obtiene todos los documentos registrados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Documento>>> GetDocumentos()
        {
            return await _context.Documentos.ToListAsync();
        }

        // POST: api/Documentos
        // Registra un nuevo documento
        [HttpPost]
        public async Task<ActionResult<Documento>> PostDocumento(Documento documento)
        {
            _context.Documentos.Add(documento);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetDocumentos),
                new { id = documento.Id },
                documento
            );
        }
    }
}