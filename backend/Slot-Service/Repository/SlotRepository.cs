using Microsoft.EntityFrameworkCore;
using Slot_Service.DataAccess;
using Slot_Service.Exceptions;
using Slot_Service.ISlotRepo;
using Slot_Service.Model;

namespace Slot_Service.Repository
{
    public class SlotRepository : ISlotRepository
    {
        private readonly SlotDBContext _context;

        // Constructor to initialize SlotDBContext for database access
        public SlotRepository(SlotDBContext context)
        {
            _context = context;
        }

        // Method to add a new slot to the database
        public async Task<bool> AddSlotAsync(Slot slot)
        {
            // Retrieve all existing slots for the same doctor, ordered by start time
            var existingSlots = await _context.Slots
                .Where(s => s.DoctorId == slot.DoctorId)
                .OrderBy(s => s.StartTime)
                .ToListAsync();

            // Check if the doctor already has the maximum number of slots for the day
            if (existingSlots.Count >= 3)
            {
                throw new SlotExceptions("A doctor can only have up to 3 slots per day.");
            }

            // Ensure the slot duration does not exceed 5 hours
            if (slot.EndTime - slot.StartTime > TimeSpan.FromHours(5))
            {
                throw new SlotExceptions("The slot duration cannot exceed a 5-hour gap.");
            }

            // Validate that the start time is before the end time
            if (slot.StartTime >= slot.EndTime)
            {
                throw new InvalidOperationException("StartTime must be earlier than EndTime.");
            }

            // Check for a minimum 1-hour gap between the new slot and existing slots
            foreach (var existingSlot in existingSlots)
            {
                if ((slot.StartTime < existingSlot.EndTime.Add(TimeSpan.FromHours(1))) &&
                    (slot.EndTime > existingSlot.StartTime.Subtract(TimeSpan.FromHours(1))))
                {
                    throw new SlotExceptions("The slot times must have at least a 1-hour gap between them.");
                }
            }

            // Ensure the slot is scheduled between 9 AM and 9 PM
            if (slot.StartTime.Hours < 9 || slot.EndTime.Hours > 21)
            {
                throw new SlotExceptions("The slot must be between 9 AM and 9 PM.");
            }

            // Add the new slot to the database and save changes
            _context.Slots.Add(slot);
            await _context.SaveChangesAsync();

            return true;
        }

        // Method to retrieve a slot by its ID
        public async Task<Slot> GetSlotByIdAsync(int slotId)
        {
            // Find the slot in the database
            var slot = await _context.Slots.FindAsync(slotId);

            // If the slot doesn't exist, throw an exception
            if (slot == null)
            {
                throw new SlotExceptions("Slot not found.");
            }
            return slot;
        }

        // Method to delete a slot by its ID
        public async Task DeleteSlotAsync(int slotId)
        {
            // Find the slot in the database
            var slot = await _context.Slots.FindAsync(slotId);

            // If the slot doesn't exist, throw an exception
            if (slot == null)
            {
                throw new SlotExceptions("Slot not found.");
            }

            // Remove the slot from the database and save changes
            _context.Slots.Remove(slot);
            await _context.SaveChangesAsync();
        }

        // Method to retrieve all slots for a specific doctor by their ID
        public async Task<List<Slot>> GetSlotsByDoctorAndDateAsync(int doctorId)
        {
            return await _context.Slots
                .Where(s => s.DoctorId == doctorId)
                .AsNoTracking() // Use AsNoTracking for read-only data, improving performance
                .ToListAsync();
        }
    }
}
