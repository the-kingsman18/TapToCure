using System.ComponentModel.DataAnnotations;

namespace Doctor_Service.DTO
{
    public class DoctorDTO
    {

        [Required]
        public int DoctorId { get; set; }
        [Required]
        public string? Degree { get; set; }
        [Required]
        public string? Speciality { get; set; }
        [Required]
        public int Experience { get; set; }
        [Required]
        public string? MedicalLicense { get; set; }
        [Required]
        public string? State { get; set; }

        [Required]
        public string? City { get; set; }

        [Required]
        public string? ClinicAddress { get; set; }

        [Required]
        public string? About { get; set; }

        [Required]
        public IFormFile? ProfileImage { get; set; }
    }
}
