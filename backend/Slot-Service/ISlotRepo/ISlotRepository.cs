using Slot_Service.Model;

namespace Slot_Service.ISlotRepo
{
    public interface ISlotRepository
    {
        Task<bool> AddSlotAsync(Slot slot);
        Task<Slot> GetSlotByIdAsync(int slotId);
        Task<List<Slot>> GetSlotsByDoctorAndDateAsync(int doctorId);

        Task DeleteSlotAsync(int slotId);
    }
}
