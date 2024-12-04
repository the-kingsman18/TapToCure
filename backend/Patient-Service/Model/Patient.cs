using System.ComponentModel.DataAnnotations;

namespace Patient_Service.Model
{
    // The Patient class represents a patient in the healthcare system
    public class Patient
    {
        // The unique identifier for the Patient (primary key)
        [Key]
        public int Id { get; set; }

        // A unique identifier for the patient (may differ from Id, used for tracking)
        [Required]  // Marks the PatientId as required
        public int PatientId { get; set; }

        // The blood group of the patient (e.g., A+, O-, etc.)
        [Required]  // Marks the BloodGroup as required
        public string BloodGroup { get; set; }

        // The height of the patient (in centimeters or inches, depending on convention)
        public int Height { get; set; }

        // The weight of the patient (in kilograms or pounds, depending on convention)
        public int Weight { get; set; }

        // The age of the patient
        public int Age { get; set; }

        // The state where the patient resides
        public string State { get; set; }

        // The city where the patient resides (required for locating the patient)
        [Required]  // Marks the City as required
        public string City { get; set; }

        // The full address of the patient (required for contacting or emergency purposes)
        [Required]  // Marks the Address as required
        public string Address { get; set; }

        // The emergency contact number for the patient (required for emergencies)
        [Required]  // Marks the EmergencyContact as required
        public string EmergencyContact { get; set; }
    }
}
