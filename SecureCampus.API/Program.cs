using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Establece la conexion a SQLite utilizando la cadena de configuracion
builder.Services.AddDbContext<SecureCampusContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Agrega el soporte para controladores
builder.Services.AddControllers();

var app = builder.Build();

// Mapea las rutas de los controladores
app.MapControllers();

// Inicia la ejecucion de la aplicacion
app.Run();