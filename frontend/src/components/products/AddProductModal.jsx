import { Modal, Button, Form, Alert, InputGroup, Spinner, Collapse } from "react-bootstrap";
import { useState } from "react";
import useCreateProduct from "../../hooks/products/useCreateProduct";
import useIndexCatalogs from "../../hooks/catalogs/useIndexCatalogs";
import useCreateCatalog from "../../hooks/catalogs/useCreateCatalog";

function AddProductModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateProduct();
  const { catalogs, loading: loadingCatalogs, refetch: refetchCatalogs } = useIndexCatalogs();
  const { create: createCatalog } = useCreateCatalog();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
    catalog: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [newCatalog, setNewCatalog] = useState({ name: "", description: "" });
  const [showNewCatalogForm, setShowNewCatalogForm] = useState(false);

  ///// Gestione cambi form /////
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

  ///// Crea catalogo /////
  const handleCreateCatalog = async () => {
    if (!newCatalog.name.trim()) return;
    try {
      const created = await createCatalog(newCatalog);
      setFormData((prev) => ({ ...prev, catalog: created._id }));
      setNewCatalog({ name: "", description: "" });
      setShowNewCatalogForm(false);
      await refetchCatalogs();
    } catch (error) {
      console.error("Error creating catalog:", error);
    }
  };

  ///// Crea prodotto /////
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
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Nome */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" onChange={handleChange} required />
          </Form.Group>

          {/* Descrizione */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} onChange={handleChange} />
          </Form.Group>

          {/* Prezzo */}
          <Form.Group className="mb-3">
            <Form.Label>Price (€)</Form.Label>
            <Form.Control type="number" name="price" step="0.01" onChange={handleChange} required />
          </Form.Group>

          {/* Cataloghi */}
          <Form.Group className="mb-3">
            <Form.Label>Catalog</Form.Label>

            {/* Se ci sono cataloghi - mostra select */}
            {catalogs.length > 0 ? (
              <>
                <InputGroup className="mb-2">
                  <Form.Select
                    name="catalog"
                    value={formData.catalog}
                    onChange={handleChange}
                    disabled={loadingCatalogs}
                  >
                    <option value="">-- Select Catalog --</option>
                    {catalogs.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="outline-success"
                    onClick={() => setShowNewCatalogForm((prev) => !prev)}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </Button>
                </InputGroup>
              </>
            ) : (
              <Alert variant="warning" className="py-2">
                No catalogs found. Please create one below.
              </Alert>
            )}

            {/* Form per creare nuovo catalogo */}
            <Collapse in={showNewCatalogForm || catalogs.length === 0}>
              <div className="border rounded p-3 mt-2 bg-light">
                <Form.Group className="mb-2">
                  <Form.Label>Catalog Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCatalog.name}
                    onChange={(e) => setNewCatalog({ ...newCatalog, name: e.target.value })}
                    placeholder="Enter catalog name"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newCatalog.description}
                    onChange={(e) => setNewCatalog({ ...newCatalog, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </Form.Group>

                <div className="text-end">
                  <Button variant="outline-primary" size="sm" onClick={handleCreateCatalog}>
                    Save Catalog
                  </Button>
                </div>
              </div>
            </Collapse>
          </Form.Group>

          {/* Disponibilità */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              label="Available"
            />
          </Form.Group>

          {/* 🔹 Immagine */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
          </Form.Group>

          {/* Btn */}
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Product"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddProductModal;
