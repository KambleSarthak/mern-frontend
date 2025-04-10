import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../utils/axios";
import { setUser } from "../features/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    socialLinks: {
      whatsapp: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      facebook: "",
    },
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        socialLinks: {
          whatsapp: user?.socialLinks?.whatsapp || "",
          instagram: user?.socialLinks?.instagram || "",
          twitter: user?.socialLinks?.twitter || "",
          linkedin: user?.socialLinks?.linkedin || "",
          facebook: user?.socialLinks?.facebook || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const socialField = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialField]: value },
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/update-profile", profile, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        dispatch(setUser({ user: response.data.user, token }));
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 mt-3 mb-3">
      <div
        className="card shadow-lg p-4 w-100"
        style={{ maxWidth: "700px", borderRadius: "12px" }}
      >
        <div className="card-header bg-primary text-white text-center rounded-top">
          <h3 className="mb-0">Update Profile</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={profile.firstname}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={profile.lastname}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter a new password (leave blank to keep the same)"
                />
              </div>
              <h5 className="text-secondary mt-4">Social Links</h5>
              <div className="col-md-6">
                <label className="form-label fw-bold">WhatsApp</label>
                <input
                  type="text"
                  name="socialLinks.whatsapp"
                  value={profile.socialLinks.whatsapp}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter WhatsApp number"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Instagram</label>
                <input
                  type="text"
                  name="socialLinks.instagram"
                  value={profile.socialLinks.instagram}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Instagram URL"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Twitter</label>
                <input
                  type="text"
                  name="socialLinks.twitter"
                  value={profile.socialLinks.twitter}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Twitter URL"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">LinkedIn</label>
                <input
                  type="text"
                  name="socialLinks.linkedin"
                  value={profile.socialLinks.linkedin}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter LinkedIn URL"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Facebook</label>
                <input
                  type="text"
                  name="socialLinks.facebook"
                  value={profile.socialLinks.facebook}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Facebook URL"
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary w-100 btn-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
