import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../Accounts/Register/regiter.css'
import { useLocation } from 'react-router-dom';
import { registerPatient } from '../../services/AccountService';
import '../Accounts/Register/regiter.css';
import {toast,ToastContainer} from 'react-toastify'
import {  useNavigate } from 'react-router-dom';
import { statesData, State } from "../../assets/data";
import { useState } from 'react';

const Patient: React.FC = () => {

  const location = useLocation();
  const  newid = location.state.id ;

const navigate = useNavigate();


 if (!newid) {
   // Redirect to home or display an error if the ID is missing
   navigate('/');
   toast.error(' ID not found');
 }

const [cities, setCities] = useState<string[]>([]);

const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
  const selectedState = e.target.value;
  const foundState = statesData.find((state) => state.name === selectedState);

  setFieldValue("state", selectedState); // Set the selected state
  setCities(foundState ? foundState.cities.map((city) => city.name) : []); // Update cities based on the selected state
};

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({

    patientId:Yup.string().required(),
    bloodGroup: Yup.string().matches(/^(A|B|AB|O)[+-]ve$/,'Enter Valid Blood Group').required(),
    height:Yup.string().matches(/^[0-9]{3}$/,"enter valid height").required(),
    weight: Yup.string().required(),
    age:Yup.string().matches(/^[0-9]{2}$/, 'enter valid age').required(),
    state:Yup.string().required(),
    city:Yup.string().required(),
    address:Yup.string().required().min(10,"minimum 10 charachters"),
    emergencyContact: Yup.string().matches(/^[0-9]{10}$/, 'emergency contact number must be 10 digits').required('Mobile number is required')


  });


  return (
<div className="register-container">
<ToastContainer/>
<div className="register-box">
<h2>Fill Details</h2>
<Formik
          initialValues={{

            patientId:newid,
            height:'',
            weight:'',
            age:'',
            bloodGroup:'',
            emergencyContact:'',
            state:'',
            city:'',
            address:''

          
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            console.log(values);
            try{
              await registerPatient(newid,values)
                .then((res)=>{
                    console.log(res);
                 
                   navigate('/');
                   toast.success("Register Success");
                })
            } catch (error:any) {
                toast.error('Registration error:', error.response.data.ErrorMessage); // Handle errors gracefully
                // Optionally display an error message to the user
              }
            }}
>
          {({ setFieldValue}) => (
            <Form>
 <div className="form-group">
            <label htmlFor="bloodGroup" className='label'>Blood Group</label>
            <Field type="text" name="bloodGroup" placeholder="Enter bloodGroup" />
            <ErrorMessage name="bloodGroup" component="small" className="error-message" />
        </div>


          <div className="form-group">
            <label htmlFor="height" className='label'>height</label>
            <Field type="text" name="height" placeholder="Enter your height (in cms)" />
            <ErrorMessage name="height" component="small" className="error-message" />
        </div>

        <div className="form-group">
            <label htmlFor="weight" className='label'>weight</label>
            <Field type="text" name="weight" placeholder="Enter your weight (in Kg)" />
            <ErrorMessage name="weight" component="small" className="error-message" />
        </div>


        <div className="form-group">
            <label htmlFor="age" className='label'>age</label>
            <Field type="text" name="age" placeholder="Enter your age" />
            <ErrorMessage name="age" component="small" className="error-message" />
        </div>
 
    
        <div className='formgroup'>
            <label htmlFor="state" className='label'>State</label>
            <Field
              as="select"
              name="state"
              className="form-control"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleStateChange(e, setFieldValue);
              }}
            >
              <option value="">Select State</option>
              {statesData.map((state: State) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="state" component="small" className='errormessage' />
          </div>

          <div className='formgroup'>
            <label htmlFor="city" className='label'>City</label>
            <Field as="select" name="city" className="form-control">
              <option value="">Select City</option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </Field>
            <ErrorMessage name="city" component="small" className='errormessage' />
          </div>


        <div className="form-group">
            <label htmlFor="address" className='label'> Address</label>
            <Field type="text" name="address" placeholder="Enter Address" />
            <ErrorMessage name="address" component="small" className="error-message" />
        </div>

        
        <div className="form-group">
            <label htmlFor="emergencyContact" className='label'>emergency contact number</label>
            <Field type="text" name="emergencyContact" placeholder="Enter emergencyContact" />
            <ErrorMessage name="emergencyContact" component="small" className="error-message" />
        </div>
        
              <button type="submit" className="register-button">Submit</button>
</Form>
          )}
</Formik>
</div>
</div>
  );
};

export default Patient;