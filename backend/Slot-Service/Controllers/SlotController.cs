using Microsoft.AspNetCore.Mvc;
using Slot_Service.Exceptions;
using Slot_Service.ISlotRepo;
using Slot_Service.Model;

namespace Slot_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlotController : ControllerBase
    {
        private readonly ISlotRepository _slotRepository;

        // Constructor to initialize the slot repository dependency
        public SlotController(ISlotRepository slotRepository)
        {
            _slotRepository = slotRepository;
        }

        // Endpoint to add a new slot
        [HttpPost("AddSlot")]
        public async Task<IActionResult> AddSlot([FromBody] Slot slot)
        {
            // Check if the incoming slot model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Attempt to add the slot and return a success response
                await _slotRepository.AddSlotAsync(slot);
                return StatusCode(201, slot); // Returns 201 Created with the created slot data
            }
            catch (SlotExceptions ex)
            {
                // Return a bad request response with the specific slot exception message
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle any unexpected exceptions with a server error response
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        // Endpoint to retrieve all slots for a specific doctor by doctorId
        [HttpGet("bydoctor/{doctorId}")]
        public async Task<IActionResult> GetSlotsByDoctorAndDate(int doctorId)
        {
            // Retrieve slots for the specified doctor and return them in the response
            var slots = await _slotRepository.GetSlotsByDoctorAndDateAsync(doctorId);
            return Ok(slots);
        }

        // Endpoint to delete a slot by its slotId
        [HttpDelete("{slotId}")]
        public async Task<IActionResult> DeleteSlot(int slotId)
        {
            try
            {
                // Attempt to delete the slot and return a no-content response if successful
                await _slotRepository.DeleteSlotAsync(slotId);
                return NoContent();
            }
            catch (SlotExceptions ex)
            {
                // Handle the case where the slot was not found
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle any unexpected exceptions with a server error response
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        // Endpoint to retrieve a specific slot by its slotId
        [HttpGet("{slotId}")]
        public async Task<IActionResult> GetSlotById(int slotId)
        {
            try
            {
                // Attempt to retrieve the slot and return it in the response
                var slot = await _slotRepository.GetSlotByIdAsync(slotId);
                return Ok(slot);
            }
            catch (SlotExceptions ex)
            {
                // Handle the case where the slot was not found
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle any unexpected exceptions with a server error response
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }
    }
}
