import { Modal, Tab, Tabs, Image, Table } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";

function ProductDetailsModal({ show, onHide, product }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="overview" className="mb-3" fill>
          {/* Overview */}
          <Tab eventKey="overview" title="Overview">
            <div className="text-center mb-3">
              {product.image ? (
                <Image src={product.image} alt={product.name} fluid rounded style={{ maxHeight: "200px" }} />
              ) : (
                <div className="text-muted">No image available</div>
              )}
            </div>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p><strong>Catalog:</strong> {product.catalog?.name || "—"}</p>
          </Tab>

          {/* Accounting Info */}
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

          {/* QR Code */}
          <Tab eventKey="qr" title="QR Code">
              <div className="d-flex justify-content-center align-items-center flex-column py-4">
                <QRCodeCanvas
                  value={`${window.location.origin}/products/${product._id}`}
                  size={180}
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
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
