import { Modal, Button, Form, Alert, Spinner, Table } from "react-bootstrap";
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
    const mappedIngredients =
      order.ingredients?.map((item) => {
        // Se l’ingrediente non è popolato, previeni errori
        const ing =
          item.ingredient && typeof item.ingredient === "object"
            ? item.ingredient
            : { name: "Unknown ingredient", cost: 0, _id: item.ingredient };

        return {
          value: ing._id,
          label: `${ing.name} — €${(ing.cost ?? 0).toFixed(2)}`,
          cost: ing.cost ?? 0,
          quantity: item.quantity || 1,
        };
      }) || [];

    setFormData({
      ingredients: mappedIngredients,
      totalCost: mappedIngredients.reduce(
        (sum, i) => sum + i.cost * (i.quantity || 1),
        0
      ),
      status: order.status || "PENDING",
      expectedDelivery: order.expectedDelivery?.split("T")[0] || "",
    });
  }
}, [order]);


  const ingredientOptions = (ingredients || []).map((i) => ({
    value: i._id,
    label: `${i.name} — €${i.cost?.toFixed(2) || "0.00"}`,
    cost: i.cost || 0,
  }));

  const calculateTotal = (items) =>
    items.reduce((sum, i) => sum + (i.cost || 0) * (i.quantity || 1), 0);

  const handleIngredientChange = (selected) => {
    const newIngredients = (selected || []).map((i) => {
      const existing = formData.ingredients.find((f) => f.value === i.value);
      return {
        ...i,
        quantity: existing ? existing.quantity : 1,
      };
    });

    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
      totalCost: calculateTotal(newIngredients),
    }));
  };

  const handleQuantityChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index].quantity = Math.max(1, Number(value) || 1);
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
        ingredients: formData.ingredients.map((i) => ({
          ingredient: i.value,
          quantity: i.quantity,
        })),
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
          </Form.Group>

          {/* TABLE OF INGREDIENTS */}
          {formData.ingredients.length > 0 && (
            <Table bordered hover responsive size="sm" className="mb-3">
              <thead className="table-light">
                <tr>
                  <th>Ingredient</th>
                  <th>Cost (€)</th>
                  <th>Quantity</th>
                  <th>Subtotal (€)</th>
                </tr>
              </thead>
              <tbody>
                {formData.ingredients.map((ing, index) => (
                  <tr key={ing.value}>
                    <td>{ing.label}</td>
                    <td>{ing.cost.toFixed(2)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={ing.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        style={{ width: "80px", margin: "auto" }}
                      />
                    </td>
                    <td>{(ing.cost * ing.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan="3" className="text-end">
                    Total
                  </td>
                  <td>€{formData.totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </Table>
          )}

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
                setFormData((prev) => ({ ...prev, expectedDelivery: e.target.value }))
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
