using Account_Service.DataAccess;
using Account_Service.DTO;
using Account_Service.Model;
using Account_Service.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Net.Http;
using static System.Net.WebRequestMethods;
using Account_Service.Exceptions;

namespace Account_Service.Repository
{
    public class UserRepository : IRepository
    {
        private readonly HttpClient _httpClient;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UsersDBContext _context;
        public readonly IConfiguration _configuration;

        private static readonly List<OTPDto> _userOtps = new List<OTPDto>();
        public UserRepository(
          UserManager<ApplicationUser> userManager,
          SignInManager<ApplicationUser> signInManager,
          RoleManager<IdentityRole> roleManager,
          UsersDBContext context, IConfiguration configuration, IHttpClientFactory httpClientfactory) // Corrected the context type
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _httpClient = httpClientfactory.CreateClient("EmailServiceClient"); 
        }

        public UserRepository(UsersDBContext context)
        {
            _context = context;
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            //Finding user by id
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new AccountServiceExceptions("User not found", 404);  // Throwing 404 if the user is not found
            }

            //Find user in user manager table 
            var identityUser = await _userManager.FindByEmailAsync(user.Email);
            if (identityUser == null)
            {
                throw new AccountServiceExceptions("Identity user not found", 404);  // Throwing 404 if the identity user is not found
            }

