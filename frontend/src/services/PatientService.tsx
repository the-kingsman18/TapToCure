import axios from "axios"

//Get Patient details by PatientId
export const getPatientDetailsById=async (id:any)=>{
    return await axios.get(`https://tapeticure-gateway.azurewebsites.net/gateway/patient/${id}`);
}

//Update Patien details by patientid
export const updatePatientDetailsById=async (id:any,data:any)=>{
    return await axios.put(`https://tapeticure-gateway.azurewebsites.net/gateway/patient/${id}`,data);
}
