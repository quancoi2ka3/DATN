using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunMovement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCoupon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeactivationReason",
                table: "Coupons",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DisableWhenProductsOutOfStock",
                table: "Coupons",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastAutoDeactivation",
                table: "Coupons",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimesDisabledDueToInventory",
                table: "Coupons",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeactivationReason",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "DisableWhenProductsOutOfStock",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "LastAutoDeactivation",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "TimesDisabledDueToInventory",
                table: "Coupons");
        }
    }
}
