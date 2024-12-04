using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Appointment_Services.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedMicroservices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SessingTiming",
                table: "AppointmentsTable",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessingTiming",
                table: "AppointmentsTable");
        }
    }
}
