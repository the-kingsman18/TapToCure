import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './doctor.css';
import { getDoctor, getallUsers } from "../../../services/AccountService";
import LoginModal from "../../Accounts/LoginModal";

import { statesData } from "../../../assets/data"; // Adjust the import path as needed
import { FaFilter } from "react-icons/fa";

interface State {
  name: string;
  cities: { name: string }[];
}

const Doctor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setId] = useState<number | null>(null);
  const [filterDoc, setFilterDoc] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [, setDoctors] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDoctor, ] = useState<string>("");
  const [, setDoctorNames] = useState<string[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const { speciality } = useParams<{ speciality: string }>();
  
  
  const handleNavigate = (doctorId: number) => {
    if (!token) {
      // Open the modal if the user is not logged in
      setIsModalOpen(true);
    } else {
      // Navigate to the appointment page if logged in
      navigate(`/my-appointment/${doctorId}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  
  };

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login'; // Adjust this to your routing method
  };

  const applyFilter = () => {
    getDoctor().then((response) => {
      let filteredDoctors = response.data;

      // Apply filter based on speciality
      if (speciality) {
        filteredDoctors = filteredDoctors.filter((doc: any) => doc.speciality === speciality);
      }

      // Apply filter based on state
      if (selectedState) {
        filteredDoctors = filteredDoctors.filter((doc: any) => doc.state === selectedState);
      }

      // Apply filter based on city
      if (selectedCity) {
        filteredDoctors = filteredDoctors.filter((doc: any) => doc.city === selectedCity);
      }

      // Apply filter based on doctor name
      if (selectedDoctor) {
        filteredDoctors = filteredDoctors.filter((doc: any) => 
          doc.userName.toLowerCase().includes(selectedDoctor.toLowerCase())
        );
      }

      setFilterDoc(filteredDoctors);
      setDoctors(response.data);
      setDoctorNames(response.data.map((doc:any) => doc.userName));
    });

    // Fetch all users
    getallUsers().then((response) => {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, selectedState, selectedCity, selectedDoctor]);

  return (
    <div>
      {/* <Navbar /> */}
      <p className="pstyle">Browse through the doctor specialists</p>

      {/* Filter Section */}
      <div className="filter-container">
        {/* State Filter */}
        <div className="filter-item">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity(""); // Reset city when state changes
            }}
          >
            <option value="">Select State</option>
            {statesData.map((state: State) => (
              <option key={state.name} value={state.name}>{state.name}</option>
            ))}
          </select>
          <button 
            className="filter-icon-button" 
            onClick={applyFilter} 
            title="Filter by state"
          >
            <FaFilter className="filter-icon" />
          </button>
        </div>

        {/* City Filter */}
        {selectedState && (
          <div className="filter-item">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select City</option>
              {statesData.find((state) => state.name === selectedState)?.cities.map((city) => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
            <button 
              className="filter-icon-button" 
              onClick={applyFilter} 
              title="Filter by city"
            >
              <FaFilter className="filter-icon" />
            </button>
          </div>
        )}
        </div>
      
      <div className="flex-responsive">
        <div className="columnStyle">
          {/* Specialty Filters */}
          <p 
            onClick={() => speciality === 'General physician' ? navigate('/doctor') : navigate('/doctor/General physician')}
            style={{
              backgroundColor: speciality === "General physician" ? 'indigo' : 'transparent',
              color: speciality === "General physician" ? 'white' : 'inherit',
            }}
          >
            General physician
          </p>
          <p 
            onClick={() => speciality === 'Gynecologist' ? navigate('/doctor') : navigate('/doctor/Gynecologist')}
            style={{
              backgroundColor: speciality === "Gynecologist" ? 'indigo' : 'transparent',
              color: speciality === "Gynecologist" ? 'white' : 'inherit',
            }}
          >
            Gynecologist
          </p>
          <p 
            onClick={() => speciality === 'Dermatologist' ? navigate('/doctor') : navigate('/doctor/Dermatologist')}
            style={{
              backgroundColor: speciality === "Dermatologist" ? 'indigo' : 'transparent',
              color: speciality === "Dermatologist" ? 'white' : 'inherit',
            }}
          >
            Dermatologist
          </p>
          <p 
            onClick={() => speciality === 'Pediatricians' ? navigate('/doctor') : navigate('/doctor/Pediatricians')}
            style={{
              backgroundColor: speciality === "Pediatricians" ? 'indigo' : 'transparent',
              color: speciality === "Pediatricians" ? 'white' : 'inherit',
            }}
          >
            Pediatricians
          </p>
          <p 
            onClick={() => speciality === 'Neurologist' ? navigate('/doctor') : navigate('/doctor/Neurologist')}
            style={{
              backgroundColor: speciality === "Neurologist" ? 'indigo' : 'transparent',
              color: speciality === "Neurologist" ? 'white' : 'inherit',
            }}
          >
            Neurologist
          </p>
          <p 
            onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctor') : navigate('/doctor/Gastroenterologist')}
            style={{
              backgroundColor: speciality === "Gastroenterologist" ? 'indigo' : 'transparent',
              color: speciality === "Gastroenterologist" ? 'white' : 'inherit',
            }}
          >
            Gastroenterologist
          </p>
        </div>

        <div className="doctorCard">
          
          {filterDoc.map((item: any, index: number) => {
            const user = users.find(u => u.id === item.doctorId);
            return (
              <div className="col-6 col-md-12" key={index}>
                <div 
                  className="border border-primary rounded-3 overflow-hidden cursor-pointer"
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="p-4" onClick={() => { 
                    setId(item.doctorId); 
                    handleNavigate(item.doctorId);
                  }}>
                    <div className="d-flex align-items-center text-sm text-center text-success">
                      <div style={{ backgroundColor: 'rgb(234, 239, 255)', opacity: 'var(--tw-bg-opacity)' }}>
                        <img src={item.imageURL} alt="" height={'200px'} width={'230px'} />
                      </div>
                      <p className="w-2 h-2 bg-success rounded-circle"></p>
                    </div>
                    <p className="text-lg fw-medium" style={{ color: 'Black' }}>Dr. {user?.userName}</p>
                    <p className="text-sm" style={{ color: 'gray-600' }}>{item.speciality}</p>
                    <p className="text-sm" style={{ color: 'gray-600' }}>{item.city}, {item.state}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={closeModal} onLogin={handleLogin} />
    </div>
  );
}

export default Doctor;
