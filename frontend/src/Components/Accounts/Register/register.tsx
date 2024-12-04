import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './regiter.css'
import {  registerUser, requestOtp, verifyOtp } from '../../../services/AccountService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ToastContainer,toast } from 'react-toastify';

const RegisterForm: React.FC = () => {

const navigate = useNavigate();
const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
//const [otpMatched, setOtpMatched] = useState(false); // Track if OTP matches

const handleSendOtp = (email: string) => {
  toast.success(`Sending OTP to ${email}`);
  requestOtp(email).then((response)=>{
    toast.error(response.data.error.message);
  })
  setOtpSent(true);
  // Here, implement API call to send OTP
};

const handleVerifyOtp = (email: string, otp: string) => {


  // Replace with actual verification logic
  
  verifyOtp(email, otp).then((response) => {
    const verifiedOtp = response.data;
    

    const isOtpValid = verifiedOtp; // Mock OTP validation

    if (isOtpValid) {
      //setOtpMatched(true);
      toast.success('OTP matched!');
    } else {
      toast.error('OTP does not match. Please try again.');
    }
  }).catch((error) => {
    console.error('OTP verification error:', error);
    toast.error('An error occurred while verifying OTP. Please try again.');
  });
};

const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required')
    .test(
      'has-gmail',
      'Email must be a gmail address',
      (value)=>value.includes('@gmail')
    )
    .test(
      'has-com',
      'email must end with .com',
      (value)=>value.endsWith('.com')
    ),
    otp: otpSent ? Yup.string().required('OTP is required') : Yup.string(),
    password: Yup.string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/).required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
    gender:Yup.string().required(),
    mobileNumber: Yup.string().matches(/^[6-9][0-9]{9}$/, 'Mobile number must be valid 10 digits').required('Mobile number is required'),
    role:Yup.string().required()
  });
 
  return (
<div className="register-container">
  <ToastContainer/>
<div className="register-box">
<h2>Create Account</h2>
<Formik
          initialValues={{
            userName: '',
            email: '',
            otp:'',
            password: '',
            confirmPassword:'',
            mobileNumber: '' ,
            gender:'',
            role:''
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
          
            
              const { confirmPassword, otp,...filteredValues } = values;
              
            
              try{
               await registerUser(filteredValues)
                 .then((res)=>{
                     
                    
                     if(values.role==='doctor'){
                      navigate('/doctorReg', { state: { id: res.data.userId } });
                 }else{
                   
                   navigate('/patient', { state: { id: res.data.userId } });
                 }
                  
                    
                
                 })
             } catch (error:any) {
                 console.error('Registration error:', error.response.data.message); // Handle errors gracefully
                 // Optionally display an error message to the user
               }
            
          }}
>
          {({ values, handleChange,setFieldValue }) => (
            <Form>

        <div className="form-group">
            <label htmlFor="userName" className='label'>Enter Your Full Name</label>
            <Field type="text" name="userName" placeholder="Enter your full name" />
            <ErrorMessage name="userName" component="small" className="error-message" />
        </div>

       
 
        <div className="form-group">
            <label htmlFor="email" className='label'>Email address</label>
            <Field type="email" name="email" placeholder="Enter your email" />

            <Button
              variant="secondary"
              onClick={() => handleSendOtp (values.email)}
              style={{ marginLeft: '10px' }}
            >
              Verify
            </Button>

            <ErrorMessage name="email" component="small" className="error-message" />

        </div>
{otpSent && (

        <div className="form-group">
            <label htmlFor="otp" className='label'>Enter OTP</label>
            <Field type="text" name="otp" placeholder="Enter otp" onChange={(e: { target: { value: any; }; }) => {
                  handleChange(e);
                  setFieldValue("otp", e.target.value); 
                }} />
 <Button
                variant="secondary"
                onClick={() => handleVerifyOtp(values.email,values.otp)}
                
              >
                Verify OTP
              </Button>
            <ErrorMessage name="otp" component="small" className="error-message" />

        </div>

)}
          <div className="form-group">
            <label htmlFor="password" className='label'>Password</label>
            <Field type="password" name="password" placeholder="Enter password" />
            <ErrorMessage name="password" component="small" className="error-message" />
        </div>

        <div className="form-group">
            <label htmlFor="confirmPassword" className='label'>Confirm Password</label>
            <Field type="password" name="confirmPassword" placeholder="Confirm password" />
            <ErrorMessage name="confirmPassword" component="small" className="error-message" />
        </div>
 
        <div className="form-group">
            <label htmlFor="mobileNumber" className='label'>Mobile Number</label>
            <Field type="text" name="mobileNumber" placeholder="Enter mobile number" />
            <ErrorMessage name="mobileNumber" component="small" className="error-message" />
        </div>
     
     <div className="form-group">
    <label htmlFor="gender" className="label">Gender</label>
    <Field as="select" name="gender" className="form-control">
        <option value="" label="Select gender" />
        <option value="male" label="Male" />
        <option value="female" label="Female" />

    </Field>
    <ErrorMessage name="gender" component="small" className="error-message" />
</div>
     
        <div className="form-group">
    <label htmlFor="role" className="label">Role</label>
    <div role="group" aria-labelledby="role">
        <label>
            <Field type="radio" name="role" value="doctor" />
            Doctor
        </label>
        <label>
            <Field type="radio" name="role" value="patient" />
            Patient
        </label>
    </div>
    <ErrorMessage name="role" component="small" className="error-message" />
</div> 
              <button type="submit" className="register-button" 
              //disabled={!otpMatched}
              >Next</button>
</Form>
          )}
</Formik>
<p>Already have an account? <a href="/login">Login</a></p>
</div>
</div>
  );
};
 
export default RegisterForm;