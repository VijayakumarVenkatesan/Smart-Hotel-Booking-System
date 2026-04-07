import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaHotel, FaPlus } from 'react-icons/fa';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [managers, setManagers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '', location: '', managerId: '', amenities: '', rating: 5, imageUrl: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hotelsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/hotels'),
        axios.get('http://localhost:5000/users?role=Hotel%20Manager')
      ]);
      setHotels(hotelsRes.data);
      setManagers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/hotels', {
        id: Date.now().toString(),
        ...newHotel,
        amenities: newHotel.amenities.split(',').map(a => a.trim()),
        rating: Number(newHotel.rating)
      });
      setShowAdd(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axios.delete(`http://localhost:5000/hotels/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container className="py-5 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-gradient mb-0"><FaHotel className="me-2"/>Manage Hotels</h1>
        <Button variant="primary" className="fw-bold d-flex align-items-center gap-2" onClick={() => setShowAdd(true)}>
          <FaPlus /> Add Hotel
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm bg-glass overflow-hidden">
        <Table responsive hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th className="py-3 px-4">Hotel Name</th>
              <th className="py-3">Location</th>
              <th className="py-3">Manager</th>
              <th className="py-3">Rating</th>
              <th className="py-3 px-4 text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(h => {
              const manager = managers.find(m => m.id === h.managerId);
              return (
                <tr key={h.id}>
                  <td className="py-3 px-4 fw-bold">{h.name}</td>
                  <td className="py-3">{h.location}</td>
                  <td className="py-3">{manager ? manager.name : 'Unknown'}</td>
                  <td className="py-3">{h.rating}</td>
                  <td className="py-3 px-4 text-end">
                    <Button variant="outline-danger" size="sm" onClick={() => deleteHotel(h.id)}>Delete</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add New Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddHotel}>
            <Form.Group className="mb-3">
              <Form.Label>Hotel Name</Form.Label>
              <Form.Control required onChange={e => setNewHotel({...newHotel, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control required onChange={e => setNewHotel({...newHotel, location: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL (Optional)</Form.Label>
              <Form.Control onChange={e => setNewHotel({...newHotel, imageUrl: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assign Manager</Form.Label>
              <Form.Select required onChange={e => setNewHotel({...newHotel, managerId: e.target.value})}>
                <option value="">Select a manager...</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Amenities (comma separated)</Form.Label>
              <Form.Control required onChange={e => setNewHotel({...newHotel, amenities: e.target.value})} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold">Create Hotel</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageHotels;
