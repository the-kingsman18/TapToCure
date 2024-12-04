using System.ComponentModel.DataAnnotations;

namespace Email_Service.Model
{
    public class Email
    {
        [Required]
        public string To { get; set; }      // Recipient email
        [Required]
        public string Subject { get; set; }     // Email subject
        [Required]
        public string Body { get; set; }
    }
}
