import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './userprofile.css';
import { useSelector } from 'react-redux';
import { getUserById, updateUserByID } from '../../../services/AccountService';
import { getPatientDetailsById, updatePatientDetailsById } from '../../../services/PatientService';

interface UserDetails {
    userName?: string;
    mobileNumber?: string;
    [key: string]: any;
}

interface PatientDetails {
    bloodGroup?: string;
    age?: number;
    height?: number;
    weight?: number;
    city?: string;
    state?: string;
    [key: string]: any;
}

const UserProfile = () => {
    const userid = useSelector((state: any) => state.user.userId);

    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails>({});
    const [updatedUserDetails, setUpdatedUserDetails] = useState<UserDetails>({});

    const [patientDetails, setPatientDetails] = useState<PatientDetails>({});
    const [updatedPatientDetails, setUpdatedPatientDetails] = useState<PatientDetails>({});

    useEffect(() => {
        getUserById(userid)
            .then(res => {
                setUserDetails(res.data);
            })
            .catch(err => {
                console.error("Error fetching user details", err);
            });
    }, [userid]);

    useEffect(() => {
        getPatientDetailsById(userid)
            .then(res => {
                setPatientDetails(res.data);
            })
            .catch(err => {
                console.error("Error fetching patient details", err);
            });
    }, [userid]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setUpdatedUserDetails(userDetails);
        setUpdatedPatientDetails(patientDetails);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
        setUpdatedPatientDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateUserByID(userid, updatedUserDetails);
            setUserDetails(updatedUserDetails);

            await updatePatientDetailsById(userid, updatedPatientDetails);
            setPatientDetails(updatedPatientDetails);

            setIsEditing(false);
            Swal.fire({
                title: 'Success!',
                text: 'Your details have been saved.',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'small-swal-popup',
                },
            });
        } catch (error) {
            console.error("Unable to update the details", error);
            Swal.fire({
                title: 'Error',
                text: 'Error in saving the details. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="doctor-profile">
            <div className="profile-details">
                <div className="detail-field">
                    <label>Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="userName"
                            value={updatedUserDetails.userName || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{userDetails.userName}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>Blood Group:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="bloodGroup"
                            value={updatedPatientDetails.bloodGroup || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{patientDetails.bloodGroup}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>Age:</label>
                    {isEditing ? (
                        <input
                            type="number"
                            name="age"
                            value={updatedPatientDetails.age || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{patientDetails.age}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>Height:</label>
                    {isEditing ? (
                        <input
                            type="number"
                            name="height"
                            value={updatedPatientDetails.height || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{patientDetails.height}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>Weight:</label>
                    {isEditing ? (
                        <input
                            type="number"
                            name="weight"
                            value={updatedPatientDetails.weight || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{patientDetails.weight}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>City:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="city"
                            value={updatedPatientDetails.city || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{patientDetails.city}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>State:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="state"
                            value={updatedPatientDetails.state || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{patientDetails.state}</p>
                    )}
                </div>
                <div className="detail-field">
                    <label>Phone:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="mobileNumber"
                            value={updatedUserDetails.mobileNumber || ''}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{userDetails.mobileNumber}</p>
                    )}
                </div>
                <div className="profile-actions">
                    {isEditing ? (
                        <button className="save-btn" onClick={handleSave}>Save</button>
                    ) : (
                        <button className="edit-btn" onClick={handleEditToggle}>Edit</button>
                    )}
                    {isEditing && <button className="cancel-btn" onClick={handleEditToggle}>Cancel</button>}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
