using MediatR;
using Microsoft.EntityFrameworkCore;
using PersonCatalog.Application.Common.Interfaces;
using PersonCatalog.Domain.Entities;

namespace PersonCatalog.Application.Features.Personas.Queries.GetAllPersonas;

public class GetAllPersonasHandler : IRequestHandler<GetAllPersonasQuery, List<Persona>>
{
    private readonly IApplicationDbContext _context; 

    public GetAllPersonasHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Persona>> Handle(GetAllPersonasQuery request, CancellationToken cancellationToken)
    {
        return await _context.Personas
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}