import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaBuilding, FaPlus } from 'react-icons/fa';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ hotelId: '', type: 'Standard', price: 100, features: 'WiFi' });

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      const hotelsRes = await axios.get(`http://localhost:5000/hotels?managerId=${user.id}`);
      setHotels(hotelsRes.data);
      
      const hotelIds = hotelsRes.data.map(h => h.id);
      if (hotelIds.length > 0) {
        const roomsRes = await Promise.all(hotelIds.map(id => axios.get(`http://localhost:5000/rooms?hotelId=${id}`)));
        setRooms(roomsRes.flatMap(r => r.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/rooms', {
        id: Date.now().toString(),
        hotelId: newRoom.hotelId,
        type: newRoom.type,
        price: Number(newRoom.price),
        availability: true,
        features: newRoom.features.split(',').map(f => f.trim())
      });
      setShowAddRoom(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="fw-bold mb-4 text-gradient"><FaBuilding className="me-2"/>Property Management</h1>
      
      <Row className="g-4 mb-5">
        {hotels.map(h => (
          <Col md={6} lg={4} key={h.id}>
            <Card className="border-0 shadow-sm bg-glass h-100 p-3">
              <h5 className="fw-bold">{h.name}</h5>
              <p className="text-muted mb-0">{h.location}</p>
            </Card>
          </Col>
        ))}
        {hotels.length === 0 && <Col><p className="text-muted">You are not assigned to manage any properties.</p></Col>}
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Rooms Inventory</h3>
        <Button variant="primary" className="fw-bold fw-bold d-flex align-items-center gap-2" onClick={() => setShowAddRoom(true)} disabled={hotels.length === 0}>
          <FaPlus /> Add Room
        </Button>
      </div>

      <Card className="border-0 shadow-sm bg-glass overflow-hidden">
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-4">Hotel</th>
              <th className="py-3">Type</th>
              <th className="py-3">Price</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-4 text-muted">No rooms found.</td></tr>
            ) : (
              rooms.map(room => {
                const hotelName = hotels.find(h => h.id === room.hotelId)?.name;
                return (
                  <tr key={room.id}>
                    <td className="py-3 px-4 fw-bold text-dark">{hotelName}</td>
                    <td className="py-3">{room.type}</td>
                    <td className="py-3">${room.price}/night</td>
                    <td className="py-3">
                      <span className={`badge ${room.availability ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                        {room.availability ? 'Available' : 'Booked'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card>

      <Modal show={showAddRoom} onHide={() => setShowAddRoom(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddRoom}>
            <Form.Group className="mb-3">
              <Form.Label>Select Hotel</Form.Label>
              <Form.Select required onChange={e => setNewRoom({...newRoom, hotelId: e.target.value})}>
                <option value="">Choose property...</option>
                {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room Type</Form.Label>
              <Form.Select required onChange={e => setNewRoom({...newRoom, type: e.target.value})}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price per night ($)</Form.Label>
              <Form.Control type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Features (comma separated)</Form.Label>
              <Form.Control type="text" required value={newRoom.features} onChange={e => setNewRoom({...newRoom, features: e.target.value})} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold">Create Room</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default ManagerDashboard;
