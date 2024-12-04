import React, { useState, useEffect } from 'react';
import './patientdisplay.css'; // Separate CSS
import { getallUsers } from '../../../services/AccountService';
import { User } from '../../Model/UserModel';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>('');

  // Fetches All Patients 
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
      .catch((err)=>{
        console.log(err);
      })
    }
    catch(ex){
      console.log("Failed to fetch allUsers",ex);
    }
    
  },[]);

  // Filtered By Email
  const filteredPatients = patients.filter(patient =>
    patient.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="patients-display-container">
    

      {/* Content */}
      <div className="patients-display-content">
        <h4>Patients List</h4>

        {/* Search Filter */}
        <div className="patients-display-filter-container">
          <input
            type="text"
            className="patients-display-search-bar"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
          />
        </div>

        {/* Table Container for Scrollability */}
        <div className="patients-display-table-container">
          <table className="patients-display-table">
            <thead>
              <tr>
                <th className="patients-display-table-header">Patient ID</th>
                <th className="patients-display-table-header">Name</th>
                <th className="patients-display-table-header">Email</th>
                <th className="patients-display-table-header">Phone No</th>
                <th className="patients-display-table-header">Gender</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="patients-display-table-row">
                  <td className="patients-display-table-cell">{patient.id}</td>
                  <td className="patients-display-table-cell">{patient.userName}</td>
                  <td className="patients-display-table-cell">{patient.email}</td>
                  <td className="patients-display-table-cell">{patient.mobileNumber}</td>
                  <td className="patients-display-table-cell">{patient.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
