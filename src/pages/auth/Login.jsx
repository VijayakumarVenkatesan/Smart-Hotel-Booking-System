import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUserCircle, FaLock } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'Admin') navigate('/admin/dashboard');
      else if (result.role === 'Hotel Manager') navigate('/manager/dashboard');
      else navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 animate-fade-in">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 bg-glass border-0">
            <div className="text-center mb-4">
              <FaUserCircle size={60} className="text-primary mb-3" />
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted">Sign in to your account</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><FaUserCircle /></span>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email (e.g. admin@example.com)" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-start-0"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-start-0"
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                Sign In
              </Button>
            </Form>

            <div className="text-center mt-4 text-muted small">
              <p>Demo Accounts:</p>
              <div>Admin: admin@example.com / password</div>
              <div>Manager: manager@example.com / password</div>
              <div>Guest: guest@example.com / password</div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
