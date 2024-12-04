using System.Net.Http;
using Appointment_Services.DataAccess;
using Appointment_Services.IRepositoryAppointment;
using Appointment_Services.Model;
using Appointment_Services.Model.Dto;
using Appointment_Services.CustomException;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Appointment_Services.Services
{
    public class AppointmentServices : IAppointment
    {
        private readonly AppointDbContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;

        public AppointmentServices(AppointDbContext context, IMapper mapper, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _mapper = mapper;
            _httpClient = httpClientFactory.CreateClient("EmailServiceClient");
        }

        // Get all appointments
        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync()
        {
            var appointments = await _context.AppointmentsTable.ToListAsync();
            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }

        // Get a specific appointment by ID
        public async Task<AppointmentDto> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _context.AppointmentsTable.FindAsync(id);
            if (appointment == null)
            {
                throw new AppointmentException($"Appointment with ID {id} not found", id, "NOT_FOUND");
            }
            return _mapper.Map<AppointmentDto>(appointment);
        }

        // Add a new appointment
        public async Task<AppointmentDto> AddAppointmentAsync(CreateAppointment createAppointmentDto)
        {
            if (createAppointmentDto == null)
            {
                throw new AppointmentException("Appointment data must be provided.",0, "INVALID_INPUT");
            }

            var appointment = _mapper.Map<Appointment>(createAppointmentDto);
            await _context.AppointmentsTable.AddAsync(appointment);
            await _context.SaveChangesAsync();
            return _mapper.Map<AppointmentDto>(appointment);
        }

        // Update an existing appointment
        public async Task UpdateAppointmentAsync(int id, CreateAppointment updateAppointmentDto)
        {
            if (updateAppointmentDto == null)
            {
                throw new AppointmentException("Updated appointment data must be provided.", id, "INVALID_INPUT");
            }

            var existingAppointment = await _context.AppointmentsTable.FindAsync(id);
            if (existingAppointment == null)
            {
                throw new AppointmentException($"Appointment with ID {id} not found", id, "NOT_FOUND");
            }

            _mapper.Map(updateAppointmentDto, existingAppointment);
            _context.AppointmentsTable.Update(existingAppointment);
            await _context.SaveChangesAsync();
        }

        // Delete an appointment by ID
        public async Task DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.AppointmentsTable.FindAsync(id);
            if (appointment == null)
            {
                throw new AppointmentException($"Appointment with ID {id} not found", id, "NOT_FOUND");
            }

            _context.AppointmentsTable.Remove(appointment);
            await _context.SaveChangesAsync();
        }

        // Get available appointments for a doctor on a specific date
        public async Task<IEnumerable<string>> GetAvailableAppointmentsAsync(int doctorId, DateTime date)
        {
            var appointments = await _context.AppointmentsTable
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate.Date == date.Date && (a.Status == "Scheduled" || a.Status == "consulted"))
                .ToListAsync();

            return appointments.Select(a => $"{a.AppointmentTime:hh\\:mm}").ToList();
        }

        // Get appointments by doctor ID
        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            var appointments = await _context.AppointmentsTable
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }

        // Get appointments by patient ID
        public async Task<IEnumerable<AppointmentDto>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            var appointments = await _context.AppointmentsTable
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }

        // Cancel an appointment by ID
        public async Task CancelAppointmentAsync(int id, string email)
        {
            var existingAppointment = await _context.AppointmentsTable.FindAsync(id);
            if (existingAppointment == null)
            {
                throw new AppointmentException($"Appointment with ID {id} not found", id, "NOT_FOUND");
            }

            var payload = new
            {
                To = email,
                Subject = "Appointment Cancelled",
                Body = $"Dear {email}, your appointment has been cancelled."
            };

            var response = await _httpClient.PostAsJsonAsync("https://localhost:7189/api/Email/send", payload);
            if (!response.IsSuccessStatusCode)
            {
                throw new AppointmentException("Failed to send email notification.", id, "EMAIL_SEND_FAILURE");
            }

            existingAppointment.Status = "available";
            _context.AppointmentsTable.Update(existingAppointment);
            await _context.SaveChangesAsync();
        }

        // Cancel an appointment by doctor
        public async Task CancelAppointmentByDoctorAsync(int id, string email)
        {
            var existingAppointment = await _context.AppointmentsTable.FindAsync(id);
            if (existingAppointment == null)
            {
                throw new AppointmentException($"Appointment with ID {id} not found", id, "NOT_FOUND");
            }

            var payload = new
            {
                To = email,
                Subject = "Appointment Cancelled",
                Body = $"Dear {email}, the doctor has cancelled your appointment."
            };

            var response = await _httpClient.PostAsJsonAsync("https://localhost:7189/api/Email/send", payload);
            if (!response.IsSuccessStatusCode)
            {
                throw new AppointmentException("Failed to send email notification.", id, "EMAIL_SEND_FAILURE");
            }

            existingAppointment.Status = "cancelled";
            _context.AppointmentsTable.Update(existingAppointment);
            await _context.SaveChangesAsync();
        }

        // Complete an appointment and send a feedback link
        public async Task CompleteAppointmentAsync(int id, string patientEmail)
        {
            var existingAppointment = await _context.AppointmentsTable.FindAsync(id);
            if (existingAppointment == null)
            {
                throw new AppointmentException($"Appointment with ID {id} not found", id, "NOT_FOUND");
            }

            existingAppointment.Status = "consulted";
            _context.AppointmentsTable.Update(existingAppointment);
            await _context.SaveChangesAsync();

            var feedbackUrl = $"http://localhost:3000/feedback?appointmentId={id}";

            var payload = new
            {
                To = patientEmail,
                Subject = "Appointment Completed",
                Body = $"Dear {patientEmail}, your appointment with ID {id} has been completed. Please provide feedback by clicking the link {feedbackUrl}."
            };

            var response = await _httpClient.PostAsJsonAsync("https://localhost:7189/api/Email/send", payload);
            if (!response.IsSuccessStatusCode)
            {
                throw new AppointmentException("Failed to send email notification.", id, "EMAIL_SEND_FAILURE");
            }
        }
        public async Task UpdatePrescriptionAsync(int appointmentId, string prescription)
        {
            var appointment = await _context.AppointmentsTable.FindAsync(appointmentId);

            if (appointment == null)
            {
                // Ensure AppointmentException is properly defined
                throw new AppointmentException($"Appointment with ID {appointmentId} not found", appointmentId, "NOT_FOUND");
            }

            // Update the prescription field of the appointment
            appointment.Prescription = prescription;

            // Ensure the entity is being tracked and then update it
            _context.AppointmentsTable.Update(appointment);
            await _context.SaveChangesAsync();
        }
    }
}
