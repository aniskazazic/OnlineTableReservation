using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class WorkerLocale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocaleId",
                table: "Workers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Workers_LocaleId",
                table: "Workers",
                column: "LocaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workers_Locales_LocaleId",
                table: "Workers",
                column: "LocaleId",
                principalTable: "Locales",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workers_Locales_LocaleId",
                table: "Workers");

            migrationBuilder.DropIndex(
                name: "IX_Workers_LocaleId",
                table: "Workers");

            migrationBuilder.DropColumn(
                name: "LocaleId",
                table: "Workers");
        }
    }
}
