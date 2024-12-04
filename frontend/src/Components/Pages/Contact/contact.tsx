import { assets } from '../../../assets/assets_frontend/assets'
import './contact.css'

const Contact = () => {
  return (
    <div>
      <div className="contact">
        <p>CONTACT <span className='custom-text-style'>US</span></p>
      </div>
      <div className='Pp6'>
        <img className='image' src={assets.contact_image} alt="" />
        <div className='customdiv'>
          <p className='custompp'>Our OFFICE</p>
          <p style={{color:'gray-500'}}>#1 SJR, <br />Electronic City Phase-1, Bengaluru-560100 </p>
          <p style={{color:'gray-500'}}>Tel: 12345-67890 <br /> Email: taptocure@gmail.com</p>
          <p className='custompp'>Careers at TAPTOCURE</p>
  </div>
      </div>
    </div>
  )
}

export default Contact