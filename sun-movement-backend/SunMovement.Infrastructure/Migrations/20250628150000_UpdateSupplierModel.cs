using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunMovement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSupplierModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Suppliers",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Suppliers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Website",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Suppliers");
        }
    }
}
