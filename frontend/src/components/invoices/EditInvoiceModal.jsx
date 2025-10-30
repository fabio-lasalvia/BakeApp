import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import useUpdateInvoice from "../../hooks/invoices/useUpdateInvoice";

function EditInvoiceModal({ show, onHide, invoice, refetch }) {
  const { update, loading } = useUpdateInvoice();
  const [formData, setFormData] = useState({
    total: "",
    dueDate: "",
    status: "UNPAID",
    notes: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (invoice) {
      setFormData({
        total: invoice.total || "",
        dueDate: invoice.dueDate?.split("T")[0] || "",
        status: invoice.status || "UNPAID",
        notes: invoice.notes || "",
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await update(invoice._id, formData);
      refetch();
      onHide();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating invoice");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Total (€)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="total"
              value={formData.total}
              onChange={handleChange}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </Form.Select>
          </Form.Group>

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

export default EditInvoiceModal;
