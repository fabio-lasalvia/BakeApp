import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useState, useEffect } from "react";
import useUpdatePurchaseOrder from "../../hooks/purchaseOrders/useUpdatePurchaseOrder";
import useIndexIngredients from "../../hooks/ingredients/useIndexIngredients";

function EditPurchaseOrderModal({ show, onHide, order, refetch }) {
  const { update, loading } = useUpdatePurchaseOrder();
  const { ingredients, loading: loadingIngredients } = useIndexIngredients();
  const [formData, setFormData] = useState({
    ingredients: [],
    totalCost: 0,
    status: "PENDING",
    expectedDelivery: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) {
      const selectedIngredients =
        order.ingredients?.map((i) => ({
          value: i._id,
          label: `${i.name} — €${i.price?.toFixed(2) || "0.00"}`,
          price: i.price,
        })) || [];
      setFormData({
        ingredients: selectedIngredients,
        totalCost: order.totalCost || 0,
        status: order.status || "PENDING",
        expectedDelivery: order.expectedDelivery?.split("T")[0] || "",
      });
    }
  }, [order]);

  const ingredientOptions = (ingredients || []).map((i) => ({
    value: i._id,
    label: `${i.name} — €${i.price?.toFixed(2) || "0.00"}`,
    price: i.price,
  }));

  const calculateTotal = (selected) =>
    selected.reduce((sum, i) => sum + (i.price || 0), 0);

  const handleIngredientChange = (selected) => {
    const newIngredients = selected || [];
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
      totalCost: calculateTotal(newIngredients),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        ingredients: formData.ingredients.map((i) => i.value),
        totalCost: formData.totalCost,
        status: formData.status,
        expectedDelivery: formData.expectedDelivery,
      };
      await update(order._id, payload);
      refetch();
      onHide();
    } catch (error) {
      setError(error.response?.data?.message || "Error updating purchase order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* INGREDIENTS */}
          <Form.Group className="mb-3">
            <Form.Label>Ingredients</Form.Label>
            <Select
              isMulti
              isSearchable
              options={ingredientOptions}
              value={formData.ingredients}
              isDisabled={loadingIngredients}
              onChange={handleIngredientChange}
            />
            {formData.ingredients.length > 0 && (
              <div className="mt-2 text-muted small">
                Total: <strong>€{formData.totalCost.toFixed(2)}</strong>
              </div>
            )}
          </Form.Group>

          {/* STATUS */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="PENDING">Pending</option>
              <option value="ORDERED">Ordered</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Form.Group>

          {/* EXPECTED DELIVERY */}
          <Form.Group className="mb-3">
            <Form.Label>Expected Delivery</Form.Label>
            <Form.Control
              type="date"
              value={formData.expectedDelivery}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expectedDelivery: e.target.value,
                }))
              }
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

export default EditPurchaseOrderModal;
