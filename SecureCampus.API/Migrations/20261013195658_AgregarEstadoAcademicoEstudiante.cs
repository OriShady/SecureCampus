using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureCampus.API.Migrations
{
    /// <inheritdoc />
    public partial class AgregarEstadoAcademicoEstudiante : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EstadoAcademico",
                table: "PerfilesEstudiantes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstadoAcademico",
                table: "PerfilesEstudiantes");
        }
    }
}
