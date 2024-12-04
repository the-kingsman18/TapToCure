using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Appointment_Services.DataAccess;
using Appointment_Services.Model;
using Appointment_Services.Model.Dto;
using Appointment_Services.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace Testing
{
    public class AppointmentServiTesting
    {
        private AppointDbContext _context;
        private AppointmentServices _appointmentServices;
        private IMapper _mapper;

        [SetUp]
        public void SetUp()
        {
            // Set up the in-memory database
            var options = new DbContextOptionsBuilder<AppointDbContext>()
                .UseInMemoryDatabase(databaseName: "AppointmentTestDb")
                .Options;
            _context = new AppointDbContext(options);

            // Set up AutoMapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Appointment, AppointmentDto>();
            });
            _mapper = config.CreateMapper();

            // Set up a mock HttpClientFactory
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            var httpClient = new HttpClient();
            httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Initialize the service with the mock HttpClientFactory
            _appointmentServices = new AppointmentServices(_context, _mapper, httpClientFactoryMock.Object);

            // Seed the database with test data
            _context.AppointmentsTable.AddRange(
                new Appointment { AppointmentId = 1, DoctorId = 101, PatientId = 201, AppointmentDate = DateTime.Now, Status = "Scheduled" , Notes = "Initial consultation", SessingTiming = "10:00 AM" },
                new Appointment { AppointmentId = 2, DoctorId = 102, PatientId = 202, AppointmentDate = DateTime.Now.AddDays(1), Status = "completed" , Notes = "Initial consultation", SessingTiming = "11:00 AM" }
            );
            _context.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Test]
        public async Task GetAppointmentsAsync_ShouldReturnAllAppointments()
        {
            // Act
            var result = await _appointmentServices.GetAppointmentsAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
        }

        [Test]
        public async Task GetAppointmentByIdAsync_ValidId_ShouldReturnAppointment()
        {
            // Act
            var result = await _appointmentServices.GetAppointmentByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.AppointmentId);
            Assert.AreEqual(101, result.DoctorId);
            Assert.AreEqual("Scheduled", result.Status);
        }

        [Test]
        public void GetAppointmentByIdAsync_InvalidId_ShouldThrowKeyNotFoundException()
        {
            // Act & Assert
            Assert.ThrowsAsync<KeyNotFoundException>(() => _appointmentServices.GetAppointmentByIdAsync(999));
        }

        [Test]
        public async Task GetAppointmentsByDoctorIdAsync_ShouldReturnAppointmentsForDoctor()
        {
            // Act
            var result = await _appointmentServices.GetAppointmentsByDoctorIdAsync(101);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());
            Assert.AreEqual(101, result.First().DoctorId);
        }

        [Test]
        public async Task GetAppointmentsByPatientIdAsync_ShouldReturnAppointmentsForPatient()
        {
            // Act
            var result = await _appointmentServices.GetAppointmentsByPatientIdAsync(202);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());
            Assert.AreEqual(202, result.First().PatientId);
        }
    }
}
