import React, { useEffect, useState } from 'react';
import './Sessions.css';
import { addSlot, deleteSlot, getslots, setAvailability } from '../../../services/DoctorService';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';

Modal.setAppElement('#root'); // Set the root element for accessibility

interface Slot {
  slotId: number;
  startTime: string;
  endTime: string;
}

const Sessions: React.FC = () => {
  const doctorId = useSelector((state: any) => state.user.userId);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormVisible, setFormVisible] = useState<boolean>(false);

  useEffect(() => {
    getslots(doctorId).then((response) => {
      setSlots(response.data);
    });
  }, [doctorId]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = async () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-CA'); // 'en-CA' format is YYYY-MM-DD
      const notAvailableDate = new Date(formattedDate.replace(/-/g, '/')).toISOString(); // Replace dashes with slashes

      try {
      await setAvailability(doctorId, notAvailableDate);
        toast.success('Marked unavailable successfully');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to set availability';
        toast.error(`Error: ${errorMessage}`);
      }
    }
    setModalIsOpen(false);
  };

  const handleDateChange = (date: Date|null) => {
    setSelectedDate(date);
  };

  const handleDelete = (id: number) => {
    deleteSlot(id).then(() => {
      setSlots((prevSlots) => prevSlots.filter((slot) => slot.slotId !== id));
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toTimeString().split(' ')[0];
  };

  const formatDuration = (minutes: string) => {
    const mins = parseInt(minutes, 10);
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
  };

  const handleAddSlot = async () => {
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    const formattedDuration = formatDuration(duration);

    const values = {
      doctorId: `${doctorId}`,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      durationForEachSlot: formattedDuration,
    };

    try {
      const response = await addSlot(values);
      setSlots((prevSlots) => [...prevSlots, response.data]);
      setFormVisible(false); // Hide the form after adding the slot
      toast.success('Slots added successfully');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;
        toast.error(`Error adding slots: ${errorMessage}`);
      } else {
        toast.error(`Error adding slots: ${err.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="pending-approvals__profile">
      <h2 className="profile-heading">Manage</h2>
      <ToastContainer />
      <div className="profile-card">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
                <td>
                  <button onClick={() => handleDelete(item.slotId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => setFormVisible(true)}
          style={{ marginRight: '10px', marginLeft: '1px', marginTop: '10px', marginBottom: '10px' }}
        >
          Add New Session
        </button>
        <div>
          <button onClick={openModal}>Mark a day as Not Available</button>
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Select Date">
            <h2>Select a Date</h2>
            <DatePicker selected={selectedDate} onChange={handleDateChange} inline />
            <button onClick={closeModal}>Close</button>
          </Modal>
        </div>

        {isFormVisible && (
          <div className="edit-form">
            <h3>Add Sessions</h3>

            <label>
              Session Start Time:
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>

            <label>
              Session End Time:
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>

            <label>
              Per Slot Duration: In Minutes
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </label>

            <button onClick={handleAddSlot}>Add</button>
            <button onClick={() => setFormVisible(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
