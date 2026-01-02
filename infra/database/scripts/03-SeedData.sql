USE PersonaDb;

INSERT INTO Personas (Nombre, Apellido, FechaNacimiento, Email, Telefono, Direccion, Genero, EstadoCivil, Activo)
VALUES
('Argel', 'Alfaro', '1995-08-24', 'rexiratus@demo.com', '(505) 555-0100', 'Managua, Nicaragua', 'Masculino', 'Soltero', 1),
('Verso', 'Dessendre', '1994-05-15', 'verso@demo.com', '(505) 555-0200', 'Managua, Nicaragua', 'Masculino', 'Soltero', 1),
('Alicia', 'Dessendre', '1996-06-12', 'alicia@demo.com', '(505) 555-0300', 'Managua, Nicaragua', 'Femenino', 'Soltera', 1),

('Cloud', 'Strife', '1997-01-31', 'cloud.strife@fenrir.com', '(505) 777-0001', 'Sector 7, Midgar', 'Masculino', 'Soltero', 1),
('Tifa', 'Lockhart', '1997-05-03', 'tifa.l@heaven.bar', '(505) 777-0002', 'Sector 7, Midgar', 'Femenino', 'Soltera', 1),
('Aerith', 'Gainsborough', '1998-02-07', 'aerith@ancient.cetra', '(505) 777-0003', 'Sector 5, Midgar', 'Femenino', 'Soltera', 0),
('Clive', 'Rosfield', '1995-10-15', 'clive@rosaria.val', '(505) 505-1999', 'Rosaria, Valisthea', 'Masculino', 'Soltero', 1),
('Jill', 'Warrick', '1996-11-22', 'jill@shiva.ice', '(505) 505-2000', 'Iron Kingdom, Valisthea', 'Femenino', 'Soltera', 1),

('Gustave', 'Expedition', '1985-03-12', 'gustave@expedition33.com', '(505) 333-3333', 'Lumiére, France', 'Masculino', 'Casado', 1),
('Maelle', 'Expedition', '1999-07-14', 'maelle@paint.arts', '(505) 333-4444', 'Lumiére, France', 'Femenino', 'Soltera', 1),
('Noctis', 'Caelum', '1990-08-30', 'noctis@lucis.reg', '(505) 888-9999', 'Insomnia, Lucis', 'Masculino', 'Casado', 0),

('Ren', 'Amamiya', '2000-04-01', 'joker@phantom.thieves', '(505) 000-1234', 'Yongen-Jaya, Tokyo', 'Masculino', 'Soltero', 1),
('Makoto', 'Niijima', '1998-04-23', 'queen@student.council', '(505) 000-5678', 'Shibuya, Tokyo', 'Femenino', 'Soltera', 1),
('2B', 'YoRHa', '2017-02-23', '2b@bunker.moon', '(505) 999-9999', 'City Ruins, Earth', 'Femenino', 'Soltera', 1),
('9S', 'YoRHa', '2017-01-30', '9s@bunker.moon', '(505) 999-8888', 'City Ruins, Earth', 'Masculino', 'Soltero', 0),

('Crono', 'Time', '1995-03-11', 'crono@truce.village', '(505) 100-1000', 'Truce, Guardia', 'Masculino', 'Casado', 1),
('Lucca', 'Ashtear', '1995-04-20', 'lucca@science.lab', '(505) 100-2000', 'Truce, Guardia', 'Femenino', 'Soltera', 1),
('Magus', 'Fiendlord', '1990-01-01', 'magus@north.cape', '(505) 666-6666', 'Zeal Kingdom', 'Masculino', 'Viudo', 0)
ON DUPLICATE KEY UPDATE Email=Email;
