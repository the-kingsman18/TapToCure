import React from 'react';
import './admindashboard.css'; 
import { FaUserMd, FaClipboardCheck, FaChartBar, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard: React.FC = () => {



  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__sidebar">
    
        <ul>
          <li ><Link to={'adminhome'} style={{textDecoration:'none', color:'inherit'}}><FaTachometerAlt /> Dashboard</Link></li>
            
          <li ><Link to={'patients'} style={{textDecoration:'none', color:'inherit'}}><FaUser /> Patients</Link></li>

          <li ><Link to={'doctors'} style={{textDecoration:'none', color:'inherit'}}><FaUserMd /> Doctors</Link></li>
          
          <li ><Link to={'pending-approvals'} style={{textDecoration:'none', color:'inherit'}}><FaClipboardCheck /> Pending Approvals</Link></li>
          
          <li ><Link to={'statistics'} style={{textDecoration:'none', color:'inherit'}}><FaChartBar /> Statistics</Link></li>
          
        </ul>
      </div>
      <div className="admin-dashboard__content">
        <Outlet></Outlet>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
