import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getallUsers, getDoctor } from "../../../services/AccountService";
import './TopDoctors.css';
// Define TypeScript interfaces for doctor and user data
interface User {
  id: string;
  userName: string;
}
interface Doctor {
  doctorId: string;
  name: string;
  imageURL: string;
  speciality: string;
}
const TopDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getDoctor().then((response) => {
      setDoctors(response.data);
    });
    getallUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);
  const handlenavigate = () => {
    navigate('/doctor');
  };
  return (
    <div className="d-flex flex-column align-items-center gap-4 my-2 mx-md-3 text-dark">
      <h3>Doctors to Book</h3>
      <p className="col-4 text-center small">
        Browse through our extensive list of trusted doctors.
      </p>
      <div className="container-fluid px-3 px-sm-0 py-5">
        <div className="doctorGrid">
          {doctors.slice(0, 10).map((item, index) => {
            // Find the user for the doctor
            const user = users.find((u) => u.id === item.doctorId);
            return (
              <div key={index} className="cardWrapper">
                <div
                  className="border border-primary rounded-3 overflow-hidden cursor-pointer"
                  style={{ transition: 'transform 0.5s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="p-4" onClick={() => navigate('/doctor')}>
                    <div className="d-flex align-items-center gap-2 text-sm text-center text-success">
                      <p className="w-2 h-2 bg-success rounded-circle"></p>
                      <p style={{ backgroundColor: 'rgb(234, 239, 255)', opacity: 'var(--tw-bg-opacity)' }}>
                        <img src={item.imageURL} alt="" className="img-fluid" style={{ height: '200px' }} />
                      </p>
                    </div>
                    <p className="text-lg fw-medium" style={{ color: 'black' }}>
                      {user ? user.userName : item.name}
                    </p>
                    <p className="text-sm" style={{ color: '#6C757D' }}>
                      {item.speciality}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="px-4 py-2 mt-3"
        style={{
          backgroundColor: '#F0F8FF',
          color: '#6C757D',
          borderRadius: '20px',
        }}
        onClick={handlenavigate}
      >
        More
      </button>
    </div>
  );
};
export default TopDoctors;




