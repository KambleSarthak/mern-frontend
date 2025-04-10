import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Card, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getError } from "../utils/getError";
import { hideLoading, showLoading } from "../features/loadingSlice";
import api from "../utils/axios";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

function TripPosts() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState(null);

  const getTrips = async () => {
    try {
      dispatch(showLoading());
      const radius = process.env.TRIP_RADIUS || 50;
      const response = await api.get(`/trips/get-trips?radius=${radius}`, {
        headers: { Authorization: `${token}` },
      });

      setTrips(response?.data?.trips || []);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      getError(error);
    }
  };

  useEffect(() => {
    if (token) getTrips();
  }, [token]);

  const sendJoinRequest = async (tripId) => {
    try {
      dispatch(showLoading());
      await api.post(
        `/trips/${tripId}/request`,
        {},
        { headers: { Authorization: `${token}` } }
      );

      setMessage({ type: "success", text: "Join request sent successfully!" });
      getTrips();
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  const getButtonStatus = (trip) => {
    if (trip?.participants?.some((p) => p === user?._id)) {
      return { text: "Already Joined", disabled: true, variant: "secondary" };
    }
    if (trip?.requests?.some((r) => r?.user === user?._id)) {
      return { text: "Request Pending", disabled: true, variant: "warning" };
    }
    if (trip?.participants?.length === trip?.slots) {
      return { text: "Slots Full", disabled: true, variant: "secondary" };
    }
    return { text: "Join Trip", disabled: false, variant: "success" };
  };

  const bgStyle = {
    background: "rgba( 255, 255, 255, 0.1 )",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    backdropFilter: "blur( 20px )",
    WebkitBackdropFilter: "blur( 20px )",
    borderRadius: "10px",
    minHeight: "250px",
  };

  return (
    <Container  className="mt-4 mb-4">
      <Row className="mb-3">
        <Col>
          <h2 className="text-white fw-bold text-center">Available Trips</h2>
        </Col>
      </Row>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Row>
        {trips?.length > 0 ? (
          trips.map((trip, index) => {
            const { text, disabled, variant } = getButtonStatus(trip);
            return (
              <Col key={trip._id} lg={4} md={6} sm={12} className="mb-4">
                <Card style={bgStyle}>
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/trip/${trip._id}`} style={styles.title}>
                        {trip.title}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-white">
                      {trip.description}
                    </Card.Text>

                    <div className="d-flex align-items-center mb-2 text-warning">
                      <FaCalendarAlt className="text-primary me-2" />
                      <strong>Date & Time:</strong>{" "}
                      {new Date(trip.when).toLocaleString()}
                    </div>

                    <div className="d-flex align-items-center mb-2 text-warning">
                      <FaMapMarkerAlt className="text-danger me-2" />
                      <strong>Location:</strong>{" "}
                      {trip.where?.city
                        ? `${trip.where.city}, ${trip.where.state}, ${trip.where.country}`
                        : "N/A"}
                    </div>

                    <div className="d-flex align-items-center mb-3 text-warning">
                      <FaUsers className="text-white me-2" />
                      <strong>Slots:</strong> {trip?.participants?.length}/
                      {trip?.slots}
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant={variant}
                        size="sm"
                        disabled={disabled}
                        onClick={() => sendJoinRequest(trip._id)}
                      >
                        {text}
                      </Button>
                      <Link
                        to={`/chat/${trip.createdBy?._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Chat
                      </Link>
                      <Link
                        to={`/traveller-profile/${trip.createdBy?._id}`}
                        className="btn btn-info btn-sm"
                      >
                        View Profile
                      </Link>
                      {trip?.participants?.some((p) => p === user?._id) && (
                        <>
                          <a
                            href="https://www.makemytrip.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-warning btn-sm"
                          >
                            Book Flights
                          </a>
                          <a
                            href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.where?.city || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm"
                          >
                            Book Hotels
                          </a>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col>
            <Alert variant="info" className="text-center">
              No trips available.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to right, #2c3e50, #4ca1af)",
    padding: "40px 20px",
    borderRadius: "10px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease-in-out",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.2rem",
    textDecoration: "none",
  },
};

export default TripPosts;
