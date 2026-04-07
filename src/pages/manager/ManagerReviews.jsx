import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaCommentAlt } from 'react-icons/fa';

const ManagerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Fetch hotels managed by this user to get their IDs
      const hotelsRes = await axios.get(`http://localhost:5000/hotels?managerId=${user.id}`);
      const hotelIds = hotelsRes.data.map(h => h.id);
      
      if (hotelIds.length > 0) {
        const revRes = await Promise.all(hotelIds.map(id => axios.get(`http://localhost:5000/reviews?hotelId=${id}`)));
        setReviews(revRes.flatMap(r => r.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRespond = async (reviewId, responseText) => {
    if (!responseText) return;
    try {
      await axios.patch(`http://localhost:5000/reviews/${reviewId}`, { response: responseText });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5 animate-fade-in">
      <h1 className="fw-bold mb-4"><FaCommentAlt className="me-2 text-primary"/>Guest Reviews</h1>
      
      {reviews.length === 0 ? (
        <Card className="p-5 text-center bg-glass border-0">
          <h4 className="text-muted">No reviews found for your properties.</h4>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-4">
          {reviews.map(review => (
            <Card key={review.id} className="border-0 shadow-sm bg-glass p-4 text-start">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold text-dark fs-5">Rating: {review.rating}/5 Stars</span>
                <span className="text-muted small">{new Date(review.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="fs-5 mb-4">"{review.comment}"</p>
              
              {review.response ? (
                <div className="bg-light p-3 rounded border">
                  <strong>Your Response:</strong>
                  <p className="mb-0 mt-1">{review.response}</p>
                </div>
              ) : (
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleRespond(review.id, e.target.elements.response.value);
                }}>
                  <Form.Group className="mb-3">
                    <Form.Control name="response" as="textarea" rows={2} placeholder="Write a response to this guest..." required />
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" size="sm" className="fw-bold px-4">Reply to Review</Button>
                </Form>
              )}
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ManagerReviews;
