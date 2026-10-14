-- Datos ficticios para una instancia local de demostracion.
-- Este script reemplaza los datos de las tablas de la aplicacion.
PRAGMA foreign_keys = ON;
BEGIN IMMEDIATE;

DELETE FROM "LogsActividad";
DELETE FROM "Calificaciones";
DELETE FROM "Inscripciones";
DELETE FROM "Documentos";
DELETE FROM "PerfilesAdministradores";
DELETE FROM "PerfilesJefes";
DELETE FROM "PerfilesProfesores";
DELETE FROM "PerfilesEstudiantes";
DELETE FROM "Cursos";
DELETE FROM "Usuarios";
DELETE FROM "Carreras";
DELETE FROM "Departamentos";

INSERT INTO "Departamentos" ("Id", "Nombre") VALUES
    (1, 'Ciencias Basicas'),
    (2, 'Sistemas y Computacion'),
    (3, 'Ciencias Economico-Administrativas');

INSERT INTO "Carreras" ("Id", "Nombre") VALUES
    (1, 'Ingenieria en Sistemas Computacionales'),
    (2, 'Ingenieria Industrial'),
    (3, 'Ingenieria en Gestion Empresarial');

-- Todos los usuarios de demostracion usan DemoCampus26! como contrasena.
-- No reutilizar estas cuentas ni esta contrasena en produccion.
INSERT INTO "Usuarios"
    ("Id", "Nombre", "ApellidoPaterno", "ApellidoMaterno", "Correo",
     "Password", "Telefono", "Rol", "IntentosFallidos")
