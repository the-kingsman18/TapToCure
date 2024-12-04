import './footer.css'
const Footer = () => {
  return (
    <div className='mx-10'>
        <div className='custom-layout'>
            {/* ----left-------- */}
            <div >
                <h3 className='custom-class' style={{color:'blueviolet'}}>TapToCure</h3>
                <p className='custom-width '>
                TapToCure is a digital healthcare platform that makes it simple to connect patients with trusted doctors for convenient online appointments.
        By eliminating traditional clinic wait times, TapToCure allows patients to book appointments with a few taps,
        making healthcare more accessible and streamlined.The platform supports personalized doctor recommendations based on specialty, location, and availability, ensuring the best match for patient needs.
                </p>
            </div>
            {/* --------center----------- */}
            <div>
                <p className='custom-text'>COMPANY</p>
                <ul className='custom-flex'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/* ---------right----------- */}
            <div>
                <p className='custom-text '>GET IN TOUCH</p>
                <ul className='custom-flex'>
                    <li>9876543210</li>
                    <li>taptocure@gmail.com</li>
                </ul>
            </div>
        </div>
        <div>
            {/* -----------Copyright------------ */}
            <hr />
            <p style={{textAlign:'center'}}>Copyright © 2024 - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer

