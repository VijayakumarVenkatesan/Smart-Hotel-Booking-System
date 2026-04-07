import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaCreditCard, FaCalendarCheck } from 'react-icons/fa';

const BookingPage = () => {
  const { id } = useParams(); // roomId
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const hotel = state?.hotel;
  const room = state?.room;

  if (!hotel || !room) {
    return <Container className="py-5 text-center"><h2>Invalid Booking Request</h2></Container>;
  }

  // Basic calculation
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = (end - start) / (1000 * 60 * 60 * 24);
    if (days <= 0) return 0;
    return days * room.price;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const total = calculateTotal();
    if (total <= 0) {
      setError("Invalid dates. Check-out must be after check-in.");
      return;
    }

    try {
      const booking = {
        id: Date.now().toString(),
        userId: user.id,
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        status: "Confirmed",
        paymentId: `pay_${Date.now()}`,
        hotelId: hotel.id
      };
      
      const payment = {
        id: booking.paymentId,
        userId: user.id,
        bookingId: booking.id,
        amount: total,
        status: "Paid",
        paymentMethod: "Credit Card"
      };

      await axios.post('http://localhost:5000/bookings', booking);
      await axios.post('http://localhost:5000/payments', payment);
      
      // Update room availability (demo only, json-server doesn't have complex transactions)
      await axios.patch(`http://localhost:5000/rooms/${room.id}`, { availability: false });

      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      console.error(err);
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="fw-bold mb-4"><FaCalendarCheck className="me-2 text-primary"/>Complete Your Booking</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Booking successful! Redirecting...</Alert>}

      <Row className="g-4">
        <Col lg={7}>
          <Card className="p-4 border-0 shadow-sm bg-glass h-100">
            <h4 className="fw-bold mb-3">Booking Details</h4>
            <Form onSubmit={handleBooking}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Check-in Date</Form.Label>
                    <Form.Control type="date" required value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Check-out Date</Form.Label>
                    <Form.Control type="date" required value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />
              <h4 className="fw-bold mb-3"><FaCreditCard className="me-2 text-secondary"/>Payment Details</h4>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control type="text" placeholder="XXXX-XXXX-XXXX-XXXX" required defaultValue="4111-1111-1111-1111" />
              </Form.Group>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control type="text" placeholder="MM/YY" required defaultValue="12/26"/>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="text" placeholder="123" required defaultValue="123"/>
                  </Form.Group>
                </Col>
              </Row>
              
              <Button variant="primary" type="submit" size="lg" className="w-100 fw-bold" disabled={success}>
                Confirm & Pay ${calculateTotal().toFixed(2)}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm overflow-hidden h-100">
            {hotel.imageUrl && <div style={{height: '200px', backgroundImage: `url(${hotel.imageUrl})`, backgroundSize: 'cover'}} />}
            <Card.Body className="p-4">
              <h5 className="fw-bold">{hotel.name}</h5>
              <p className="text-muted">{hotel.location}</p>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Room Type</span>
                <span className="fw-bold">{room.type}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Price per night</span>
                <span className="fw-bold">${room.price}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingPage;
