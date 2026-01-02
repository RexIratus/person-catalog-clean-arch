
using PersonCatalog.Application.Features.Personas.Queries.GetAllPersonas;

namespace PersonCatalog.UnitTests.Features.Personas;

public class GetAllPersonasTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly GetAllPersonasHandler _handler;

    public GetAllPersonasTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new GetAllPersonasHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_DebeRetornarListaDePersonas()
    {
        // 1. Arrange: Simulamos una tabla con 2 personas
        var personasData = new List<Persona>
        {
            new Persona("Juan", "Perez", DateTime.Now, "juan@test.com", "12345678", "Dir 1", "Masculino", "Soltero"),
            new Persona("María", "Gomez", DateTime.Now, "maria@test.com", "12345678", "Dir 2", "Femenino", "Casada")
        };

        // Realizamos MockQueryable para simular EF Core asíncrono
        var mockSet = personasData.AsQueryable().BuildMockDbSet();

        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        // 2. Act
        var result = await _handler.Handle(new GetAllPersonasQuery(), CancellationToken.None);

        // 3. Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2); // Validamos que se obtienen los 2 registros mockeados
        result[0].Nombre.Should().Be("Juan");
    }
}