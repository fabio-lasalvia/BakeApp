import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import useUpdateProduct from "../../hooks/products/useUpdateProduct";
import useIndexCatalogs from "../../hooks/catalogs/useIndexCatalogs";

function EditProductModal({ show, onHide, product, refetch }) {
  const { update, loading } = useUpdateProduct();
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

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "OTHER",
        catalog: product.catalog?._id || "",
        available: product.available ?? true,
        image: null,
      });
    }
  }, [product]);

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
      await update(product._id, data);
      onHide();
      refetch();
    } catch (error) {
      setError(error.response?.data?.message || "Error updating product");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {!product ? (
          <div className="text-center py-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (€)</Form.Label>
              <Form.Control type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} />
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
              <Form.Select name="catalog" value={formData.catalog} onChange={handleChange}>
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default EditProductModal;
