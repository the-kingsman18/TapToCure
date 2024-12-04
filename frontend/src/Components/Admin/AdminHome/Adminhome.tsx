import React, { useEffect, useState } from 'react';
import './Adminhome.css'; 
import { FaUserMd, FaClipboardCheck, FaChartBar, FaUser } from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom';
import { getapproveddoctors, getpendingdoctors } from '../../../services/DoctorService';
import { User } from '../../Model/UserModel';
import { getallUsers } from '../../../services/AccountService';


const AdminHome: React.FC = () => {
const [ApprovedDoctors,setApprovedDoctors]=useState(0);
const [NoOfPendingDoctors,setNoOfPendingDoctors]=useState(0);
 const [Patients,setPatients]=useState<User[]>([]);

 const navigate=useNavigate();

 //  
useEffect(()=>{
  try{
  
      getapproveddoctors()
    .then((res)=>{
     
      if(res.data && res.data.length>0){
        setApprovedDoctors(res.data.length);
      }
      else{
        setApprovedDoctors(0);
      }
    })
    .catch(()=>{
      
    })
  }
  catch(ex){
    
  }
  
},[]);



 // Get Count of Pending Approval Doctors
  useEffect(()=>{
    try{
      getpendingdoctors()
      .then((res)=>{
        
        if(res.data && res.data.length>0){
          setNoOfPendingDoctors(res.data.length);
        }
        else{
          setNoOfPendingDoctors(0);
        }
      })
      .catch(()=>{
       
      })
    }
    catch(ex){
     
    }
    
  },[]);
 

// Patients Count
useEffect(()=>{
  try{
    getallUsers()
    .then((res)=>{
     
      if(res.data && res.data.length>0){
        setPatients(res.data.filter((pat:any)=>pat.role==="patient"));
      }
      else{
        setPatients([]);
      }
    })
    .catch(()=>{
      
    })
  }
  catch(ex){
    
  }
  
},[]);

 


  return (
    <div className="admin-dashboard">
      
      <div className="admin-dashboard__content">
      
        <div className="admin-dashboard__options">
          <div className="admin-dashboard__option card" onClick={() => navigate('/admindashboard/patients')}>
            <FaUser className="admin-dashboard__icon" />
            <p>Total Patients</p>
            <span>{Patients.length}</span>
          
          </div>
          
          <div className="admin-dashboard__option card" onClick={() =>  navigate('/admindashboard/doctors')}>
            <FaUserMd className="admin-dashboard__icon" />
            <p>Approved Doctors</p>
            <span>{ApprovedDoctors}</span>
          </div>
          <div className="admin-dashboard__option card" onClick={() =>  navigate('/admindashboard/pending-approvals')}>
            <FaClipboardCheck className="admin-dashboard__icon" />
            <p>Pending Doctor Approvals</p>
            <span>{NoOfPendingDoctors}</span>
          </div>
          <div className="admin-dashboard__option card" onClick={() => navigate('/admindashboard/statistics')}>
            <FaChartBar className="admin-dashboard__icon" />
            <p>View Statistics</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminHome;
