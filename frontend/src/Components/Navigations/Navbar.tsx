import  { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/UserSlicer"; // Update this path as needed
import "./Navbar.css"; // Optional for custom styles
import { getUserById } from "../../services/AccountService";

const Navbar = () => {
  const isLoggedIn = useSelector((state:any) => state.user.isLogIn);
  const role = useSelector((state:any) => state.user.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [name,setUsername]=useState('');

  var id = useSelector((state:any)=>state.user.userId);
  useEffect(()=>{
    try{
      getUserById(id)
      .then(res=>{
        setUsername(getInitials(res.data.userName));
      })
      .catch(()=>{
        
      })
    }
    catch(ex){
      console.log("Error in fetching the Userdetails by Id",ex);
    }
   
  },[])


  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

const getInitials=(loginName:string)=>{
  const names=loginName.split(" ");
  const initials=names.map((n)=>n[0]).join("");
  return initials.toUpperCase();
}


  return (
    <div
      className="d-flex align-items-center justify-content-between mb-4"
      style={{
        fontSize: "0.875rem",
        borderBottom: "2px solid blue",
        padding: "0.5rem 1rem",
      }}
    >
      <h3>
        <NavLink
          to="/"
          className="navbar-brand"
          style={{ width: "11rem", cursor: "pointer", color: "blueviolet" }}
        >
          TapToCure {role === "admin" && <span className="text-danger"></span>}
        </NavLink>
      </h3>

      {/* Navbar container */}
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          aria-controls="navbarNav"
          aria-expanded={showMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${showMenu ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Default Patient Links */}
            {!isLoggedIn || role === "patient" ? (
              <>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/doctor" className="nav-link">
                    All Doctors
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className="nav-link">
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/contact" className="nav-link">
                    Contact
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/bmicalculator" className="nav-link">
                    BMI Calculator
                  </NavLink>
                </li>
              </>
            ) : null}

            {/* Role-specific Links for logged in users */}
            {isLoggedIn && role === "doctor" && (
              <li className="nav-item">
                <NavLink to="/doctordashboard" className="nav-link">
                  Doctor
                </NavLink>
              </li>
            )}
            {isLoggedIn && role === "admin" && (
              <li className="nav-item">
                <NavLink to="/admindashboard" className="nav-link">
                  Administrator
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* User profile section */}
      <div>
        {isLoggedIn ? (
          <div
            className="d-flex align-items-center gap-2 position-relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* <img src="src/assets/assets_frontend/person-fill.svg" alt="Profile" height="25px" style={{ cursor: "pointer" }} /> */}
            {
              role==='admin'?<div className="profile-img">AD</div>:<div className="profile-img">{name}</div>
            }
            
            {showDropdown && (
              <div className="dropdown-menu position-absolute top-100 end-0 mt-1 fs-6 fw-medium text-secondary">
                {role === "patient" && (
                  <>
                    <p
                      onClick={() => navigate("/my-profile")}
                      className="dropdown-item hover-text-black"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/my-appointments")}
                      className="dropdown-item hover-text-black"
                    >
                      My Appointments
                    </p>
                  </>
                )}
                {/* For doctor and admin, only show logout option */}
                <p onClick={handleLogout} className="dropdown-item hover-text-black">
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="login-button">
            Login/SignUp
          </button>
        )}
      </div>

    </div>
  );
};

export default Navbar;
