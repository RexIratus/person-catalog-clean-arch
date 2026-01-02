using MediatR;

namespace PersonCatalog.Application.Features.Personas.Commands.CreatePersona;

public record CreatePersonaCommand : IRequest<int>
{
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Genero { get; set; } = string.Empty;
    public string EstadoCivil { get; set; } = string.Empty;
}