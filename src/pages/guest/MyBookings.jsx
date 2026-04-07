import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Badge, Table, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaSuitcase } from 'react-icons/fa';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Expand relationships if possible, else fetch manually. json-server allows _expand
        const response = await axios.get(`http://localhost:5000/bookings?userId=${user.id}&_expand=hotel`);
        // json-server _expand=hotel tries to find hotelId. 
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user.id]);

  if (loading) return <Container className="py-5 text-center"><h2>Loading...</h2></Container>;

  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="fw-bold mb-4"><FaSuitcase className="me-2 text-primary"/>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <Card className="p-5 text-center bg-glass border-0 shadow-sm">
          <h3 className="text-muted">You have no bookings yet.</h3>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm bg-glass overflow-hidden">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3">Check-in</th>
                <th className="py-3">Check-out</th>
                <th className="py-3">Status</th>
                <th className="py-3 px-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="py-3 px-4 fw-bold text-muted">#{b.id}</td>
                  <td className="py-3">{b.checkInDate}</td>
                  <td className="py-3">{b.checkOutDate}</td>
                  <td className="py-3">
                    <Badge bg={b.status === 'Confirmed' ? 'success' : 'secondary'} className="rounded-pill px-3">
                      {b.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-end">
                    <Button variant="outline-primary" size="sm">View Receipt</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default MyBookings;
