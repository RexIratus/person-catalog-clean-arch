using Microsoft.EntityFrameworkCore;
using PersonCatalog.Domain.Entities;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace PersonCatalog.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Persona> Personas { get; }
    DatabaseFacade Database { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}