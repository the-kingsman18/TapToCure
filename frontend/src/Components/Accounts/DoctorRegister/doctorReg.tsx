import React, { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerDoctor } from '../../../services/AccountService';
import { statesData, State } from "../../../assets/data";
import { specialities } from '../../../assets/data';
import { useLocation } from 'react-router-dom';
import './doctorReg.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";

const DoctorReg: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const selectedState = e.target.value;
    const foundState = statesData.find((state) => state.name === selectedState);  
    setFieldValue("state", selectedState); // Set the selected state
    setCities(foundState ? foundState.cities.map((city) => city.name) : []); // Update cities based on the selected state
  };

  const navigate = useNavigate();
  const location = useLocation();
  const newid = location.state.id;

  const fillRef = useRef<HTMLInputElement>(null);

  if (!newid) {
    // Redirect to home or display an error if the ID is missing
    navigate('/');
    toast.error('ID not found');
  }

  const handleImageClick = () => {
    fillRef.current?.click();
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    DoctorId: Yup.string().required(),
    Degree: Yup.string().required(),
    speciality: Yup.string().required(),
    experience: Yup.number().required().min(1),
    medicalLicense: Yup.string()
      .matches(/^MCI-\d{4}-\d{6}$/, 'Invalid medical license number format')
      .required('Medical license number is required'),
    state: Yup.string().required(),
    city: Yup.string().required(),
    clinicAddress: Yup.string().required().min(10, "Minimum 10 characters"),
    about: Yup.string().required().min(30, "Minimum 30 characters"),
    profileimage: Yup.mixed().required("Profile image is required")
  });

  return (
    <div className='registercontainer'>
      <div className='registerbox'>
        <ToastContainer />
        <h2>Fill Details</h2>
        <Formik
          initialValues={{
            DoctorId: newid,
            Degree: '',
            speciality: '',
            experience: '',
            medicalLicense: '',
            state: '',
            city: '',
            clinicAddress: '',
            about: '',
            profileimage: null
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await registerDoctor(values, newid)
                .then(() => {
                  navigate("/login");
                  toast.success("Register Success!");
                });
            } catch (error: any) {
              toast.error(error.response.data.message);
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className='formgroup'>
                <label htmlFor="Degree" className='label'>Degree</label>
                <Field type="text" name="Degree" placeholder="Enter your degree" />
                <ErrorMessage name="Degree" component="small" className='errormessage' />
              </div>

              <div className='formgroup'>
                <label htmlFor="speciality" className='label'>Select Your Speciality</label>
                <Field as="select" name="speciality">
                  <option value="" label="Select your speciality" />
                  {specialities.map((spec, index) => (
                    <option key={index} value={spec.speciality} label={spec.speciality} />
                  ))}
                </Field>
                <ErrorMessage name="speciality" component="small" className='errormessage' />
              </div>

              <div className='formgroup'>
                <label htmlFor="experience" className='label'>Experience</label>
                <Field type="text" name="experience" placeholder="Enter experience" />
                <ErrorMessage name="experience" component="small" className='errormessage' />
              </div>

              <div className='formgroup'>
                <label htmlFor="medicalLicense" className='label'>License Number</label>
                <Field type="text" name="medicalLicense" placeholder="Enter MCI medical license" />
                <ErrorMessage name="medicalLicense" component="small" className='errormessage' />
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

              <div className='formgroup'>
                <label htmlFor="clinicAddress" className='label'>Clinic Address</label>
                <Field type="text" name="clinicAddress" placeholder="Enter clinic address" />
                <ErrorMessage name="clinicAddress" component="small" className='errormessage' />
              </div>

              <div className='formgroup'>
                <label htmlFor="about" className='label'>Brief yourself</label>
                <Field type="textarea" name="about" placeholder="Enter about" />
                <ErrorMessage name="about" component="small" className='errormessage' />
              </div>

              <div className='formgroup'>
                <label htmlFor="profileimage" className='label'>Upload Profile Image</label>
                <input ref={fillRef} hidden type="file" name="profileimage"
                  onChange={(event) => {
                    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                      setFieldValue("profileimage", event.currentTarget.files[0]);
                      setFileName(event.currentTarget.files[0].name);
                    }
                  }}
                />
                <p>{fileName}</p>
                <Button onClick={handleImageClick}>Upload</Button>
                <ErrorMessage name="profileimage" component="small" className='errormessage' />
              </div>
              <button type="submit" className='registerbutton'>Submit</button>
            </Form>
          )}
        </Formik>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default DoctorReg;
