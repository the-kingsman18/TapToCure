
using Doctor_Service.DataAccess;
using Doctor_Service.IRepository;
using Doctor_Service.Repository;
using Microsoft.EntityFrameworkCore;

namespace Doctor_Service
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

            builder.Services.AddAutoMapper(typeof(Program));

            builder.Services.AddDbContext<DoctorDBContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("ProjectData")));


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder => builder
                        .WithOrigins("http://localhost:3000") // React app URL
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            builder.Services.AddHttpClient("EmailServiceClient", client =>
            {
                client.BaseAddress = new Uri("https://localhost:7189/api/Email/send"); // Replace with the actual URL of your Email Service
            });
            builder.Services.AddScoped<IImageRepository, ImageRepository>();
            builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();


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
