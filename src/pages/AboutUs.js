import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {

    const bgStyle = {
        background: "rgba( 255, 255, 255, 0.1 )",
        boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
        backdropFilter: "blur( 20px )",
        WebkitBackdropFilter: "blur( 20px )",
        borderRadius: "10px",
        minHeight: "300px",
      };
  return (
    <Container className="my-5 text-warning">
      <Row className="align-items-center">
        <Col md={6} style={bgStyle}>
          <h1 className="display-4 fw-bold">About Us</h1>
          <p className="lead">
            Welcome to TravelBuddy—your trusted companion for discovering and sharing amazing travel experiences. Our platform connects travellers and adventure-seekers from around the globe, offering unique trips and unforgettable experiences.
          </p>
          <p>
            At TravelBuddy, we believe that travel enriches lives. Our mission is to empower you with the tools and community to explore new destinations, join exciting trips, and create lifelong memories. Whether you're planning your next journey or looking to share your travel story, we're here to help.
          </p>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            {/* Replace the image URL with your own image if needed */}
            <Card.Img variant="top" src="https://images.unsplash.com/photo-1611373836556-ce9163368f47?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
