using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Models;

namespace SecureCampus.API.Data
{
    /// Gestiona la conexion con la base de datos.
    public class SecureCampusContext : DbContext
    {
        /// Inicializa el contexto de datos.
        /// Opciones de configuracion.
        public SecureCampusContext(DbContextOptions options) : base(options) { }

        /// Representa la tabla Usuarios en la base de datos.
        public DbSet<Usuario> Usuarios { get; set; }
    }
}