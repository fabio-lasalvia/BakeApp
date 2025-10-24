import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import useCreateProduct from "../../hooks/products/useCreateProduct";
import useIndexCatalogs from "../../hooks/catalogs/useIndexCatalogs";

function AddProductModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateProduct();
  const { catalogs } = useIndexCatalogs();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "OTHER",
    catalog: "",
    available: true,
    image: null,
  });

  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") data.append(key, value);
      });

      await create(data);
      onHide();
      refetch();
    } catch (error) {
      setError(error.response?.data?.message || "Error creating product");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (€)</Form.Label>
            <Form.Control type="number" name="price" step="0.01" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange}>
              <option value="LEAVENED">Leavened</option>
              <option value="CAKE">Cake</option>
              <option value="COOKIE">Cookie</option>
              <option value="CHOCOLATE">Chocolate</option>
              <option value="BREAD">Bread</option>
              <option value="DESSERT">Dessert</option>
              <option value="OTHER">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Catalog</Form.Label>
            <Form.Select name="catalog" onChange={handleChange}>
              <option value="">— Select Catalog —</option>
              {catalogs?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              label="Available"
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Add Product"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddProductModal;
