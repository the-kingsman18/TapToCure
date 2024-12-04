using Microsoft.EntityFrameworkCore;
using Patient_Service.Model;

namespace Patient_Service.DataAccess
{
    public class PatientDBContext : DbContext
    {
        public PatientDBContext(DbContextOptions<PatientDBContext> options) : base(options) { }

        public DbSet<Patient> Patients { get; set; }
    }
}
