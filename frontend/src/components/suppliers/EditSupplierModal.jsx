import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import useUpdateSupplier from "../../hooks/suppliers/useUpdateSupplier";

function EditSupplierModal({ show, onHide, supplier, refetch }) {
  const { update, loading } = useUpdateSupplier();
  const [formData, setFormData] = useState({
    companyName: "",
    contact: "",
    vatNumber: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (supplier) {
      setFormData({
        companyName: supplier.companyName || "",
        contact: supplier.contact || "",
        vatNumber: supplier.vatNumber || "",
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await update(supplier._id, formData);
      refetch();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating supplier");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
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
            <Form.Control
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>VAT Number</Form.Label>
            <Form.Control
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditSupplierModal;
