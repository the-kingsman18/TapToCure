using NUnit.Framework;
using System.Linq;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using Patient_Service.DataAccess;
using Patient_Service.Model;
using Patient_Service.Repository;
using Patient_Service.Exceptions;
namespace Testing
{
    [TestFixture]
    public class PatientServiceTesting
    {
        private PatientDBContext _context;
        private PatientRepository _repository;
        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<PatientDBContext>()
                .UseInMemoryDatabase(databaseName: "PatientTestDb")
                .Options;
            _context = new PatientDBContext(options);
            _repository = new PatientRepository(_context);
            // Seed the in-memory database with test data including Age field
            _context.Patients.AddRange(
                new Patient { Id = 1, PatientId = 101, BloodGroup = "A+", Height = 170, Weight = 70, Age = 30, State = "State1", City = "City1", Address = "Address1", EmergencyContact = "12" },
                new Patient { Id = 2, PatientId = 102, BloodGroup = "B+", Height = 175, Weight = 75, Age = 40, State = "State2", City = "City2", Address = "Address2", EmergencyContact = "12" }
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
        public async Task GetPatientByIdAsync_WithExistingId_ReturnsCorrectPatient()
        {
            var result = await _repository.GetPatientByIdAsync(1);
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual(101, result.PatientId);
            Assert.AreEqual("A+", result.BloodGroup);
            Assert.AreEqual(30, result.Age);
        }
        [Test]
        
        public void GetPatientByIdAsync_WithNonExistingId_ThrowsPatientNotFoundException()
        {
            // Assert
            var ex = Assert.ThrowsAsync<PatientNotFoundException>(async () => await _repository.GetPatientByIdAsync(99));
            Assert.AreEqual("Patient with ID 99 was not found.", ex.Message);
        }
        [Test]
        public async Task GetPatientByPatientIdAsync_WithExistingPatientId_ReturnsCorrectPatient()
        {
            var result = await _repository.GetPatientByPatientIdAsync(102);
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Id);
            Assert.AreEqual(102, result.PatientId);
            Assert.AreEqual("B+", result.BloodGroup);
            Assert.AreEqual(40, result.Age);
        }
        [Test]
        public void GetPatientByPatientIdAsync_WithNonExistingPatientId_ThrowsPatientNotFoundException()
        {
            // Assert
            var ex = Assert.ThrowsAsync<PatientNotFoundException>(async () => await _repository.GetPatientByPatientIdAsync(999));
            Assert.AreEqual("Patient with ID 999 was not found.", ex.Message);
        }
        [Test]
        public async Task GetAllPatientsAsync_ReturnsAllPatients()
        {
            var result = await _repository.GetAllPatientsAsync();
            Assert.IsNotNull(result);
            var patientsList = result.ToList();
            Assert.AreEqual(2, patientsList.Count);
            Assert.AreEqual(101, patientsList[0].PatientId);
            Assert.AreEqual(30, patientsList[0].Age);
            Assert.AreEqual(102, patientsList[1].PatientId);
            Assert.AreEqual(40, patientsList[1].Age);
        }
    }
}









