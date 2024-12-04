import { Link } from 'react-router-dom'
import {specialityData} from '../../../assets/assets_frontend/assets'

const Speciality = () => {
        const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
        };
    
        const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.transform = 'translateY(0)';
        };
    
  return (
    <div>
       <div className='d-flex flex-column align-items-center g-4 py-5 text-gray' id="speciality">
        <h2 className="fw-medium">Find by Speciality</h2>
        <p className='col-12 col-sm-8 col-md-6 text-center fs-6'>
             Browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
        </p>

        <div className='d-flex justify-content-center pt-3 overflow-auto' style={{ gap: '20px', flexWrap: 'wrap' }}>
        {
            specialityData.map((item, index) => (
            <Link
                onClick={() => scrollTo(0, 0)}
                className='d-flex flex-column align-items-center text-muted'
                key={index}
                to={`/doctor/${item.speciality}`}
                style={{ textDecoration: 'none', cursor: 'pointer', flexShrink: 0 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <img
                    className="mb-2"
                    style={{ width: '6rem', maxWidth: '6rem' }}
                    src={item.image}
                    alt=""
                />
                <p style={{ textAlign: 'center' }}>{item.speciality}</p>
            </Link>
            ))
         }
        </div>
    </div>
    </div>

  )
}

export default Speciality
