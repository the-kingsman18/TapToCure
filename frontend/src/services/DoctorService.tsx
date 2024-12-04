import axios from "axios";

//Approve doctor and send email
  export const approvedoctor = async (id:any, email:string) => {
    try {
      const res = await axios.put(
        `https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/approval/${id}`,
         email , // Send email as an object
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return res;
    } catch (error) {
      console.error("Error approving doctor:", error);
      throw error;
    }
  };

//Reject doctor and send email  
  export const rejectdoctor = async (id:any, email:string) => {
    try {
      const res = await axios.put(
        `https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/reject/${id}`,
         email , // Send email as an object
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return res;
    } catch (error) {
      console.error("Error rejecting :", error);
      throw error;
    }
  };

//Get all approved doctors
export const getapproveddoctors=async ()=>{
    return await axios.get("https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/approved");
}

//Get all pending doctors
  export const getpendingdoctors=async ()=>{
    return await axios.get("https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/pending");
  }

  //Get slots by doctor id
  export const getslots = async (id:any)=>{
    return await axios.get(`https://tapeticure-gateway.azurewebsites.net/gateway/slot/bydoctor/${id}`);
  }

  
//Add Slots
 export const addSlot = (values:any) => {
  return axios.post(`https://tapeticure-gateway.azurewebsites.net/gateway/slot/AddSlot`,values);
}

//Get appointment by patient
  export const getAppointmentByPatient=async (id:any)=>{
    return await axios.get(`https://tapeticure-gateway.azurewebsites.net/gateway/appointment/patient/${id}`);
  }

//check doctor availability on specific date
  export const checkAvailability=async (id:any,date:any)=>{
    return await axios.get(`https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/CheckAvailability?doctorId=${id}&date=${date}`);
  }

//Cancel Appointment by patient side and send email 
export const cancelAppointment=async (id:any,email: any)=>{
  return await axios.put(`https://tapeticure-gateway.azurewebsites.net/gateway/Appointment/Cancel/${id}`,email,{
      headers:{
        'Content-Type':'application/json'
      }
  });
}

//Consulted Appointment and send email
export const completeAppointment = async (id: any, email: string) => {
  return await axios.put(`https://tapeticure-gateway.azurewebsites.net/gateway/Appointment/Complete/${id}`, email, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

//add prescription
export const updatePrescription = async (id: any, prescription: string) => {
  return await axios.put(
    `https://tapeticure-gateway.azurewebsites.net/gateway/Appointment/${id}/prescription`,
    { prescription },  // The prescription data wrapped in an object
    {
      headers: {
        'Content-Type': 'application/json',  // Ensure the correct content type
      }
    }
  );
};

//Cancel Appointment by doctor
export const cancelAppointmentByDoctor=async (id:any,email:string)=>{
  return await axios.put(`https://tapeticure-gateway.azurewebsites.net/gateway/Appointment/Cancel/${id}`,email,{
    headers:{
     'Content-Type':'application/json'
    }
  });
}

//set availability for particular date
export const setAvailability = async (doctorId: any, notAvailableDate: any) => {
  const data = {
    doctorId: doctorId,
    notAvailableDate: notAvailableDate
  };

  try {
    const response = await axios.post("https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/SetAvailability", data);
    return response.data;
  } catch (error) {
    console.error('Error in createAppointment:', error);
    throw error; // Rethrow error for component to handle it
  }
};


//Get all doctors from users table
export const getDoctorsFromUsers=async ()=>{
  return await axios.get('https://tapeticure-gateway.azurewebsites.net/gateway/Accounts/role/doctor');
}

//provide feedback 
export const giveFeedback = (values:any) => {
  return axios.post(`https://localhost:7247/api/Feedback`,values);
}

//delete a slot
export const deleteSlot = (id:any) => {
  return axios.delete(`https://tapeticure-gateway.azurewebsites.net/gateway/Slot/${id}`);
}

//get all appointments
export const  getAllAppointments= async ()=>{
  return await axios.get("https://tapeticure-gateway.azurewebsites.net/gateway/appointment");
}
