using Feedback_Service.DTO;
using Feedback_Service.Models;


namespace Feedback_Service.IRepository
{
    public interface IFeedbackRepository
    {
        Task<FeedbackDTO> AddFeedback(FeedbackDTO feedback);
        Task<IEnumerable<Feedback>> GetAllFeedbacks();

        Task<IEnumerable<Feedback>> GetFeedbacksByDoctorName(string doctorName);

    }
}
