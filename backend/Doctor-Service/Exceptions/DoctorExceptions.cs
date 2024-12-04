namespace Doctor_Service.Exceptions
{
    public class DoctorExceptions:Exception
    {
        public DoctorExceptions(int doctorId)
       : base($"Doctor with ID {doctorId} was not found.")
        {
        }
    }
}
