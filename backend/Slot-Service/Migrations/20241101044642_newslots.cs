using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Slot_Service.Migrations
{
    /// <inheritdoc />
    public partial class newslots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxPatients",
                table: "Slots");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "DurationForEachSlot",
                table: "Slots",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationForEachSlot",
                table: "Slots");

            migrationBuilder.AddColumn<int>(
                name: "MaxPatients",
                table: "Slots",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
