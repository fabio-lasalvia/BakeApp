import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useState } from "react";
import useCreateCatalog from "../../hooks/catalogs/useCreateCatalog";

function AddCatalogModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateCatalog();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await create(formData);
      refetch();
      onHide();
    } catch (error) {
      setError(error.response?.data?.message || "Error creating catalog");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Catalog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Catalog Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter catalog name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              placeholder="Optional description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Active flag */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              label="Active catalog"
            />
            <Form.Text muted>
              Uncheck this box if you want to create the catalog but keep it inactive for now.
            </Form.Text>
          </Form.Group>

          {/* Actions */}
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Catalog"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCatalogModal;
