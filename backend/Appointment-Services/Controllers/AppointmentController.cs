using Appointment_Services.IRepositoryAppointment;
using Appointment_Services.Model.Dto;
using Appointment_Services.CustomException;
using Microsoft.AspNetCore.Mvc;

namespace Appointment_Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointment _appointmentService;

        public AppointmentController(IAppointment appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsAsync();
                return Ok(appointments);
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching appointments.{ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentById(int id)
        {
            try
            {
                var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
                return Ok(appointment);
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while fetching the appointment.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointment createAppointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdAppointment = await _appointmentService.AddAppointmentAsync(createAppointmentDto);
                return Ok(createdAppointment);
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the appointment.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, CreateAppointment updateAppointmentDto)
        {
            try
            {
                await _appointmentService.UpdateAppointmentAsync(id, updateAppointmentDto);
                return NoContent();
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the appointment.");
            }
        }

        [HttpPut("Cancel/{id}")]
        public async Task<IActionResult> CancelAppointment(int id, [FromBody] string email)
        {
            try
            {
                await _appointmentService.CancelAppointmentAsync(id, email);
                return NoContent();
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while canceling the appointment.");
            }
        }

        [HttpPut("Cancel-Doctor/{id}")]
        public async Task<IActionResult> CancelAppointmentByDoctor(int id, [FromBody] string email)
        {
            try
            {
                await _appointmentService.CancelAppointmentByDoctorAsync(id, email);
                return NoContent();
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while canceling the appointment.");
            }
        }

        [HttpPut("Complete/{id}")]
        public async Task<IActionResult> CompleteAppointment(int id, [FromBody] string email)
        {
            try
            {
                await _appointmentService.CompleteAppointmentAsync(id, email);
                return NoContent();
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while completing the appointment.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                await _appointmentService.DeleteAppointmentAsync(id);
                return NoContent();
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the appointment.");
            }
        }

        [HttpGet("available/{doctorId}/{date}")]
        public async Task<IActionResult> GetAvailableAppointments(int doctorId, DateTime date)
        {
            if (doctorId <= 0 || date == default)
            {
                return BadRequest("Invalid doctor ID or date.");
            }

            try
            {
                var bookedTimeslots = await _appointmentService.GetAvailableAppointmentsAsync(doctorId, date);
                return Ok(bookedTimeslots);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while fetching available appointments.");
            }
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetAppointmentsByDoctorId(int doctorId)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByDoctorIdAsync(doctorId);
                return appointments.Any() ? Ok(appointments) : NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while fetching appointments by doctor ID.");
            }
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetAppointmentsByPatientId(int patientId)
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByPatientIdAsync(patientId);
                return appointments.Any() ? Ok(appointments) : NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while fetching appointments by patient ID.");
            }
        }
        [HttpPut("{appointmentId}/prescription")]
        public async Task<IActionResult> UpdatePrescription(int appointmentId, [FromBody] string prescription)
        {
            try
            {
                await _appointmentService.UpdatePrescriptionAsync(appointmentId, prescription);
                return Ok("Prescription updated successfully.");
            }
            catch (AppointmentException ex) when (ex.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { ex.ErrorCode, ex.Message });
            }
            catch (AppointmentException ex)
            {
                return BadRequest(new { ex.ErrorCode, ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the prescription.");
            }
        }

    }
}
