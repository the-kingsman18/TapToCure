using Email_Service.IRepository;
using Email_Service.Model;
using Microsoft.AspNetCore.Mvc;

namespace Email_Service.Controllers
{
    // The EmailController handles incoming HTTP requests related to email sending
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        // Private field to hold the reference to the email service repository
        private readonly IEmailRepository _emailService;

        // Constructor to inject the IEmailRepository into the controller
        public EmailController(IEmailRepository emailService)
        {
            _emailService = emailService; // Assign the injected email service to the private field
        }

        // POST endpoint to send an email
        // [HttpPost("send")] specifies the URL for this action: POST to api/Email/send
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] Email emailRequest)
        {
            // Check if the model state is valid (e.g., emailRequest has valid data)
            if (!ModelState.IsValid)
                return BadRequest("Invalid email request"); // Return a bad request response if invalid

            // Call the SendEmailAsync method from the email service to send the email
            await _emailService.SendEmailAsync(emailRequest);

            // Return a success message if email is sent successfully
            return Ok("Email sent successfully");
        }
    }
}
