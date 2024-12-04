using System.ComponentModel.DataAnnotations;

namespace Slot_Service.Model
{
    // The Slot class represents a time slot for a doctor
    public class Slot
    {
        // The unique identifier for the Slot (primary key)
        [Key]
        public int SlotId { get; set; }

        // The ID of the doctor this time slot is associated with
        [Required]  // Marks the DoctorId as required for the Slot entity
        public int DoctorId { get; set; }

        // The start time of the time slot for the doctor
        [Required]  // Marks the StartTime as required
        public TimeSpan StartTime { get; set; }

        // The end time of the time slot for the doctor
        [Required]  // Marks the EndTime as required
        public TimeSpan EndTime { get; set; }

        // The duration of each individual slot (e.g., 30 minutes, 1 hour)
        [Required]  // Marks the DurationForEachSlot as required
        public TimeSpan DurationForEachSlot { get; set; }
    }
}
