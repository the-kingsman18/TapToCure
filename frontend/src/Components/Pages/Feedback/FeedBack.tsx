import React, { useEffect, useState } from 'react';
import styles from './FeedBack.module.css';
import { useSelector } from 'react-redux';
import { getDoctorsFromUsers, giveFeedback } from '../../../services/DoctorService';
import { useSearchParams } from 'react-router-dom';
import { getUserById } from '../../../services/AccountService';

interface FeedbackData {
  appointmentId:number|null;
  patientId: number;
  patientName:string;
  doctorName: string;
  doctorRating: number;
  platformRating: number;
  comments: string;
}

const FeedbackForm: React.FC = () => {

  const [doctors, setDoctors] = useState([]);
  const [pname,setPname]=useState('');
  const [error,setError]=useState('');

  const [searchParams] = useSearchParams();
    const appointmentId: number | null = searchParams.get('appointmentId') 
        ? Number(searchParams.get('appointmentId')) 
        : null;


  useEffect(() => {
    getDoctorsFromUsers().then((response) => {
      setDoctors(response.data);
    });
    getUserById(patientid).then((res)=>{
       setPname(res.data.name);
    })
  }, []);

  const patientid = useSelector((state: any) => state.user.userId);

  const [formData, setFormData] = useState<FeedbackData>({
    appointmentId:appointmentId,
    patientId: patientid,
    patientName:pname,
    doctorName: '',
    doctorRating: 0,
    platformRating: 0,
    comments: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('ratings') ? parseInt(value) : value,
    });
  };

  
 const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    try {
      // Make the POST request to your API
     await giveFeedback(formData);
     
      // Handle successful response (e.g., show success message)
    } catch (err:any) {
      // Check if it's a validation error or a server error
      if (err.response) {
        // Server responded with a non-2xx status code
        setError(err.response.data.Message || 'An error occurred while submitting the feedback');
      } else {
        // Network or other errors
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className={styles.feedbackform}>
      <h2>Doctor Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formgroup}>
          <label htmlFor="doctorName">Doctor Name</label>
          <select
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a doctor</option>
            {doctors.map((doctor: any) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="doctorRating">Doctor Ratings (1-5)</label>
          <input
            type="number"
            id="doctorRating"
            name="doctorRating"
            value={formData.doctorRating}
            onChange={handleChange}
            min={1}
            max={5}
            required
          />
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="platformRating">Platform Ratings (1-5)</label>
          <input
            type="number"
            id="platformRating"
            name="platformRating"
            value={formData.platformRating}
            onChange={handleChange}
            min={1}
            max={5}
            required
          />
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={4}
            required
          ></textarea>
        </div>
        <button className={styles.buttons} type="submit">Submit Feedback</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default FeedbackForm;
