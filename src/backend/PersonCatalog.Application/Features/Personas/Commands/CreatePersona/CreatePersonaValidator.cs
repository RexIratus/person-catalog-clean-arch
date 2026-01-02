using FluentValidation;

namespace PersonCatalog.Application.Features.Personas.Commands.CreatePersona;

public class CreatePersonaValidator : AbstractValidator<CreatePersonaCommand>
{
    public CreatePersonaValidator()
    {
        RuleFor(v => v.Nombre).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Apellido).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Email).NotEmpty().EmailAddress().MaximumLength(150);
        RuleFor(v => v.FechaNacimiento).LessThan(DateTime.Now).WithMessage("La fecha de nacimiento no puede ser la fecha en curso.");
    }
}