import  { useState } from 'react';
import './banner.css';
import { useNavigate } from 'react-router-dom';

const Banner = () => {


  const token = localStorage.getItem("token");

  const [showWhyChooseUs, ] = useState(token);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register');
  };

  return (
    <div className='flex-custom primary'>
      {/* -------------leftside---------------- */}
      <div className='flex-1-custom'>
        <div className='text-responsive'>
          {showWhyChooseUs ? (
            <>
              <p style={{ marginBottom: '-0.25rem', color: 'white' }}>Why Choose Us</p>
              <p className='mt-2' style={{ color: 'white' }}>We provide the best healthcare services</p>
              <ul className='small-text' style={{ color: 'white', marginTop: '1rem' }}>
                <li>Experienced and certified doctors</li>
                <li>State-of-the-art medical facilities</li>
                <li>Personalized care and attention</li>
              </ul>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '-0.25rem', color: 'white' }}>Book Appointment</p>
              <p className='mt-2' style={{ color: 'white' }}>With 100+ Trusted Doctors</p>
              <button className='btn12' onClick={handleNavigate}>Create Account</button>
            </>
          )}
        </div>
      </div>
      {/* ================rightside=---------------- */}
      <div className='hidden-md-block'>
        <img className='full-absolute-bottom-right' src='src/assets/assets_frontend/appointment_img.png' alt="" />
      </div>
    </div>
  );
};

export default Banner;
