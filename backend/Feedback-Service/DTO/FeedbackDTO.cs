namespace Feedback_Service.DTO
{
    public class FeedbackDTO
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public string DoctorName { get; set; }
        public int DoctorRating { get; set; }
        public int PlatformRating { get; set; }
        public string Comments { get; set; }

    }
}









