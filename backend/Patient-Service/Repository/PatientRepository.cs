using Microsoft.EntityFrameworkCore;
using Patient_Service.DataAccess;
using Patient_Service.DTO;
using Patient_Service.Exceptions;
using Patient_Service.IRepository;
using Patient_Service.Model;

namespace Patient_Service.Repository
{
    public class PatientRepository : IPatientRepository
    {
        private readonly PatientDBContext _context;

        // Constructor to initialize the PatientDBContext dependency
        public PatientRepository(PatientDBContext context)
        {
            _context = context;
        }

        // Adds a new patient record to the database
        public async Task<Patient> AddPatientAsync(int id, Patient patient)
        {
            patient.PatientId = id; // Assigns the provided ID to the patient
            await _context.Patients.AddAsync(patient); // Adds patient to the database context
            await _context.SaveChangesAsync(); // Commits changes to the database
            return patient; // Returns the newly added patient
        }

        // Retrieves a patient by their ID, throws an exception if not found
        public async Task<Patient> GetPatientByIdAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                throw new PatientNotFoundException(id); // Throws custom exception if patient is not found
            }
            return patient;
        }

        // Retrieves a patient by their patient ID, throws an exception if not found
        public async Task<Patient> GetPatientByPatientIdAsync(int patientId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.PatientId == patientId);
            if (patient == null)
            {
                throw new PatientNotFoundException(patientId); // Throws custom exception if patient is not found
            }
            return patient;
        }

        // Updates an existing patient's details based on the provided PatientDTO
        public async Task<Patient> UpdatePatientAsync(int id, PatientDTO patientDto)
        {
            var existingPatient = await GetPatientByPatientIdAsync(id); // Retrieves the patient to update

            // Update the existing patient’s properties with values from the DTO
            existingPatient.PatientId = id;
            existingPatient.BloodGroup = patientDto.BloodGroup;
            existingPatient.Height = patientDto.Height;
            existingPatient.Weight = patientDto.Weight;
            existingPatient.Age = patientDto.Age;
            existingPatient.State = patientDto.State;
            existingPatient.City = patientDto.City;
            existingPatient.Address = patientDto.Address;
            existingPatient.EmergencyContact = patientDto.EmergencyContact;

            _context.Patients.Update(existingPatient); // Updates the patient in the database context
            await _context.SaveChangesAsync(); // Commits the changes to the database
            return existingPatient; // Returns the updated patient data
        }

        // Deletes a patient by ID, throws an exception if not found
        public async Task<bool> DeletePatientAsync(int id)
        {
            var patient = await GetPatientByIdAsync(id);
            if (patient == null)
            {
                throw new PatientNotFoundException(id); // Throws custom exception if patient is not found
            }

            _context.Patients.Remove(patient); // Removes the patient from the database context
            await _context.SaveChangesAsync(); // Commits the deletion to the database
            return true; // Returns true if deletion is successful
        }

        // Retrieves all patients from the database
        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await _context.Patients.ToListAsync(); // Returns a list of all patients
        }
    }
}
