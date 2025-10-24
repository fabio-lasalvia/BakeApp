import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useState, useEffect } from "react";
import useUpdateCustomerOrder from "../../hooks/customerOrders/useUpdateCustomerOrder";
import useIndexProducts from "../../hooks/products/useIndexProducts";

function EditCustomerOrderModal({ show, onHide, order, refetch }) {
  const { update, loading } = useUpdateCustomerOrder();
  const { products, loading: loadingProducts } = useIndexProducts();

  const [formData, setFormData] = useState({
    status: "PENDING",
    notes: "",
    products: [],
    totalAmount: 0,
  });

  const [error, setError] = useState(null);

  // Calcolo del totale in base ai prodotti selezionati
  const calculateTotal = (selectedProducts) =>
    selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  // Inizializza i dati del form quando l’ordine viene caricato
  useEffect(() => {
    if (order) {
      const selectedProducts =
        order.products?.map((p) => ({
          value: p._id,
          label: `${p.name} — €${p.price.toFixed(2)}`,
          price: p.price,
        })) || [];

      setFormData({
        status: order.status || "PENDING",
        notes: order.notes || "",
        products: selectedProducts,
        totalAmount: order.totalAmount || calculateTotal(selectedProducts),
      });
    }
  }, [order]);

  // Opzioni prodotti disponibili
  const productOptions =
    products?.map((p) => ({
      value: p._id,
      label: `${p.name} — €${p.price.toFixed(2)}`,
      price: p.price,
    })) || [];

  // Gestisce selezione prodotti
  const handleProductChange = (selected) => {
    const newProducts = selected || [];
    setFormData((prev) => ({
      ...prev,
      products: newProducts,
      totalAmount: calculateTotal(newProducts),
    }));
  };

  // Gestione cambi testo o select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        status: formData.status,
        notes: formData.notes,
        products: formData.products.map((p) => p.value),
        totalAmount: formData.totalAmount,
      };

      await update(order._id, payload);
      refetch();
      onHide();
    } catch (error) {
      console.error("Error updating order:", error);
      setError(error.response?.data?.message || "Error updating order");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Customer Order</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* PRODUCTS MULTI SELECT */}
          <Form.Group className="mb-3">
            <Form.Label>Products</Form.Label>
            <Select
              isMulti
              isSearchable
              isDisabled={loadingProducts}
              placeholder="Select or modify products..."
              options={productOptions}
              value={formData.products}
              onChange={handleProductChange}
            />
            {formData.products.length > 0 && (
              <div className="mt-2 text-muted small">
                Total: <strong>€{formData.totalAmount.toFixed(2)}</strong>
              </div>
            )}
          </Form.Group>

          {/* STATUS */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
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
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>

          {/* ACTION BUTTONS */}
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

export default EditCustomerOrderModal;