            //Remove user from user manager table
            var identityResult = await _userManager.DeleteAsync(identityUser);
            if (!identityResult.Succeeded)
            {
                throw new AccountServiceExceptions("Error deleting user", 500);  // Throwing 500 in case of any error in deletion
            }
            //Remove user from Users Table
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        //Method to Get All Users
        public async Task<List<User>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            if (users == null || users.Count == 0)
            {
                //throws exception if no users found
                throw new AccountServiceExceptions("No users found", 404);  // Throwing 404 if no users are found
            }
            return users;
        }
        //Getting a specific user by id
        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                //throws exception if not found
                throw new AccountServiceExceptions("User not found", 404);  // Throwing 404 if the user is not found
            }
            return user;
        }
        //Getting users by their role
        public async Task<List<User>> GetUsersByRoleAsync(string role)
        {
            //Find in Users table
            var users = await _context.Users
                .Where(u => u.Role == role)
                .ToListAsync();

            if (users == null || users.Count == 0)
            {
                //throws error if no user for sepcified role is found
                throw new AccountServiceExceptions($"No users found for the role {role}", 404);  // Throwing 404 if no users are found for the specified role
            }
            return users;
        }


        public async Task<(int, string)> Login(LoginDTO loginDTO)
        {
           //First checks email,password for admin
                if (loginDTO.Email == "admin@gmail.com" && loginDTO.Password == "Admin@123")
                {
                //if true then adds claims
                    var authsClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, "admin"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, "admin")
            };
                //Generates token
                    string adminToken = GenerateToken(authsClaims);
                    return (1, adminToken);
                }

                // Check if the user exists in Identity
                var identityUser = await _userManager.FindByEmailAsync(loginDTO.Email);
                if (identityUser == null)
                    throw new AccountServiceExceptions("Invalid email", 404);

                // Check if the password is correct
                if (!await _userManager.CheckPasswordAsync(identityUser, loginDTO.Password))
                    throw new AccountServiceExceptions("Invalid password", 401);

                // Check if the user exists in the Users table
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
                if (user == null)
                    throw new AccountServiceExceptions("User not found in database", 404);

                int userId = user.Id;

                // Generate claims for the JWT token
                var userRoles = await _userManager.GetRolesAsync(identityUser);
                var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, identityUser.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
            //adds roles of the user in claims
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }
                //Generate and return token
                string token = GenerateToken(authClaims);
                return (1, token);
            
           
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            //checks for claims
            if (claims == null) throw new ArgumentNullException(nameof(claims));
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
     
        public async Task<(bool, string)> Registeration(User newUser)
        {
            try
            {
                // Check if the user already exists based on email
                var userExists = await _userManager.FindByEmailAsync(newUser.Email);
                if (userExists != null)
                {
                    // Return false and the message if user already exists
                    return (false, $"{newUser.Email} already exists.");
                }

                // Create a new ApplicationUser object
                ApplicationUser appuser = new ApplicationUser()
                {
                    UserName = newUser.UserName,
                    Email = newUser.Email,
                    AppUserName = newUser.UserName,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                // Create the user identity
                var createdUser = await _userManager.CreateAsync(appuser, newUser.Password);
                if (!createdUser.Succeeded)
                {
                    // Log detailed error messages from the Identity result
                    var errorMessages = string.Join(", ", createdUser.Errors.Select(e => e.Description));
     
                    // Throw an exception with more detailed error info
                    throw new Exception($"User creation failed. Errors: {errorMessages}");
                }

                if (newUser.Role == Roles.Admin || newUser.Role == Roles.Patient || newUser.Role == Roles.Doctor)
                {
                    if (!await _roleManager.RoleExistsAsync(newUser.Role))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(newUser.Role));
                    }

                    // Add the role to the user
                    await _userManager.AddToRoleAsync(appuser, newUser.Role);
                }
                else
                {
                    throw new ArgumentException("Invalid role. Role must be Admin, Patient, or Doctor.");
                }

                // Save user details to the custom User table
                User userdetails = new User()
                {
                    UserName = newUser.UserName,
                    Password = newUser.Password,
                    Email = newUser.Email,
                    MobileNumber = newUser.MobileNumber,
                    Gender = newUser.Gender,
                    Role = newUser.Role,
                };

                _context.Users.Add(userdetails);
                await _context.SaveChangesAsync();

                return (true, userdetails.Id.ToString());
            }
            catch (Exception ex)
            {
                // Handle unexpected errors and log them
                Console.WriteLine($"Unexpected error during registration: {ex.Message}");
                throw new Exception($"Error during registration: {ex.Message}", ex);
            }
        }

        public async Task<User> UpdateUserDetailsAsync(int id, UpdateUserDto updateUser)
        {
            // Retrieve the user from DbContext by custom User Id
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return null; // User not found in application-specific database
            }

            // Use the email to find the Identity user
            var identityUser = await _userManager.FindByEmailAsync(existingUser.Email);
            if (identityUser == null)
            {
                throw new Exception("User not found in Identity system"); // User mismatch between DbContext and Identity
            }

            // Update fields in Identity via _userManager
            identityUser.UserName = updateUser.UserName;
            var identityResult = await _userManager.UpdateAsync(identityUser);
            if (!identityResult.Succeeded)
            {
                // Handle errors if updating in Identity failed
                throw new Exception(string.Join(", ", identityResult.Errors.Select(e => e.Description)));
            }

            // Update custom fields in DbContext
            existingUser.MobileNumber = updateUser.MobileNumber;
            _context.Users.Update(existingUser);

            await _context.SaveChangesAsync(); // Save changes to DbContext

            return existingUser;
        }



        public string GenerateOtp()
        {
            //Generates random  code
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // 6-digit OTP
        }

        public async Task<bool> SendOtpAsync(string email)
        {
            var otp = GenerateOtp();
            var expirationTime = DateTime.UtcNow.AddMinutes(10);

            // Create a new OTP entry in the DTO
            var otpDto = new OTPDto
            {
                Email = email,
                OtpCode = otp,
                ExpirationTime = expirationTime
            };

            // Remove any existing OTP for the same email
            _userOtps.RemoveAll(o => o.Email == email);

            // Add the new OTP DTO to the list
            _userOtps.Add(otpDto);

            // Construct the request payload for email
            var payload = new
            {
                To = email,
                Subject = "OTP Code",
                Body = $"Your OTP code is {otp}. It is valid until {expirationTime}."
            };

            // Send request to EmailService
            var response = await _httpClient.PostAsJsonAsync("https://email-service-d4guancwbefycwh2.centralindia-01.azurewebsites.net/api/email/send", payload);

            // Check if the request succeeded
            return response.IsSuccessStatusCode;
        }

        public bool ValidateOtp(string email, string otp)
        {
            // Find the OTP record for the specified email
            var otpDto = _userOtps.FirstOrDefault(o => o.Email == email);

            // Check if OTP record exists, if OTP code matches, and if OTP has not expired
            if (otpDto == null || otpDto.OtpCode != otp || otpDto.ExpirationTime < DateTime.UtcNow)
            {
                return false; // Return false if any validation fails
            }

            // Remove the OTP record after successful validation
            _userOtps.Remove(otpDto);
            return true; // Return true if OTP is valid
        }


        public async Task<bool> SendPasswordResetEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return false;
            }

            // Generate password reset token
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Generate reset link for localhost development
            var resetLink = $"http://localhost:3000/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";

            // Create email payload
            var payload = new
            {
                To = user.Email,
                Subject = "Password Reset",
                Body = $"Click the link to reset your password: {resetLink}"
            };

            // Send request to EmailService
            var response = await _httpClient.PostAsJsonAsync("email-service-d4guancwbefycwh2.centralindia-01.azurewebsites.net/gateway/email/send", payload);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            // Find user by email
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                // If user is not found, return false
                return false;
            }

            // Attempt to reset the password using the provided token
            var resetResult = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (resetResult.Succeeded)
            {
                // Optionally save any additional changes to your DbContext
                var userInDbContext = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (userInDbContext != null)
                {
                    // Update the password in the Users table
                    userInDbContext.Password = newPassword; // Update with hashed password if required

                    // Save changes to your DbContext
                    await _context.SaveChangesAsync();
                }
            }
            // Return true if succeeded, false otherwise
            return resetResult.Succeeded;
        }



    }
}

