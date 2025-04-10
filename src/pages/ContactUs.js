import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, simulate a submission
    setSubmitted(true);
  };

  const bgStyle = {
    background: "rgba( 255, 255, 255, 0.1 )",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    backdropFilter: "blur( 20px )",
    WebkitBackdropFilter: "blur( 20px )",
    borderRadius: "10px",
    minHeight: "600px",
  };

  return (

    <Container className="my-5 text-warning" style={bgStyle}>
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 fw-bold text-center">Contact Us</h1>
        </Col>
      </Row>
      {submitted && (
        <Row>
          <Col>
            <Alert variant="success" className="text-center">
              Thank you for reaching out! We will get back to you soon.
            </Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={6}>
          <h4>Get in Touch</h4>
          <p>
            If you have any questions, feedback, or need assistance, feel free to contact us via the form. You can also reach us using the following details:
          </p>
          <ul className="list-unstyled">
            <li><strong>Email:</strong> support@travelbuddy.com</li>
            <li><strong>Phone:</strong> +1 (555) 123-4567</li>
            <li><strong>Address:</strong> 123 Travel Buddy Lane, Adventure City, USA</li>
          </ul>
        </Col>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Your message" name="message" value={formData.message} onChange={handleChange} required />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Send Message
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
