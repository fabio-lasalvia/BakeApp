import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import useCreateCustomerOrder from "../../hooks/customerOrders/useCreateCustomerOrder";
import useIndexCustomers from "../../hooks/customers/useIndexCustomers";
import useIndexProducts from "../../hooks/products/useIndexProducts";

function AddCustomerOrderModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateCustomerOrder();
  const { customers, loading: loadingCustomers, error: errorCustomers } = useIndexCustomers();
  const { products, loading: loadingProducts, error: errorProducts } = useIndexProducts();

  const [formData, setFormData] = useState({
    customer: null,
    products: [],
    totalAmount: 0,
    status: "PENDING",
    notes: "",
  });

  const [error, setError] = useState(null);

  // Decodifica token per sapere chi ha creato l'ordine
  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  /////////////////////////////////////////////
  // Dropdown options con validazione sicura //
  /////////////////////////////////////////////
  const customerOptions = (customers || [])
    .filter((c) => c?.user)
    .map((c) => ({
      value: c._id,
      label: `${c.user.name || "Unnamed"} ${c.user.surname || ""} (${c.user.email || "no-email"})`,
    }));

  const productOptions = (products || []).map((p) => ({
    value: p._id,
    label: `${p.name} — €${p.price?.toFixed(2) || "0.00"}`,
    price: p.price || 0,
  }));

  //////////////////////////////////
  // Calcolo totale prodotti scelti //
  //////////////////////////////////
  const calculateTotal = (selectedProducts) =>
    selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleProductChange = (selected) => {
    const newProducts = selected || [];
    setFormData((prev) => ({
      ...prev,
      products: newProducts,
      totalAmount: calculateTotal(newProducts),
    }));
  };

  //////////////////////////////////
  // Handle submit ordine cliente //
  //////////////////////////////////
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.customer) {
      setError("Please select a customer.");
      return;
    }

    if (formData.products.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    try {
      const payload = {
        customerId: formData.customer.value,
        products: formData.products.map((p) => p.value),
        totalAmount: formData.totalAmount,
        status: formData.status,
        notes: formData.notes,
      };

      await create(payload);
      refetch();
      onHide();
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "Error creating order");
    }
  };

  //////////////////////////////////
  // UI Rendering //
  //////////////////////////////////
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Customer Order</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {errorCustomers && (
          <Alert variant="warning">Failed to load customers.</Alert>
        )}
        {errorProducts && (
          <Alert variant="warning">Failed to load products.</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* CUSTOMER SELECTION */}
          <Form.Group className="mb-3">
            <Form.Label>Customer</Form.Label>
            {loadingCustomers ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            ) : (
              <Select
                isSearchable
                isClearable
                placeholder="Select customer..."
                options={customerOptions}
                value={formData.customer}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, customer: selected }))
                }
              />
            )}
          </Form.Group>

          {/* PRODUCTS MULTI SELECT */}
          <Form.Group className="mb-3">
            <Form.Label>Products</Form.Label>
            {loadingProducts ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            ) : (
              <Select
                isMulti
                isSearchable
                placeholder="Select products..."
                options={productOptions}
                value={formData.products}
                onChange={handleProductChange}
              />
            )}
            {formData.products.length > 0 && (
              <div className="mt-2 text-muted small">
                Total:{" "}
                <strong>€{formData.totalAmount.toFixed(2)}</strong>
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
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Form.Group>

          {/* NOTES */}
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </Form.Group>

          {/* ACTION BUTTONS */}
          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Order"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCustomerOrderModal;
