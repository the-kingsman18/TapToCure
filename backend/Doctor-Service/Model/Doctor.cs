using System.ComponentModel.DataAnnotations;

namespace Doctor_Service.Model
{
    public class Doctor
    {
        // The Id represents the unique identifier for each doctor in the system
        [Key]  // Marks this property as the primary key in the database
        public int Id { get; set; }

        // The DoctorId represents a unique identifier for the doctor (used for business logic or external linking)
        [Required]  // Marks this property as required in the database
        public int DoctorId { get; set; }

        // The Degree represents the highest academic qualification of the doctor (e.g., MD, MBBS)
        [Required]  // Marks this property as required in the database
        public string? Degree { get; set; }

        // The Speciality represents the medical field the doctor specializes in (e.g., Cardiologist, Orthopedic)
        [Required]  // Marks this property as required in the database
        public string? Speciality { get; set; }

        // The Experience represents the number of years the doctor has been practicing medicine
        [Required]  // Marks this property as required in the database
        public int Experience { get; set; }

        // The MedicalLicense represents the registration/license number for the doctor to practice
        [Required]  // Marks this property as required in the database
        public string? MedicalLicense { get; set; }

        // The State where the doctor practices (e.g., California, New York)
        [Required]  // Marks this property as required in the database
        public string? State { get; set; }

        // The City where the doctor's clinic is located
        [Required]  // Marks this property as required in the database
        public string? City { get; set; }

        // The ClinicAddress represents the full address of the doctor's clinic or practice
        [Required]  // Marks this property as required in the database
        public string? ClinicAddress { get; set; }

        // The About section provides a brief biography or description of the doctor
        [Required]  // Marks this property as required in the database
        public string? About { get; set; }

        // The IsAvailable property indicates whether the doctor is currently available for appointments
        [Required]  // Marks this property as required in the database
        public bool IsAvailable { get; set; } = true;

        // The Status indicates the current approval or verification status of the doctor's profile (e.g., "pending", "approved")
        [Required]  // Marks this property as required in the database
        public string Status { get; set; } = "pending";

        // The ImageURL represents a URL link to the doctor's profile picture or image
        public string? ImageURL { get; set; }

        // The UnavailableDates list stores dates when the doctor is unavailable for appointments
        public List<DateTime> UnavailableDates { get; set; } = new List<DateTime>();
    }
}
