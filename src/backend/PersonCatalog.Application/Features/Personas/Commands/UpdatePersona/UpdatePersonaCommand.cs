using MediatR;

namespace PersonCatalog.Application.Features.Personas.Commands.UpdatePersona;

// Se hace uso de return Unit al ser el estándar.
public record UpdatePersonaCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string EstadoCivil { get; set; } = string.Empty;
}