import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
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
    }
  }, [ingredient]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files?.[0] || null }));
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
        if (v !== null && v !== "") data.append(k, v);
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
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
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
