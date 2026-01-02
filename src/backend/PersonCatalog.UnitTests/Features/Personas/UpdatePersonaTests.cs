using PersonCatalog.Application.Features.Personas.Commands.UpdatePersona;

namespace PersonCatalog.UnitTests.Features.Personas;

public class UpdatePersonaTests
{
    private readonly Mock<IApplicationDbContext> _mockContext;
    private readonly UpdatePersonaHandler _handler;

    public UpdatePersonaTests()
    {
        _mockContext = new Mock<IApplicationDbContext>();
        _handler = new UpdatePersonaHandler(_mockContext.Object);
    }

    [Fact]
    public async Task Handle_ConIdValido_DebeActualizarYGuardar()
    {
        // 1. Arrange
        var personaExistente = new Persona("Viejo", "Nombre", DateTime.Now, "test@test.com", "000", "Dir", "M", "S");
        var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<Persona>>();

        // Simulamos que FindAsync encuentra la persona
        mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync(personaExistente);

        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        var command = new UpdatePersonaCommand
        {
            Id = 1,
            Nombre = "NuevoNombre",
            Apellido = "NuevoApellido",
            Telefono = "12345678",
            Direccion = "Nueva Calle",
            EstadoCivil = "Casado",
            Email = "test@test.com"
        };

        // 2. Act
        await _handler.Handle(command, CancellationToken.None);

        // 3. Assert
        personaExistente.Nombre.Should().Be("NuevoNombre"); // Validamos que el objeto cambió en memoria
        _mockContext.Verify(x => x.SaveChangesAsync(CancellationToken.None), Times.Once); // Validamos que se guardó en DB
    }

    [Fact]
    public async Task Handle_ConIdInexistente_DebeLanzarExcepcion()
    {
        // 1. Arrange
        var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<Persona>>();
        
        // Simulamos que FindAsync no encuentra nada (retorna null)
        mockSet.Setup(m => m.FindAsync(It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync((Persona)null!);

        _mockContext.Setup(m => m.Personas).Returns(mockSet.Object);

        var command = new UpdatePersonaCommand { Id = 999, Nombre = "Nadie" };

        // 2. Act & Assert
        // Validamos que el código lance KeyNotFoundException
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _handler.Handle(command, CancellationToken.None));
    }
}