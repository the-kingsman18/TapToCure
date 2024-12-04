import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './DoctorProfile.css';
import { useSelector } from 'react-redux';

interface DoctorDetails {
    name: string;
    speciality: string;
    experience: string;
    clinicAddress: string;
    phone: string;
    degree: string;
    medicalLicense: string;
    state: string;
    city: string;
    about: string;
    profileImage: File | null;
    [key: string]: any; // To allow dynamic keys
}

const DoctorProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState('');  // Image URL state
    const [doctorDetails, setDoctorDetails] = useState<DoctorDetails>({
        name: '',
        speciality: '',
        experience: '',
        clinicAddress: '',
        phone: '',
        degree: '',
        medicalLicense: '',
        state: '',
        city: '',
        about: '',
        profileImage: null, // Image file itself
    });

    const id = useSelector((state: any) => state.user.userId);

    // Fetch doctor's details from the server
    useEffect(() => {
        const fetchDoctorName = async () => {
            try {
                const response = await axios.get(`https://localhost:7229/api/Accounts/${id}`);
                setDoctorDetails(prevDetails => ({
                    ...prevDetails,
                    name: response.data.userName,
                    phone: response.data.mobileNumber
                }));
            } catch (error) {
                console.error('Error fetching doctor name:', error);
            }
        };

        const fetchDoctorDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7015/api/Doctors/${id}`);
                setDoctorDetails(prevDetails => ({ ...prevDetails, ...response.data }));
                setImage(response.data.imageURL); // Set the image URL from the backend
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            }
        };

        fetchDoctorName();
        fetchDoctorDetails();
    }, [id]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDoctorDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setDoctorDetails(prevDetails => ({ ...prevDetails, profileImage: file }));

            // Create a temporary URL for the image to display immediately
            const objectURL = URL.createObjectURL(file);
            setImage(objectURL);  // Update the image state with the new image's object URL
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        
        // Append all text fields except for the profileImage
        for (const key in doctorDetails) {
            if (doctorDetails[key] !== undefined && key !== 'profileImage') {
                formData.append(key, doctorDetails[key]);
            }
        }
    
        // Append the profile image file (if available)
        if (doctorDetails.profileImage) {
            formData.append('profileImage', doctorDetails.profileImage);
        }
    
        try {
            const response = await axios.put(`https://localhost:7015/api/Doctors/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
    
            // Assuming the response contains the updated doctor details, including the new image URL
            const updatedDoctorDetails = response.data;
            const updatedImageURL = updatedDoctorDetails.profileImage; // Get the updated image URL
    
            setDoctorDetails(prevDetails => ({
                ...prevDetails,
                profileImage: updatedImageURL, // Update the profileImage state with the new image URL
            
            }));
    
            // Update the image URL for rendering the new image
            setImage(updatedImageURL); // Set the new image URL returned from the backend
        
            Swal.fire({
                title: 'Success!',
                text: 'Your details have been saved.',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'small-swal-popup',
                },
                
            });
    
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating doctor details:', error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue saving your details. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // List of fields to display
    const fieldsToDisplay = [
        { label: 'Name', key: 'name' },
        { label: 'Speciality', key: 'speciality' },
        { label: 'Experience', key: 'experience' },
        { label: 'Degree', key: 'degree' },
        { label: 'Medical License', key: 'medicalLicense' },
        { label: 'Clinic Address', key: 'clinicAddress' },
        { label: 'State', key: 'state' },
        { label: 'City', key: 'city' },
        { label: 'About', key: 'about' },
        { label: 'Phone', key: 'phone' },
    ];

    return (
        <div className="doctor-profile">
            <div className="profile-image-container">
                {/* Display existing profile image */}
                <img
                    src={image || 'default-image-path'}  // Display image URL or fallback
                    alt="Doctor"
                    className="profile-image"
                />
            </div>
            <div className="profile-details">
                {/* Render only the selected fields */}
                {fieldsToDisplay.map(({ label, key }) => (
                    <div className="detail-field" key={key}>
                        <label>{label}:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name={key}
                                value={doctorDetails[key] || ''}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <p>{doctorDetails[key]}</p>
                        )}
                    </div>
                ))}
                <div className="detail-field">
                    <label>Profile Image:</label>
                    {isEditing ? (
                        <input type="file" name="profileImage" onChange={handleFileChange} />
                    ) : (
                        <p>{doctorDetails.profileImage ? 'Image uploaded' : 'No image'}</p>
                    )}
                </div>
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-btn" onClick={handleEditToggle}>Cancel</button>
                        </>
                    ) : (
                        <button className="edit-btn" onClick={handleEditToggle}>Edit</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
