using Microsoft.EntityFrameworkCore;
using SecureCampus.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SecureCampus.API.Services;
using Microsoft.OpenApi;
using QuestPDF.Infrastructure;


var builder = WebApplication.CreateBuilder(args);


// Configura QuestPDF para generar documentos academicos.
// Community debe utilizarse solamente si se cumplen sus condiciones de licencia.
QuestPDF.Settings.License = LicenseType.Community;


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


// Registra el servicio encargado de generar tokens JWT.
builder.Services.AddScoped<JwtService>();


// Obtener la configuracion JWT.
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "No se encontro la clave JWT.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "No se encontro el emisor JWT.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "No se encontro la audiencia JWT.");

// Configurar la validacion de los tokens.
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.Zero
        };
    });

// Habilitar las politicas de autorizacion.
builder.Services.AddAuthorization();

// Agrega los servicios necesarios para Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    // Configura el esquema de autenticacion JWT.
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Introduce el token JWT.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    // Indica que los endpoints protegidos utilizan JWT.
    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});



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

// Verifica la identidad del usuario.
app.UseAuthentication();

// Comprueba los permisos de acceso.
app.UseAuthorization();

// Mapea las rutas de los controladores
app.MapControllers();

// Inicia la ejecucion de la aplicacion
app.Run();