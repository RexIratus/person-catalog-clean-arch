using PersonCatalog.Application.Features.Personas.Commands.CreatePersona;

namespace PersonCatalog.UnitTests.Features.Personas;

public class CreatePersonaTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly CreatePersonaHandler _handler;

    public CreatePersonaTests()
    {
        // 1. Arrange para Mockear
        _mockContext = new Mock<IApplicationDbContext>();
        
        // Simulamos el DbSet de Personas
        var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<Persona>>();
        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        _handler = new CreatePersonaHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_DebeCrearPersona_Y_RetornarId()
    {
        // 1. Arrange: Preparamos el comando con datos válidos
        var command = new CreatePersonaCommand
        {
            Nombre = "Verso",
            Apellido = "Dessendre",
            Email = "verso@test.com",
            FechaNacimiento = new DateTime(1990, 1, 1),
            Telefono = "8888-8585",
            Direccion = "Lumiere",
            Genero = "Masculino",
            EstadoCivil = "Soltero"
        };

        // 2. Act: Ejecutamos el handler
        var result = await _handler.Handle(command, CancellationToken.None);

        // 3. Assert:
        
        // Verificamos que se llamó al método Add del DbSet UNA vez
        _mockContext.Verify(x => x.Personas.Add(It.IsAny<Persona>()), Times.Once);
        
        // Verificamos que se guardaron los cambios en la DB
        _mockContext.Verify(x => x.SaveChangesAsync(CancellationToken.None), Times.Once);
        
        // Verificamos que devolvió un ID
        result.Should().BeOfType(typeof(int));
    }
}