using MediatR;
using PersonCatalog.Application.Common.Interfaces;

namespace PersonCatalog.Application.Features.Personas.Commands.ReactivatePersona;

public class ReactivatePersonaHandler : IRequestHandler<ReactivatePersonaCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public ReactivatePersonaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(ReactivatePersonaCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Personas.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) throw new KeyNotFoundException($"Persona {request.Id} no encontrada.");

        entity.Activar();

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}