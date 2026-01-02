CREATE DATABASE IF NOT EXISTS PersonaDb;
USE PersonaDb;

CREATE TABLE IF NOT EXISTS Personas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    FechaNacimiento DATE NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(255),
    Genero VARCHAR(20),
    EstadoCivil VARCHAR(20),
    Activo BOOLEAN DEFAULT TRUE,
    -- Campo que MySQL actualiza automáticamente; nos permitirá evitar que se dupliquen registros o que un usuario solape a otro en caso tal de haber simultaniedad de consulta.
    RowVersion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
