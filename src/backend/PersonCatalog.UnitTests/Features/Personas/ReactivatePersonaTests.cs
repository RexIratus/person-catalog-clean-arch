using PersonCatalog.Application.Features.Personas.Commands.ReactivatePersona;

namespace PersonCatalog.UnitTests.Features.Personas;

public class ReactivatePersonaTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly ReactivatePersonaHandler _handler;

    public ReactivatePersonaTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new ReactivatePersonaHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_ConIdValido_DebeActivarPersona()
    {
        // Arrange: Persona inactiva
        var persona = new Persona("Juan", "Borrable", DateTime.Now, "test@test.com", "1234-5678", "Dir 1", "Masculino", "Soltero");
        persona.Desactivar(); 
        
        var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<Persona>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(persona);

        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        // Act
        await _handler.Handle(new ReactivatePersonaCommand(1), CancellationToken.None);

        // Assert
        persona.Activo.Should().BeTrue(); // Validamos que cambió a True
        _mockContext.Verify(x => x.SaveChangesAsync(CancellationToken.None), Times.Once);
    }
}