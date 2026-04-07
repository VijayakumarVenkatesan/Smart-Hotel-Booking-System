import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Guest',
    contactNumber: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic check if email exists
      const exist = await axios.get(`http://localhost:5000/users?email=${formData.email}`);
      if (exist.data.length > 0) {
        setError("Email already in use.");
        return;
      }
      
      await axios.post('http://localhost:5000/users', { ...formData, id: Date.now().toString() });
      navigate('/login');
    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 animate-fade-in">
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 bg-glass border-0">
            <h2 className="text-center fw-bold mb-4">Create an Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" required onChange={e => setFormData({...formData, name: e.target.value})} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={e => setFormData({...formData, email: e.target.value})} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={e => setFormData({...formData, password: e.target.value})} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" required onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label>Account Type</Form.Label>
                <Form.Select onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Guest">Guest</option>
                  <option value="Hotel Manager">Hotel Manager</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">Sign Up</Button>
            </Form>
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="text-primary text-decoration-none fw-bold">Login here</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
