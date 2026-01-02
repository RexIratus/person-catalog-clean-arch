using System.Net;
using System.Text.Json;

namespace PersonCatalog.Api.Middleware;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;

    public GlobalExceptionHandler(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception error)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            switch (error)
            {
                case KeyNotFoundException:
                    // 404: No encontrado
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    break;
                
                case InvalidOperationException:
                case ArgumentException:
                    // 400: Error de validación o lógica
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;

                default:
                    // 500: Error no controlado (DB caída, bug, etc.)
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            var result = JsonSerializer.Serialize(new { message = error.Message });
            await response.WriteAsync(result);
        }
    }
}