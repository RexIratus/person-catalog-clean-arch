using MediatR;

namespace PersonCatalog.Application.Features.Personas.Commands.DeletePersona;

public record DeletePersonaCommand(int Id) : IRequest<Unit>;