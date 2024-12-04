using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Slot_Service.DataAccess;
using Slot_Service.Exceptions;
using Slot_Service.Model;
using Slot_Service.Repository;

namespace Testing
{
    [TestFixture]
    public class SlotServiceTesting
    {

        private SlotRepository _slotRepository;
        private SlotDBContext _context;

        [SetUp]
        public void Setup()
        {
            // Create an in-memory database for testing
            var options = new DbContextOptionsBuilder<SlotDBContext>()
                .UseInMemoryDatabase(databaseName: "SlotDB")
                .Options;

            _context = new SlotDBContext(options);

            // Seed the in-memory database with some test data
            _context.Slots.AddRange(
                new Slot { SlotId = 1, DoctorId = 1, StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(10, 0, 0), DurationForEachSlot = new TimeSpan(0, 30, 0) },
                new Slot { SlotId = 2, DoctorId = 1, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(11, 0, 0), DurationForEachSlot = new TimeSpan(0, 30, 0) },
                new Slot { SlotId = 3, DoctorId = 2, StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(10, 0, 0), DurationForEachSlot = new TimeSpan(0, 30, 0) }
            );
            _context.SaveChanges();

            _slotRepository = new SlotRepository(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Database.EnsureDeleted(); // Clean up after each test
            _context.Dispose();
        }

        [Test]
        public async Task GetSlotByIdAsync_SlotExists_ReturnsSlot()
        {
            // Act
            var result = await _slotRepository.GetSlotByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.SlotId);
            Assert.AreEqual(1, result.DoctorId);
        }

        [Test]
        public void GetSlotByIdAsync_SlotDoesNotExist_ThrowsSlotExceptions()
        {
            // Act & Assert
            var ex = Assert.ThrowsAsync<SlotExceptions>(async () => await _slotRepository.GetSlotByIdAsync(99));
            Assert.AreEqual("Slot not found.", ex.Message);
        }

        [Test]
        public async Task GetSlotsByDoctorAndDateAsync_SlotsExistForDoctor_ReturnsSlots()
        {
            // Act
            var result = await _slotRepository.GetSlotsByDoctorAndDateAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.All(s => s.DoctorId == 1));
        }

        [Test]
        public async Task GetSlotsByDoctorAndDateAsync_NoSlotsForDoctor_ReturnsEmptyList()
        {
            // Act
            var result = await _slotRepository.GetSlotsByDoctorAndDateAsync(99);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsEmpty(result);
        }
    }
}
