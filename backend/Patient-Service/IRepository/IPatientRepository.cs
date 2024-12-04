using Patient_Service.DTO;
using Patient_Service.Model;

namespace Patient_Service.IRepository
{
    public interface IPatientRepository
    {
        Task<Patient> AddPatientAsync(int id, Patient patient);

        // Read a patient by their ID
        Task<Patient> GetPatientByIdAsync(int id);

        // Update an existing patient's details
        Task<Patient> UpdatePatientAsync(int id, PatientDTO patient);

        // Delete a patient by their ID
        Task<bool> DeletePatientAsync(int id);

        // Get all patients
        Task<IEnumerable<Patient>> GetAllPatientsAsync();

        Task<Patient> GetPatientByPatientIdAsync(int patientId);


    }
}
