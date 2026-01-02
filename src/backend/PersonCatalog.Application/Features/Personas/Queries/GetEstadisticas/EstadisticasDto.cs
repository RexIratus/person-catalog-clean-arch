namespace PersonCatalog.Application.Features.Estadisticas.Queries.GetEstadisticas;

public class EstadisticasDto
{
    public long Total { get; set; }
    public decimal Activos { get; set; } // Decimal ya que en ocasiones la operación SUM en MySql retorna decimales aunque sea números enteros la respuesta como por ejemplo: "1.00"
    public decimal Inactivos { get; set; }
}