
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SecureCampus.API.Models;

namespace SecureCampus.API.Services
{
    // Servicio encargado de generar tokens JWT.
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Genera un token para un usuario autenticado.
        public string GenerarToken(Usuario usuario)
        {
            var clave = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException(
                    "No se encontro la clave JWT.");

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var minutos = int.Parse(
                _configuration["Jwt:ExpirationMinutes"] ?? "30");

            // Incluye la identidad y el rol del usuario.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,
                    usuario.Id.ToString()),

                new Claim(ClaimTypes.Email,
                    usuario.Correo),

                new Claim(ClaimTypes.Role,
                    usuario.Rol.ToString())
            };

            // Prepara la firma del token.
            var llave = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(clave));

            var credenciales = new SigningCredentials(
                llave,
                SecurityAlgorithms.HmacSha256);

            // Genera el JWT con tiempo de expiracion.
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(minutos),
                signingCredentials: credenciales
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}
