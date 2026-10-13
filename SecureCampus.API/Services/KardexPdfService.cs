
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

using SecureCampus.API.Models;


namespace SecureCampus.API.Services
{
    // Servicio encargado de generar el kardex en PDF.
    public class KardexPdfService
    {
        // Prepara la estructura del documento.
        
    public byte[] GenerarKardex(KardexDTO datos)

        {
            var documento = Document.Create(contenedor =>
            {
                contenedor.Page(pagina =>
                {
                    // Configuracion general de la pagina.
                    pagina.Size(PageSizes.A4);
                    pagina.Margin(40);

                    // Encabezado del documento.
                    pagina.Header()
                        .Text("SECURECAMPUS - KARDEX ACADEMICO")
                        .FontSize(18)
                        .Bold();

                    
                    // Muestra los datos reales del estudiante.
                    pagina.Content()
                        .PaddingVertical(20)
                        .Column(columna =>
                        {
                            columna.Spacing(10);

                            columna.Item()
                                .Text($"Nombre: {datos.NombreEstudiante}");

                            columna.Item()
                                .Text($"Numero de control: {datos.NumeroControl}");

                            columna.Item()
                                .Text($"Carrera: {datos.Carrera}");

                            columna.Item()
                                .Text($"Semestre: {datos.Semestre}");

                            columna.Item()
                                .Text($"Correo: {datos.Correo}");

                                
                            // Seccion de materias y calificaciones.
                            columna.Item()
                                .PaddingTop(15)
                                .Text("MATERIAS Y CALIFICACIONES")
                                .FontSize(14)
                                .Bold();

                            if (datos.Materias.Count == 0)
                            {
                                columna.Item()
                                    .Text("No hay materias inscritas.");
                            }
                            else
                            {
                                foreach (var materia in datos.Materias)
                                {
                                    columna.Item()
                                        .PaddingTop(10)
                                        .Text(materia.NombreMateria)
                                        .Bold();

                                    // Muestra las calificaciones parciales.
                                    for (int i = 0; i < materia.Parciales.Count; i++)
                                    {
                                        var calificacion = materia.Parciales[i];

                                        columna.Item().Text(
                                            $"Parcial {i + 1}: " +
                                            (calificacion.HasValue
                                                ? calificacion.Value.ToString()
                                                : "Pendiente")
                                        );
                                    }

                                    // Muestra la calificacion final.
                                    columna.Item()
                                        .Text(
                                            "Calificacion final: " +
                                            (materia.CalificacionFinal.HasValue
                                                ? materia.CalificacionFinal.Value.ToString()
                                                : "Pendiente")
                                        );
                                }
                            }

                            
                            // Muestra el promedio general del estudiante.
                            columna.Item()
                                .PaddingTop(20)
                                .Text("PROMEDIO GENERAL")
                                .FontSize(14)
                                .Bold();

                            columna.Item()
                                .Text(
                                    datos.PromedioGeneral.HasValue
                                        ? datos.PromedioGeneral.Value.ToString("F2")
                                        : "Pendiente"
                                )
                                .FontSize(16)
                                .Bold();


                        });

                        


                    // Pie de pagina.
                    pagina.Footer()
                        .AlignCenter()
                        .Text("Cardex")
                        .FontSize(9);
                });
            });

            // Convierte el documento en un archivo PDF.
            return documento.GeneratePdf();
        }
    }
}
