using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using SecureCampus.API.DTOs;
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


        /// Recupera un usuario especifico por su identificador.
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

         
         /// Inserta un nuevo registro de usuario en el sistema.
         
         /// Entidad de usuario a registrar.
         /// Confirmacion de la creacion y datos del usuario.
        /// Registra un nuevo usuario en la base de datos y genera su perfil correspondiente.
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(RegistroUsuarioDTO registro)
        {
            var nuevoUsuario = new Usuario
            {
                Nombre = registro.Nombre,
                ApellidoPaterno = registro.ApellidoPaterno,
                ApellidoMaterno = registro.ApellidoMaterno,
                Correo = registro.Correo,
                Password = registro.Password, // Almacenamiento en texto plano por requerimiento de la Fase Funcional.
                Telefono = registro.Telefono,
                Rol = registro.Rol
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            if (registro.Rol == RolUsuario.Estudiante && registro.CarreraId.HasValue)
            {
                string anioMes = DateTime.Now.ToString("yyMM");
                string sufijo = new Random().Next(1000, 9999).ToString();
                string numeroControlGenerado = $"{anioMes}{sufijo}";

                var perfilEstudiante = new PerfilEstudiante
                {
                    NumeroControl = numeroControlGenerado,
                    SemestreActual = 1,
                    UsuarioId = nuevoUsuario.Id,
                    CarreraId = registro.CarreraId.Value
                };

                _context.PerfilesEstudiantes.Add(perfilEstudiante);
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetUsuario), new { id = nuevoUsuario.Id }, nuevoUsuario);
        }
    }
}