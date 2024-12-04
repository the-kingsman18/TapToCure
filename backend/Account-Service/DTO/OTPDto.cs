namespace Account_Service.DTO
{
    public class OTPDto
    {
        public string Email { get; set; }

        public string? OtpCode { get; set; }

        public DateTime ExpirationTime { get; set; }
    }
}
