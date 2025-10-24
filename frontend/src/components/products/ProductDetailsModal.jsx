import { Modal, Tab, Tabs, Image, Table, Badge } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

function ProductDetailsModal({ show, onHide, product }) {
  if (!product) return null;

  const categoryLabels = {
    LEAVENED: "Leavened",
    CAKE: "Cake",
    COOKIE: "Cookie",
    CHOCOLATE: "Chocolate",
    BREAD: "Bread",
    DESSERT: "Dessert",
    OTHER: "Other",
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="overview" className="mb-3" fill>
          {/* OVERVIEW */}
          <Tab eventKey="overview" title="Overview">
            <div className="text-center mb-3">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fluid
                  rounded
                  style={{ maxHeight: "240px", objectFit: "cover" }}
                />
              ) : (
                <div className="text-muted py-5 border rounded">
                  No image available
                </div>
              )}
            </div>
            <h4 className="text-center">{product.name}</h4>
            <p className="text-center text-muted">{product.description || "No description"}</p>
            <p className="text-center">
              <strong>Category:</strong>{" "}
              <Badge bg="info" text="dark">
                {categoryLabels[product.category] || product.category}
              </Badge>
            </p>
            <p className="text-center">
              <strong>Catalog:</strong> {product.catalog?.name || "—"}
            </p>
          </Tab>

          {/* ACCOUNTING */}
          <Tab eventKey="accounting" title="Accounting">
            <Table bordered hover>
              <tbody>
                <tr>
                  <td><strong>Price (€)</strong></td>
                  <td>{product.price.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Available</strong></td>
                  <td>{product.available ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td><strong>Created At</strong></td>
                  <td>{new Date(product.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Updated At</strong></td>
                  <td>{new Date(product.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </Tab>

          {/* QR CODE */}
          <Tab eventKey="qr" title="QR Code">
            <div className="d-flex flex-column align-items-center justify-content-center py-4">
              <QRCodeCanvas
                value={JSON.stringify({
                  id: product._id,
                  name: product.name,
                  category: product.category,
                  price: product.price,
                })}
                size={180}
                includeMargin
              />
              <p className="mt-3 text-muted small">Scan to view product details</p>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default ProductDetailsModal;
