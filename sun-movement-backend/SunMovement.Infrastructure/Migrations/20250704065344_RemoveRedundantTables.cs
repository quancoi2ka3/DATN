using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SunMovement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRedundantTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerActivities");

            migrationBuilder.DropTable(
                name: "CustomerReviews");

            migrationBuilder.DropTable(
                name: "ProductReviewHelpfuls");

            migrationBuilder.DropTable(
                name: "ProductReviewImages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ActivityType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdditionalData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerActivities_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CustomerReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    OrderId = table.Column<int>(type: "int", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    ServiceId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AdminResponse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdminResponseDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    IsVerifiedPurchase = table.Column<bool>(type: "bit", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_AspNetUsers_AdminId",
                        column: x => x.AdminId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProductReviewHelpfuls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductReviewId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsHelpful = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductReviewHelpfuls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductReviewHelpfuls_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductReviewHelpfuls_ProductReviews_ProductReviewId",
                        column: x => x.ProductReviewId,
                        principalTable: "ProductReviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductReviewImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductReviewId = table.Column<int>(type: "int", nullable: false),
                    AltText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductReviewImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductReviewImages_ProductReviews_ProductReviewId",
                        column: x => x.ProductReviewId,
                        principalTable: "ProductReviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerActivities_UserId",
                table: "CustomerActivities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_AdminId",
                table: "CustomerReviews",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_OrderId",
                table: "CustomerReviews",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_ProductId",
                table: "CustomerReviews",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_ServiceId",
                table: "CustomerReviews",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_UserId",
                table: "CustomerReviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviewHelpfuls_ProductReviewId_UserId",
                table: "ProductReviewHelpfuls",
                columns: new[] { "ProductReviewId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviewHelpfuls_UserId",
                table: "ProductReviewHelpfuls",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviewImages_ProductReviewId",
                table: "ProductReviewImages",
                column: "ProductReviewId");
        }
    }
}
