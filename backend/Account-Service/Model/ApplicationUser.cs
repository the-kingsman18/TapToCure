using Microsoft.AspNetCore.Identity;

namespace Account_Service.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string AppUserName { get; set; }
    }
}
