using MediatR;
using Microsoft.AspNetCore.Mvc;
using PersonCatalog.Application.Features.Estadisticas.Queries.GetEstadisticas;
using PersonCatalog.Application.Features.Personas.Commands.CreatePersona;
using PersonCatalog.Application.Features.Personas.Queries.GetAllPersonas;
using PersonCatalog.Application.Features.Personas.Commands.UpdatePersona;
using PersonCatalog.Application.Features.Personas.Commands.DeletePersona;
using PersonCatalog.Application.Features.Personas.Commands.ReactivatePersona;
using Swashbuckle.AspNetCore.Annotations; 

namespace PersonCatalog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[SwaggerTag("Gestión del Catálogo de Personas")]
public class PersonasController : ControllerBase
{
    private readonly IMediator _mediator;

    public PersonasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Obtener todas las personas", Description = "Devuelve el listado completo de personas registradas.")]
    public async Task<IActionResult> GetPersonas()
    {
        var query = new GetAllPersonasQuery();
        var resultado = await _mediator.Send(query);
        return Ok(resultado);
    }

    [HttpGet("estadisticas")]
    [SwaggerOperation(Summary = "Obtener estadísticas (SP)", Description = "Ejecuta el Stored Procedure para obtener totales de activos/inactivos.")]
    public async Task<IActionResult> GetEstadisticas()
    {
        var query = new GetEstadisticasQuery();
        var resultado = await _mediator.Send(query);
        return Ok(resultado);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Crear nueva persona", Description = "Registra una nueva persona en el catálogo.")]
    [SwaggerResponse(200, "Persona creada exitosamente (devuelve ID)")]
    [SwaggerResponse(400, "Error de validación o datos duplicados")]
    public async Task<IActionResult> CreatePersona([FromBody] CreatePersonaCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }
    
    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Actualizar persona", Description = "Actualiza los datos de una persona existente.")]
    [SwaggerResponse(204, "Actualización exitosa")]
    [SwaggerResponse(404, "Persona no encontrada")]
    public async Task<IActionResult> UpdatePersona(int id, [FromBody] UpdatePersonaCommand command)
    {
        if (id != command.Id) return BadRequest("El ID de la URL no coincide con el cuerpo.");
        
        try 
        {
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Desactivar persona", Description = "Realiza un borrado lógico (Soft Delete) cambiando el estado a inactivo.")]
    [SwaggerResponse(204, "Desactivación exitosa")]
    public async Task<IActionResult> DeletePersona(int id)
    {
        try
        {
            await _mediator.Send(new DeletePersonaCommand(id));
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
    
    [HttpPut("{id}/reactivate")]
    [SwaggerOperation(Summary = "Reactivar persona", Description = "Restaura un registro previamente desactivado.")]
    [SwaggerResponse(204, "Reactivación exitosa")]
    public async Task<IActionResult> ReactivatePersona(int id)
    {
        try
        {
            await _mediator.Send(new ReactivatePersonaCommand(id));
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}