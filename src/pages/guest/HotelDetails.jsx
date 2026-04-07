import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaMapMarkerAlt, FaStar, FaCheckCircle, FaBed } from 'react-icons/fa';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          axios.get(`http://localhost:5000/hotels/${id}`),
          axios.get(`http://localhost:5000/rooms?hotelId=${id}&availability=true`)
        ]);
        setHotel(hotelRes.data);
        setRooms(roomsRes.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Container className="py-5 text-center"><h2>Loading...</h2></Container>;
  if (!hotel) return <Container className="py-5 text-center"><h2>Hotel not found!</h2></Container>;

  return (
    <Container className="py-5 animate-fade-in">
      <Card className="border-0 shadow-sm mb-5 overflow-hidden">
        {hotel.imageUrl && (
          <div style={{height: '350px', backgroundImage: `url(${hotel.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
        )}
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="fw-bold mb-0 text-gradient">{hotel.name}</h1>
            <Badge bg="warning" text="dark" className="fs-5 d-flex align-items-center rounded-pill">
              <FaStar className="me-2" /> {hotel.rating}
            </Badge>
          </div>
          <p className="text-muted fs-5 mb-4"><FaMapMarkerAlt className="me-2"/>{hotel.location}</p>
          
          <h4 className="fw-bold mb-3">Amenities</h4>
          <div className="d-flex gap-2 flex-wrap mb-4">
            {hotel.amenities.map((am, i) => (
              <Badge key={i} bg="light" text="dark" className="border px-3 py-2 fs-6 fw-normal rounded-pill">
                <FaCheckCircle className="text-success me-2"/>{am}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      <h3 className="fw-bold mb-4">Available Rooms</h3>
      <Row className="g-4">
        {rooms.length === 0 ? (
          <Col><p className="text-muted">No rooms currently available for this hotel.</p></Col>
        ) : (
          rooms.map(room => (
            <Col md={6} key={room.id}>
              <Card className="h-100 border-0 shadow-sm bg-glass">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between mb-3">
                    <h4 className="fw-bold text-primary"><FaBed className="me-2"/>{room.type} Room</h4>
                    <h4 className="fw-bold text-dark">${room.price}<span className="fs-6 text-muted fw-normal">/night</span></h4>
                  </div>
                  
                  <ListGroup variant="flush" className="mb-4 bg-transparent">
                    {room.features.map((feature, i) => (
                      <ListGroup.Item key={i} className="bg-transparent px-0 border-light border-opacity-50">
                        <FaCheckCircle className="text-primary me-2"/> {feature}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                  <Button 
                    variant="primary" 
                    className="mt-auto fw-bold py-2"
                    onClick={() => navigate(`/book/${room.id}`, { state: { hotel, room } })}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default HotelDetails;
