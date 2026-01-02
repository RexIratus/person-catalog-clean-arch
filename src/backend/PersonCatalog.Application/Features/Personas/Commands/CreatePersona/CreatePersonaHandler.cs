using MediatR;
using PersonCatalog.Application.Common.Interfaces;
using PersonCatalog.Domain.Entities;

namespace PersonCatalog.Application.Features.Personas.Commands.CreatePersona;

public class CreatePersonaHandler : IRequestHandler<CreatePersonaCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreatePersonaHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreatePersonaCommand request, CancellationToken cancellationToken)
    {
        // Creamos la entidad usando el constructor que protege el dominio
        var entity = new Persona(
            request.Nombre,
            request.Apellido,
            request.FechaNacimiento,
            request.Email,
            request.Telefono,
            request.Direccion,
            request.Genero,
            request.EstadoCivil
        );

        _context.Personas.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}