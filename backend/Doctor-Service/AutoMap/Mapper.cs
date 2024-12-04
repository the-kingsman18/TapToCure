using AutoMapper;
using Doctor_Service.DTO;
using Doctor_Service.Model;

namespace Doctor_Service.AutoMap
{
    public class Mapper : Profile
    {
        public Mapper()
        {
            CreateMap<Doctor, DoctorDTO>().ReverseMap();
        }
    }
}
