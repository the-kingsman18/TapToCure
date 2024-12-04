import axios from "axios";
//https://tapeticure-gateway.azurewebsites.net/index.html
//user registration
export const registerUser = (userAccount:any) => {
    return axios.post("https://tapeticure-gateway.azurewebsites.net/gateway/Accounts/register",userAccount);
}

//register as  a patient
export const registerPatient = (id:any,userAccount:any) => {
    return axios.post(`https://tapeticure-gateway.azurewebsites.net/gateway/patient/${id}`,userAccount);
}

//request otp
export const requestOtp = (email:string) => {
    return axios.post("https://tapeticure-gateway.azurewebsites.net/gateway/Accounts/generate", { email });
};


//otp verification
export const verifyOtp = (email:string, otp:string) => {
    return axios.post("https://tapeticure-gateway.azurewebsites.net/gateway/Accounts/verify", {
        Email: email,
        OtpCode: otp
    });
};

//register as a doctor 
export const registerDoctor =async (userAccount:any,id:any) => {
    console.log(userAccount,id);
    return await axios.post(`https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/${id}`,userAccount, {
        headers: {
            'Content-Type': 'multipart/form-data'
          }
    });
}

//get all approved doctors
export const getDoctor = () => {
    return axios.get("https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/approved",);
}


//get all users
export const getallUsers = async () => {
    return await axios.get("https://tapeticure-gateway.azurewebsites.net/gateway/accounts/GetAllUser");
}

//getting user by id
export const getUserById =  (id:any) => {
    return  axios.get(`https://tapeticure-gateway.azurewebsites.net/gateway/accounts/${id}`);
}

//getting doctor by id
export const getDoctorById =  (id:any) => {
    return  axios.get(`https://tapeticure-gateway.azurewebsites.net/gateway/Doctors/${id}`);
}

//getting doctors by specialities
export const specialities = () => {
    return axios.get("https://tapeticure-gateway.azurewebsites.net/gateway/Doctors");
}

//post appointments
export const appointments = (newapp:any) => {
    return axios.post("https://tapeticure-gateway.azurewebsites.net/gateway/appointment",newapp);
}

//get sessions added
export const sessions =  (id:any) => {
    return  axios.get(`http://localhost:5001/Sessions/${id}`);
}

//user validation on login
export const validatingUser = async (email:string, password:string) => {
    const loginData = {
      email,
      password,
    };
  
    return axios.post("https://tapeticure-gateway.azurewebsites.net/gateway/accounts/login", loginData);
  };

  //update user By Id
export const updateUserByID= async (id:any,userdata:any)=>{
    return await axios.put(`https://tapeticure-gateway.azurewebsites.net/gateway/accounts/${id}`,userdata,{
        headers: {
            'Content-Type': 'application/json'
          }
    });
}
