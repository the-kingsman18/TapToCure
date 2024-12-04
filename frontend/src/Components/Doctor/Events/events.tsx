import { FaUserMd, FaClipboardCheck, FaUser } from 'react-icons/fa';
import { IoIosTimer } from "react-icons/io";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Events = () => {

  const docId = useSelector((state:any)=>state.user.userId);

  const [allAppointments, setAllAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`https://localhost:7280/api/Appointment/doctor/${docId}`);
        const appointments = response.data;
        setAllAppointments(appointments.length);

        const bookedAppointments = appointments.filter((appointment:any) => appointment.status === 'Scheduled');
        setUpcomingAppointments(bookedAppointments.length);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="admin-dashboard__content">

      
      <div className="admin-dashboard__options">
        
        <div className="admin-dashboard__option card" onClick={() => navigate('/doctordashboard/allappointments')}>
          <FaUser className="admin-dashboard__icon" />
          <p>All Appointments</p>
          <span>{allAppointments}</span>
        </div>

        <div className="admin-dashboard__option card" onClick={() => navigate('/doctordashboard/doctorappointments')}>
          <FaUserMd className="admin-dashboard__icon" />
          <p>Upcoming Appointments</p>
          <span>{upcomingAppointments}</span>
        </div>

        <div className="admin-dashboard__option card" onClick={() => navigate('/doctordashboard/doctorprofile')}>
          <FaClipboardCheck className="admin-dashboard__icon" />
          <p>My Profile</p>
        </div>

        <div className="admin-dashboard__option card" onClick={() => navigate('/doctordashboard/doctorsessions')}>
          <IoIosTimer className="admin-dashboard__icon" />
          <p>Sessions</p>
        </div>
      
      </div>
      
    </div>
  );
};
