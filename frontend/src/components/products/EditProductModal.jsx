import { Modal, Button, Form, Alert, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import useUpdateProduct from "../../hooks/products/useUpdateProduct";
import useIndexCatalogs from "../../hooks/catalogs/useIndexCatalogs";
import useCreateCatalog from "../../hooks/catalogs/useCreateCatalog";

function EditProductModal({ show, onHide, product, refetch }) {
  const { update, loading } = useUpdateProduct();
  const { catalogs, refetch: refetchCatalogs } = useIndexCatalogs();
  const { create: createCatalog } = useCreateCatalog();

  const [formData, setFormData] = useState({});
  const [newCatalogName, setNewCatalogName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        available: product.available ?? true,
        catalog: product.catalog?._id || "",
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

  const handleCreateCatalog = async () => {
    if (!newCatalogName.trim()) return;
    try {
      const newCatalog = await createCatalog({ name: newCatalogName });
      setFormData((prev) => ({ ...prev, catalog: newCatalog._id }));
      setNewCatalogName("");
      await refetchCatalogs();
    } catch (error) {
      console.error("Error creating catalog:", error);
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} rows={3} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (€)</Form.Label>
            <Form.Control type="number" name="price" value={formData.price} step="0.01" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Catalog</Form.Label>
            <InputGroup>
              <Form.Select name="catalog" value={formData.catalog} onChange={handleChange}>
                <option value="">-- Select Catalog --</option>
                {catalogs.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                placeholder="New catalog name"
                value={newCatalogName}
                onChange={(e) => setNewCatalogName(e.target.value)}
              />
              <Button variant="outline-success" onClick={handleCreateCatalog}>
                <i className="bi bi-plus-circle"></i>
              </Button>
            </InputGroup>
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

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
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
      </Modal.Body>
    </Modal>
  );
}

export default EditProductModal;
