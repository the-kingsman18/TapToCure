import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2'; // Import both Bar and Line components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'; // Import necessary Chart.js components
import './statistics.css'
import { getallUsers } from '../../../services/AccountService';

import { getAllAppointments, getpendingdoctors } from '../../../services/DoctorService';
// import { useSelector } from 'react-redux'; // Assuming you're using Redux

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

interface Counts {
  patients: number;
  doctors: number;
  appointments: number;
  approvals: number;
}

const Statistics: React.FC = () => {
  const [counts, setCounts] = useState<Counts>({
    patients: 0,
    doctors: 0,
    appointments: 0,
    approvals: 0,
  });

// Get All Patients and Doctor Count
  useEffect(()=>{
    try{
      getallUsers()
      .then((res)=>{
         console.log(res.data);
        if(res.data && res.data.length>0){
          setCounts(prevCounts => ({
            ...prevCounts, // Spread the previous counts
          
           patients:res.data.filter((pat:any)=>pat.role==="patient").length,
           doctors:res.data.filter((pat:any)=>pat.role==="doctor").length, 
              
          }));   
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
 
// Pending Doctors Count
  useEffect(()=>{
    try{
      getpendingdoctors()
      .then((res)=>{
        //  console.log(res.data);
        if(res.data && res.data.length>0){
          setCounts(prevCounts => ({
            ...prevCounts, // Spread the previous counts
           approvals: res.data.length,             
          })); 
        }
       
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    catch(ex){
      console.log("Failed to fetch PendingDoctors",ex);
    }
    
  },[]);

  // Fetches All Appointment count
  useEffect(()=>{
    try{
      getAllAppointments()
      .then((res)=>{
         console.log(res.data);
        if(res.data && res.data.length>0){
          setCounts(prevCounts => ({
            ...prevCounts, // Spread the previous counts
            appointments: res.data.length
              
          }));   
        }      
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    catch(ex){
      console.log("Failed to fetch all appointments",ex);
    }
    
  },[]);

  // like setting Bar
  const data = {
    labels: [ 'Patients', 'Doctors', 'Appointments', 'Pending Approvals'],
    datasets: [
      {
        label: 'Count (Bar)',
        data: [ counts.patients, counts.doctors, counts.appointments, counts.approvals],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#FF9F40'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#FF9F40'],
      },
    ],
  };

  const lineData = {
    labels: [ 'Patients', 'Doctors', 'Appointments', 'Pending Approvals'],
    datasets: [
      {
        label: 'Count (Line)',
        data: [ counts.patients, counts.doctors, counts.appointments, counts.approvals],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true, // Fill under the line
        tension: 0.4, // Smooth the line
      },
    ],
  };

  return (
    <div className="statistics">
      
      <div className="statistics__content">
        <h4 className="statisticsHeader">Statistics</h4>
        <div className="statisticsChartSection">
          <Bar data={data} className="statisticsCanvas" />
          <Line data={lineData} className="statisticsCanvas" />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
