import { useState, useEffect } from 'react';
import './doctorsdisplay.css'; 
import { Doctor } from '../../Model/DoctorModel';
import { getapproveddoctors } from '../../../services/DoctorService';
import { getUserById } from '../../../services/AccountService';
import axios from 'axios';
import { IoCloseSharp } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doctors = () => {
  const [doctorNames, setDoctorNames] = useState<{ [key: string]: string }>({});
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Fetches Approved Doctors
  useEffect(() => {
    try {
      getapproveddoctors()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setDoctorsList(res.data);
            // Fetch the doctor names
            res.data.forEach((doctor: Doctor) => {
              fetchDoctorName(doctor.doctorId);
            });
          } else {
            setDoctorsList([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (ex) {
      console.log("Failed to fetch Doctors", ex);
    }
  }, []);

  // Fetch Doctor Name
  const fetchDoctorName = async (id: string) => {
    try {
      const res = await getUserById(id);
      setDoctorNames(prevState => ({
        ...prevState,
        [id]: res.data.userName
      }));
    } catch (err) {
      console.log("Error in fetching the doctor name", err);
      toast.error("Error fetching doctor name");
    }
  };

  // For Search Doctor By Specialization
  const filteredDoctors = doctorsList.filter(doctor =>
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch FeedBacks of each Doctor
  const fetchFeedbacks = async (doctorname: string) => {
    console.log("doctor", doctorname)
    try {
      const response = await axios.get<any[]>(`https://localhost:7247/api/Feedback/doctorname/${doctorname}`);
      setFeedback(response.data);
    } catch (err: any) {      
      toast.info(err.response.data.message);
    }
  };

  const handleFeedback = (doctorname: string) => {
    fetchFeedbacks(doctorname);
  };

  const closePopup = () => {
    setFeedback([]);
  };

  return (
    <div className="doctors-display">
      <div className="doctors-display__content">
        <h4>Doctors List</h4>
        <div className="doctors-display__filter">
          <input
            type="text"
            placeholder="Search by Specialization"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="doctors-display__search"
          />
        </div>
        <div className="doctors-display__table-container">
          <table className="doctors-display__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Degree</th>
                <th>License Number</th>
                <th>Experience</th>
                <th>Specialization</th>
                <th>State/City</th>
                <th>Clinic Address</th>
                <th>FeedBacks</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.doctorId}>
                    <td>{doctorNames[doctor.doctorId] || 'Loading...'}</td>
                    <td>{doctor.degree}</td>
                    <td>{doctor.medicalLicense}</td>
                    <td>{doctor.experience} years</td>
                    <td>{doctor.speciality}</td>
                    <td>{doctor.state}/{doctor.city}</td>
                    <td>{doctor.clinicAddress}</td>
                    <td> <button onClick={() => handleFeedback(doctorNames[doctor.doctorId])} className='view-button'> View Feedback </button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>No Doctors Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {feedback.length > 0  &&
          <div className="pending-approvals__overlay">
            <div className="pending-approvals__doctor-popup">
              <button className="pending-approvals__back-button" onClick={closePopup}>
                <IoCloseSharp />
              </button>
              {feedback.map((fb, index) => (
                <div key={index}>
                  <p>Appointment Id: {fb.appointmentId}</p>
                  <p>Patient: {fb.patientName}</p>
                  <p>Doctor: {fb.doctorName}</p>
                  <p>Doctor Rating: {fb.doctorRating}</p>
                  <p>Platform Rating: {fb.platformRating}</p>
                  <p>Comments: {fb.comments}</p>
                  <p>Given on: {fb.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        
        }
      </div>
      <ToastContainer />
    </div>
  );
};

export default Doctors;
