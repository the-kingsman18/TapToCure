using Doctor_Service.Model;
using Microsoft.EntityFrameworkCore;

namespace Doctor_Service.DataAccess
{
    public class DoctorDBContext : DbContext
    {
        public DoctorDBContext(DbContextOptions<DoctorDBContext> options) : base(options) { }

        public DbSet<Doctor> Doctors { get; set; }
    }
}
