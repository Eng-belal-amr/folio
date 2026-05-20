using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Folio.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Templates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Slug = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Style = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsFree = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PreviewBg = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PreviewHeader = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PreviewSkill = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PreviewTag = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Templates", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GoogleId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AvatarUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAdmin = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Analyses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CandidateName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CandidateTitle = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OverallScore = table.Column<int>(type: "int", nullable: false),
                    ResultJson = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SelectedTemplateId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Analyses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Currency = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Plan = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    PaymobOrderId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PaymobTransactionId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Plan = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    AnalysesUsedThisMonth = table.Column<int>(type: "int", nullable: false),
                    AnalysesResetDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    PaymobOrderId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subscriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Templates",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "IsFree", "Name", "PreviewBg", "PreviewHeader", "PreviewSkill", "PreviewTag", "Slug", "SortOrder", "Style" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6447), "Clean, typographic, and timeless. Perfect for developers who let their work speak.", true, true, "Lumière", "#fafaf8", "#1c1a16", "#d4a843", "#f5edd8", "lumiere", 1, "Minimal & Editorial" },
                    { 2, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6455), "Nature-inspired with strong teal accents. Great for designers and full-stack devs.", true, true, "Verdant", "#f0fafa", "#2a7c7c", "#3da8a8", "#d4eded", "verdant", 2, "Creative & Bold" },
                    { 3, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6458), "Deep dark backgrounds with electric blue highlights. Makes a strong first impression.", true, true, "Nova", "#0d1117", "#58a6ff", "#388bfd", "#161b22", "nova", 3, "Dark & Futuristic" },
                    { 4, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6460), "Gold accents on deep dark backgrounds. For seniors who mean business.", true, false, "Gilded", "#1a1814", "#d4a843", "#e8c96b", "#3a3220", "gilded", 4, "Luxury & Refined" },
                    { 5, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6462), "Violet gradients and soft depth. Stands out in a sea of boring portfolios.", true, false, "Aurora", "#f7f5ff", "#6b4fa8", "#8e72c4", "#ede8f8", "aurora", 5, "Vibrant & Modern" },
                    { 6, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6465), "Rose tones and warm whites. Perfect for UX designers and content creators.", true, false, "Blush", "#fff8f9", "#c24b6e", "#e06d8a", "#fce8ef", "blush", 6, "Warm & Approachable" },
                    { 7, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6467), "High contrast, monochrome, no-nonsense. Backend devs will love this.", true, false, "Slate", "#f8fafc", "#334155", "#64748b", "#e2e8f0", "slate", 7, "Brutalist & Raw" },
                    { 8, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6469), "Warm terracotta and olive tones. For creatives who value authenticity over flash.", true, false, "Terra", "#fdf6f0", "#8b4513", "#cd853f", "#f5e6d3", "terra", 8, "Earthy & Organic" },
                    { 9, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6471), "Pure white with icy blue accents. Ultra-clean, Scandinavian-inspired layout.", true, false, "Arctic", "#f0f8ff", "#1e3a5f", "#4a90d9", "#ddeeff", "arctic", 9, "Ice-Cold Minimal" },
                    { 10, new DateTime(2026, 5, 18, 21, 34, 8, 407, DateTimeKind.Utc).AddTicks(6474), "Full dark mode with deep purple and silver. The most premium-feeling template in the set.", true, false, "Obsidian", "#111118", "#a78bfa", "#7c3aed", "#1e1b4b", "obsidian", 10, "Premium Dark Mode" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Analyses_UserId",
                table: "Analyses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserId",
                table: "Payments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_UserId",
                table: "Subscriptions",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Templates_Slug",
                table: "Templates",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analyses");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Subscriptions");

            migrationBuilder.DropTable(
                name: "Templates");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
