using Email_Service.EmailConfiguration;
using Email_Service.IRepository;
using Email_Service.Model;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Email_Service.Repository
{
    // EmailRepository is responsible for handling email sending functionality
    public class EmailRepository : IEmailRepository
    {
        // Injecting EmailConfig through IOptions for accessing SMTP settings
        private readonly EmailConfig _emailConfig;

        // Constructor to initialize the email configuration using IOptions
        public EmailRepository(IOptions<EmailConfig> emailConfig)
        {
            _emailConfig = emailConfig.Value; // Storing the email config values
        }

        // Method to send an email asynchronously
        public async Task SendEmailAsync(Email emailRequest)
        {
            // Creating a new MimeMessage for the email
            var email = new MimeMessage();

            // Adding the sender's information to the email
            email.From.Add(new MailboxAddress(_emailConfig.SenderName, _emailConfig.SenderEmail));

            // Adding the recipient's information to the email
            email.To.Add(MailboxAddress.Parse(emailRequest.To));

            // Setting the subject of the email
            email.Subject = emailRequest.Subject;

            // Setting the body of the email with HTML format
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = emailRequest.Body };

            // Using the SmtpClient to send the email asynchronously
            using var smtp = new SmtpClient();

            // Connecting to the SMTP server with specified settings
            await smtp.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, MailKit.Security.SecureSocketOptions.StartTls);

            // Authenticating with the SMTP server using provided credentials
            await smtp.AuthenticateAsync(_emailConfig.Username, _emailConfig.Password);

            // Sending the email message
            await smtp.SendAsync(email);

            // Disconnecting from the SMTP server after sending the email
            await smtp.DisconnectAsync(true);
        }
    }
}
