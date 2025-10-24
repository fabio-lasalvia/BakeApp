import { Modal, Table, Badge, Tab, Tabs } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

function PurchaseOrderDetailsModal({ show, onHide, order }) {
  if (!order) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING": return "warning";
      case "ORDERED": return "info";
      case "RECEIVED": return "success";
      case "CANCELLED": return "danger";
      default: return "secondary";
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Purchase Order Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tabs defaultActiveKey="overview" id="purchase-order-tabs" className="mb-3">
          {/* OVERVIEW */}
          <Tab eventKey="overview" title="Overview">
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <td><strong>Supplier</strong></td>
                  <td>{order.supplier?.user?.name} {order.supplier?.user?.surname}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{order.supplier?.user?.email || "—"}</td>
                </tr>
                <tr>
                  <td><strong>Handled By</strong></td>
                  <td>{order.handledBy?.name} {order.handledBy?.surname}</td>
                </tr>
                <tr>
                  <td><strong>Status</strong></td>
                  <td><Badge bg={getStatusVariant(order.status)}>{order.status}</Badge></td>
                </tr>
                <tr>
                  <td><strong>Total Cost</strong></td>
                  <td>€{order.totalCost?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Expected Delivery</strong></td>
                  <td>{order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : "—"}</td>
                </tr>
                <tr>
                  <td><strong>Created At</strong></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </Tab>

          {/* INGREDIENTS */}
          <Tab eventKey="ingredients" title="Ingredients">
            {order.ingredients?.length > 0 ? (
              <Table bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Ingredient</th>
                    <th>Unit</th>
                    <th>Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.ingredients.map((i, idx) => (
                    <tr key={i._id}>
                      <td>{idx + 1}</td>
                      <td>{i.name}</td>
                      <td>{i.unit || "—"}</td>
                      <td>{i.price?.toFixed(2) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted text-center">No ingredients in this order.</p>
            )}
          </Tab>

          {/* QR CODE */}
          <Tab eventKey="qrcode" title="QR Code">
            <div className="d-flex flex-column align-items-center justify-content-center py-4">
              <p className="text-muted mb-3">Scan this QR to view order details</p>
              <QRCodeCanvas
                value={JSON.stringify({
                  id: order._id,
                  supplier: order.supplier?.user?.email,
                  total: order.totalCost,
                  status: order.status,
                })}
                size={180}
                includeMargin
              />
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default PurchaseOrderDetailsModal;
