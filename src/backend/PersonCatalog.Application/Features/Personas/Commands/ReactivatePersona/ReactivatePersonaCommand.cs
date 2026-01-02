using MediatR;

namespace PersonCatalog.Application.Features.Personas.Commands.ReactivatePersona;

public record ReactivatePersonaCommand(int Id) : IRequest<Unit>;