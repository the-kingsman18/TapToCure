import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home/home"
import Doctor from "./Components/Pages/DoctorsPage/doctor"
import Login from "./Components/Accounts/Login/login"
import About from "./Components/Pages/About/about"
import Contact from "./Components/Pages/Contact/contact"
import UserProfile from "./Components/Pages/UserProfile/userprofile";
import MyAppointments from "./Components/Pages/MyAppointments/MyAppointments"
import Appointment from "./Components/Pages/Appointment/Appointment"
import RegisterForm from "./Components/Accounts/Register/register"
import DoctorReg from "./Components/Accounts/DoctorRegister/doctorReg"
import AdminDashboard from "./Components/Admin/AdminDashBoard/AdminDashboard"
import Patients from "./Components/Admin/PatientsDisplay/Patients"
import Doctors from "./Components/Admin/DoctorsDisplay/Doctors"
import Statistics from "./Components/Admin/AdminSatistics/Statistics"
import PendingApprovals from "./Components/Admin/PendingApprovals/PendingApprovals"
import Navbar from "./Components/Navigations/Navbar";
import Patient from "./Components/Accounts/PatientRegister/Patient"
import ResetPassword from "./Components/Accounts/ResetPassword/ResetPassword"
import ProtectedRoute from "./services/ProtectedRoute";
import { UserRole } from "./services/roles";
import BMICalculator from "./Components/Pages/BMICalculator/BMICalculator";
import { Events } from "./Components/Doctor/Events/events";
import UpcomingAppointments from "./Components/Doctor/UpcomingAppointments/UpcomingAppointments";
import DoctorDashboard from "./Components/Doctor/DoctorDashboard/DoctorDashBoard";
import DoctorProfile from "./Components/Doctor/DoctorProfile/DoctorProfile";
import Sessions from "./Components/Doctor/Sessions/Sessions";
import AllAppointments from "./Components/Doctor/AllAppointments/AllAppointments";
import FeedbackForm from "./Components/Pages/Feedback/FeedBack";
import AdminHome from "./Components/Admin/AdminHome/Adminhome";
import PatientDetail from "./Components/Doctor/UpcomingAppointments/PatientDetails/Patientdetails";
import Footer from "./Components/Navigations/Footer";
const App = () => {
  return (<Router>
    <div className="mx-4 custom-sm-margin" style={{ backgroundColor: '#F8F9FA' }}>
      <Navbar />

      <Routes>
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feedback" element={< FeedbackForm />} />
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/doctor" element={<Doctor></Doctor>}></Route>
        <Route path="/doctor/:speciality" element={<Doctor></Doctor>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/about" element={<About></About>}></Route>
        <Route path="/contact" element={<Contact></Contact>}></Route>
        <Route path="/my-profile" element={<UserProfile></UserProfile>}></Route>
        <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
        <Route path="/doctorReg" element={<DoctorReg></DoctorReg>}></Route>
        <Route path="/patient" element={<Patient></Patient>}></Route>
        <Route path="/bmicalculator" element={<BMICalculator></BMICalculator>}> </Route>
      
{/* specific routes for user*/}
<Route element={<ProtectedRoute allowedRoles={[UserRole.Patient]} />}  >
        <Route path="/my-Appointments" element={<MyAppointments></MyAppointments>}></Route>
        <Route path="/my-appointment/:docId" element={<Appointment></Appointment>}></Route>
</Route>
{/* specific routes for admin*/}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.Admin]} />}  >
          <Route path="admindashboard" element={<AdminDashboard />}>
            <Route index element={<AdminHome/>}></Route>
            <Route path="adminhome" element={<AdminHome/>}></Route>
            <Route path="patients" element={<Patients />}></Route>
            <Route path="doctors" element={<Doctors />}></Route>
            <Route path="statistics" element={<Statistics />}></Route>
            <Route path="pending-approvals" element={<PendingApprovals />}></Route>
          </Route>
        </Route>


{/* specific routes for doctor*/}
        <Route element={<ProtectedRoute allowedRoles={[UserRole.Doctor]} />}>
          <Route path="doctordashboard" element={<DoctorDashboard />}>
            <Route index element={<Events/>}></Route>
            <Route path="patientdetails" element={<PatientDetail/>}></Route>
            <Route path="doctorappointments" element={< UpcomingAppointments />}></Route>
            <Route path="allappointments" element={<AllAppointments />}></Route>
            <Route path="doctorprofile" element={<DoctorProfile />}></Route>
            <Route path="doctorsessions" element={<Sessions />}></Route>
            <Route path="events" element={<Events />}></Route>
          </Route>
        </Route>
      </Routes>
      <Footer/>
    </div>
  </Router>
  )
}
export default App;