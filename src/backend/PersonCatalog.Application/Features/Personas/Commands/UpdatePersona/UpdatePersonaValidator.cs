using FluentValidation;

namespace PersonCatalog.Application.Features.Personas.Commands.UpdatePersona;

public class UpdatePersonaValidator : AbstractValidator<UpdatePersonaCommand>
{
    public UpdatePersonaValidator()
    {
        RuleFor(v => v.Id).GreaterThan(0);
        RuleFor(v => v.Nombre).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Apellido).NotEmpty().MaximumLength(100);
    }
}