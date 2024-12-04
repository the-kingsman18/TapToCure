import { assets } from "../../../assets/assets_frontend/assets"
import './about.css'

const About = () => {
  return (
    <div>
      <div className="aboutus">
      <p>ABOUT <span className="span">US</span></p>
    </div>
    <div className="param1">
      <img className="custom-width" src={assets.about_image} alt="" />
   
    <div className="customParams">
      <p>Welcome to TaptoCure, your trusted partner in managing your healthcare needs conveniently and efficiently. At TaptoCure, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
      <p>TaptoCure is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, TaptoCure is here to support you every step of the way.</p>
      <b style={{color: '#1F2937'}}>Our Vision</b>
      <p>Our vision at TaptoCure is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
    </div>
    </div>

    <div className="P1">
      <p>WHY <span className="pp1">CHOOSE US</span></p>
    </div>
       <div className="pp2">
        <div className="pp5">
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className="pp5">
        <b>Convenience:</b>
        <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className="pp5">
        <b>Personalization:</b>
        <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
       </div>
    </div>
  )
}

export default About