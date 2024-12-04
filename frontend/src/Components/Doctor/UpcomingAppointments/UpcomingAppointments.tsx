import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; // Import Modal from react-bootstrap
import { useSelector } from 'react-redux';
import './UpcomingAppointments.css';
import { cancelAppointmentByDoctor, completeAppointment } from '../../../services/DoctorService';
import { getUserById } from '../../../services/AccountService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineInfoCircle } from "react-icons/ai";




interface AppointmentDto {
  appointmentId: number;
  appointmentDate: string;
  appointmentTime: string;
  patientId: string;
  notes: string;
  status: string;
  prescription: string;
}

interface PatientDto {
  id: string;
  userName: string;
  email: string;
}

const UpcomingAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [patients, setPatients] = useState<{ [key: string]: PatientDto }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentAppointment, setCurrentAppointment] = useState<AppointmentDto | null>(null);
  const [prescription, setPrescription] = useState<string>('');
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false); // Modal visibility state
  const docID = useSelector((state: any) => state.user.userId);
const navigate=useNavigate();


  const fetchAppointments = async () => {
    try {
      const response = await axios.get<AppointmentDto[]>(`https://localhost:7280/api/Appointment/doctor/${docID}`);
      const bookedAppointments = response.data.filter(appointment => appointment.status === 'Scheduled');
      setAppointments(bookedAppointments);

      const uniquePatientIds = [...new Set(bookedAppointments.map(app => app.patientId))];
      const patientData = await Promise.all(uniquePatientIds.map(id => getUserById(id).then(res => res.data)));

      const mappedPatients = patientData.reduce((acc, patient) => {
        acc[patient.id] = patient;
        return acc;
      }, {} as { [key: string]: PatientDto });

      setPatients(mappedPatients);
    } catch (err) {
      setError('Failed to fetch appointments');
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [docID]);

  const cancel = async (appointmentId: number, email: string) => {
    try {
      await cancelAppointmentByDoctor(appointmentId, email);
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.appointmentId === appointmentId ? { ...appointment, status: 'Cancelled' } : appointment
        )
      );
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      setError('Failed to cancel appointment');
      toast.error('Failed to cancel appointment');
    }
  };

  const markCompleted = async (appointmentId: number, email: string) => {
    try {
      await completeAppointment(appointmentId, email);
      await fetchAppointments();
      toast.success('Appointment marked as completed');
    } catch (err) {
      setError('Failed to complete appointment');
      toast.error('Failed to complete appointment');
    }
  };

  const deleteAppointmentsByDate = async (date: string) => {
    try {
      const appointmentsToDelete = appointments.filter(appointment => formatDate(appointment.appointmentDate) === formatDate(date));
      await Promise.all(appointmentsToDelete.map(appointment => cancelAppointmentByDoctor(appointment.appointmentId, patients[appointment.patientId]?.email || '')));
      await fetchAppointments();
      toast.success('All appointments for the selected date have been deleted');
    } catch (err) {
      setError('Failed to delete appointments');
      toast.error('Failed to delete appointments');
    }
  };

  const updatePrescription = async (appointmentId: number, prescription: string) => {
    await axios.put(`https://localhost:7280/api/Appointment/${appointmentId}/prescription`, prescription, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentAppointment && prescription.trim() !== '') {
      try {
        await updatePrescription(currentAppointment.appointmentId, prescription);
        await markCompleted(currentAppointment.appointmentId, patients[currentAppointment.patientId]?.email || '');
        setCurrentAppointment(null);
        setPrescription('');
        setPrescriptionModalOpen(false); // Close the modal
        toast.success('Prescription sent and appointment marked as completed');
      } catch (error) {
        console.error('Error submitting prescription:', error);
        toast.error('Failed to submit prescription. Please try again.');
      }
    } else {
      toast.error('Prescription cannot be empty');
    }
  };

  const openPrescriptionModal = (appointment: AppointmentDto) => {
    setCurrentAppointment(appointment);
    setPrescriptionModalOpen(true);
  };

  const closePrescriptionModal = () => {
    setCurrentAppointment(null);
    setPrescription('');
    setPrescriptionModalOpen(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isToday = (dateString: string) => {
    const today = new Date().toLocaleDateString();
    return formatDate(dateString) === today;
  };

  const filteredAppointments = selectedDate
    ? appointments.filter(appointment => formatDate(appointment.appointmentDate) === formatDate(selectedDate))
    : appointments;

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

   const handlepatientdetails=(id:any)=>{
    navigate('/doctordashboard/patientdetails',{state:id});
   }

  return (
    <div className='doctors-display__table-container'>
      <ToastContainer />
      <h2>Upcoming Appointments</h2>

      <div className="date-filter">
        <label htmlFor="date">Filter by Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="pending-approvals__buttons" onClick={() => deleteAppointmentsByDate(selectedDate)}>Delete Appointments</button>
      </div>

      <table className="doctors-display__table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient Name</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan={6}>No appointments found</td>
            </tr>
          ) : (
            filteredAppointments.map((appointment) => {
              const patient = patients[appointment.patientId];
              const isConsultEnabled = isToday(appointment.appointmentDate);

              return (
                <tr key={appointment.appointmentId}>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{formatTime(appointment.appointmentTime)}</td>
                  <td>{patient?.userName || 'N/A'} 
                  <strong className="icon" onClick={() => handlepatientdetails(appointment.patientId)}>
                    
                  <AiOutlineInfoCircle />
                     
                  </strong>
                 
                  </td>
                  <td>{appointment.notes}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="pending-approvals__buttons"
                      onClick={() => cancel(appointment.appointmentId, patient?.email || '')}>
                      Cancel
                    </button>
                    <button
                      className="pending-approvals__buttons"
                      onClick={() => openPrescriptionModal(appointment)}
                      disabled={!isConsultEnabled || appointment.status === 'Consulted'}>
                      {appointment.status === 'Consulted' ? 'Consulted' : 'Consult'}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Prescription Modal */}
      <Modal show={isPrescriptionModalOpen} onHide={closePrescriptionModal} className="modal">
        <Modal.Header closeButton>
        <Modal.Title>
    Prescription for {currentAppointment && patients[currentAppointment.patientId] ? patients[currentAppointment.patientId].userName : 'Unknown Patient'}
</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePrescriptionSubmit} className="prescription-form">
            <div className="form-group">
              <label htmlFor="prescription">Enter Prescription</label>
              <textarea
                id="prescription"
                className="form-control"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription here"
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePrescriptionModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePrescriptionSubmit}>
            Submit Prescription
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpcomingAppointments;
