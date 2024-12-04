import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import { validatingUser } from '../../../services/AccountService';
import { jwtDecode } from 'jwt-decode';
import styles from './login.module.css'
import 'react-toastify/dist/ReactToastify.css'
import * as Yup from "yup"
import { useState } from 'react';
import { login, setRole } from '../../Store/UserSlicer';
import axios from 'axios';
import CodeModal from '../../Pages/CodeModal/CodeModel';


const Login = () => {
 
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expectedCode] = useState("7722");
  


 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
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
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (forgotPassword) {
        alert('Password reset link sent to ' + values.email);
        await axios.post('https://localhost:7229/api/Accounts/request-password-reset', { email: `${values.email}` }, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
    
    
 
      } 

else{
      try {
        const response = await validatingUser(values.email, values.password);
        
             
        if(response.status==200){
          
          localStorage.setItem("token",response.data);
          const decodedToken = jwtDecode<any>(response.data);

         
         dispatch(login(decodedToken.nameid));
         dispatch(setRole(decodedToken.role));
         if(decodedToken.role === "doctor")
         {
          toast.success("Login success");
          setTimeout(()=>navigate('/doctordashboard'),2000);
         }
        else if(decodedToken.role==="admin"){
          
          setShowModal(true);
        }
        else{
          toast.success("Login success");
          setTimeout(()=>navigate('/'),2000);
        }
        

        }    
     
      } catch (error) {
        toast.error('Login failed. Please check your credentials and try again.'); // Show error toast
        
      }
    }

    },
  });

  const handleCodeSubmit = (enteredCode: string) => {
            if (enteredCode === expectedCode) {
              toast.success("Login success");
              setTimeout(() => navigate('/admindashboard'), 2000);
            } else {
              toast.error("Invalid code. Please try again.");
            }
            setShowModal(false); // Close the modal after submission
          };
    
  return (

    <div className={styles.logincontainer}>
      <ToastContainer />
      <div className={styles.loginbox}>
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
        
          <div className={styles.formgroup}>

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <small className={styles.errormessage}>{formik.errors.email}</small>
            )}
          </div>

          {!forgotPassword && (
            <div className={styles.formgroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <small className={styles.errormessage}>{formik.errors.password}</small>
              )}
            </div>
          )}

          <button type="submit" className={styles.loginbutton}>
            {forgotPassword ? 'Send me reset link ' : 'Login'}
          </button>
        </form>

        {!forgotPassword && (
          <p className={styles.createaccount}>
            Create a new account? <a href="/register">Click here</a>
          </p>)}
        
{  !forgotPassword &&     (
        <p className={styles.createaccount}>
          <a href="#" onClick={() => setForgotPassword(true)}>Forgot Password?</a>
        </p>
)}
      </div>
      <CodeModal

show={showModal}

handleClose={() => setShowModal(false)}
handleSubmit={handleCodeSubmit}

/>

    </div>
  );
};

export default Login;
