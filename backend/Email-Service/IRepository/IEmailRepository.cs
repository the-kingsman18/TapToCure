using Email_Service.Model;

namespace Email_Service.IRepository
{
    public interface IEmailRepository
    {

        Task SendEmailAsync(Email emailRequest);


    }
}
