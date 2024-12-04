namespace Appointment_Services.CustomException
{
    public class AppointmentException : Exception
    {
        public int AppointmentId { get; set; }
        public string ErrorCode { get; set; }

        // Default constructor
        public AppointmentException() : base("An error occurred with the appointment.")
        {
        }

        // Constructor with message
        public AppointmentException(string message) : base(message)
        {
        }

        // Constructor with message and inner exception
        public AppointmentException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }

        // Constructor with specific appointment ID and error code
        public AppointmentException(string message, int appointmentId, string errorCode)
            : base(message)
        {
            AppointmentId = appointmentId;
            ErrorCode = errorCode;
        }
    }
}
