using AutoMapper;
using Patient_Service.DTO;
using Patient_Service.Model;

namespace Patient_Service.PatientProfile
{
    public class PatientProfile : Profile
    {
        public PatientProfile()
        {

            CreateMap<PatientDTO, Patient>().ReverseMap();
        }
    }
}
