import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import useUpdateCatalog from "../../hooks/catalogs/useUpdateCatalog";

function EditCatalogModal({ show, onHide, catalog, refetch }) {
  const { update, loading } = useUpdateCatalog();
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (catalog) {
      setFormData({
        name: catalog.name || "",
        description: catalog.description || "",
        isActive: catalog.isActive ?? true,
      });
    }
  }, [catalog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await update(catalog._id, formData);
      refetch();
      onHide();
    } catch (error) {
      setError(error.response?.data?.message || "Error updating catalog");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Catalog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              label="Active"
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

export default EditCatalogModal;
