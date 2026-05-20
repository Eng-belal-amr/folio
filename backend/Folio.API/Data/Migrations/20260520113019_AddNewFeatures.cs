using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Folio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DiscountPercent = table.Column<int>(type: "int", nullable: false),
                    MaxUses = table.Column<int>(type: "int", nullable: false),
                    UsedCount = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Used = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SharedPortfolios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    AnalysisId = table.Column<int>(type: "int", nullable: false),
                    Slug = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TemplateSlug = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsPublic = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ViewCount = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SharedPortfolios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SharedPortfolios_Analyses_AnalysisId",
                        column: x => x.AnalysisId,
                        principalTable: "Analyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SharedPortfolios_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(28), "Clean, typographic, and timeless." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(36), "Nature-inspired with strong teal accents." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(40), "Deep dark with electric blue highlights." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(42), "Gold accents with floating 3D crystals." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(44), "Violet gradients with morphing 3D blob." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(46), "Rose tones with 3D torus." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Description", "Style" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(49), "Blue steel with rotating 3D box.", "Bold & Structured" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Description", "Style" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(51), "Warm amber with 3D dodecahedron.", "Earthy & Authentic" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Description", "Style" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(53), "Icy blue with 3D icosahedron.", "Ice-Cold Precision" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 20, 11, 30, 17, 5, DateTimeKind.Utc).AddTicks(55), "Deep purple with 3D torus knot." });

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_Code",
                table: "Coupons",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_UserId",
                table: "PasswordResetTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SharedPortfolios_AnalysisId",
                table: "SharedPortfolios",
                column: "AnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_SharedPortfolios_Slug",
                table: "SharedPortfolios",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SharedPortfolios_UserId",
                table: "SharedPortfolios",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "PasswordResetTokens");

            migrationBuilder.DropTable(
                name: "SharedPortfolios");

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6447), "Clean, typographic, and timeless. Perfect for developers who let their work speak." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6455), "Nature-inspired with strong teal accents. Great for designers and full-stack devs." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6458), "Deep dark backgrounds with electric blue highlights. Makes a strong first impression." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6460), "Gold accents on deep dark backgrounds. For seniors who mean business." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6462), "Violet gradients and soft depth. Stands out in a sea of boring portfolios." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6465), "Rose tones and warm whites. Perfect for UX designers and content creators." });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Description", "Style" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6467), "High contrast, monochrome, no-nonsense. Backend devs will love this.", "Brutalist & Raw" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Description", "Style" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6469), "Warm terracotta and olive tones. For creatives who value authenticity over flash.", "Earthy & Organic" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Description", "Style" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6471), "Pure white with icy blue accents. Ultra-clean, Scandinavian-inspired layout.", "Ice-Cold Minimal" });

            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Description" },
                values: new object[] { new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6474), "Full dark mode with deep purple and silver. The most premium-feeling template in the set." });
        }
    }
}
