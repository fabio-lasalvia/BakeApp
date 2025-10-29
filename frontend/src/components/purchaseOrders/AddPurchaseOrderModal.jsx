import { Modal, Button, Form, Alert, Spinner, Table } from "react-bootstrap";
import Select from "react-select";
import { useState, useMemo, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useCreatePurchaseOrder from "../../hooks/purchaseOrders/useCreatePurchaseOrder";
import useIndexSuppliers from "../../hooks/suppliers/useIndexSuppliers";
import useIndexIngredients from "../../hooks/ingredients/useIndexIngredients";

function AddPurchaseOrderModal({ show, onHide, refetch }) {
  const { create, loading } = useCreatePurchaseOrder();
  const { suppliers, loading: loadingSuppliers } = useIndexSuppliers();
  const { ingredients, loading: loadingIngredients } = useIndexIngredients();

  // Stato iniziale del form
  const initialFormState = {
    supplier: null,
    ingredients: [], // [{ value, label, cost, quantity }]
    totalCost: 0,
    status: "PENDING",
    expectedDelivery: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);

  // Reset form automatico quando il modale viene chiuso od aperto
  useEffect(() => {
    if (!show) {
      setFormData(initialFormState);
      setError(null);
    }
  }, [show]);

  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  const supplierOptions = (suppliers || []).map((s) => ({
    value: s._id,
    label: `${s.user?.name || "—"} ${s.user?.surname || ""} (${s.user?.email || "no email"})`,
  }));

  const ingredientOptions = (ingredients || []).map((i) => ({
    value: i._id,
    label: `${i.name} — €${i.cost?.toFixed(2) || "0.00"}`,
    cost: i.cost || 0,
  }));

  const calculateTotal = (items) =>
    items.reduce((sum, i) => sum + (i.cost || 0) * (i.quantity || 1), 0);

  const handleIngredientChange = (selected) => {
    const newIngredients = (selected || []).map((i) => ({
      ...i,
      quantity: 1, // quantità di default
    }));

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.supplier) return setError("Please select a supplier.");
    if (formData.ingredients.length === 0)
      return setError("Please select at least one ingredient.");

    try {
      const payload = {
        supplierId: formData.supplier.value,
        ingredients: formData.ingredients.map((i) => ({
          ingredient: i.value,
          quantity: i.quantity,
        })),
        status: formData.status,
        expectedDelivery: formData.expectedDelivery,
      };

      await create(payload);
      refetch();
      onHide();

      // Reset form anche dopo creazione riuscita
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      setError(error.response?.data?.message || "Error creating purchase order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Purchase Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* SUPPLIER */}
          <Form.Group className="mb-3">
            <Form.Label>Supplier</Form.Label>
            <Select
              isSearchable
              isClearable
              placeholder="Select supplier..."
              isDisabled={loadingSuppliers}
              options={supplierOptions}
              value={formData.supplier}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, supplier: selected }))
              }
            />
          </Form.Group>

          {/* INGREDIENTS */}
          <Form.Group className="mb-3">
            <Form.Label>Ingredients</Form.Label>
            <Select
              isMulti
              isSearchable
              placeholder="Select ingredients..."
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

          {/* EXPECTED DELIVERY */}
          <Form.Group className="mb-3">
            <Form.Label>Expected Delivery</Form.Label>
            <Form.Control
              type="date"
              name="expectedDelivery"
              value={formData.expectedDelivery}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expectedDelivery: e.target.value }))
              }
            />
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

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Purchase Order"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPurchaseOrderModal;
