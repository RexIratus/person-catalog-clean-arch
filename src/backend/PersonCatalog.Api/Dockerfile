# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/backend/PersonCatalog.Api/PersonCatalog.Api.csproj", "src/backend/PersonCatalog.Api/"]
COPY ["src/backend/PersonCatalog.Application/PersonCatalog.Application.csproj", "src/backend/PersonCatalog.Application/"]
COPY ["src/backend/PersonCatalog.Domain/PersonCatalog.Domain.csproj", "src/backend/PersonCatalog.Domain/"]
COPY ["src/backend/PersonCatalog.Infrastructure/PersonCatalog.Infrastructure.csproj", "src/backend/PersonCatalog.Infrastructure/"]
RUN dotnet restore "src/backend/PersonCatalog.Api/PersonCatalog.Api.csproj"
COPY . .
WORKDIR "/src/src/backend/PersonCatalog.Api"
RUN dotnet build "PersonCatalog.Api.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "PersonCatalog.Api.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PersonCatalog.Api.dll"]