import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import useCreateInvoice from "../../hooks/invoices/useCreateInvoice";
import useIndexCustomerOrders from "../../hooks/customerOrders/useIndexCustomerOrders";

function AddInvoiceModal({ show, onHide, refetch }) {
  const { create, loading } = useCreateInvoice();
  const { orders, loading: loadingOrders } = useIndexCustomerOrders();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customerOrder: null,
    customer: null,
    total: 0,
    dueDate: "",
    status: "UNPAID",
    notes: "",
  });

  // Decodifica utente loggato
  const decoded = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, []);

  // Opzioni customer orders
  const customerOrderOptions = (orders || []).map((order) => ({
    value: order._id,
    label: `${order.customer?.user?.name} ${order.customer?.user?.surname || ""} — €${order.totalAmount?.toFixed(2)} (${order.status})`,
    customer: order.customer,
    total: order.totalAmount,
  }));

  // Quando cambia customerOrder, aggiorniamo automaticamente il totale e il customer
  useEffect(() => {
    if (formData.customerOrder) {
      setFormData((prev) => ({
        ...prev,
        customer: formData.customerOrder.customer,
        total: formData.customerOrder.total,
      }));
    }
  }, [formData.customerOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.customerOrder) throw new Error("Please select a customer order");

      const payload = {
        customerOrderId: formData.customerOrder.value,
        customerId: formData.customerOrder.customer?._id,
        total: formData.total,
        dueDate: formData.dueDate,
        status: formData.status,
        notes: formData.notes,
      };

      await create(payload);
      refetch();
      onHide();
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(err.response?.data?.message || err.message || "Error creating invoice");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Invoice</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* CUSTOMER ORDER */}
          <Form.Group className="mb-3">
            <Form.Label>Customer Order</Form.Label>
            <Select
              isSearchable
              placeholder="Select a customer order..."
              options={customerOrderOptions}
              isDisabled={loadingOrders}
              value={formData.customerOrder}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  customerOrder: selected,
                  total: selected?.total || 0,
                }))
              }
            />
          </Form.Group>

          {/* CUSTOMER (auto) */}
          <Form.Group className="mb-3">
            <Form.Label>Customer</Form.Label>
            <Form.Control
              type="text"
              value={
                formData.customer
                  ? `${formData.customer.user?.name || ""} ${formData.customer.user?.surname || ""}`
                  : ""
              }
              disabled
              placeholder="Automatically filled"
            />
          </Form.Group>

          {/* TOTAL (auto) */}
          <Form.Group className="mb-3">
            <Form.Label>Total (€)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={formData.total}
              disabled
            />
          </Form.Group>

          {/* DUE DATE */}
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </Form.Group>

          {/* STATUS */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
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
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Generate Invoice"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddInvoiceModal;
