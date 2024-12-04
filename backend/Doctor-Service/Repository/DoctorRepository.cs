using System.Net.Http;
using System.Net.Http.Json;
using Doctor_Service.DataAccess;
using Doctor_Service.DTO;
using Doctor_Service.IRepository;
using Doctor_Service.Model;
using Microsoft.EntityFrameworkCore;
using System;
using Doctor_Service.Exceptions;

namespace Doctor_Service.Repository
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly DoctorDBContext _context;
        private readonly HttpClient _httpClient;
        private readonly IImageRepository _imageRepository;

        public DoctorRepository(DoctorDBContext context, IHttpClientFactory httpClientFactory, IImageRepository imageRepository)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient("EmailServiceClient");
            _imageRepository = imageRepository;
        }

        public async Task<Doctor> GetDoctorByIdAsync(int id)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.DoctorId == id);
            if (doctor == null)
            {
                throw new DoctorExceptions(id);
            }
            return doctor;
        }

        public async Task<IEnumerable<Doctor>> GetApprovedDoctorsAsync()
        {
            return await _context.Doctors
                .Where(d => d.Status == "approved")
                .ToListAsync();
        }

        public async Task<IEnumerable<Doctor>> GetPendingDoctorsAsync()
        {
            return await _context.Doctors
                .Where(d => d.Status == "pending")
                .ToListAsync();
        }

        public async Task AddDoctorAsync(int id, DoctorDTO doctor)
        {
            try
            {
                var newDoctor = new Doctor
                {
                    DoctorId = id,
                    Degree = doctor.Degree,
                    Speciality = doctor.Speciality,
                    Experience = doctor.Experience,
                    MedicalLicense = doctor.MedicalLicense,
                    State = doctor.State,
                    City = doctor.City,
                    ClinicAddress = doctor.ClinicAddress,
                    About = doctor.About,
                    ImageURL = _imageRepository.GenerateImageURL(doctor.ProfileImage)
                };

                _context.Doctors.Add(newDoctor);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding a new doctor.", ex);
            }
        }

        public async Task UpdateDoctorAsync(int doctorId, DoctorDTO doctor)
        {
            try
            {
                var existingDoctor = await GetDoctorByIdAsync(doctorId);

                existingDoctor.Degree = doctor.Degree;
                existingDoctor.Speciality = doctor.Speciality;
                existingDoctor.Experience = doctor.Experience;
                existingDoctor.MedicalLicense = doctor.MedicalLicense;
                existingDoctor.State = doctor.State;
                existingDoctor.City = doctor.City;
                existingDoctor.ClinicAddress = doctor.ClinicAddress;
                existingDoctor.About = doctor.About;
                existingDoctor.ImageURL = _imageRepository.GenerateImageURL(doctor.ProfileImage);

                _context.Doctors.Update(existingDoctor);
                await _context.SaveChangesAsync();
            }
            catch (DoctorExceptions)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating doctor information.", ex);
            }
        }

        public async Task DoctorApprovalAsync(int id, string email)
        {
            try
            {
                var doctor = await GetDoctorByIdAsync(id);
                var payload = new
                {
                    To = email,
                    Subject = "Approved",
                    Body = $"Dear {email}, your details have been verified and approved by the administrator. You can now access the dashboard and add sessions."
                };

                var response = await _httpClient.PostAsJsonAsync("https://email-service-d4guancwbefycwh2.centralindia-01.azurewebsites.net/api/email/send", payload);
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to send approval email to {email}. Status Code: {response.StatusCode}");
                }

                doctor.Status = "approved";
                _context.Doctors.Update(doctor);
                await _context.SaveChangesAsync();
            }
            catch (DoctorExceptions)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred during doctor approval.", ex);
            }
        }

        public async Task DoctorRejectAsync(int id, string email)
        {
            try
            {
                var doctor = await GetDoctorByIdAsync(id);
                var payload = new
                {
                    To = email,
                    Subject = "Application Rejected",
                    Body = $"Dear {email}, your application has been reviewed and was not approved. Please contact support if you have any questions."
                };

                var response = await _httpClient.PostAsJsonAsync("https://localhost:7189/api/Email/send", payload);
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to send rejection email to {email}. Status Code: {response.StatusCode}");
                }

                doctor.Status = "rejected";
                _context.Doctors.Update(doctor);
                await _context.SaveChangesAsync();
            }
            catch (DoctorExceptions)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred during doctor rejection.", ex);
            }
        }

        public async Task DeleteDoctorAsync(int id)
        {
            try
            {
                var doctor = await GetDoctorByIdAsync(id);
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
            }
            catch (DoctorExceptions)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the doctor.", ex);
            }
        }

        public async Task<IEnumerable<Doctor>> GetAllDoctorsBySpecialityAsync(string speciality)
        {
            if (string.IsNullOrWhiteSpace(speciality))
            {
                return new List<Doctor>();
            }

            return await _context.Doctors
                .Where(d => d.Speciality != null && d.Speciality.ToLower() == speciality.ToLower())
                .ToListAsync();
        }

        public async Task<bool> SetAvailability(AvailabilityDTO availabilityDTO)
        {
            try
            {
                if (availabilityDTO == null)
                {
                    return false;
                }

                var doctor = await GetDoctorByIdAsync(availabilityDTO.DoctorId);
                if (!doctor.UnavailableDates.Contains(availabilityDTO.NotAvailableDate.Date))
                {
                    doctor.UnavailableDates.Add(availabilityDTO.NotAvailableDate.Date);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (DoctorExceptions)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while setting availability.", ex);
            }
        }

        public async Task<bool?> CheckAvailability(int doctorId, DateTime date)
        {
            try
            {
                var doctor = await GetDoctorByIdAsync(doctorId);
                bool isAvailable = !doctor.UnavailableDates.Contains(date.Date);
                return isAvailable;
            }
            catch (DoctorExceptions)
            {
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while checking doctor availability.", ex);
            }
        }
    }
}
