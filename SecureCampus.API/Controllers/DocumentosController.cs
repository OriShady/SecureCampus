
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;
using System.Security.Claims;

namespace SecureCampus.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentosController : ControllerBase
    {
        private const long MaximoBytesArchivo = 10 * 1024 * 1024;

        private static readonly HashSet<string> ExtensionesPermitidas =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ".pdf", ".png", ".jpg", ".jpeg"
            };

        private readonly SecureCampusContext _context;
        private readonly IWebHostEnvironment _environment;

        public DocumentosController(
            SecureCampusContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // Obtiene todos los documentos registrados.
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

        // Obtiene los documentos de un estudiante.
        [HttpGet("estudiante/{estudianteId}")]
        public async Task<ActionResult<IEnumerable<DocumentoResumenDTO>>> GetDocumentosPorEstudiante(
            int estudianteId)
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

        // Permite subir documentos PDF e imagenes.
        [HttpPost("estudiante/{estudianteId}")]
        [RequestSizeLimit(MaximoBytesArchivo + 64 * 1024)]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<DocumentoResumenDTO>> SubirDocumento(
            int estudianteId,
            IFormFile archivo)
        {
            var esEstudiante = await _context.Usuarios
                .AnyAsync(u =>
                    u.Id == estudianteId &&
                    u.Rol == RolUsuario.Estudiante);

            if (!esEstudiante)
            {
                return NotFound(new
                {
                    mensaje = "No se encontro el perfil del estudiante."
                });
            }

            if (archivo == null || archivo.Length == 0)
            {
                return BadRequest(new
                {
                    mensaje = "Selecciona un archivo antes de cargarlo."
                });
            }

            if (archivo.Length > MaximoBytesArchivo)
            {
                return BadRequest(new
                {
                    mensaje = "El archivo no puede superar los 10 MB."
                });
            }

            var nombreArchivo = Path.GetFileName(archivo.FileName);
            var extension = Path.GetExtension(nombreArchivo);

            if (string.IsNullOrWhiteSpace(nombreArchivo) ||
                !ExtensionesPermitidas.Contains(extension))
            {
                return BadRequest(new
                {
                    mensaje = "Solo se permiten archivos PDF, PNG y JPG."
                });
            }

            // Verifica que el contenido coincida con la extension.
            await using (var stream = archivo.OpenReadStream())
            {
                var encabezado = new byte[8];
                var bytesLeidos = await stream.ReadAsync(encabezado);

                if (!CoincideConTipo(extension, encabezado, bytesLeidos))
                {
                    return BadRequest(new
                    {
                        mensaje = "El contenido del archivo no coincide con su extension."
                    });
                }
            }

            // Prepara la carpeta donde se guardara el documento.
            var directorioEstudiante = Path.Combine(
                _environment.ContentRootPath,
                "App_Data",
                "documentos",
                estudianteId.ToString()
            );

            Directory.CreateDirectory(directorioEstudiante);

            var nombreAlmacenado =
                $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

            var rutaCompleta = Path.Combine(
                directorioEstudiante,
                nombreAlmacenado
            );

            var rutaRelativa = Path.GetRelativePath(
                _environment.ContentRootPath,
                rutaCompleta
            );

            // Guarda el archivo en el servidor.
            await using (var stream = System.IO.File.Create(rutaCompleta))
            {
                await archivo.CopyToAsync(stream);
            }

            // Registra el documento en la base de datos.
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

            return CreatedAtAction(
                nameof(GetDocumentosPorEstudiante),
                new { estudianteId },
                respuesta
            );
        }

        // Descarga un documento previamente almacenado.
        [HttpGet("estudiante/{estudianteId}/{documentoId}/descargar")]
        public async Task<IActionResult> DescargarDocumento(
            int estudianteId,
            int documentoId)
        {
            var documento = await _context.Documentos
                .SingleOrDefaultAsync(d =>
                    d.Id == documentoId &&
                    d.EstudianteId == estudianteId);

            if (documento == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontro el documento solicitado."
                });
            }

            var directorioRaiz = Path.GetFullPath(
                Path.Combine(
                    _environment.ContentRootPath,
                    "App_Data",
                    "documentos",
                    estudianteId.ToString()
                )
            );

            var rutaCompleta = Path.GetFullPath(
                Path.Combine(
                    _environment.ContentRootPath,
                    documento.RutaFisica
                )
            );

            // Comprueba que el archivo exista dentro de su carpeta.
            if (!rutaCompleta.StartsWith(
                    directorioRaiz + Path.DirectorySeparatorChar,
                    StringComparison.Ordinal) ||
                !System.IO.File.Exists(rutaCompleta))
            {
                return NotFound(new
                {
                    mensaje = "El archivo no esta disponible."
                });
            }

            var contentTypeProvider =
                new FileExtensionContentTypeProvider();

            if (!contentTypeProvider.TryGetContentType(
                    documento.NombreArchivo,
                    out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var stream = System.IO.File.OpenRead(rutaCompleta);

            return File(
                stream,
                contentType,
                documento.NombreArchivo
            );
        }

        // Permite descargar el kardex del estudiante autenticado.
        [Authorize(Roles = nameof(RolUsuario.Estudiante))]
        [HttpGet("estudiante/{estudianteId}/kardex")]
        public async Task<IActionResult> DescargarKardex(int estudianteId)
        {
            // Obtiene el ID del usuario desde su token JWT.
            var idToken = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (!int.TryParse(idToken, out int usuarioId))
            {
                return Unauthorized(new
                {
                    mensaje = "No se pudo identificar al usuario."
                });
            }

            // Impide descargar el kardex de otro estudiante.
            if (usuarioId != estudianteId)
            {
                return Forbid();
            }

            // Comprueba que exista el perfil academico.
            var perfil = await _context.PerfilesEstudiantes
                .FirstOrDefaultAsync(p =>
                    p.UsuarioId == estudianteId);

            if (perfil == null)
            {
                return NotFound(new
                {
                    mensaje = "El estudiante no tiene un perfil academico."
                });
            }

            
            // Consulta los datos reales del estudiante.
            var estudiante = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == estudianteId);

            if (estudiante == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontro al estudiante."
                });
            }

            
            // Consulta la carrera registrada en el perfil academico.
            var carrera = await _context.Carreras
                .FirstOrDefaultAsync(c => c.Id == perfil.CarreraId);

            if (carrera == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontro la carrera del estudiante."
                });
            }


            // Prepara los datos para generar el kardex.
            var datos = new KardexDTO
            {
                NombreEstudiante =
                    $"{estudiante.Nombre} {estudiante.ApellidoPaterno} {estudiante.ApellidoMaterno}".Trim(),

                Correo = estudiante.Correo,

                // Estos datos se completaran en el siguiente paso.
                
                NumeroControl = perfil.NumeroControl,
                Carrera = carrera.Nombre,
                Semestre = perfil.SemestreActual

            };
            
            // Consulta las materias en las que esta inscrito el estudiante.
            var inscripciones = await _context.Inscripciones
                .Include(i => i.Curso)
                .Where(i => i.EstudianteId == estudianteId)
                .OrderBy(i => i.Curso!.Nombre)
                .ToListAsync();

            
            // Consulta las calificaciones parciales del estudiante.
            var calificaciones = await _context.Calificaciones
                .Where(c => c.EstudianteId == estudianteId)
                .ToListAsync();


            
            // Relaciona cada materia con sus calificaciones parciales.
            datos.Materias = inscripciones
                .Where(i => i.Curso != null)
                .Select(i =>
                {
                    var curso = i.Curso!;

                    // Obtiene las calificaciones de esta materia.
                    var parciales = calificaciones
                        .Where(c => c.CursoId == curso.Id)
                        .ToList();

                    // Organiza las calificaciones por numero de parcial.
                    var valores = Enumerable
                        .Range(1, curso.CantidadParciales)
                        .Select(numero => parciales
                            .Where(c => c.NumeroParcial == numero)
                            .Select(c => (int?)c.Valor)
                            .FirstOrDefault())
                        .ToList();

                    // Calcula la final solo si estan todos los parciales.
                    int? calificacionFinal = null;

                    if (valores.All(v => v.HasValue))
                    {
                        calificacionFinal = (int)Math.Round(
                            valores.Average(v => v!.Value),
                            0,
                            MidpointRounding.AwayFromZero
                        );
                    }

                    return new MateriaKardexDTO
                    {
                        NombreMateria = curso.Nombre,
                        Parciales = valores,
                        CalificacionFinal = calificacionFinal
                    };
                })
                .ToList();

            
            // Obtiene las calificaciones finales de materias completas.
            var finales = datos.Materias
                .Where(m => m.CalificacionFinal.HasValue)
                .Select(m => m.CalificacionFinal!.Value)
                .ToList();

            // Calcula el promedio general si existen materias completas.
            datos.PromedioGeneral = finales.Count > 0
                ? Math.Round(
                    finales.Average(n => (decimal)n),
                    2,
                    MidpointRounding.AwayFromZero
                )
                : null;


            // Genera el kardex utilizando QuestPDF.
            var servicio =
                new SecureCampus.API.Services.KardexPdfService();

            byte[] pdf = servicio.GenerarKardex(datos);

            // Devuelve el PDF como archivo descargable.
            return File(
                pdf,
                "application/pdf",
                $"Kardex_{estudianteId}.pdf"
            );
        }

        
        // Descarga la constancia del estudiante activo.
        [Authorize(Roles = nameof(RolUsuario.Estudiante))]
        [HttpGet("estudiante/{estudianteId}/constancia")]
        public async Task<IActionResult> DescargarConstancia(int estudianteId)
        {
            // Identifica al usuario mediante su JWT.
            var idToken = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(idToken, out int usuarioId))
            {
                return Unauthorized(new
                {
                    mensaje = "No se pudo identificar al usuario."
                });
            }

            // Impide descargar constancias de otros estudiantes.
            if (usuarioId != estudianteId)
            {
                return Forbid();
            }

            // Busca el perfil academico del estudiante.
            var perfil = await _context.PerfilesEstudiantes
                .FirstOrDefaultAsync(p => p.UsuarioId == estudianteId);

            if (perfil == null)
            {
                return NotFound(new
                {
                    mensaje = "El estudiante no tiene un perfil academico."
                });
            }

            // Solo los estudiantes activos pueden descargar constancias.
            if (perfil.EstadoAcademico != EstadoAcademico.Activo)
            {
                return StatusCode(403, new
                {
                    mensaje = "Solo los estudiantes activos pueden descargar constancias."
                });
            }

            // Consulta los datos personales del estudiante.
            var estudiante = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == estudianteId);

            if (estudiante == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontro al estudiante."
                });
            }

            // Consulta la carrera.
            var carrera = await _context.Carreras
                .FirstOrDefaultAsync(c => c.Id == perfil.CarreraId);

            if (carrera == null)
            {
                return NotFound(new
                {
                    mensaje = "No se encontro la carrera del estudiante."
                });
            }

            // Organiza los datos que apareceran en el PDF.
            var datos = new ConstanciaDTO
            {
                NombreEstudiante =
                    $"{estudiante.Nombre} {estudiante.ApellidoPaterno} {estudiante.ApellidoMaterno}".Trim(),
                NumeroControl = perfil.NumeroControl,
                Carrera = carrera.Nombre,
                Semestre = perfil.SemestreActual,
                FechaExpedicion = DateTime.Now
            };

            // Genera y devuelve el archivo PDF.
            var servicio = new SecureCampus.API.Services.ConstanciaPdfService();
            byte[] pdf = servicio.GenerarConstancia(datos);

            return File(
                pdf,
                "application/pdf",
                $"Constancia_{estudianteId}.pdf"
            );
        }


        // Comprueba la firma inicial de los archivos permitidos.
        private static bool CoincideConTipo(
            string extension,
            byte[] encabezado,
            int bytesLeidos)
        {
            return extension.ToLowerInvariant() switch
            {
                ".pdf" => bytesLeidos >= 5 &&
                    encabezado.AsSpan(0, 5).SequenceEqual("%PDF-"u8),

                ".png" => bytesLeidos >= 8 &&
                    encabezado.AsSpan(0, 8).SequenceEqual(
                        new byte[]
                        {
                            0x89, 0x50, 0x4E, 0x47,
                            0x0D, 0x0A, 0x1A, 0x0A
                        }),

                ".jpg" or ".jpeg" => bytesLeidos >= 3 &&
                    encabezado[0] == 0xFF &&
                    encabezado[1] == 0xD8 &&
                    encabezado[2] == 0xFF,

                _ => false
            };
        }
    }

    // Datos basicos que se muestran al consultar documentos.
    public class DocumentoResumenDTO
    {
        public int Id { get; set; }
        public string NombreArchivo { get; set; } = string.Empty;
        public DateTime FechaCarga { get; set; }
        public int EstudianteId { get; set; }
    }
}
