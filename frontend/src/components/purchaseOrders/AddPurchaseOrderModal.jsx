import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import useCreatePurchaseOrder from "../../hooks/purchaseOrders/useCreatePurchaseOrder";
import useIndexSuppliers from "../../hooks/suppliers/useIndexSuppliers";
import useIndexIngredients from "../../hooks/ingredients/useIndexIngredients";

function AddPurchaseOrderModal({ show, onHide, refetch }) {
  const { create, loading } = useCreatePurchaseOrder();
  const { suppliers, loading: loadingSuppliers } = useIndexSuppliers();
  const { ingredients, loading: loadingIngredients } = useIndexIngredients();

  const [formData, setFormData] = useState({
    supplier: null,
    ingredients: [],
    totalCost: 0,
    status: "PENDING",
    expectedDelivery: "",
  });
  const [error, setError] = useState(null);

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
    label: `${i.name} — €${i.price?.toFixed(2) || "0.00"}`,
    price: i.price || 0,
  }));

  const calculateTotal = (selectedIngredients) =>
    selectedIngredients.reduce((sum, i) => sum + (i.price || 0), 0);

  const handleIngredientChange = (selected) => {
    const newIngredients = selected || [];
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
      totalCost: calculateTotal(newIngredients),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const payload = {
        supplierId: formData.supplier?.value,
        ingredients: formData.ingredients.map((i) => i.value),
        totalCost: formData.totalCost,
        status: formData.status,
        expectedDelivery: formData.expectedDelivery,
      };

      await create(payload);
      refetch();
      onHide();
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
            {formData.ingredients.length > 0 && (
              <div className="mt-2 text-muted small">
                Total Cost: <strong>€{formData.totalCost.toFixed(2)}</strong>
              </div>
            )}
          </Form.Group>

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
