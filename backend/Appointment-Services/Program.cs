
using Appointment_Services.DataAccess;
using Appointment_Services.IRepositoryAppointment;
using Appointment_Services.Services;
using Microsoft.EntityFrameworkCore;

namespace Appointment_Services
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<AppointDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("AppoinConnection")));
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IAppointment, AppointmentServices>();

            builder.Services.AddAutoMapper(typeof(Program));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy.AllowAnyOrigin()  // Use this cautiously, only for development
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });
            builder.Services.AddHttpClient("EmailServiceClient", client =>
            {
                client.BaseAddress = new Uri("https://localhost:7189/api/Email/send"); // Replace with the actual URL of your Email Service
            });
            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                options.RoutePrefix = string.Empty; // Swagger at root
            });


            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
