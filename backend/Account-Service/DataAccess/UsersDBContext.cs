using Account_Service.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Account_Service.DataAccess
{
    public class UsersDBContext:IdentityDbContext<ApplicationUser>
    {
        public UsersDBContext(DbContextOptions<UsersDBContext> options):base(options) { }
 
         public DbSet<User> Users {  get; set; }   
    }
}
