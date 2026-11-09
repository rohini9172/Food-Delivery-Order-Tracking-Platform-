using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OrderService.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCartAndOrderSnapshots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Restaurants",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Orders",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "RestaurantId",
                table: "Orders",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "Orders",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "MenuItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "CartItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "CartItems",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.Sql(
                """
                UPDATE [CartItems]
                SET [Name] = COALESCE([MenuItems].[Name], N'Legacy menu item'),
                    [UnitPrice] = COALESCE([MenuItems].[Price], 0)
                FROM [CartItems]
                LEFT JOIN [MenuItems] ON [CartItems].[MenuItemId] = [MenuItems].[Id];

                UPDATE [Orders]
                SET [TotalAmount] = [OrderTotals].[TotalAmount]
                FROM [Orders]
                INNER JOIN (
                    SELECT [CartItems].[OrderId],
                           SUM([CartItems].[UnitPrice] * [CartItems].[Quantity]) AS [TotalAmount]
                    FROM [CartItems]
                    LEFT JOIN [MenuItems] ON [CartItems].[MenuItemId] = [MenuItems].[Id]
                    GROUP BY [CartItems].[OrderId]
                ) AS [OrderTotals] ON [Orders].[Id] = [OrderTotals].[OrderId];
                """);

            migrationBuilder.CreateTable(
                name: "CartEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MenuItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartEntries_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Restaurants",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d101"), "Green Bowl Kitchen" },
                    { new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d102"), "Pizza Corner" }
                });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "Name", "Price", "RestaurantId" },
                values: new object[,]
                {
                    { new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d201"), "Roasted Veggie Bowl", 249m, new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d101") },
                    { new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d202"), "Paneer Protein Bowl", 289m, new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d101") },
                    { new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d203"), "Margherita Pizza", 299m, new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d102") },
                    { new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d204"), "Farmhouse Pizza", 379m, new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d102") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_RestaurantId",
                table: "Orders",
                column: "RestaurantId");

            migrationBuilder.CreateIndex(
                name: "IX_CartEntries_CustomerId_MenuItemId",
                table: "CartEntries",
                columns: new[] { "CustomerId", "MenuItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CartEntries_MenuItemId",
                table: "CartEntries",
                column: "MenuItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Restaurants_RestaurantId",
                table: "Orders",
                column: "RestaurantId",
                principalTable: "Restaurants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Restaurants_RestaurantId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "CartEntries");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_RestaurantId",
                table: "Orders");

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d201"));

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d202"));

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d203"));

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: new Guid("b10bab6c-2f7f-4f9e-8f22-7b5e6fc7d204"));

            migrationBuilder.DeleteData(
                table: "Restaurants",
                keyColumn: "Id",
                keyValue: new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d101"));

            migrationBuilder.DeleteData(
                table: "Restaurants",
                keyColumn: "Id",
                keyValue: new Guid("a09a9b5b-1e6e-4e8d-9e11-6a4d5fb6d102"));

            migrationBuilder.DropColumn(
                name: "RestaurantId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "CartItems");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "CartItems");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "MenuItems",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);
        }
    }
}
