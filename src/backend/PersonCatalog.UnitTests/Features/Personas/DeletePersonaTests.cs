using PersonCatalog.Application.Features.Personas.Commands.DeletePersona;

namespace PersonCatalog.UnitTests.Features.Personas;

public class DeletePersonaTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly DeletePersonaHandler _handler;

    public DeletePersonaTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new DeletePersonaHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_ConIdValido_DebeDesactivarPersona()
    {
        // 1. Arrange
        var persona = new Persona("Juan", "Perez", DateTime.Now, "borrar@test.com", "12345678", "Dir 2", "Masculino", "Soltero");
        // Se valida que esté activo (true) para poder realizar el borrado lógico
        persona.Activo.Should().BeTrue(); 

        var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<Persona>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync(persona);

        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        // 2. Act
        await _handler.Handle(new DeletePersonaCommand(1), CancellationToken.None);

        // 3. Assert
        persona.Activo.Should().BeFalse(); // Se valida que se desactivó.
        _mockContext.Verify(x => x.SaveChangesAsync(CancellationToken.None), Times.Once);
    }

    [Fact]
    public async Task Handle_ConIdInexistente_DebeLanzarExcepcion()
    {
        var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<Persona>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync((Persona)null!);

        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => 
            _handler.Handle(new DeletePersonaCommand(999), CancellationToken.None));
    }
}