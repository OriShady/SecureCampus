using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureCampus.API.Migrations
{
    /// <inheritdoc />
    public partial class AgregarIndiceUnicoCalificaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Calificaciones_EstudianteId",
                table: "Calificaciones");

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_EstudianteId_CursoId_NumeroParcial",
                table: "Calificaciones",
                columns: new[] { "EstudianteId", "CursoId", "NumeroParcial" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Calificaciones_EstudianteId_CursoId_NumeroParcial",
                table: "Calificaciones");

            migrationBuilder.CreateIndex(
                name: "IX_Calificaciones_EstudianteId",
                table: "Calificaciones",
                column: "EstudianteId");
        }
    }
}
