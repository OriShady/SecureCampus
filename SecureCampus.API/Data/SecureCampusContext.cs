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
        ///
        public DbSet<Curso> Cursos { get; set; }
        /// 
        public DbSet<Calificacion> Calificaciones { get; set; }
        /// 
        public DbSet<Documento> Documentos { get; set; }
        /// Configura la entidad Carrera en la base de datos
        public DbSet<Carrera> Carreras { get; set; }

        /// Configura la entidad Departamento en la base de datos
        public DbSet<Departamento> Departamentos { get; set; }

        /// Configura la entidad PerfilEstudiante en la base de datos
        public DbSet<PerfilEstudiante> PerfilesEstudiantes { get; set; }

        /// Configura la entidad PerfilProfesor en la base de datos
        public DbSet<PerfilProfesor> PerfilesProfesores { get; set; }

        /// Configura la entidad PerfilJefe en la base de datos
        public DbSet<PerfilJefe> PerfilesJefes { get; set; }

        /// Configura la entidad PerfilAdministrador en la base de datos
        public DbSet<PerfilAdministrador> PerfilesAdministradores { get; set; }
    }
}