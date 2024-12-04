
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Account_Service.DataAccess;
using Account_Service.Interface;
using Account_Service.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using JWTAuth;
using Account_Service.Repository;

namespace Account_Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddJwtAuthentication();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<UsersDBContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("UserData")));

           



            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultProvider;
                options.Password.RequireDigit = true; // Remove digit requirement
                options.Password.RequiredLength = 6;   // Minimum password length
                options.Password.RequireNonAlphanumeric = true; // Remove non-alphanumeric character requirement
                options.Password.RequireUppercase = true; // Remove uppercase letter requirement
                options.Password.RequireLowercase = true; // Remove lowercase letter requirement
                options.Password.RequiredUniqueChars = 0;
                options.User.AllowedUserNameCharacters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";
                options.User.RequireUniqueEmail = true;
            })
           .AddEntityFrameworkStores<UsersDBContext>()
           .AddDefaultTokenProviders();


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder => builder
                        .WithOrigins("http://localhost:3000") // React app URL
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });
            builder.Services.AddControllers();

            builder.Services.AddHttpClient("EmailServiceClient", client =>
            {
                client.BaseAddress = new Uri("https://localhost:7189/api/Email/send"); // Replace with the actual URL of your Email Service
            });

            builder.Services.AddScoped<IRepository, UserRepository>();

           

            builder.Services.AddAutoMapper(typeof(Program));
            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                options.RoutePrefix = string.Empty; // Swagger at root
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseCors("AllowReactApp");

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
