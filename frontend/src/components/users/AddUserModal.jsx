import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useCreateUser from "../../hooks/users/useCreateUser";

function AddUserModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateUser();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    // extra fields
    phone: "",
    address: "",
    department: "",
    companyName: "",
    contact: "",
    vatNumber: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await create(formData);
      refetch?.();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating user");
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "CUSTOMER":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>
          </>
        );

      case "EMPLOYEE":
        return (
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="PRODUCTION">Production</option>
              <option value="ADMINISTRATION">Administration</option>
              <option value="LOGISTICS">Logistics</option>
            </Form.Select>
          </Form.Group>
        );

      case "SUPPLIER":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control name="contact" value={formData.contact} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>VAT Number</Form.Label>
              <Form.Control name="vatNumber" value={formData.vatNumber} onChange={handleChange} />
            </Form.Group>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Surname</Form.Label>
            <Form.Control name="surname" value={formData.surname} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="SUPPLIER">Supplier</option>
            </Form.Select>
          </Form.Group>

          {renderRoleSpecificFields()}

          <div className="text-end mt-3">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Add User"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddUserModal;
