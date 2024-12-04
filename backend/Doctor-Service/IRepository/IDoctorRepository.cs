using Doctor_Service.DTO;
using Doctor_Service.Model;

namespace Doctor_Service.IRepository
{
    public interface IDoctorRepository
    {
        Task<Doctor> GetDoctorByIdAsync(int id);
        Task<IEnumerable<Doctor>> GetPendingDoctorsAsync();
        Task<IEnumerable<Doctor>> GetApprovedDoctorsAsync();
        Task AddDoctorAsync(int id, DoctorDTO doctor);
        Task UpdateDoctorAsync(int doctorId, DoctorDTO doctor);
        Task DoctorApprovalAsync(int id, string email);
        Task DoctorRejectAsync(int id, string email);
        Task DeleteDoctorAsync(int id);
        Task<IEnumerable<Doctor>> GetAllDoctorsBySpecialityAsync(string speciality);
        Task<bool> SetAvailability(AvailabilityDTO availabilityDTO);
        Task<bool?> CheckAvailability(int id, DateTime date);
    }
}
