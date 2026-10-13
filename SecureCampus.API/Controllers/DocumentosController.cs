using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentosController : ControllerBase
    {
        private const long MaximoBytesArchivo = 10 * 1024 * 1024;
        private static readonly HashSet<string> ExtensionesPermitidas = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".png", ".jpg", ".jpeg"
        };

        private readonly SecureCampusContext _context;
        private readonly IWebHostEnvironment _environment;

        public DocumentosController(SecureCampusContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DocumentoResumenDTO>>> GetDocumentos()
        {
            return await _context.Documentos
                .OrderByDescending(d => d.FechaCarga)
                .Select(d => new DocumentoResumenDTO
                {
                    Id = d.Id,
                    NombreArchivo = d.NombreArchivo,
                    FechaCarga = d.FechaCarga,
                    EstudianteId = d.EstudianteId
                })
                .ToListAsync();
        }

        [HttpGet("estudiante/{estudianteId}")]
        public async Task<ActionResult<IEnumerable<DocumentoResumenDTO>>> GetDocumentosPorEstudiante(int estudianteId)
        {
            return await _context.Documentos
                .Where(d => d.EstudianteId == estudianteId)
                .OrderByDescending(d => d.FechaCarga)
                .Select(d => new DocumentoResumenDTO
                {
                    Id = d.Id,
                    NombreArchivo = d.NombreArchivo,
                    FechaCarga = d.FechaCarga,
                    EstudianteId = d.EstudianteId
                })
                .ToListAsync();
        }

        
            [HttpPost("estudiante/{estudianteId}")]
            [RequestSizeLimit(MaximoBytesArchivo + 64 * 1024)]
            [Consumes("multipart/form-data")]
            public async Task<ActionResult<DocumentoResumenDTO>> SubirDocumento(int estudianteId, IFormFile archivo)

        {
            var esEstudiante = await _context.Usuarios
                .AnyAsync(u => u.Id == estudianteId && u.Rol == RolUsuario.Estudiante);

            if (!esEstudiante)
            {
                return NotFound(new { mensaje = "No se encontro el perfil del estudiante." });
            }

            if (archivo == null || archivo.Length == 0)
            {
                return BadRequest(new { mensaje = "Selecciona un archivo antes de cargarlo." });
            }

            if (archivo.Length > MaximoBytesArchivo)
            {
                return BadRequest(new { mensaje = "El archivo no puede superar los 10 MB." });
            }

            var nombreArchivo = Path.GetFileName(archivo.FileName);
            var extension = Path.GetExtension(nombreArchivo);
            if (string.IsNullOrWhiteSpace(nombreArchivo) || !ExtensionesPermitidas.Contains(extension))
            {
                return BadRequest(new { mensaje = "Solo se permiten archivos PDF, PNG y JPG." });
            }

            await using (var stream = archivo.OpenReadStream())
            {
                var encabezado = new byte[8];
                var bytesLeidos = await stream.ReadAsync(encabezado);
                if (!CoincideConTipo(extension, encabezado, bytesLeidos))
                {
                    return BadRequest(new { mensaje = "El contenido del archivo no coincide con su extension." });
                }
            }

            var directorioEstudiante = Path.Combine(_environment.ContentRootPath, "App_Data", "documentos", estudianteId.ToString());
            Directory.CreateDirectory(directorioEstudiante);

            var nombreAlmacenado = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
            var rutaCompleta = Path.Combine(directorioEstudiante, nombreAlmacenado);
            var rutaRelativa = Path.GetRelativePath(_environment.ContentRootPath, rutaCompleta);

            await using (var stream = System.IO.File.Create(rutaCompleta))
            {
                await archivo.CopyToAsync(stream);
            }

            var documento = new Documento
            {
                NombreArchivo = nombreArchivo,
                RutaFisica = rutaRelativa,
                FechaCarga = DateTime.UtcNow,
                EstudianteId = estudianteId
            };

            try
            {
                _context.Documentos.Add(documento);
                await _context.SaveChangesAsync();
            }
            catch
            {
                System.IO.File.Delete(rutaCompleta);
                throw;
            }

            var respuesta = new DocumentoResumenDTO
            {
                Id = documento.Id,
                NombreArchivo = documento.NombreArchivo,
                FechaCarga = documento.FechaCarga,
                EstudianteId = documento.EstudianteId
            };

            return CreatedAtAction(nameof(GetDocumentosPorEstudiante), new { estudianteId }, respuesta);
        }

        [HttpGet("estudiante/{estudianteId}/{documentoId}/descargar")]
        public async Task<IActionResult> DescargarDocumento(int estudianteId, int documentoId)
        {
            var documento = await _context.Documentos
                .SingleOrDefaultAsync(d => d.Id == documentoId && d.EstudianteId == estudianteId);

            if (documento == null)
            {
                return NotFound(new { mensaje = "No se encontro el documento solicitado." });
            }

            var directorioRaiz = Path.GetFullPath(Path.Combine(_environment.ContentRootPath, "App_Data", "documentos", estudianteId.ToString()));
            var rutaCompleta = Path.GetFullPath(Path.Combine(_environment.ContentRootPath, documento.RutaFisica));
            if (!rutaCompleta.StartsWith(directorioRaiz + Path.DirectorySeparatorChar, StringComparison.Ordinal) ||
                !System.IO.File.Exists(rutaCompleta))
            {
                return NotFound(new { mensaje = "El archivo no esta disponible." });
            }

            var contentTypeProvider = new FileExtensionContentTypeProvider();
            if (!contentTypeProvider.TryGetContentType(documento.NombreArchivo, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var stream = System.IO.File.OpenRead(rutaCompleta);
            return File(stream, contentType, documento.NombreArchivo);
        }

        private static bool CoincideConTipo(string extension, byte[] encabezado, int bytesLeidos)
        {
            return extension.ToLowerInvariant() switch
            {
                ".pdf" => bytesLeidos >= 5 && encabezado.AsSpan(0, 5).SequenceEqual("%PDF-"u8),
                ".png" => bytesLeidos >= 8 && encabezado.AsSpan(0, 8).SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }),
                ".jpg" or ".jpeg" => bytesLeidos >= 3 && encabezado[0] == 0xFF && encabezado[1] == 0xD8 && encabezado[2] == 0xFF,
                _ => false
            };
        }
    }

    public class DocumentoResumenDTO
    {
        public int Id { get; set; }
        public string NombreArchivo { get; set; } = string.Empty;
        public DateTime FechaCarga { get; set; }
        public int EstudianteId { get; set; }
    }
}
