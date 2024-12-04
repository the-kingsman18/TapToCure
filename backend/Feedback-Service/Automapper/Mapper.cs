using AutoMapper;
using Feedback_Service.DTO;
using Feedback_Service.Models;

namespace Feedback_Service.Automapper
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Feedback, FeedbackDTO>().ReverseMap();
        }
    }
}
