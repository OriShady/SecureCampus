
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SecureCampus.API.Models;

namespace SecureCampus.API.Services
{
    // Servicio encargado de generar constancias de estudios en PDF.
    public class ConstanciaPdfService
    {
        public byte[] GenerarConstancia(ConstanciaDTO datos)
        {
            var documento = Document.Create(contenedor =>
            {
                contenedor.Page(pagina =>
                {
                    // Configuracion general del documento.
                    pagina.Size(PageSizes.A4);
                    pagina.Margin(50);

                    // Encabezado.
                    pagina.Header()
                        .AlignCenter()
                        .Text("SECURECAMPUS")
                        .FontSize(20)
                        .Bold();

                    // Contenido de la constancia.
                    pagina.Content()
                        .PaddingVertical(30)
                        .Column(columna =>
                        {
                            columna.Spacing(20);

                            columna.Item()
                                .AlignCenter()
                                .Text("CONSTANCIA DE ESTUDIOS")
                                .FontSize(16)
                                .Bold();

                            columna.Item()
                                .Text(
                                    $"Por medio de la presente se hace constar que " +
                                    $"{datos.NombreEstudiante}, con numero de control " +
                                    $"{datos.NumeroControl}, se encuentra actualmente " +
                                    $"activo(a) como estudiante de la carrera de " +
                                    $"{datos.Carrera}, cursando el semestre " +
                                    $"{datos.Semestre}."
                                )
                                .FontSize(12)
                                .LineHeight(1.5f);

                            columna.Item()
                                .Text(
                                    $"Fecha de expedicion: " +
                                    $"{datos.FechaExpedicion:dd/MM/yyyy}"
                                )
                                .FontSize(11);
                        });

                    // Pie de pagina.
                    pagina.Footer()
                        .AlignCenter()
                        .Text("SecureCampus - Sistema de Gestion Escolar")
                        .FontSize(9);
                });
            });

            // Genera el archivo PDF.
            return documento.GeneratePdf();
        }
    }
}
