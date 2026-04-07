import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/layout/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Guest Pages
import GuestDashboard from './pages/guest/GuestDashboard';
import HotelDetails from './pages/guest/HotelDetails';
import BookingPage from './pages/guest/BookingPage';
import MyBookings from './pages/guest/MyBookings';
import LoyaltyProgram from './pages/guest/LoyaltyProgram';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerReviews from './pages/manager/ManagerReviews';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageHotels from './pages/admin/ManageHotels';

// Role wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedLayout = ({ children }) => (
  <>
    <AppNavbar />
    <div className="main-content">
      {children}
    </div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Guest Routes (Default) */}
          <Route path="/" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Guest', 'Admin']}>
                <GuestDashboard />
              </ProtectedRoute>
            </ProtectedLayout>
          } />
          
          <Route path="/hotel/:id" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Guest', 'Admin']}>
                <HotelDetails />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

          <Route path="/book/:id" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Guest']}>
                <BookingPage />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

          <Route path="/my-bookings" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Guest']}>
                <MyBookings />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

          <Route path="/loyalty" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Guest']}>
                <LoyaltyProgram />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Hotel Manager', 'Admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

          <Route path="/manager/reviews" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Hotel Manager', 'Admin']}>
                <ManagerReviews />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            </ProtectedLayout>
          } />
          <Route path="/admin/users" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Admin']}>
                <ManageUsers />
              </ProtectedRoute>
            </ProtectedLayout>
          } />
          <Route path="/admin/hotels" element={
            <ProtectedLayout>
              <ProtectedRoute allowedRoles={['Admin']}>
                <ManageHotels />
              </ProtectedRoute>
            </ProtectedLayout>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
