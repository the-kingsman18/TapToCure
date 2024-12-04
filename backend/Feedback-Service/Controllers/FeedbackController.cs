using Feedback_Service.DTO;
using Feedback_Service.Exceptions;
using Feedback_Service.IRepository;
using Microsoft.AspNetCore.Mvc;

namespace Feedback_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        // Dependency injection to access the Feedback repository
        private readonly IFeedbackRepository _feedbackRepository;

        // Constructor to inject IFeedbackRepository into the controller
        public FeedbackController(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }

        // POST: api/Feedback
        // Endpoint to add new feedback
        [HttpPost]
        public async Task<ActionResult> AddFeedback([FromBody] FeedbackDTO feedbackDTO)
        {
            try
            {
                // Calling the AddFeedback method from the repository
                var feedback = await _feedbackRepository.AddFeedback(feedbackDTO);
                // Returning the added feedback in the response
                return Ok(feedback);
            }
            catch (FeedbackExceptions ex)
            {
                // Catch specific feedback-related exceptions and return a bad request
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Catch unexpected exceptions and return a generic internal server error
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }

        // GET: api/Feedback
        // Endpoint to retrieve all feedback records
        [HttpGet]
        public async Task<ActionResult> GetAllFeedbacks()
        {
            try
            {
                // Fetching all feedback records from the repository
                var feedbacks = await _feedbackRepository.GetAllFeedbacks();
                // Returning the feedbacks in the response
                return Ok(feedbacks);
            }
            catch (FeedbackExceptions ex)
            {
                // Returning a bad request response if there is an error related to feedback
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handling unexpected errors with a generic internal server error response
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }

        // GET: api/Feedback/doctorname/{doctorName}
        // Endpoint to retrieve feedback by a specific doctor's name
        [HttpGet("doctorname/{doctorName}")]
        public async Task<ActionResult> GetFeedbacksByDoctorName(string doctorName)
        {
            try
            {
                // Fetching feedbacks for the given doctor name
                var feedbacks = await _feedbackRepository.GetFeedbacksByDoctorName(doctorName);

                // If no feedbacks are found for the doctor, return a NotFound response
                if (feedbacks == null || feedbacks.Count() == 0)
                {
                    return NotFound(new { Message = "No feedback found for the specified doctor name" });
                }

                // Returning the feedbacks if found
                return Ok(feedbacks);
            }
            catch (FeedbackExceptions ex)
            {
                // Returning a bad request if there is a feedback-related error
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handling unexpected errors with a generic internal server error response
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }
    }
}
