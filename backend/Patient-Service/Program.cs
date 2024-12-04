
using Microsoft.EntityFrameworkCore;
using Patient_Service.DataAccess;
using Patient_Service.IRepository;
using Patient_Service.Repository;

namespace Patient_Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<PatientDBContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("PatientDatabase")));
            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddScoped<IPatientRepository, PatientRepository>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder => builder
                        .WithOrigins("http://localhost:3000") // React app URL
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                options.RoutePrefix = string.Empty; // Swagger at root
            });

            app.UseHttpsRedirection();
            app.UseCors("AllowReactApp");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
