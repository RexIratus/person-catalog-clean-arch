namespace PersonCatalog.Domain.Entities;

public class Persona
{
    // Constructor de clase
    protected Persona() { }

    public Persona(string nombre, string apellido, DateTime fechaNacimiento, string email, string telefono, string direccion, string genero, string estadoCivil)
    {
        Nombre = nombre;
        Apellido = apellido;
        FechaNacimiento = fechaNacimiento;
        Email = email;
        Telefono = telefono;
        Direccion = direccion;
        Genero = genero;
        EstadoCivil = estadoCivil;
        Activo = true;
    }

    public int Id { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public string Apellido { get; private set; } = string.Empty;
    public DateTime FechaNacimiento { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string Telefono { get; private set; } = string.Empty;
    public string Direccion { get; private set; } = string.Empty;
    public string Genero { get; private set; } = string.Empty;
    public string EstadoCivil { get; private set; } = string.Empty;
    public bool Activo { get; private set; }

    // Token de concurrencia para evitar conflictos de escritura
    public byte[] RowVersion { get; private set; } = Array.Empty<byte>();

    public void Actualizar(string nombre, string apellido, string email, string telefono, string direccion, string estadoCivil)
    {
        Nombre = nombre;
        Apellido = apellido;
        Email = email;
        Telefono = telefono;
        Direccion = direccion;
        EstadoCivil = estadoCivil;
    }

    public void Desactivar() => Activo = false;
    public void Activar() => Activo = true;
}