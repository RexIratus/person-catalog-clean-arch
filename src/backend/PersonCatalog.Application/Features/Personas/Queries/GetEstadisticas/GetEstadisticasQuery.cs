using MediatR;
using Microsoft.EntityFrameworkCore;
using PersonCatalog.Application.Common.Interfaces;

namespace PersonCatalog.Application.Features.Estadisticas.Queries.GetEstadisticas;

public record GetEstadisticasQuery : IRequest<EstadisticasDto>;

public class GetEstadisticasHandler : IRequestHandler<GetEstadisticasQuery, EstadisticasDto>
{
    private readonly IApplicationDbContext _context;

    public GetEstadisticasHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EstadisticasDto> Handle(GetEstadisticasQuery request, CancellationToken cancellationToken)
    {
        // Hacemos uso del SP/View creado para obtener las estadísticas de los usuarios
        var result = await _context.Database
            .SqlQuery<EstadisticasDto>($"CALL Sp_ObtenerEstadisticasPersonas()")
            .ToListAsync(cancellationToken);

        return result.FirstOrDefault() ?? new EstadisticasDto();
    }
}