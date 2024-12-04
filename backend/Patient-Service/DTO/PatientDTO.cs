using System.ComponentModel.DataAnnotations;

namespace Patient_Service.DTO
{
    public class PatientDTO
    {

        public int PatientId { get; set; }
        [Required]
        public string BloodGroup { get; set; }

        [Required]
        public int Height { get; set; }

        [Required]
        public int Weight { get; set; }
        [Required]

        public int Age { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Address { get; set; }

        [Required(ErrorMessage = "Contact number required 10 digits")]
        public string EmergencyContact { get; set; }

    }
}
