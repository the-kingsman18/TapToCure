import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './AllAppointments.css';
import { getUserById } from '../../../services/AccountService';
 
interface AppointmentDto {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  patientId: string;
  notes: string;
  status: string;
  prescription:string
}
 
interface PatientDto {
  id: string;
  email: string;
  userName: string; // Assuming this field exists
}
 
const AllAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [patients, setPatients] = useState<{ [key: string]: PatientDto }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const docId = useSelector((state: any) => state.user.userId);
 
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get<AppointmentDto[]>(`https://localhost:7280/api/Appointment/doctor/${docId}`);
        setAppointments(response.data);
 
        // Fetch patients based on the patientId from the appointments
        const patientIds = [...new Set(response.data.map(app => app.patientId))];
        const patientPromises = patientIds.map(id =>
          getUserById(id)
          
        );
        const patientResponses = await Promise.all(patientPromises);
        const patientsData = patientResponses.reduce((acc, res) => {
          acc[res.data.id] = res.data;
          return acc;
        }, {} as { [key: string]: PatientDto });
        setPatients(patientsData);
      } catch (err: any) {
        console.log(err.message);
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
 
    fetchAppointments();
  }, [docId]);
 
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format to local date string (MM/DD/YYYY)
  };
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
<div className='doctors-display__table-container'>
<h2>All Appointments</h2>
<table className="doctors-display__table">
<thead>
<tr>
<th>Date</th>
<th>Time</th>
<th>Patient Name</th>
<th>Prescriptions</th>
<th>Status</th>
</tr>
</thead>
<tbody>
          {appointments.length === 0 ? (
<tr>
<td colSpan={5}>No appointments yet</td>
</tr>
          ) : (
            appointments.map((appointment) => {
              const patient = patients[appointment.patientId];
              return (
<tr key={appointment.id}>
<td>{formatDate(appointment.appointmentDate)}</td>
<td>{formatTime(appointment.appointmentTime)}</td>
<td>{patient ? patient.userName : 'Loading...'}</td>
<td>{appointment.prescription}</td>
<td>{appointment.status === 'available' || appointment.status === 'cancelled' ? 'cancelled' : appointment.status}</td>
</tr>
              );
            })
          )}
</tbody>
</table>
</div>
  );
};
 
export default AllAppointments;