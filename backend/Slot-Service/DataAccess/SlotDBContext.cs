using Microsoft.EntityFrameworkCore;
using Slot_Service.Model;

namespace Slot_Service.DataAccess
{
    public class SlotDBContext : DbContext
    {
        public SlotDBContext(DbContextOptions<SlotDBContext> options) : base(options) { }

        public DbSet<Slot> Slots { get; set; }
    }
}
