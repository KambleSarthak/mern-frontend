import React, { useState } from "react";
import { Accordion, Container, Row, Col } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";

function HomePage() {
  // Dynamic FAQ data; update these as needed.
  const faqData = [
    {
      question: "What is TravelBuddy?",
      answer:
        "TravelBuddy is a platform that connects travellers and users, helping you discover and join trips with like-minded adventurers.",
    },
    {
      question: "How do I join a trip?",
      answer:
        "Simply browse available trips and send a join request to the traveller who created the trip. Once accepted, you can chat and plan your adventure.",
    },
    {
      question: "Can I create my own trip?",
      answer:
        "Yes! If you're a traveller, you can create your own trips, manage requests, and connect with fellow travellers to make your trip even more exciting.",
    },
    {
      question: "How do I update my profile?",
      answer:
        "You can update your profile by navigating to the update profile section where you can change your personal details, social links, and location.",
    },
  ];

  // State to track the currently active (expanded) FAQ item.
  const [activeKey, setActiveKey] = useState(null);

  const toggleAccordion = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  const bgStyle = {
    background: "rgba( 255, 255, 255, 0.1 )",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    backdropFilter: "blur( 20px )",
    WebkitBackdropFilter: "blur( 20px )",
    borderRadius: "10px",
    minHeight: "550px",
  };

  return (
    <Container style={bgStyle} className="my-5 text-warning">
      <Row className="justify-content-center">
        <Col md={10} data-aos="zoom-in" data-aos-duration="500" data-aos-delay="300">
          <h1 className="display-2 fw-bold text-center mb-4">
            Welcome to TravelBuddy
          </h1>
          <p className="lead text-center mb-5 fw-bolder">
            Explore amazing trips and connect with travellers near you. Discover your next adventure with our vibrant community and innovative tools.
          </p>
          <h2 className="fw-bold mb-4 text-center">Frequently Asked Questions</h2>
          <Accordion activeKey={activeKey}>
            {faqData.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header onClick={() => toggleAccordion(index.toString())}>
                  {faq.question}
                </Accordion.Header>
                <Accordion.Body className="fw-bold">{faq.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
