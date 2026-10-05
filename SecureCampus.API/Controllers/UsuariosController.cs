using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.Models;

namespace SecureCampus.API.Controllers
{
     
     ///Gestiona las operaciones de red para la entidad Usuario.
     
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly SecureCampusContext _context;

         
         /// Inicializa el controlador asignando el contexto de la base de datos.
         
         ///Contexto inyectado por el framework.
        public UsuariosController(SecureCampusContext context)
        {
            _context = context;
        }

         
         ///Recupera el listado total de usuarios registrados en la base de datos.
         
         /// Coleccion de objetos tipo Usuario.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

         
         /// Inserta un nuevo registro de usuario en el sistema.
         
         /// Entidad de usuario a registrar.
         /// Confirmacion de la creacion y datos del usuario.
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuarios), new { id = usuario.Id }, usuario);
        }
    }
}