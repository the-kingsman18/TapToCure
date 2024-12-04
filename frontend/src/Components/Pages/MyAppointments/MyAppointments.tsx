import  { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { cancelAppointment, getAppointmentByPatient } from '../../../services/DoctorService';
import { useSelector } from 'react-redux';
import { getDoctorById, getUserById } from '../../../services/AccountService';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctorDetails, setDoctorDetails] = useState<any[]>([]);
  const pid = useSelector((state: any) => state.user.userId);
 
  useEffect(() => {
    getAppointmentByPatient(pid).then((response) => {
      setAppointments(response.data);
    });
  }, [pid]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const details = await Promise.all(
        appointments.map(async (item) => {
          const doctorData = await getDoctorById(item.doctorId);
          const userData = await getUserById(item.doctorId);
          return {
            ...doctorData.data,
            ...userData.data,
            appointmentId: item.appointmentId, 
            appointmentDate: item.appointmentDate,
            appointmentTime: item.appointmentTime,
            status: item.status,
            prescription:item.prescription
          };
        })
      );
      setDoctorDetails(details);
    };
  
    if (appointments.length > 0) {
      fetchDoctorDetails();
    }
  }, [appointments]);

  const formatDate = (dateString: string) => {
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancel = (appointmentId: string) => {
    const doctor = doctorDetails.find((item) => item.appointmentId === appointmentId);
    if (doctor) {
     
    }
    cancelAppointment(appointmentId,doctor.email).then(() => {
     
      // Update the appointments state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, status: 'cancelled' }
            : appointment
        )
      );
    });
    alert(`Appointment ${appointmentId} cancelled`);
  };



  return (
    <>
      <Container className="py-3">
        <div className="pb-3 mt-4 border-bottom" style={{ fontWeight: '500', fontSize: '1.25rem', color: '#3f3f46' }}>
          My Appointments
        </div>

        {doctorDetails.map((item, index) => (
          <Row className="py-3 border-bottom align-items-center" key={index}>
            <Col xs={12} sm={4} md={3} lg={2} className="d-flex justify-content-center">
              <Image src={item.imageURL} alt="" rounded style={{ width: '8rem', backgroundColor: '#ebf4ff' }} />
            </Col>

            <Col xs={12} sm={6} md={6} lg={7} style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>{item.name}</p>
              <p>{item.speciality}</p>
              <p className="mt-2" style={{ fontWeight: '500', color: '#374151' }}>Address:</p>
              <p className="text-muted">{item.clinicAddress}</p>
              <p className="text-muted">{item.city}, {item.state}</p>
              <p className="mt-2">
                <span style={{ fontWeight: '600', color: '#1f2937' }}>Phone:</span> {item.mobileNumber}
              </p>
              <p className="mt-2">
                <span style={{ fontWeight: '600', color: '#1f2937' }}>Appointment Date:</span> {formatDate(item.appointmentDate)}
              </p>
              <p className="mt-2">
                <span style={{ fontWeight: '600', color: '#1f2937' }}>Appointment Time:</span> {item.appointmentTime}
              </p>
              <p className="mt-2">
                <span style={{ fontWeight: '600', color: '#1f2937' }}>Prescription:</span> {item.prescription}
              </p>
            </Col>

            <Col xs="auto" className="ml-auto d-flex flex-column gap-2">
              {item.status === 'cancelled' || item.status === 'available' ? (
                <Button
                  variant="outline-danger"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', transition: 'all 0.3s' }}
                  disabled
                >
                  Cancelled
                </Button>
              ) : item.status === 'consulted' ? (
                <Button
                  variant="outline-primary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', transition: 'all 0.3s' }}
                  
                >
                Consulted
                </Button>
              ) : (
                <Button
                  variant="outline-danger"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', transition: 'all 0.3s' }}
                  onClick={() => handleCancel(item.appointmentId)}
                >
                  Cancel
                </Button>
              )}
            </Col>
          </Row>
        ))}
      </Container>
    </>
  );
};

export default MyAppointments;
