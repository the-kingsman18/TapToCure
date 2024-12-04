using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Slot_Service.Migrations
{
    /// <inheritdoc />
    public partial class slotupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Slots");

            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Slots");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Slots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "MaxPatients",
                table: "Slots",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Slots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Slots");

            migrationBuilder.DropColumn(
                name: "MaxPatients",
                table: "Slots");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Slots");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Slots",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Slots",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
