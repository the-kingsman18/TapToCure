import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import './DoctorFeedBack.css'; // Import your CSS file

interface Feedback {
  doctorId: string;
  doctorRating: number;
  comments: string;
  patientName: string;
}

interface DoctorFeedBackProps {
  docname: string;
}

const DoctorFeedBack: React.FC<DoctorFeedBackProps> = ({ docname }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get<Feedback[]>(`https://localhost:7247/api/Feedback/doctorname/${docname}`);
        setFeedback(response.data);
      } catch (err: any) {
        
      }
    };

    if (docname) {
      fetchFeedbacks();
    }
  }, [docname]);

  const handleFeedbackClick = (doctorId: string) => {
    navigate(`/my-appointment/${doctorId}`);
  };

  // Render stars based on doctorRating
  const renderStars = (rating: number) => {
    return (
      <span className="stars">
        {Array.from({ length: 5 }, (_, index) => (
          <i
            key={index}
            className={`fa-star ${index < rating ? 'fas filled' : 'far empty'}`}
          ></i>
        ))}
      </span>
    );
  };

  return (
    <div className="feedback-container">
      <h2>Feedbacks</h2>
      {feedback.length > 0 ? (
        <div className="doctorGrid border-primary">
          {feedback.map((item, index) => (
            <div
              key={index}
              className="feedback-item"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-10px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
              onClick={() => handleFeedbackClick(item.doctorId)}
            >
              <div className="feedback-content">
              <p><strong>{item.patientName}</strong></p>
                <p><strong>Rating:</strong> {item.doctorRating}</p>
                <p> {renderStars(item.doctorRating)}</p>
                <p><strong>Comments:</strong> {item.comments}</p>
              </div>
             
            </div>
          ))}
        </div>
      ) : (
        <p className="no-feedback-message">No feedback available for {docname} yet.</p>
      )}
    </div>
  );
}

export default DoctorFeedBack;
