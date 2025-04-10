import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import { useSelector } from "react-redux";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const TravellerSocialCard = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [traveller, setTraveller] = useState(null);

  useEffect(() => {
    const fetchTraveller = async () => {
      try {
        const response = await api.get(`/traveller/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTraveller(response.data.traveller);
      } catch (error) {
        console.error("Error fetching traveller details:", error);
      }
    };

    fetchTraveller();
  }, [id]);

  if (!traveller) {
    return <div className="text-center text-muted">Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg rounded-4 w-100"
        style={{ maxWidth: "500px" }}
      >
        <div
          className="p-4 text-white text-center rounded-top"
          style={{
            background: "linear-gradient(to right, #2c3e50, #4ca1af)",
            backgroundColor: "#4f46e5",
          }}
        >
          <h1 className="fw-bold mb-2">
            {traveller.role === "traveller" ? "Traveller Card" : "User Card"}
          </h1>
          <h2 className="fw-semibold">
            {traveller.firstname} {traveller.lastname}
          </h2>
          <p className="fs-6">{traveller.email}</p>
        </div>

        <div className="p-4 text-center">
          <p className="text-dark mb-3">
            <strong>📞 Mobile:</strong> {traveller.mobile}
          </p>

          <div className="mt-3">
            <h3 className="fw-semibold text-dark mb-3">🔗 Social Links</h3>
            <div className="d-flex flex-column align-items-center gap-2">
              {traveller.socialLinks?.whatsapp && (
                <a
                  href={traveller.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success w-75 d-flex align-items-center justify-content-center"
                >
                  <FaWhatsapp size={20} className="me-2" />
                  WhatsApp
                </a>
              )}
              {traveller.socialLinks?.instagram && (
                <a
                  href={traveller.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-danger w-75 d-flex align-items-center justify-content-center"
                >
                  <FaInstagram size={20} className="me-2" />
                  Instagram
                </a>
              )}
              {traveller.socialLinks?.linkedin && (
                <a
                  href={traveller.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary w-75 d-flex align-items-center justify-content-center"
                >
                  <FaLinkedin size={20} className="me-2" />
                  LinkedIn
                </a>
              )}
              {traveller.socialLinks?.twitter && (
                <a
                  href={traveller.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info w-75 d-flex align-items-center justify-content-center"
                >
                  <FaTwitter size={20} className="me-2" />
                  Twitter
                </a>
              )}
              {traveller.socialLinks?.facebook && (
                <a
                  href={traveller.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary w-75 d-flex align-items-center justify-content-center"
                >
                  <FaFacebook size={20} className="me-2" />
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravellerSocialCard;
