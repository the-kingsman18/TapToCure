using Microsoft.AspNetCore.Mvc;
using Patient_Service.DTO;
using Patient_Service.Exceptions;
using Patient_Service.IRepository;
using Patient_Service.Model;

namespace Patient_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientRepository _patientRepository;

        // Constructor to initialize the IPatientRepository dependency
        public PatientController(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        // GET: api/patient - Retrieves all patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetAllPatients()
        {
            try
            {
                var patients = await _patientRepository.GetAllPatientsAsync();
                if (patients == null || !patients.Any())
                {
                    throw new NoPatientsFoundException(); // Throws custom exception if no patients are found
                }
                return Ok(patients); // 200 OK
            }
            catch (NoPatientsFoundException ex)
            {
                return NotFound(ex.Message); // 404 Not Found if no patients are found
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving the patients."); // 500 Internal Server Error
            }
        }

        // GET: api/patient/{patientId} - Retrieves a patient by their ID
        [HttpGet("{patientId}")]
        public async Task<ActionResult<Patient>> GetPatientByPatientId(int patientId)
        {
            try
            {
                var patient = await _patientRepository.GetPatientByPatientIdAsync(patientId);
                if (patient == null)
                {
                    throw new PatientNotFoundException(patientId); // Throws custom exception if patient is not found
                }
                return Ok(patient); // 200 OK
            }
            catch (PatientNotFoundException ex)
            {
                return NotFound(ex.Message); // 404 Not Found if patient is not found
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving the patient."); // 500 Internal Server Error
            }
        }

        // POST: api/patient/{patientId} - Adds a new patient
        [HttpPost("{patientid}")]
        public async Task<ActionResult<Patient>> AddPatient(int patientid, [FromBody] Patient patient)
        {
            try
            {
                if (patient == null)
                {
                    return BadRequest("Patient data is required."); // 400 Bad Request if patient data is missing
                }

                var createdPatient = await _patientRepository.AddPatientAsync(patientid, patient); // Adds the patient to the repository
                return StatusCode(201, createdPatient); // 201 Created
            }
            catch (PatientAlreadyExistsException ex)
            {
                return Conflict(ex.Message); // 409 Conflict if patient already exists
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while adding the patient."); // 500 Internal Server Error
            }
        }

        // PUT: api/patient/{patientId} - Updates an existing patient's details
        [HttpPut("{patientId}")]
        public async Task<ActionResult<Patient>> UpdatePatient(int patientId, [FromBody] PatientDTO patient)
        {
            try
            {
                if (patient == null || patient.PatientId != patientId)
                {
                    return BadRequest("Patient ID mismatch or data is invalid."); // 400 Bad Request for ID mismatch or invalid data
                }

                var updatedPatient = await _patientRepository.UpdatePatientAsync(patientId, patient); // Updates the patient in the repository
                if (updatedPatient == null)
                {
                    throw new PatientNotFoundException(patientId); // Throws exception if patient is not found
                }

                return Ok(updatedPatient); // 200 OK
            }
            catch (PatientNotFoundException ex)
            {
                return NotFound(ex.Message); // 404 Not Found if patient is not found
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while updating the patient."); // 500 Internal Server Error
            }
        }

        // DELETE: api/patient/{patientId} - Deletes a patient by their ID
        [HttpDelete("{patientId}")]
        public async Task<IActionResult> DeletePatient(int patientId)
        {
            try
            {
                var result = await _patientRepository.DeletePatientAsync(patientId); // Attempts to delete the patient
                if (!result)
                {
                    throw new PatientNotFoundException(patientId); // Throws exception if patient is not found
                }

                return NoContent(); // 204 No Content if deletion is successful
            }
            catch (PatientNotFoundException ex)
            {
                return NotFound(ex.Message); // 404 Not Found if patient is not found
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting the patient.{ex}"); // 500 Internal Server Error
            }
        }
    }
}
