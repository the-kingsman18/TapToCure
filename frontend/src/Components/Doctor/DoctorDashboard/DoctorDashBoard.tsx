import React, { useEffect, useState } from 'react';
import './DoctorDashboard.css'; // Separate CSS for styling
import { FaClipboardCheck, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { IoIosTimer } from "react-icons/io";
import {  Outlet, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../../../services/AccountService';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
const DoctorDashboard: React.FC = () => {
  const id = useSelector((state: any) => state.user.userId);
  const [isApproved, setApproved] = useState<string | null>(null);
  const [warning, ] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDoctorById(id).then((res) => {
      setApproved(res.data.status);
    });
  }, [id]);

  const handleNavigation = (path: string) => {
    if (path === 'events' || isApproved === 'approved') {
      navigate(path);
    } else {
      toast.warning('You are not approved to access this section.');
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="doctor-dashboard__sidebar">
        <ul>
          <li onClick={() => handleNavigation('events')}><FaTachometerAlt /> Dashboard</li>
          <li onClick={() => handleNavigation('doctorappointments')}><FaClipboardCheck /> Upcoming Appointments</li>
       
          <li onClick={() => handleNavigation('allappointments')}><FaClipboardCheck /> All Appointments</li>
       
          
         
          <li onClick={() => handleNavigation('doctorprofile')}><FaUser /> My Profile</li>
          <li onClick={() => handleNavigation('doctorsessions')}><IoIosTimer /> Sessions</li>
   </ul>
      </div>
      
      <div className="doctor-dashboard__content">
        {warning && <div className="warning-message">{warning}</div>}
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard;
