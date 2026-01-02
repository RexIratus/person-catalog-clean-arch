using Microsoft.EntityFrameworkCore;
using PersonCatalog.Infrastructure.Persistence;
using PersonCatalog.Application.Common.Interfaces;
using PersonCatalog.Application.Features.Personas.Queries.GetAllPersonas;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de Base de Datos (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        mysqlOptions => mysqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
});

// Aquí le decimos a .NET: "Cuando un Handler pida IApplicationDbContext, dale la instancia de ApplicationDbContext"
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

// 2. Agrega Servicios de la Capa de Aplicación (MediatR, Validadores)
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetAllPersonasHandler).Assembly));

// 3. Configuración de API y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "Person Catalog API", 
        Version = "v1.0", 
        Description = "API RESTful implementando CQRS, Mediator y Concurrencia Optimista con MySQL.",
        Contact = new() { Name = "Ing. Argel Alfaro", Email = "argel.alfaro95@gmail.com" }
    });
    
    // Activa las anotaciones para [SwaggerOperation]
    c.EnableAnnotations();

    // Ruta del archivo XML de documentación
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// 4. CORS (PERMISOS PARA EL FRONTEND)
var allowedOrigins = builder.Configuration["AllowedOrigins"]?
    .Split(';', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins) // Acá leemos del appsettings el url/port del frontend para permitir que consuma
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// 5. Configuración AWS Lambda
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

// 6.1 Configuración ideal para no exponer públicamente swagger cuando el ambiente es productivo (como por ejemplo ya levantar desde un docker), sin embargo, para efectos de la prueba, se deja comentado.
/*if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
       c.SwaggerEndpoint("v1/swagger.json", "API v1");
       c.RoutePrefix = "swagger"; 
   });
}*/

// 6.2 Construimos y exponemos swagger siempre.
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("v1/swagger.json", "API v1");
    c.RoutePrefix = "swagger"; 
});

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseMiddleware<PersonCatalog.Api.Middleware.GlobalExceptionHandler>(); // Manejador global de excepciones controladas
app.MapControllers();

app.Run();