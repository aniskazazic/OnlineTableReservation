using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class Migracija2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Locales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Locales_OwnerId",
                table: "Locales",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Locales_Owners_OwnerId",
                table: "Locales",
                column: "OwnerId",
                principalTable: "Owners",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locales_Owners_OwnerId",
                table: "Locales");

            migrationBuilder.DropIndex(
                name: "IX_Locales_OwnerId",
                table: "Locales");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Locales");
        }
    }
}
