using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Doctor_Service.DataAccess;
using Doctor_Service.IRepository;
using Doctor_Service.Model;
using Doctor_Service.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
namespace Testing
{
    public class DoctorServiceTesting
    {
        private DoctorDBContext _context;
        private DoctorRepository _repository;
        // Minimal test implementation for IHttpClientFactory
        private class TestHttpClientFactory : IHttpClientFactory
        {
            public HttpClient CreateClient(string name)
            {
                return new HttpClient(); // Return a basic HttpClient instance
            }
        }
        // Minimal test implementation for IImageRepository
        private class TestImageRepository : IImageRepository
        {
            public string GenerateImageURL(IFormFile file)
            {
                throw new NotImplementedException();
            }

            public Task<string> GetImageUrlAsync(int doctorId)
            {
                return Task.FromResult("http://example.com/default-image.jpg");
            }
        }
        [SetUp]
        public void SetUp()
        {
            // Create an in-memory database for testing
            var options = new DbContextOptionsBuilder<DoctorDBContext>()
                .UseInMemoryDatabase(databaseName: "DoctorTestDb")
                .Options;
            _context = new DoctorDBContext(options);
            // Use test implementations for HttpClientFactory and ImageRepository
            var httpClientFactory = new TestHttpClientFactory();
            var imageRepository = new TestImageRepository();
            _repository = new DoctorRepository(_context, httpClientFactory, imageRepository);
            // Seed the database with test data
            SeedDatabase();
        }
        private void SeedDatabase()
        {
            _context.Doctors.AddRange(new List<Doctor> {
            new Doctor { DoctorId = 1, Status = "approved", Speciality = "Cardiology", About = "Experienced cardiologist with over 10 years of practice.", City = "New York", ClinicAddress = "123 Heart Lane", Degree = "MD", MedicalLicense = "12345-CARD", State = "NY" },
            new Doctor { DoctorId = 2, Status = "approved", Speciality = "Neurology", About = "Expert in neurological disorders with a focus on patient care.", City = "Los Angeles", ClinicAddress = "456 Brain Avenue", Degree = "MD", MedicalLicense = "67890-NEUR", State = "CA" },
            new Doctor { DoctorId = 3, Status = "pending", Speciality = "Orthopedics", About = "Skilled orthopedic surgeon specializing in bone injuries.", City = "Chicago", ClinicAddress = "789 Bone Street", Degree = "MD", MedicalLicense = "24680-ORTHO", State = "IL" }
                });
            _context.SaveChanges();
        }
        [Test]
        public async Task GetDoctorByIdAsync_ShouldReturnDoctor_WhenDoctorExists()
        {
            // Act
            var doctor = await _repository.GetDoctorByIdAsync(1);
            // Assert
            Assert.IsNotNull(doctor);
            Assert.AreEqual(1, doctor.DoctorId);
        }
        [Test]
        public async Task GetDoctorByIdAsync_ShouldReturnNull_WhenDoctorDoesNotExist()
        {
            // Act
            var doctor = await _repository.GetDoctorByIdAsync(99);
            // Assert
            Assert.IsNull(doctor);
        }
        [Test]
        public async Task GetApprovedDoctorsAsync_ShouldReturnOnlyApprovedDoctors()
        {
            // Act
            var approvedDoctors = await _repository.GetApprovedDoctorsAsync();
            // Assert
            Assert.IsNotNull(approvedDoctors);
            Assert.AreEqual(2, approvedDoctors.Count());
            Assert.IsTrue(approvedDoctors.All(d => d.Status == "approved"));
        }
        [Test]
        public async Task GetPendingDoctorsAsync_ShouldReturnOnlyPendingDoctors()
        {
            // Act
            var pendingDoctors = await _repository.GetPendingDoctorsAsync();
            // Assert
            Assert.IsNotNull(pendingDoctors);
            Assert.AreEqual(1, pendingDoctors.Count());
            Assert.IsTrue(pendingDoctors.All(d => d.Status == "pending"));
        }
        [Test]
        public async Task GetAllDoctorsBySpecialityAsync_ShouldReturnDoctorsWithMatchingSpeciality()
        {
            // Act
            var doctors = await _repository.GetAllDoctorsBySpecialityAsync("Cardiology");
            // Assert
            Assert.IsNotNull(doctors);
            Assert.AreEqual(1, doctors.Count());
            Assert.IsTrue(doctors.All(d => d.Speciality == "Cardiology"));
        }
        [Test]
        public async Task GetAllDoctorsBySpecialityAsync_ShouldReturnEmptyList_WhenNoMatchingSpeciality()
        {
            // Act
            var doctors = await _repository.GetAllDoctorsBySpecialityAsync("Oncology");
            // Assert
            Assert.IsNotNull(doctors);
            Assert.IsEmpty(doctors);
        }
        [TearDown]
        public void TearDown()
        {
            // Clean up the in-memory database
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}




