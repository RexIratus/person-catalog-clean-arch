using MediatR;
using PersonCatalog.Domain.Entities;

namespace PersonCatalog.Application.Features.Personas.Queries.GetAllPersonas;

// Petición para devolver la lista de Personas"
public record GetAllPersonasQuery : IRequest<List<Persona>>;