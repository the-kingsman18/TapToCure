// Import images
import appointment_img from './appointment_img.png';
import header_img from './header_img.png';
import group_profiles from './group_profiles.png';
import contact_image from './contact_image.png';
import about_image from './about_image.png';
import dropdown_icon from './dropdown_icon.svg';
import info_icon from './info_icon.svg';
import Dermatologist from './Dermatologist.svg';
import Gastroenterologist from './Gastroenterologist.svg';
import General_physician from './General_physician.svg';
import Gynecologist from './Gynecologist.svg';
import Neurologist from './Neurologist.svg';
import Pediatricians from './Pediatricians.svg';

// Define types for assets
export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    info_icon,
    contact_image,
    about_image,
    dropdown_icon,  
};

// Define the type for Speciality
interface Speciality {
    speciality: string;
    image: string;
}

// Speciality data
export const specialityData: Speciality[] = [
    {
        speciality: 'General physician',
        image: General_physician,
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist,
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist,
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians,
    },
    {
        speciality: 'Neurologist',
        image: Neurologist,
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist,
    },
];

