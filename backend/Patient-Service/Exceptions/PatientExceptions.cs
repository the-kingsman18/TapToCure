namespace Patient_Service.Exceptions
{
    // Base class for all patient-related exceptions
    public class PatientException : Exception
    {
        public PatientException(string message) : base(message) { }
        public PatientException(string message, Exception innerException) : base(message, innerException) { }
    }

    // Exception thrown when a patient is not found
    public class PatientNotFoundException : PatientException
    {
        public PatientNotFoundException(int patientId)
            : base($"Patient with ID {patientId} was not found.")
        {
        }
    }

    // Exception thrown when a patient already exists
    public class PatientAlreadyExistsException : PatientException
    {
        public PatientAlreadyExistsException(int patientId)
            : base($"Patient with ID {patientId} already exists.")
        {
        }
    }

    // Exception thrown when patient data is invalid or incomplete
    public class InvalidPatientDataException : PatientException
    {
        public InvalidPatientDataException(string message)
            : base($"Invalid patient data: {message}")
        {
        }
    }

    // Exception thrown when there is an issue with deleting a patient
    public class PatientDeleteException : PatientException
    {
        public PatientDeleteException(int patientId)
            : base($"An error occurred while trying to delete patient with ID {patientId}.")
        {
        }
    }

    public class NoPatientsFoundException : PatientException
    {
        public NoPatientsFoundException()
            : base("No patients were found in the system.")
        {
        }
    }
}
