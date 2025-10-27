import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Image,
} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import useMyProfile from "../hooks/users/useMyProfile";
import useUpdateMyProfile from "../hooks/users/useUpdateMyProfile";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

function Settings() {
  const { profile, loading: loadingProfile, error, refetch } = useMyProfile();
  const { update, loading } = useUpdateMyProfile();

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    companyName: "",
    contact: "",
    vatNumber: "",
    avatar: "",
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        surname: profile.surname || "",
        email: profile.email || "",
        phone: profile.customer?.phone || "",
        address: profile.customer?.address || "",
        department: profile.employee?.department || "",
        companyName: profile.supplier?.companyName || "",
        contact: profile.supplier?.contact || "",
        vatNumber: profile.supplier?.vatNumber || "",
        avatar: profile.avatar || "",
      });
      setPreview(
        profile.avatar ||
        "https://res.cloudinary.com/dbqckc5sl/image/upload/v1759400955/segnapostoNoImage_rumvcb.png"
      );
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await update(data);
      refetch();

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Update failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  if (loadingProfile)
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="py-5">
      <Button
              variant="outline-primary"
              className="d-flex align-items-center gap-2 mb-3"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft size={20} />
              Back
            </Button>
      <Card className="shadow-lg border-0 rounded-4 p-4">
        <Card.Body>
          {/* PROFILE IMAGE SECTION */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div
              className="position-relative rounded-circle overflow-hidden shadow"
              onClick={handleAvatarClick}
              style={{
                width: "140px",
                height: "140px",
                cursor: "pointer",
                border: "3px solid #dee2e6",
              }}
            >
              <Image
                src={preview}
                alt="Profile"
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
              <div
                className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow"
                style={{
                  transform: "translate(25%, 25%)",
                }}
              >
                <i className="bi bi-camera-fill"></i>
              </div>
            </div>

            <Form.Control
              type="file"
              accept="image/*"
              className="d-none"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <p className="small text-muted mt-3">
              Click the image to change your profile picture
            </p>
          </div>

          {/* PROFILE FORM */}
          <h2 className="fw-bold text-primary mb-4 text-center">
            Edit Profile
          </h2>

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            {profile.role === "CUSTOMER" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            {profile.role === "EMPLOYEE" && (
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  <option value="PRODUCTION">Production</option>
                  <option value="ADMINISTRATION">Administration</option>
                  <option value="LOGISTICS">Logistics</option>
                </Form.Select>
              </Form.Group>
            )}

            {profile.role === "SUPPLIER" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>VAT Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            <div className="text-end mt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Settings;
