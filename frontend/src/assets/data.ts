// src/statesData.ts
export interface Speciality{
  speciality:string
}

export const specialities: Speciality[] = [
  { speciality: 'General physician'},
  { speciality: 'Gynecologist'},
  { speciality: 'Dermatologist'},
  { speciality: 'Pediatricians'},
  { speciality: 'Neurologist', },
  {speciality:'Gastroenterologist'}
]

export interface City {
    name: string;
  }
  
  export interface State {
    name: string;
    cities: City[];
  }
  
  export const statesData: State[] = [
    { name: "Andhra Pradesh", cities: [{ name: "Visakhapatnam" }, { name: "Vijayawada" }, { name: "Guntur" }] },
    { name: "Arunachal Pradesh", cities: [{ name: "Itanagar" }, { name: "Tawang" }, { name: "Ziro" }] },
    { name: "Assam", cities: [{ name: "Guwahati" }, { name: "Dibrugarh" }, { name: "Silchar" }] },
    { name: "Bihar", cities: [{ name: "Patna" }, { name: "Gaya" }, { name: "Bhagalpur" }] },
    { name: "Chhattisgarh", cities: [{ name: "Raipur" }, { name: "Bhilai" }, { name: "Bilaspur" }] },
    { name: "Goa", cities: [{ name: "Panaji" }, { name: "Margao" }, { name: "Vasco da Gama" }] },
    { name: "Gujarat", cities: [{ name: "Ahmedabad" }, { name: "Surat" }, { name: "Vadodara" }] },
    { name: "Haryana", cities: [{ name: "Gurugram" }, { name: "Faridabad" }, { name: "Panipat" }] },
    { name: "Himachal Pradesh", cities: [{ name: "Shimla" }, { name: "Manali" }, { name: "Dharamshala" }] },
    { name: "Jharkhand", cities: [{ name: "Ranchi" }, { name: "Jamshedpur" }, { name: "Dhanbad" }] },
    { name: "Karnataka", cities: [{ name: "Bengaluru" }, { name: "Mysuru" }, { name: "Mangaluru" }] },
    { name: "Kerala", cities: [{ name: "Thiruvananthapuram" }, { name: "Kochi" }, { name: "Kozhikode" }] },
    { name: "Madhya Pradesh", cities: [{ name: "Bhopal" }, { name: "Indore" }, { name: "Gwalior" }] },
    { name: "Maharashtra", cities: [{ name: "Mumbai" }, { name: "Pune" }, { name: "Nagpur" }] },
    { name: "Manipur", cities: [{ name: "Imphal" }, { name: "Churachandpur" }, { name: "Ukhrul" }] },
    { name: "Meghalaya", cities: [{ name: "Shillong" }, { name: "Tura" }, { name: "Nongstoin" }] },
    { name: "Mizoram", cities: [{ name: "Aizawl" }, { name: "Lunglei" }, { name: "Champhai" }] },
    { name: "Nagaland", cities: [{ name: "Kohima" }, { name: "Dimapur" }, { name: "Mokokchung" }] },
    { name: "Odisha", cities: [{ name: "Bhubaneswar" }, { name: "Cuttack" }, { name: "Rourkela" }] },
    { name: "Punjab", cities: [{ name: "Amritsar" }, { name: "Ludhiana" }, { name: "Jalandhar" }] },
    { name: "Rajasthan", cities: [{ name: "Jaipur" }, { name: "Jodhpur" }, { name: "Udaipur" }] },
    { name: "Sikkim", cities: [{ name: "Gangtok" }, { name: "Pelling" }, { name: "Namchi" }] },
    { name: "Tamil Nadu", cities: [{ name: "Chennai" }, { name: "Coimbatore" }, { name: "Madurai" }] },
    { name: "Telangana", cities: [{ name: "Hyderabad" }, { name: "Warangal" }, { name: "Nizamabad" }] },
    { name: "Tripura", cities: [{ name: "Agartala" }, { name: "Udaipur" }, { name: "Kailashahar" }] },
    { name: "Uttar Pradesh", cities: [{ name: "Lucknow" }, { name: "Kanpur" }, { name: "Varanasi" }] },
    { name: "Uttarakhand", cities: [{ name: "Dehradun" }, { name: "Haridwar" }, { name: "Nainital" }] },
    { name: "West Bengal", cities: [{ name: "Kolkata" }, { name: "Durgapur" }, { name: "Siliguri" }] }
  ];
  