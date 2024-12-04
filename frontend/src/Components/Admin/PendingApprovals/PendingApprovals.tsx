import React, { useState, useEffect } from 'react';
import './pendingapprovals.css'; 
import { approvedoctor, getpendingdoctors, rejectdoctor } from '../../../services/DoctorService';
import { Doctor } from '../../Model/DoctorModel';
import { IoCloseSharp } from "react-icons/io5";
import { getallUsers } from '../../../services/AccountService';

const PendingApprovals: React.FC = () => {
 
  const [PendingDoctorApprovals, setPendingDoctorApprovals] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [users, setUsers] = useState<any>([]);

  // Fetches Doctor Details to Apporve after Register
  useEffect(() => {
    try {
      getpendingdoctors()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setPendingDoctorApprovals(res.data);
          } else {
            setPendingDoctorApprovals([]);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (ex) {
      console.log("Failed to fetch PendingDoctors", ex);
    }
    getallUsers().then((response) => {
      setUsers(response.data);
    })
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const closePopup = () => {
    setSelectedDoctor(null);
  };

  const handleApprove = (doctorId: any) => {
    // Logic to approve the doctor
    try {
      const user = users.find((u: { id: any; }) => u.id === doctorId);
      if (user) {
        console.log(user.email)
        approvedoctor(doctorId, user.email); 
        console.log(`Approving doctor with ID: ${doctorId} and email: ${user.email}`);
      } else {
        console.error('User not found for the given doctor ID');
      }
      // Optionally refetch doctors or update state
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
    closePopup();
  };

  const handleReject = (doctorId: any) => {
    // Logic to reject the doctor
    try {
      const user = users.find((u: { id: any; }) => u.id === doctorId);
      if (user) {
        console.log(user.email)
      rejectdoctor(doctorId, user.email);
        console.log(`Approving doctor with ID: ${doctorId} and email: ${user.email}`);
      } else {
        console.error('User not found for the given doctor ID');
      }
      // Optionally refetch doctors or update state
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
    closePopup();
  };

  return (
    <div className="pending-approvals">
      
      
      <div className="pending-approvals__content">
        <h4>Pending Doctor Approvals</h4>
        <div className="pending-approvals__cards-container">
          {PendingDoctorApprovals.map((doctor) => {
            const user = users.find((u: { id: any; }) => u.id === doctor.doctorId);
            return (
              <div key={doctor.doctorId} className="pending-approvals__doctor-card" onClick={() => handleSelectDoctor(doctor)}>
                <img src={doctor.imageURL} alt='doctorimage' className='imagecontainer'></img>
                <h2>Dr. {user?.userName || "N/A"}</h2> 
                <h6>Specialization: {doctor.speciality}</h6>
                <h6>Location: {doctor.clinicAddress}</h6>
              </div>
            );
          })}
        </div>

        {selectedDoctor && (
          <div className="pending-approvals__overlay">
            <div className="pending-approvals__doctor-popup">
              <button className="pending-approvals__back-button" onClick={closePopup}>
                <IoCloseSharp />
              </button>
              {(() => {
                const user = users.find((u: { id: any; }) => u.id === selectedDoctor.doctorId);
                return (
                  <>
                    <h2>{user?.userName || "N/A"}</h2> 
                    <p>Email: {user?.email || "N/A"}</p>
                  </>
                );
              })()}
              <p>Specialization: {selectedDoctor.speciality}</p>
              <p>Medical License: {selectedDoctor.medicalLicense}</p>
              <p>Years of Experience: {selectedDoctor.experience}</p>
              <p>State: {selectedDoctor.state}</p>
              <p>Location: {selectedDoctor.clinicAddress}</p>
              <div className="pending-approvals__buttons">
                <button className="approve-button" onClick={() => handleApprove(selectedDoctor.doctorId)}>Approve</button>
                <button className="reject-button" onClick={() => handleReject(selectedDoctor.doctorId)}>Reject</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;
