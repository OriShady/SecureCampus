
using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Models;

namespace SecureCampus.API.Data
{
    /// Gestiona la conexion con la base de datos.
    public class SecureCampusContext : DbContext
    {
        // Inicializa el contexto de datos.
        public SecureCampusContext(DbContextOptions options)
            : base(options) { }

        // Representa la tabla de usuarios.
        public DbSet<Usuario> Usuarios { get; set; }

        // Representa la tabla de cursos.
        public DbSet<Curso> Cursos { get; set; }

        // Representa la tabla de calificaciones.
        public DbSet<Calificacion> Calificaciones { get; set; }

        // Representa la tabla de documentos.
        public DbSet<Documento> Documentos { get; set; }

        // Representa la tabla de carreras.
        public DbSet<Carrera> Carreras { get; set; }

        // Representa la tabla de departamentos.
        public DbSet<Departamento> Departamentos { get; set; }

        // Representa los perfiles de estudiantes.
        public DbSet<PerfilEstudiante> PerfilesEstudiantes { get; set; }

        // Representa los perfiles de profesores.
        public DbSet<PerfilProfesor> PerfilesProfesores { get; set; }

        // Representa los perfiles de jefes.
        public DbSet<PerfilJefe> PerfilesJefes { get; set; }

        // Representa los perfiles de administradores.
        public DbSet<PerfilAdministrador> PerfilesAdministradores { get; set; }

        // Representa las inscripciones.
        public DbSet<Inscripcion> Inscripciones { get; set; }

        // Representa los registros de actividad del sistema.
        public DbSet<LogActividad> LogsActividad { get; set; }

        
        // Configura las restricciones de las tablas.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Evita calificaciones duplicadas para el mismo
            // estudiante, curso y numero de parcial.
            modelBuilder.Entity<Calificacion>()
                .HasIndex(c => new
                {
                    c.EstudianteId,
                    c.CursoId,
                    c.NumeroParcial
                })
                .IsUnique();
        }

    }
}
