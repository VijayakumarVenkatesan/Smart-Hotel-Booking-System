import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaHotel, FaBed, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, hotels: 0, rooms: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, hotels, rooms, bookings] = await Promise.all([
          axios.get('http://localhost:5000/users'),
          axios.get('http://localhost:5000/hotels'),
          axios.get('http://localhost:5000/rooms'),
          axios.get('http://localhost:5000/bookings')
        ]);
        setStats({
          users: users.data.length,
          hotels: hotels.data.length,
          rooms: rooms.data.length,
          bookings: bookings.data.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="fw-bold mb-5 text-gradient">System Overview</h1>
      
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-glass text-center p-4 h-100">
            <FaUsers size={40} className="text-primary mx-auto mb-3" />
            <h2 className="fw-bold display-4">{stats.users}</h2>
            <p className="text-muted text-uppercase fw-bold m-0">Total Users</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-glass text-center p-4 h-100">
            <FaHotel size={40} className="text-success mx-auto mb-3" />
            <h2 className="fw-bold display-4">{stats.hotels}</h2>
            <p className="text-muted text-uppercase fw-bold m-0">Hotels</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-glass text-center p-4 h-100">
            <FaBed size={40} className="text-info mx-auto mb-3" />
            <h2 className="fw-bold display-4">{stats.rooms}</h2>
            <p className="text-muted text-uppercase fw-bold m-0">Rooms</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm bg-glass text-center p-4 h-100">
            <FaMoneyBillWave size={40} className="text-warning mx-auto mb-3" />
            <h2 className="fw-bold display-4">{stats.bookings}</h2>
            <p className="text-muted text-uppercase fw-bold m-0">Bookings</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
