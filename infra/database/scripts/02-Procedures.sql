USE PersonaDb;

DROP PROCEDURE IF EXISTS Sp_ObtenerEstadisticasPersonas;

DELIMITER //
CREATE PROCEDURE Sp_ObtenerEstadisticasPersonas()
BEGIN
    SELECT
        COUNT(*) as Total,
        SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) as Activos,
        SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) as Inactivos
    FROM Personas;
END //
DELIMITER ;
