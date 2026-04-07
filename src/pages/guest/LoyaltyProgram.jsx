import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, ProgressBar, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaCrown, FaGift, FaStar } from 'react-icons/fa';

const LoyaltyProgram = () => {
  const { user } = useAuth();
  const [loyalty, setLoyalty] = useState(null);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/loyaltyAccounts?userId=${user.id}`);
        if (response.data.length > 0) {
          setLoyalty(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
      }
    };
    fetchLoyalty();
  }, [user.id]);

  if (!loyalty) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-muted">You are not enrolled in the loyalty program yet.</h2>
      </Container>
    );
  }

  const nextTier = 2000;
  const progress = (loyalty.pointsBalance / nextTier) * 100;

  return (
    <Container className="py-5 animate-fade-in">
      <div className="text-center mb-5">
        <FaCrown size={60} className="text-warning mb-3" />
        <h1 className="fw-bold text-gradient">SmartRewards™</h1>
        <p className="text-muted fs-5">Earn points. Get free stays. Travel smarter.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-0 shadow-lg bg-glass overflow-hidden text-center p-5">
            <h3 className="fw-bold mb-4">Your Points Balance</h3>
            <h1 className="display-1 fw-bold text-primary mb-4">{loyalty.pointsBalance}</h1>
            
            <div className="text-start mb-2 fw-bold text-muted d-flex justify-content-between">
              <span>Current Status: Silver</span>
              <span>Next Tier: Gold</span>
            </div>
            <ProgressBar now={progress} className="mb-4" style={{height: '10px'}} />
            <p className="text-muted mb-4">{nextTier - loyalty.pointsBalance} points away from Gold Status</p>
            
            <Row className="g-3 mt-3">
              <Col sm={6}>
                <Button variant="outline-primary" className="w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                  <FaGift /> Redeem Points
                </Button>
              </Col>
              <Col sm={6}>
                <Button variant="primary" className="w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                  <FaStar /> View Benefits
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoyaltyProgram;
