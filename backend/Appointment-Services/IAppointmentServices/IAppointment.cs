using Appointment_Services.Model;
using Appointment_Services.Model.Dto;

namespace Appointment_Services.IRepositoryAppointment
{
    public interface IAppointment
    {
        Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync();
        Task<AppointmentDto> GetAppointmentByIdAsync(int id);
        Task<AppointmentDto> AddAppointmentAsync(CreateAppointment createAppointmentDto);
        Task UpdateAppointmentAsync(int id, CreateAppointment updateAppointmentDto);

        Task CancelAppointmentAsync(int id, string email);
        Task CancelAppointmentByDoctorAsync(int id, string email);
        Task CompleteAppointmentAsync(int id, string email);
        Task DeleteAppointmentAsync(int id);
        Task<IEnumerable<string>> GetAvailableAppointmentsAsync(int doctorId, DateTime date);

        Task<IEnumerable<AppointmentDto>> GetAppointmentsByDoctorIdAsync(int doctorId);
        Task<IEnumerable<AppointmentDto>> GetAppointmentsByPatientIdAsync(int patientId);
        Task UpdatePrescriptionAsync(int appointmentId, string prescription);

    }
}