VALUES
    (1, 'Alex', 'Solis', 'Rivera', 'admin.demo@toluca.tec.mx',
     'DemoCampus26!', '', 2, 0),
    (2, 'Lucia', 'Mendoza', 'Cruz', 'jefa.sistemas@toluca.tec.mx',
     'DemoCampus26!', '', 3, 0),
    (3, 'Carlos', 'Vega', 'Nunez', 'jefe.industrial@toluca.tec.mx',
     'DemoCampus26!', '', 3, 0),
    (4, 'Patricia', 'Rios', 'Salazar', 'jefa.gestion@toluca.tec.mx',
     'DemoCampus26!', '', 3, 0),
    (5, 'Andres', 'Castillo', 'Mora', 'andres.castillo@toluca.tec.mx',
     'DemoCampus26!', '', 1, 0),
    (6, 'Daniela', 'Herrera', 'Lopez', 'daniela.herrera@toluca.tec.mx',
     'DemoCampus26!', '', 1, 0),
    (7, 'Roberto', 'Navarro', 'Diaz', 'roberto.navarro@toluca.tec.mx',
     'DemoCampus26!', '', 1, 0),
    (8, 'Valeria', 'Ortega', 'Sanchez', 'valeria.ortega@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (9, 'Diego', 'Ramirez', 'Flores', 'diego.ramirez@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (10, 'Camila', 'Torres', 'Reyes', 'camila.torres@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (11, 'Mateo', 'Jimenez', 'Morales', 'mateo.jimenez@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (12, 'Renata', 'Flores', 'Castro', 'renata.flores@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (13, 'Emiliano', 'Cruz', 'Vargas', 'emiliano.cruz@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (14, 'Sofia', 'Morales', 'Romero', 'sofia.morales@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (15, 'Leonardo', 'Reyes', 'Mendoza', 'leonardo.reyes@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (16, 'Ximena', 'Castro', 'Jimenez', 'ximena.castro@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (17, 'Sebastian', 'Vargas', 'Torres', 'sebastian.vargas@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (18, 'Regina', 'Diaz', 'Ortega', 'regina.diaz@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (19, 'Santiago', 'Salazar', 'Ramirez', 'santiago.salazar@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (20, 'Mariana', 'Lopez', 'Herrera', 'mariana.lopez@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (21, 'Nicolas', 'Nunez', 'Vega', 'nicolas.nunez@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (22, 'Isabella', 'Rivera', 'Solis', 'isabella.rivera@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (23, 'Gael', 'Mora', 'Castillo', 'gael.mora@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (24, 'Elena', 'Sanchez', 'Ortega', 'elena.sanchez@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (25, 'Hugo', 'Flores', 'Ramirez', 'hugo.flores@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (26, 'Natalia', 'Torres', 'Jimenez', 'natalia.torres@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (27, 'Pablo', 'Reyes', 'Cruz', 'pablo.reyes@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (28, 'Abril', 'Vega', 'Navarro', 'abril.vega@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (29, 'Joaquin', 'Herrera', 'Mendoza', 'joaquin.herrera@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (30, 'Aitana', 'Navarro', 'Rios', 'aitana.navarro@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (31, 'Bruno', 'Romero', 'Salazar', 'bruno.romero@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0),
    (32, 'Zoe', 'Vargas', 'Diaz', 'zoe.vargas@toluca.tec.mx',
     'DemoCampus26!', '', 0, 0);

UPDATE "Usuarios"
SET "Telefono" = '7220000' || printf('%03d', "Id")
WHERE "Id" BETWEEN 1 AND 32;

INSERT INTO "PerfilesAdministradores"
    ("Id", "NumeroEmpleado", "NivelAcceso", "UsuarioId")
VALUES (1, 'ADM-DEMO-001', 'Completo', 1);

INSERT INTO "PerfilesJefes"
    ("Id", "NumeroEmpleado", "FechaNombramiento", "UsuarioId", "DepartamentoId")
VALUES
    (1, 'JEF-DEMO-001', '2026-01-15T00:00:00Z', 2, 2),
    (2, 'JEF-DEMO-002', '2026-01-15T00:00:00Z', 3, 1),
    (3, 'JEF-DEMO-003', '2026-01-15T00:00:00Z', 4, 3);

INSERT INTO "PerfilesProfesores"
    ("Id", "NumeroEmpleado", "UsuarioId", "DepartamentoId")
VALUES
    (1, 'DOC-DEMO-001', 5, 2),
    (2, 'DOC-DEMO-002', 6, 1),
    (3, 'DOC-DEMO-003', 7, 3);

INSERT INTO "PerfilesEstudiantes"
    ("Id", "NumeroControl", "SemestreActual", "EstadoAcademico", "UsuarioId", "CarreraId")
VALUES
    (1, '2026100001', 2, 0, 8, 1),
    (2, '2026100002', 2, 0, 9, 1),
    (3, '2026100003', 2, 0, 10, 1),
    (4, '2026100004', 2, 0, 11, 1),
    (5, '2026100005', 2, 0, 12, 1),
    (6, '2026100006', 3, 0, 13, 2),
    (7, '2026100007', 3, 0, 14, 2),
    (8, '2026100008', 3, 0, 15, 2),
    (9, '2026100009', 3, 0, 16, 2),
    (10, '2026100010', 3, 0, 17, 2),
    (11, '2026100011', 2, 0, 18, 1),
    (12, '2026100012', 2, 0, 19, 1),
    (13, '2026100013', 2, 0, 20, 1),
    (14, '2026100014', 2, 0, 21, 1),
    (15, '2026100015', 2, 0, 22, 1),
    (16, '2026100016', 2, 0, 23, 1),
    (17, '2026100017', 2, 0, 24, 1),
    (18, '2026100018', 2, 0, 25, 1),
    (19, '2026100019', 2, 0, 26, 1),
    (20, '2026100020', 2, 0, 27, 1),
    (21, '2026100021', 4, 0, 28, 3),
    (22, '2026100022', 4, 0, 29, 3),
    (23, '2026100023', 4, 0, 30, 3),
    (24, '2026100024', 4, 0, 31, 3),
    (25, '2026100025', 4, 0, 32, 3);

-- El modelo actual no tiene campos de grupo ni horario; se incluyen en Nombre.
INSERT INTO "Cursos" ("Id", "Nombre", "CantidadParciales", "ProfesorId") VALUES
    (1, 'Programacion I - ISC-A - Lun/Mie 08:00', 3, 5),
    (2, 'Fisica - Industrial-A - Mar/Jue 10:00', 3, 5),
    (3, 'Matematicas I - ISC-B - Lun/Mie 12:00', 3, 6),
    (4, 'Matematicas I - ISC-C - Mar/Jue 08:00', 3, 6),
    (5, 'Contabilidad - Gestion-A - Lun/Mie 09:00', 3, 7);

INSERT INTO "Inscripciones" ("EstudianteId", "CursoId") VALUES
    (8, 1), (9, 1), (10, 1), (11, 1), (12, 1),
    (13, 2), (14, 2), (15, 2), (16, 2), (17, 2),
    (18, 3), (19, 3), (20, 3), (21, 3), (22, 3),
    (23, 4), (24, 4), (25, 4), (26, 4), (27, 4),
    (28, 5), (29, 5), (30, 5), (31, 5), (32, 5);

INSERT INTO "Calificaciones"
    ("EstudianteId", "CursoId", "NumeroParcial", "Valor")
SELECT i."EstudianteId",
       i."CursoId",
       p."NumeroParcial",
       78 + ((i."EstudianteId" * 7 + i."CursoId" * 3 + p."NumeroParcial" * 5) % 20)
FROM "Inscripciones" AS i
CROSS JOIN (
    SELECT 1 AS "NumeroParcial"
    UNION ALL SELECT 2
    UNION ALL SELECT 3
) AS p;

COMMIT;

SELECT 'Usuarios' AS "Tabla", COUNT(*) AS "Registros" FROM "Usuarios"
UNION ALL SELECT 'Carreras', COUNT(*) FROM "Carreras"
UNION ALL SELECT 'Profesores', COUNT(*) FROM "PerfilesProfesores"
UNION ALL SELECT 'Estudiantes', COUNT(*) FROM "PerfilesEstudiantes"
UNION ALL SELECT 'Cursos/grupos', COUNT(*) FROM "Cursos"
UNION ALL SELECT 'Inscripciones', COUNT(*) FROM "Inscripciones"
UNION ALL SELECT 'Calificaciones', COUNT(*) FROM "Calificaciones";
