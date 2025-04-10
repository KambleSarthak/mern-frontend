import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Alert,
  Modal,
  Row,
  Col,
  Spinner,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getError } from "../utils/getError";
import { hideLoading, showLoading } from "../features/loadingSlice";
import api from "../utils/axios";
import { FaTrash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function TripRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token,user } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.loading);

  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setId(null);
  };

  const getMyTrips = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/trips/get-my-trips", {
        headers: { Authorization: ` ${token}` },
      });
      setTrips(response?.data?.trips || []);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  useEffect(() => {
    if (token) {
      getMyTrips();
    }
  }, [token]);

  const handleAccept = async (tripId, requestId) => {
    try {
      dispatch(showLoading());
      await api.patch(
        `/trips/${tripId}/requests/${requestId}`,
        { status: "accepted" },
        { headers: { Authorization: `${token}` } }
      );
      setMessage({ type: "success", text: "Request accepted!" });
      getMyTrips();
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  const handleReject = async (tripId, requestId) => {
    try {
      dispatch(showLoading());
      await api.patch(
        `/trips/${tripId}/requests/${requestId}`,
        { status: "rejected" },
        { headers: { Authorization: ` ${token}` } }
      );
      setMessage({ type: "success", text: "Request rejected!" });
      getMyTrips();
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(showLoading());
      await api.delete(`/trips/${id}`, {
        headers: { Authorization: ` ${token}` },
      });
      setMessage({ type: "success", text: "Trip deleted!" });
      getMyTrips();
      handleClose();
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  const bgStyle = {
    background: "rgba( 255, 255, 255, 0.1 )",
    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    backdropFilter: "blur( 20px )",
    WebkitBackdropFilter: "blur( 20px )",
    borderRadius: "10px",
    minHeight: "300px",
  };

  return (
    <Container className="mt-3 mb-3">
      <Row className="mb-3 pt-3 px-3">
        <Col>
          <h2 className="text-white fw-bold">Manage Trip Requests</h2>
        </Col>
        <Col className="text-end">
          <Button
            onClick={() => navigate("/trips/create-trip")}
            variant="primary"
          >
            Create Trip
          </Button>
        </Col>
      </Row>

      {message && (
        <Row className="px-3">
          <Col>
            <Alert variant={message.type}>{message.text}</Alert>
          </Col>
        </Row>
      )}

      <Row className="g-4 px-3 pb-4" >
        {trips?.length > 0 ? (
          trips.map((trip) => (
            <Col md={6} key={trip?._id}>
              <Card style={bgStyle}>
                <Card.Body className='text-warning'>
                  <div className="d-flex justify-content-between">
                    <h4 className="fw-bold">
                      Trip name: {trip?.title}
                    </h4>
                    <Button
                      variant="transparent"
                      onClick={() => {
                        setId(trip?._id);
                        setOpen(true);
                      }}
                    >
                      <FaTrash color="red" />
                    </Button>
                  </div>
                  <h6 className=" mb-2 fw-bold">
                    Slots: {trip?.participants?.length}/{trip?.slots}
                  </h6>
                  <h6 className=" mb-3 fw-bold">
                    Status:{" "}
                    <span
                      className="px-2 rounded-pill text-white"
                      style={{
                        background: trip?.status === "closed" ? "red" : "green",
                      }}
                    >
                      {trip?.status}
                    </span>
                  </h6>

                  <div className="mb-4">
                    <h5 className=" fw-bold">Requests</h5>
                    <Row className="g-3">
                      {trip?.requests?.length > 0 ? (
                        trip.requests.map((reqUser, index) => (
                          <Col xs={12} key={reqUser._id}>
                            <Card className="shadow-sm">
                              <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="fw-bold mb-1">
                                    {index + 1}. {reqUser?.user?.firstname}{" "}
                                    {reqUser?.user?.lastname}
                                  </h6>
                                  <p className="mb-0">{reqUser?.user?.email}</p>
                                </div>
                                <div>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() =>
                                      handleAccept(trip?._id, reqUser?._id)
                                    }
                                  >
                                    Accept
                                  </Button>{" "}
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleReject(trip?._id, reqUser?._id)
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col xs={12}>
                          <Alert variant="info" className="text-center mb-0">
                            No requests for this trip.
                          </Alert>
                        </Col>
                      )}
                    </Row>
                  </div>

                  <div>
                    <h5 className=" fw-bold">Participants</h5>
                    <Row className="g-3">
                      {trip?.participants?.length > 0 ? (
                        trip?.participants.map((user, index) => (
                          <Col xs={12} key={user._id}>
                            <Card className="shadow-sm">
                              <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="fw-bold mb-1">
                                    {index + 1}. {user?.firstname}{" "}
                                    {user?.lastname}
                                  </h6>
                                  <p className="mb-0">{user?.email}</p>
                                </div>
                                <div className="d-flex gap-2">
                                  <Link
                                    to={"/chat/" + user?._id}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Chat
                                  </Link>
                                  <Link
                                    to={"/user-profile/" + user?._id}
                                    className="btn btn-info btn-sm"
                                  >
                                    View Profile
                                  </Link>
                                </div>
                              </Card.Body>
                            </Card>
                            
                          </Col>
                        ))
                      ) : (
                        <Col xs={12}>
                          <Alert variant="info" className="text-center mb-0">
                            No participants for this trip.
                          </Alert>
                        </Col>
                      )}
                    </Row>
                    
                  </div>
                  { (
                    <div className="d-flex flex-wrap gap-2 mt-3">
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
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">You have not created any trips yet.</Alert>
          </Col>
        )}
      </Row>

      <Modal show={open} onHide={handleClose}>
        <Modal.Header className="p-2 border-0" closeButton></Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete this trip?</h5>
          <p>This can't be undone.</p>
          <div className="d-flex gap-3">
            <Button
              variant="primary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {isLoading ? <Spinner size="sm" /> : "Confirm"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

// const styles = {
//   container: {
//     background: "linear-gradient(to right, #2c3e50, #4ca1af)",
//     minHeight: "100vh",
//     padding: "20px",
//     borderRadius: "10px",
//   },
//   card: {
//     background: "rgba(255, 255, 255, 0.95)",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//   },
// };

export default TripRequests;
