import { Modal, Table, Badge, Tab, Tabs, Image } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

function CustomerOrderDetailsModal({ show, onHide, order }) {
  if (!order) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Customer Order Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tabs defaultActiveKey="overview" id="order-details-tabs" className="mb-3">
          {/* OVERVIEW */}
          <Tab eventKey="overview" title="Overview">
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <td><strong>Customer</strong></td>
                  <td>
                    {order.customer?.user
                      ? `${order.customer.user.name || ""} ${
                          order.customer.user.surname || ""
                        }`
                      : "—"}
                  </td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{order.customer?.user?.email || "—"}</td>
                </tr>
                <tr>
                  <td><strong>Handled By</strong></td>
                  <td>
                    {order.handledBy
                      ? `${order.handledBy.name || ""} ${
                          order.handledBy.surname || ""
                        }`
                      : "—"}
                  </td>
                </tr>
                <tr>
                  <td><strong>Status</strong></td>
                  <td>
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td><strong>Total Amount</strong></td>
                  <td>€{order.totalAmount?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Notes</strong></td>
                  <td>{order.notes || "—"}</td>
                </tr>
                <tr>
                  <td><strong>Created At</strong></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Last Updated</strong></td>
                  <td>{new Date(order.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </Tab>

          {/* PRODUCTS */}
          <Tab eventKey="products" title="Products">
            {order.products?.length > 0 ? (
              <Table bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price (€)</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.description || "—"}</td>
                      <td>{product.price?.toFixed(2) || "—"}</td>
                      <td>
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            rounded
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-secondary fw-bold">
                    <td colSpan="3" className="text-end">
                      TOTAL
                    </td>
                    <td colSpan="2">€{order.totalAmount?.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <p className="text-muted text-center">
                No products linked to this order.
              </p>
            )}
          </Tab>

          {/* QR CODE */}
          <Tab eventKey="qrcode" title="QR Code">
            <div className="d-flex flex-column align-items-center justify-content-center py-4">
              <p className="text-muted mb-3">
                Scan this QR to retrieve order info quickly
              </p>
              <QRCodeCanvas
                value={JSON.stringify({
                  orderId: order._id,
                  customer: order.customer?.user?.email,
                  total: order.totalAmount,
                  status: order.status,
                })}
                size={180}
                includeMargin
              />
              <div className="mt-3 small text-muted">Order ID: {order._id}</div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default CustomerOrderDetailsModal;
