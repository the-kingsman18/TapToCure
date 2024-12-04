import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getallUsers, getDoctor } from '../../../services/AccountService';

// Define a type for the doctor objects
type Doctor = {
    doctorId: string;
    name:string;
    speciality: string;
    imageURL: string;
};

// Define a type for the user objects
type User = {
    id: string;
    userName: string;
};

const RelatedDoctors = ({ speciality, docId }: { speciality: string; docId: string }) => {
    

    const navigate = useNavigate();
    const [relDoc, setRelDoc] = useState<Doctor[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getDoctor().then((response) => {
            
            setDoctors(response.data);
        });
        getallUsers().then((response) => {
            
            setUsers(response.data);
        });
    }, []);

    useEffect(() => {
        if (doctors.length > 0 && users.length > 0 && speciality) {
            const docData = doctors
                .filter((doc) => doc.speciality === speciality && doc.doctorId != docId)
                
                .map((doc) => {
                    const user = users.find((user) => user.id === doc.doctorId);  
                    return { ...doc, name: user ? user.userName : 'Unknown' };
                });
            setRelDoc(docData);
            
            
        }
    }, [doctors, users, speciality, docId]);

    return (
        <div className="d-flex flex-column align-items-center gap-4 my-2 mx-md-3 text-dark">
            <h3>Related Doctors</h3>
            <p className="col-4 text-center small">Browse through our extensive list of trusted doctors.</p>
            <div className="container-fluid px-3 px-sm-0 py-5">
                <div className="row">
                    {relDoc.slice(0, 5).map((item, index) => (
                        <div className="col-6 col-md-3" key={index}>
                            <div className="border border-primary rounded-3 overflow-hidden cursor-pointer"
                                style={{ transition: '0.5s', transform: '0.5s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div className="p-4" onClick={() => { navigate(`/my-appointment/${item.doctorId}`); scrollTo(0, 0); }}>
                                    <img src={item.imageURL} alt="doctor" className="img-fluid rounded-circle mb-2" style={{ backgroundColor: 'rgb(234, 239, 255)', opacity: 'var(--tw-bg-opacity)' }}/>
                                    <p className="text-lg fw-medium" style={{ color: 'Black' }}>{item.name}</p>
                                    <p className="text-sm" style={{ color: 'gray-600' }}>{item.speciality}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedDoctors;
