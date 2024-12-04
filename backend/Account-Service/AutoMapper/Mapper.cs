using Account_Service.Model;
using AutoMapper;
using Account_Service.DTO;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Account_Service.AutoMapper
{
    public class Mapper:Profile
    {
        public Mapper() { 
            CreateMap<RegistrationDTO,User>().ReverseMap();
            CreateMap<User,UpdateUserDto>().ReverseMap();
        }
    }
}

   
