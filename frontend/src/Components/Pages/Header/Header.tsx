import { useState } from "react";
import "./Header.css";

function Header() {
    const [isHovered, setIsHovered] = useState(false);
  return (
    <div className='d-flex flex-column flex-md-row  rounded-lg px-3 px-md-4 px-lg-5 bg-primary'>

        {/* ----------left---------------- */}
        <div className='col-md-6 d-flex flex-column align-items-start justify-content-center g-4 py-5 mx-auto w-50 bg-primary'>
            <p className='fs-3 fs-md-4 fs-lg-5 text-white fw-semibold' style={{ lineHeight: '1.2' }}>
                Book Appointment 
                <div className="words">
                    <span>With Trusted Doctors</span>
                    <span>With experts you trust</span>
                    <span>For a better tomorrow</span>
                    <span>With skilled professionals</span>
                </div>
            </p>
            <div className="d-flex flex-column flex-md-row align-items-center  g-3 text-white small fw-light">
                <img src="src\assets\assets_frontend\group_profiles.png" alt="" />
                <p style={{marginLeft:'15px',color:'white'}}>Explore our comprehensive list of highly qualified doctors,<br className="d-none d-sm-block"/> schedule your appointment hassle-free.</p>
            </div>
            <a href="#speciality" className="d-flex align-items-center bg-white px-4 py-2 rounded-pill text-secondary text-sm mx-auto mx-md-0 mt-3" style={{gap:'6px',transition: 'transform 0.3s',transform: isHovered ? 'scale(1.05)' : 'scale(1)',textDecoration:'none'}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
               Explore Doctors <img className="w-3" src="src/assets/assets_frontend/arrow_icon.svg" alt="" />
            </a>
        </div>
        {/* ------------right-------------- */}
        <div className="col-md-6 position-relative">
            <img className="w-100 position-md-absolute bottom-0 rounded-lg" src="src/assets/assets_frontend/header_img.png" alt="" />
        </div>
    </div>



  )
}

export default Header