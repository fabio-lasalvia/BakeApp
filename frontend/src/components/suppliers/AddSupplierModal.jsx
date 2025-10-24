import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useState } from "react";
import useCreateSupplier from "../../hooks/suppliers/useCreateSupplier";

function AddSupplierModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateSupplier();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
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
      refetch();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating supplier");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Surname</Form.Label>
            <Form.Control name="surname" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control name="companyName" required onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control name="contact" onChange={handleChange} placeholder="Phone or email contact" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>VAT Number</Form.Label>
            <Form.Control name="vatNumber" onChange={handleChange} />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Supplier"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddSupplierModal;
