using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureCampus.API.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCalificacionesParciales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.AddColumn<int>(
            name: "CantidadParciales",
            table: "Cursos",
            type: "INTEGER",
            nullable: false,
            defaultValue: 3);


            migrationBuilder.AlterColumn<int>(
                name: "Valor",
                table: "Calificaciones",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "TEXT");

            migrationBuilder.AddColumn<int>(
                name: "NumeroParcial",
                table: "Calificaciones",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CantidadParciales",
                table: "Cursos");

            migrationBuilder.DropColumn(
                name: "NumeroParcial",
                table: "Calificaciones");

            migrationBuilder.AlterColumn<decimal>(
                name: "Valor",
                table: "Calificaciones",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");
        }
    }
}
