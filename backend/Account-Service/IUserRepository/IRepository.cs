using Account_Service.DTO;
using Account_Service.Model;

namespace Account_Service.Interface
{
    public interface IRepository
    {

        // Register a new user
        Task<(bool, string)> Registeration(User newUser);

        // Login user
        Task<(int, string)> Login(LoginDTO loginDTO);

        // Get user by ID

        Task<User> GetUserByIdAsync(int id);

        // Get all users
        Task<List<User>> GetAllUsersAsync();

        // Get users by role
        Task<List<User>> GetUsersByRoleAsync(string role);

        // Get roles by user ID
        

        // Delete user
        Task<bool> DeleteUserAsync(int id);

        // Update user details
        Task<User> UpdateUserDetailsAsync(int id,UpdateUserDto updateUser);

   

        Task<bool> SendOtpAsync(string email);

        bool ValidateOtp(string email, string otp);

        Task<bool> SendPasswordResetEmailAsync(string email);

        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
