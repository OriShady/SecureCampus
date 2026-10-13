
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.DTOs;


using Microsoft.AspNetCore.Authorization;
using SecureCampus.API.Models;


namespace SecureCampus.API.Controllers
{
    
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = nameof(RolUsuario.Administrador))]
public class LogsActividadController : ControllerBase
    
    {
        
        // GET: api/LogsActividad
        // Consulta el historial de actividades.
        // Solo pueden acceder administradores autenticados.
        [HttpGet]
        public async Task<ActionResult<List<LogActividadDTO>>> GetLogs()
        {
            var logs = await ObtenerLogsAsync();

            return Ok(logs);
        }

        private readonly SecureCampusContext _context;

        public LogsActividadController(SecureCampusContext context)
        {
            _context = context;
        }

        // Prepara la consulta del historial de actividades.
        // Este metodo es privado para evitar exponer los logs
        // hasta implementar la autorizacion del administrador.
        private async Task<List<LogActividadDTO>> ObtenerLogsAsync()
        {
            return await _context.LogsActividad
                .AsNoTracking()
                .OrderByDescending(log => log.Fecha)
                .Select(log => new LogActividadDTO
                {
                    Id = log.Id,
                    Fecha = log.Fecha,
                    Categoria = log.Categoria,
                    Accion = log.Accion,
                    Descripcion = log.Descripcion,
                    UsuarioId = log.UsuarioId,
                    UsuarioAfectadoId = log.UsuarioAfectadoId
                })
                .ToListAsync();
        }
    }
}
