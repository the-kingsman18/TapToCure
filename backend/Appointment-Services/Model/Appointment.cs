using System.ComponentModel.DataAnnotations;

namespace Appointment_Services.Model
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }
        [Required]
        public int DoctorId { get; set; }
        [Required]
        public int PatientId { get; set; }
        [Required]
        public string SessingTiming { get; set; }
        [Required]
        public DateTime AppointmentDate { get; set; }
        [Required]
        public TimeSpan AppointmentTime { get; set; }
        [Required]
        public string Status { get; set; } // e.g., Scheduled, Consulted, Cancelled
        [Required]
        public string? Notes { get; set; }
        public string? Prescription { get; set; }
    }
}
