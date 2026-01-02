using MediatR;
using PersonCatalog.Application.Common.Interfaces;

namespace PersonCatalog.Application.Features.Personas.Commands.UpdatePersona;

public class UpdatePersonaHandler : IRequestHandler<UpdatePersonaCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public UpdatePersonaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdatePersonaCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Personas
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Persona con ID {request.Id} no encontrada.");
        }

        // Usamos el método de dominio (Encapsulamiento)
        entity.Actualizar(request.Nombre, request.Apellido, request.Email, request.Telefono, request.Direccion, request.EstadoCivil);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}