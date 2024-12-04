import React, { useEffect, useState } from 'react';
import '../PatientDetails/Patientdetails.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPatientDetailsById } from '../../../../services/PatientService';
import { toast } from 'react-toastify';

interface PatientDetails {
  patienId: number;
  bloodGroup: string;
  height: string;
  weight: string;
  address: string;
  city: string;
  emergencyContact: string;
}

const PatientDetail: React.FC = () => {
  const [PatientInfo, setPatientInfo] = useState<PatientDetails[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = location.state;


  useEffect(() => {
    if (!patientId) {
      toast.error('Patient ID not found');
      navigate('/doctordashboard/doctorappointments');
      return;
    }

    getPatientDetailsById(patientId)
      .then(res => {
        if (Array.isArray(res.data)) {
          setPatientInfo(res.data);
        } else {
          setPatientInfo([res.data]); // Wrap in array if response is a single object
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [patientId, navigate]);

  return (
    <div className="modal-overlay">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => navigate('/doctordashboard/doctorappointments')}>
          &times;
        </button>
        <h2 className="modal-title">Patient Details</h2>
        {PatientInfo.length > 0 ? (
          PatientInfo.map((patient) => (
            <div key={patient.patienId} className="modal-content">
              <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
              <p><strong>Height:</strong> {patient.height}</p>
              <p><strong>Weight:</strong> {patient.weight}</p>
              <p><strong>Address:</strong> {patient.address}</p>
              <p><strong>City:</strong> {patient.city}</p>
              <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
            </div>
          ))
        ) : (
          <p>Loading patient details...</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;