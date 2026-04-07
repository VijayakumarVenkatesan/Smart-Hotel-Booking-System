import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const GuestDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/hotels');
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5 animate-fade-in">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-gradient">Find Your Perfect Stay</h1>
        <p className="text-muted fs-5">Search through our exclusive collection of premium hotels.</p>
      </div>

      <Card className="p-4 mb-5 bg-glass shadow-sm border-0">
        <Form className="d-flex align-items-center">
          <FaSearch className="text-muted ms-3 me-2 fs-4" />
          <Form.Control
            type="search"
            placeholder="Search by hotel name or location..."
            className="border-0 shadow-none bg-transparent fs-5 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
      </Card>

      <Row className="g-4">
        {filteredHotels.map(hotel => (
          <Col md={6} lg={4} key={hotel.id}>
            <Card className="h-100 border-0 shadow-sm overflow-hidden" 
                  style={{cursor: 'pointer'}} 
                  onClick={() => navigate(`/hotel/${hotel.id}`)}>
              {hotel.imageUrl ? (
                <div style={{height: '200px', backgroundImage: `url(${hotel.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
              ) : (
                <div style={{height: '200px', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'}} className="d-flex align-items-center justify-content-center">
                  <FaStar size={40} className="text-white" />
                </div>
              )}
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0">{hotel.name}</h5>
                  <Badge bg="warning" text="dark" className="d-flex align-items-center rounded-pill">
                    <FaStar className="me-1" /> {hotel.rating}
                  </Badge>
                </div>
                <p className="text-muted flex-grow-1"><FaMapMarkerAlt className="me-1"/>{hotel.location}</p>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {hotel.amenities.slice(0,3).map((am, i) => (
                    <Badge key={i} bg="light" text="dark" className="border fw-normal">{am}</Badge>
                  ))}
                  {hotel.amenities.length > 3 && <Badge bg="light" text="dark" className="border fw-normal">+{hotel.amenities.length - 3}</Badge>}
                </div>
                <Button variant="primary" className="w-100 fw-bold mt-auto">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {filteredHotels.length === 0 && (
        <div className="text-center text-muted mt-5">
          <h3>No hotels found.</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </Container>
  );
};

export default GuestDashboard;
