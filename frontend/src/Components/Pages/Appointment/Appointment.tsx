import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import RelatedDoctors from '../RelatedDoctors/relatedDoctors';
import './Appointment.css';
import { getDoctorById, getUserById } from '../../../services/AccountService';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { checkAvailability } from '../../../services/DoctorService';
import DoctorFeedBack from '../DoctorFeedBack/DoctorFeedBack';

interface TimeSlot {
  startTime: string;
  endTime: string;
  durationForEachSlot: string;
}

interface DoctorInfo {
  name: string;
  degree: string;
  speciality: string;
  experience: number;
  about: string;
  medicalLicense: string;
  clinicAddress: string;
  city: string;
  state: string;
}

const Appointment: React.FC = () => {
  const daysOfWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docSlot, setDocSlot] = useState<{ date: string; morning: Date[]; evening: Date[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<string | null>(null);
  const [docInfo, setDocInfo] = useState<DoctorInfo | null>(null);
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<string>(''); 
  const [availableTimes, setAvailableTimes] = useState<Date[]>([]); 
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [availability, setAvailability] = useState<boolean>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docname,setDocname]=useState<string|null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { docId =''} = useParams<{ docId: string }>();

  const patientId = useSelector((state: any) => state.user.userId);
  
  const [image,setImage]=useState('');
  const fetchDocInfo = async () => {
    try {
      const response = await getDoctorById(docId);
      setDocInfo(response.data);
      setAvailability(response.data.isAvailable);
      setImage(response.data.imageURL);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
      setBookingMessage('Failed to fetch doctor information.');
    }
  };

  const filterAvailableSlots = (availableSlots: Date[], bookedSlots: string[]) => {
    return availableSlots.filter(slot => {
      const slotTimeStr = slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      return !bookedSlots.includes(slotTimeStr);
    });
  };

  const fetchUser = async () => {
    try {
      const response = await getUserById(docId);
      setUser(response.data);
      setDocname(response.data.userName);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setBookingMessage('Failed to fetch user information.');
    }
  };

  const getAvailableSlots = async () => {
    const today = new Date();
    const allTimeSlots: { date: string; morning: Date[]; evening: Date[] }[] = [];
  
    try {
      const response = await axios.get<TimeSlot[]>(`https://localhost:7174/api/Slot/bydoctor/${docId}`);
      const timeSlots = response.data;
  
      for (let i = 0; i < 7; i++) {
        const curDate = new Date(today);
        curDate.setDate(today.getDate() + i);
        const morningSlots: Date[] = [];
        const eveningSlots: Date[] = [];
  
        for (const slot of timeSlots) {
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          const duration = slot.durationForEachSlot.split(':').map(Number);
  
          const startSlotDate = new Date(curDate);
          startSlotDate.setHours(startHour, startMinute, 0, 0);
          const endSlotDate = new Date(curDate);
          endSlotDate.setHours(endHour, endMinute, 0, 0);
  
          if (startSlotDate > today) {
            const timeDifference = (endSlotDate.getTime() - startSlotDate.getTime()) / (1000 * 60);
            const numberOfSlots = Math.floor(timeDifference / duration[1]);
  
            for (let j = 0; j < numberOfSlots; j++) {
              const slotTime = new Date(startSlotDate.getTime() + j * duration[1] * 60 * 1000);
              if (slotTime.getHours() >= 9 && slotTime.getHours() < 13) {
                morningSlots.push(slotTime);
              } else if (slotTime.getHours() >= 16 && slotTime.getHours() < 21) {
                eveningSlots.push(slotTime);
              }
            }
          }
        }
  
        if (morningSlots.length > 0 || eveningSlots.length > 0) {
          allTimeSlots.push({
            date: curDate.toDateString(),
            morning: morningSlots,
            evening: eveningSlots,
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching time slots:', error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'An error occurred while fetching time slots';
        if (status === 404) {
          toast.error(`Not Found: ${message}`);
        } else if (status === 500) {
          toast.error(`Server Error: ${message}`);
        } else {
          toast.error(`Unexpected Error: ${message}`);
        }
      } else {
        toast.error('Network error or server is down.');
      }
    }
  
    setDocSlot(allTimeSlots);
  };


   const fetchBookedAppointments = async (dateStr: string) => {
    try {
      const response = await axios.get(`https://localhost:7280/api/Appointment/available/${docId}/${dateStr}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching booked appointments:', error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'An error occurred while fetching booked appointments';
        if (status === 404) {
          toast.error(`Not Found: ${message}`);
        } else if (status === 500) {
          toast.error(`Server Error: ${message}`);
        } else {
          toast.error(`Unexpected Error: ${message}`);
        }
      } else {
        toast.error('Network error or server is down.');
      }
      return [];
    }
  };
  

  useEffect(() => {
    fetchDocInfo();
    fetchUser();
  }, [docId, patientId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const handleDateClick = async (dateString: string) => {
    const date = new Date(dateString);
    setSelectedDate(date);

    const formattedDate = date.toISOString().split('T')[0];
    try {
      const response = await checkAvailability(docId, formattedDate);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error checking availability:', error);
      setBookingMessage('Failed to check availability.');
    }
    
    setSelectedSlotTime(null);
    setTimeOfDay(null);
  };

  const handleTimeOfDaySelect = (time: string) => {
    setTimeOfDay(time);
    setSelectedSlotTime(null);
  };

  const handleSlotClick = (time: string) => {
    setSelectedSlotTime(time);
  };

  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let convertedHours = hours;

    if (modifier.toLowerCase() === 'pm' && hours !== 12) {
      convertedHours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
      convertedHours = 0;
    }

    return `${String(convertedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const convertTo12HourFormat = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; 
    return `${hours12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

 const handleBooking = async () => {
  if (!selectedDate || !selectedSlotTime) {
    setBookingMessage('Please select a date and time slot.');
    return;
  }

  if (typeof selectedSlotTime !== 'string' || !selectedSlotTime.trim()) {
    setBookingMessage('Invalid time slot selected. Please select a valid time.');
    return;
  }

  const appointmentDate = selectedDate.toISOString().split('T')[0];
  const appointmentTime = convertTo24Hour(selectedSlotTime);

  if (bookedSlots.includes(appointmentTime)) {
    setBookingMessage('This time slot is already booked. Please select another slot.');
    return;
  }

  try {
    const response = await axios.post('https://localhost:7280/api/Appointment', {
      doctorId: docId,
      patientId,
      sessingTiming: timeOfDay,
      appointmentDate,
      appointmentTime,
      status: 'Scheduled',
      notes,
      prescription : 'No Prescription'
    });

    if (response.status === 200) {
      setBookedSlots([...bookedSlots, appointmentTime]);
      toast.success('Appointment booked successfully!');
      await getAvailableSlots();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      toast.error('Failed to book the appointment.');
    }
  } catch (error: any) {
    if (error.response) {
      // Handle HTTP error response
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';
      if (status === 400) {
        toast.error(`Bad Request: ${message}`);
      } else if (status === 404) {
        toast.error(`Not Found: ${message}`);
      } else if (status === 500) {
        toast.error(`Server Error: ${message}`);
      } else {
        toast.error(`Unexpected Error: ${message}`);
      }
    } else {
      // Handle network or unexpected error
      toast.error('Network error or server is down.');
    }
  }

  closeModal();
};

  useEffect(() => {
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const fetchAvailableTimes = async () => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        try {
          const bookedSlots = await fetchBookedAppointments(dateStr);
          const availableSlots = (timeOfDay === 'morning' 
            ? docSlot.find(slot => slot.date === selectedDate?.toDateString())?.morning 
            : docSlot.find(slot => slot.date === selectedDate?.toDateString())?.evening
          ) || [];

          const filteredAvailableSlots = filterAvailableSlots(availableSlots, bookedSlots);
          setAvailableTimes(filteredAvailableSlots);
          setBookedSlots(bookedSlots);
        } catch (error) {
          console.error('Error fetching available times:', error);
        }
      };

      fetchAvailableTimes();
    }
  }, [selectedDate, timeOfDay, docSlot]);

  function handleNotesChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setNotes(event.target.value);
  }

  return (
    docInfo && user && (
      <div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
        <div className="flex-container">
          <div>
            <img className="custom-class12" src={image} alt="Doctor" />
          </div>
          <div className="custom-class1">
            <p>Dr. {docname}</p>
            <p className="info">{docInfo.degree} - Specialization {docInfo.speciality}
              
            </p>Experience : 
            <button className="button"> {docInfo.experience} years</button>
            <p className='para'>About</p> 

            <p className="para1"><strong> Dr. {user.userName} </strong>
              {/* {docInfo.about} */}
            A doctor is a medical professional dedicated to diagnosing, treating, and preventing illnesses, providing compassionate care, and promoting health. They play a vital role in enhancing patients' quality of life.
            </p>
            <p className="para2">License: <span style={{fontSize:'14px',fontWeight:'300'}}>{docInfo.medicalLicense}</span></p>
            <p className="para2">Clinic Address: <span style={{fontSize:'14px',fontWeight:'300'}}>{docInfo.clinicAddress}</span></p>
            <p className="para2">City: <span style={{fontSize:'14px',fontWeight:'300'}}>{docInfo.city}</span></p>
            <p className="para2">State: <span style={{fontSize:'14px',fontWeight:'300'}}>{docInfo.state}</span></p>
            <button onClick={openModal} className='appointmentButton'>Book Appointment</button>
          </div>
        </div>
        {/* Modal for Booking Appointment */}
        <Modal show={isModalOpen} onHide={closeModal} className="modal">
          <Modal.Header closeButton>
            <Modal.Title>Select a Time Slot</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="para3">
              <p>Booking Slots</p>
              <div className="para4">
                {docSlot.length > 0 ? (
                  docSlot.map((item, index) => (
                    <div
                      key={index}
                      className={`para5 ${selectedDate?.toDateString() === item.date ? 'bg-primary color-white' : 'border border-gray'}`}
                      onClick={() => handleDateClick(item.date)}
                    >
                      <p>{daysOfWeeks[new Date(item.date).getDay()]}</p>
                      <p>{new Date(item.date).getDate()}</p>
                    </div>
                  ))
                ) : (
                  <p>No available slots</p>
                )}
              </div>

              {selectedDate && (
                <div>
                  <p>Select time of day:</p>
                  <button onClick={() => handleTimeOfDaySelect('morning')} className='slot-button'>Morning</button>
                  <button onClick={() => handleTimeOfDaySelect('evening')} className='slot-button'>Evening</button>
                </div>
              )}

              {timeOfDay && (
                <div className="button1">
                  {availability ? (
                    <>
                      <p>Available Slots for {selectedDate?.toDateString()} - {timeOfDay}</p>
                        {(timeOfDay === 'morning' ? availableTimes : availableTimes)
                       ?.slice(0, 12)
                        .length === 0 ? (  // Check if there are no available slots
                      <p className='no-slots-message'>No slots are available for {timeOfDay} session</p>
                    ) : (
                  ( timeOfDay === 'morning' ? availableTimes : availableTimes)
                    ?.slice(0, 12)
                    .map((slot, index) => {
                      const slotTimeStr = convertTo12HourFormat(slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                      const isBooked = bookedSlots.includes(slotTimeStr);
            
            return (
              <p
                key={index}
                className={`slot-button ${selectedSlotTime === slotTimeStr ? 'selected-slot' : ''} ${isBooked ? 'disabled-slot' : ''}`}
                onClick={() => !isBooked && handleSlotClick(slotTimeStr)}
              >
                {slotTimeStr}
              </p>
            );
          })
      )}
                      <textarea
                        className="para3"
                        placeholder="Enter any additional information here..."
                        rows={4}
                        cols={50}
                        value={notes}
                        onChange={handleNotesChange}
                      ></textarea>

                      <button className="appointmentButton" onClick={handleBooking}>
                        Submit
                      </button>
                    </>
                  ) : (
                    <p>Please select a different date.</p>
                  )}
                </div>
              )}
            </div>

            {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
          </Modal.Body>
        </Modal>

        {bookingMessage && <p className="booking-message">{bookingMessage}</p>}

        <DoctorFeedBack docname={user.userName}/>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
