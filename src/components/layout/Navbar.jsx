import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaSignOutAlt, FaHotel, FaBed, FaUserCog, FaTrophy } from 'react-icons/fa';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 custom-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-gradient">
          <FaHotel className="me-2 text-primary" /> SmartHotel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user?.role === 'Guest' && (
              <>
                <Nav.Link as={Link} to="/">Search Hotels</Nav.Link>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/loyalty">Loyalty & Rewards</Nav.Link>
              </>
            )}
            
            {user?.role === 'Hotel Manager' && (
              <>
                <Nav.Link as={Link} to="/manager/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/manager/reviews">Reviews</Nav.Link>
              </>
            )}

            {user?.role === 'Admin' && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">Admin Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/users">Manage Users</Nav.Link>
                <Nav.Link as={Link} to="/admin/hotels">Manage Hotels</Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-light me-2 px-3">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-primary text-white px-3">Register</Nav.Link>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-custom-components" className="text-white text-decoration-none d-flex align-items-center">
                  <span className="me-2">{user.name}</span>
                  <FaUserCircle size={24} className="text-secondary" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-lg border-0 bg-glass" variant="dark">
                  <Dropdown.ItemText className="text-muted small">Role: {user.role}</Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
