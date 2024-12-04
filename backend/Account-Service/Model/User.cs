using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Account_Service.Model
{
    public class User
    {
        [Key] // Primary key for the User entity
        public int Id { get; set; }

        [Required] // UserName is a required field
        public string UserName { get; set; }

        [Required] // Email is a required field
        public string Email { get; set; }

        [Required] // Password is a required field
        public string Password { get; set; }

        [Required] // MobileNumber is a required field
        public string MobileNumber { get; set; }

        [Required] // Gender is a required field
        public string Gender { get; set; }

        [Required] // Role is a required field
        public string Role { get; set; }
    }
}
