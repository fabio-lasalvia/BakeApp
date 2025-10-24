import { Modal, Table, Badge } from "react-bootstrap";

function InvoiceDetailsModal({ show, onHide, invoice }) {
  if (!invoice) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "OVERDUE":
        return "danger";
      default:
        return "warning";
    }
  };

  const orderRef = invoice.customerOrder
    ? `Customer Order #${invoice.customerOrder._id.slice(-6)}`
    : invoice.purchaseOrder
    ? `Purchase Order #${invoice.purchaseOrder._id.slice(-6)}`
    : "—";

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Invoice Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered hover responsive>
          <tbody>
            <tr>
              <td><strong>Customer</strong></td>
              <td>
                {invoice.customer?.user
                  ? `${invoice.customer.user.name} ${invoice.customer.user.surname || ""}`
                  : "—"}
              </td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>{invoice.customer?.user?.email || "—"}</td>
            </tr>
            <tr>
              <td><strong>Handled By</strong></td>
              <td>
                {invoice.handledBy
                  ? `${invoice.handledBy.name} ${invoice.handledBy.surname || ""} (${invoice.handledBy.email})`
                  : "—"}
              </td>
            </tr>
            <tr>
              <td><strong>Order Reference</strong></td>
              <td>{orderRef}</td>
            </tr>
            <tr>
              <td><strong>Total Amount</strong></td>
              <td>€{invoice.total?.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Issue Date</strong></td>
              <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>Due Date</strong></td>
              <td>
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td>
                <Badge bg={getStatusVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </td>
            </tr>
            <tr>
              <td><strong>Notes</strong></td>
              <td>{invoice.notes || "—"}</td>
            </tr>
            <tr>
              <td><strong>Created At</strong></td>
              <td>{new Date(invoice.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Last Updated</strong></td>
              <td>{new Date(invoice.updatedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default InvoiceDetailsModal;
