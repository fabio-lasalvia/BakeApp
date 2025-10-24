import { Modal, Button, Form, Alert, Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import useUpdateIngredient from "../../hooks/ingredients/useUpdateIngredient";

const UNITS = ["g", "kg", "ml", "l", "pcs"];

function EditIngredientModal({ show, onHide, ingredient, refetch }) {
  const { update, loading } = useUpdateIngredient();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    cost: "",
    expirationDate: "",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name || "",
        quantity: ingredient.quantity || "",
        unit: ingredient.unit || "kg",
        cost: ingredient.cost || "",
        expirationDate: ingredient.expirationDate
          ? ingredient.expirationDate.split("T")[0]
          : "",
        image: null,
      });
      setCurrentImage(ingredient.image || null);
      setPreview(null);
    }
  }, [ingredient, show]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredient) return;
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === "image") {
          if (v) data.append("image", v);
        } else if (v !== null && v !== "") {
          data.append(k, v);
        }
      });

      await update(ingredient._id, data);
      refetch?.();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating ingredient");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Unit</Form.Label>
                <Form.Select name="unit" value={formData.unit} onChange={handleChange}>
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Cost (€)</Form.Label>
                <Form.Control
                  name="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Expiration Date</Form.Label>
                <Form.Control
                  name="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                <div className="mt-2 d-flex align-items-center gap-3">
                  {currentImage && !preview && (
                    <Image
                      src={currentImage}
                      alt="current"
                      rounded
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  )}
                  {preview && (
                    <Image
                      src={preview}
                      alt="preview"
                      rounded
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end mt-3">
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

export default EditIngredientModal;
