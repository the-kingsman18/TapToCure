using AutoMapper;
using Doctor_Service.DTO;
using Doctor_Service.IRepository;
using Doctor_Service.Model;
using Doctor_Service.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Doctor_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorRepository _doctorService;
        private readonly IMapper _mapper;

        public DoctorsController(IDoctorRepository doctorService, IMapper mapper)
        {
            _doctorService = doctorService;
            _mapper = mapper;
        }

        // GET: api/doctor/approved
        [HttpGet("approved")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetAllDoctors()
        {
            try
            {
                var doctors = await _doctorService.GetApprovedDoctorsAsync();
                if (doctors == null || !doctors.Any())
                {
                    return NotFound("No approved doctors found.");
                }
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Interrnal server error: {ex.Message}");
            }
        }

        // GET: api/doctor/pending
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetPendingDoctors()
        {
            try
            {
                var doctors = await _doctorService.GetPendingDoctorsAsync();
                if (doctors == null || !doctors.Any())
                {
                    return NotFound("No pending doctors found.");
                }
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/doctor/speciality/{speciality}
        [HttpGet("speciality/{speciality}")]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctorsBySpeciality(string speciality)
        {
            try
            {
                var doctors = await _doctorService.GetAllDoctorsBySpecialityAsync(speciality);
                if (doctors == null || !doctors.Any())
                {
                    return NotFound($"No doctors found for speciality: {speciality}");
                }
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/doctor/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctorById(int id)
        {
            try
            {
                var doctor = await _doctorService.GetDoctorByIdAsync(id);
                if (doctor == null)
                {
                    return NotFound(new DoctorExceptions(id).Message);
                }
                return Ok(doctor);
            }
            catch (DoctorExceptions ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/doctor/{id}
        [HttpPost("{id}")]
        public async Task<ActionResult> AddDoctor(int id, [FromForm] DoctorDTO doctor)
        {
            try
            {
                await _doctorService.AddDoctorAsync(id, doctor);
                return StatusCode(201, "Doctor added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/doctor/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDoctor(int id, [FromForm] DoctorDTO doctor)
        {
            try
            {
                await _doctorService.UpdateDoctorAsync(id, doctor);
                return Ok("Doctor updated successfully.");
            }
            catch (DoctorExceptions ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/doctor/approval/{id}
        [HttpPut("approval/{id}")]
        public async Task<ActionResult> DoctorApproval(int id, [FromBody] string email)
        {
            try
            {
                await _doctorService.DoctorApprovalAsync(id, email);
                return NoContent();
            }
            catch (DoctorExceptions ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/doctor/reject/{id}
        [HttpPut("reject/{id}")]
        public async Task<ActionResult> DoctorReject(int id, [FromBody] string email)
        {
            try
            {
                await _doctorService.DoctorRejectAsync(id, email);
                return NoContent();
            }
            catch (DoctorExceptions ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/doctor/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDoctor(int id)
        {
            try
            {
                await _doctorService.DeleteDoctorAsync(id);
                return NoContent();
            }
            catch (DoctorExceptions ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/doctor/SetAvailability
        [HttpPost("SetAvailability")]
        public async Task<IActionResult> SetAvailability([FromBody] AvailabilityDTO availabilityDTO)
        {
            if (availabilityDTO == null)
            {
                return BadRequest("Invalid availability data.");
            }

            bool result = await _doctorService.SetAvailability(availabilityDTO);

            if (result)
            {
                return Ok("Availability updated successfully.");
            }

            return BadRequest("Failed to update availability.");
        }

        // GET: api/doctor/CheckAvailability
        [HttpGet("CheckAvailability")]
        public async Task<IActionResult> CheckAvailability(int doctorId, DateTime date)
        {
            try
            {
                var isAvailable = await _doctorService.CheckAvailability(doctorId, date);

                if (isAvailable == null)
                {
                    return NotFound("Doctor not found.");
                }

                return Ok(isAvailable);
            }
            catch (DoctorExceptions ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
