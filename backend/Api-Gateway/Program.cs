
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

namespace Api_Gateway
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

            builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
            .AddJsonFile("ApiConfig.json", false, reloadOnChange: true);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder => builder
                        .WithOrigins("https://taptocure.azurewebsites.net") // React app URL
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });


            builder.Services.AddOcelot();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                    options.RoutePrefix = string.Empty; // Swagger at root
                });
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowReactApp");

            app.UseAuthorization();

            app.UseOcelot().Wait();



            app.MapControllers();

            app.MapGet("/hello", () => "Welcome TO Feedback Service");

            app.Run();
        }
    }
}
