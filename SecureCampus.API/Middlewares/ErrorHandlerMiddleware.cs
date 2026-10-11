using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SecureCampus.API.Middlewares
{
    /// Define el componente para la intercepcion de excepciones.
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        /// Inicializa la instancia del componente.
        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// Procesa la peticion HTTP y captura las excepciones generadas.
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var result = JsonSerializer.Serialize(new { error = exception.Message });
                await context.Response.WriteAsync(result);
            }
        }
    }
}