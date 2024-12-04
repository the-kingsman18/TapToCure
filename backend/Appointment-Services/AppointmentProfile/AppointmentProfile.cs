using Appointment_Services.Model;
using Appointment_Services.Model.Dto;
using AutoMapper;

namespace Appointment_Services.AppointmentProfile
{
    public class AppointmentProfile : Profile
    {
        public AppointmentProfile()
        {
            CreateMap<Appointment, AppointmentDto>();
            CreateMap<CreateAppointment, Appointment>()
                .ForMember(dest => dest.AppointmentTime, opt => opt.MapFrom(src => src.AppointmentTime));
        }
    }
}
