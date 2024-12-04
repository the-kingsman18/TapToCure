namespace Email_Service.EmailConfiguration
{
    // The EmailConfig class holds the configuration settings for the email service
    public class EmailConfig
    {
        // The SMTP server address (e.g., smtp.gmail.com)
        public string SmtpServer { get; set; }

        // The port number used for SMTP communication (e.g., 587 for TLS)
        public int Port { get; set; }

        // The sender's name that will appear in the "From" field of the email
        public string SenderName { get; set; }

        // The sender's email address that will be used to send the email
        public string SenderEmail { get; set; }

        // The username used for SMTP authentication (typically the sender's email)
        public string Username { get; set; }

        // The password used for SMTP authentication (typically an app-specific password)
        public string Password { get; set; }
    }
}
