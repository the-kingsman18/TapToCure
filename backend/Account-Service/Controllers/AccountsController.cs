using AutoMapper;
using Account_Service.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Account_Service.Interface;
using Account_Service.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using Account_Service.Exceptions;

namespace Account_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IRepository _authRepository;
        private readonly IMapper _mapper;

        public AccountsController(IRepository authRepository, IMapper mapper)
        {
            _authRepository = authRepository;
            _mapper = mapper;
        }

     
        [HttpPost("register")]
        public async Task<IActionResult> Register(User newUser)
        {
            try
            {
                var (success, message) = await _authRepository.Registeration(newUser);

                if (!success)
                {
                    // If user already exists, return Conflict (409) status with the message
                    return Conflict(new { Message = message });
                }

                // Registration successful, return the user ID
                return Ok(new { Message = "User registered successfully", UserId = message });
            }
            catch (AccountServiceExceptions ex)
            {
                // Handle specific service exceptions (e.g., user creation failed)
                return StatusCode(ex.StatusCode, new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Catch unexpected errors and return internal server error (500)
                return StatusCode(500, new { Message = $"An error occurred during registration: {ex.Message}" });
            }
        }

      
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO logindetails)
        {
            try
            {
                var result = await _authRepository.Login(logindetails);
                if (result.Item1 == 1)
                {
                    return Ok(result.Item2);
                }
                else
                {
                    return BadRequest(new { Message = "Login failed." });
                }
            }
            catch (AccountServiceExceptions ex)
            {
                // Return a response with the custom status code from the exception
                return StatusCode(ex.StatusCode, new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle any other unexpected exceptions and return a generic error message
                return StatusCode(500, new { Message = "An unexpected error occurred during login." });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _authRepository.DeleteUserAsync(id);
                return Ok(new { Message = "User deleted successfully." });
            }
            catch (AccountServiceExceptions ex)
            {
                if (ex.StatusCode == 404)
                {
                    return NotFound(new { Message = ex.Message });
                }
                else
                {
                    return StatusCode(500, new { Message = "An error occurred while deleting the user." });
                }
            }
        }

        // Get all users
        [HttpGet("GetAllUser")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            try
            {
                var users = await _authRepository.GetAllUsersAsync();
                return Ok(users);
            }
            catch (AccountServiceExceptions ex)
            {
                if (ex.StatusCode == 404)
                {
                    //if not found 
                    return NotFound(new { Message = ex.Message });
                }
                else
                {
                    //internal server error
                    return StatusCode(500, new { Message = "An error occurred while fetching all users." });
                }
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            try
            {
                var user = await _authRepository.GetUserByIdAsync(id);
                return Ok(user);  // Return user if found
            }
            catch (AccountServiceExceptions ex)
            {
                if (ex.StatusCode == 404)
                {
                    return NotFound(new { Message = ex.Message });  // If user is not found, return 404
                }
                else
                {
                    return StatusCode(500, new { Message = "An error occurred while fetching the user." });
                }
            }
        }

        // Get users by role
        [HttpGet("role/{role}")]
        public async Task<ActionResult<List<User>>> GetUsersByRole(string role)
        {
            try
            {
                var users = await _authRepository.GetUsersByRoleAsync(role);
                return Ok(users);  // Return users if found
            }
            catch (AccountServiceExceptions ex)
            {
                if (ex.StatusCode == 404)
                {
                    return NotFound(new { Message = ex.Message });  // If no users found for the role, return 404
                }
                else
                {
                    return StatusCode(500, new { Message = "An error occurred while fetching users by role." });
                }
            }
        }

        // Update user details
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUserDetails(int id, [FromBody] UpdateUserDto updateduser)
        {
            if (id != updateduser.Id)
            {
                return BadRequest(new { Message = "User ID mismatch." });
            }

            var updatedUser = await _authRepository.UpdateUserDetailsAsync(id, updateduser);
            if (updatedUser == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Use AutoMapper to map updated details if necessary
            _mapper.Map(updateduser, updatedUser);
            return Ok(updatedUser);
        }

        // Generate OTP
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateOtp([FromBody] OTPDto otpRequest)
        {
            if (otpRequest == null || string.IsNullOrEmpty(otpRequest.Email))
            {
                return BadRequest(new { Message = "Email is required." });
            }

            var result = await _authRepository.SendOtpAsync(otpRequest.Email);

            if (result)
            {
                return Ok(new { Message = "OTP sent successfully." });
            }

            return BadRequest(new { Message = "Failed to send OTP." });
        }

        // Verify OTP
        [HttpPost("verify")]
        public IActionResult VerifyOtp([FromBody] OTPDto otpVerify)
        {
            if (otpVerify == null || string.IsNullOrEmpty(otpVerify.Email) || string.IsNullOrEmpty(otpVerify.OtpCode))
            {
                return BadRequest(new { Message = "Invalid request. Email and OTP code are required." });
            }

            var isValid = _authRepository.ValidateOtp(otpVerify.Email, otpVerify.OtpCode);
            if (isValid)
            {
                return Ok(new { Message = "OTP verified successfully" });
            }

            return BadRequest(new { Message = "Invalid OTP" });
        }

        // Request password reset
        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestReset requestdto)
        {
            bool result = await _authRepository.SendPasswordResetEmailAsync(requestdto.Email);
            if (!result)
            {
                return BadRequest(new { Message = "User with the specified email address does not exist." });
            }

            return Ok(new { Message = "Password reset link sent successfully." });
        }

        // Reset user password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authRepository.ResetPasswordAsync(resetPasswordDto.Email, resetPasswordDto.Token, resetPasswordDto.NewPassword);

            if (result)
            {
                //On Successful password reset send message 
                return Ok(new { Message = "Password has been reset successfully." });
            }
            else
            {
                //if error displays Message
                return BadRequest(new { Message = "Password reset failed. Please check the token or try again." });
            }
        }
    }
}
