using Appointment_Services.Model;
using Microsoft.EntityFrameworkCore;

namespace Appointment_Services.DataAccess
{
    public class AppointDbContext:DbContext
    {
        public AppointDbContext(DbContextOptions<AppointDbContext> options) : base(options)
        {
        }
        public DbSet<Appointment> AppointmentsTable { get; set; }
    }
}
