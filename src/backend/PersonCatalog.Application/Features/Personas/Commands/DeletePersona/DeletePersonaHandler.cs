using MediatR;
using PersonCatalog.Application.Common.Interfaces;

namespace PersonCatalog.Application.Features.Personas.Commands.DeletePersona;

public class DeletePersonaHandler : IRequestHandler<DeletePersonaCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeletePersonaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeletePersonaCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Personas
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) throw new KeyNotFoundException($"Persona {request.Id} no encontrada.");

        // Soft Delete
        entity.Desactivar();

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}