using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Establece la conexion a SQLite utilizando la cadena de configuracion
builder.Services.AddDbContext<SecureCampusContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Agrega el servicio de CORS al contenedor de dependencias
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Agrega el soporte para controladores
builder.Services.AddControllers();

// Agrega los servicios necesarios para Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();


// Habilita Swagger en el entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Registra el componente de manejo de errores
app.UseMiddleware<SecureCampus.API.Middlewares.ErrorHandlerMiddleware>();

// Habilita el middleware de CORS utilizando la politica definida
app.UseCors("PermitirFrontend");

// Mapea las rutas de los controladores
app.MapControllers();

// Inicia la ejecucion de la aplicacion
app.Run();