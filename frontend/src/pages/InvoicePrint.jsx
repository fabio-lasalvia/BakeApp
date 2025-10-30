import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Table, Button, Spinner, Image, Badge } from "react-bootstrap";
import axios from "../data/axiosInstance";
import { QRCodeCanvas } from "qrcode.react";

function InvoicePrint() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch singola fattura
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/invoices/${id}`);
        setInvoice(response.data);
      } catch (err) {
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="text-center mt-5 text-danger">
        <h4>{error}</h4>
      </Container>
    );

  const { customer, handledBy, customerOrder, total, issueDate, dueDate, status } = invoice || {};

  const formatPrice = (value) =>
    typeof value === "number" && !isNaN(value) ? value.toFixed(2) : "0.00";

  const getStatusVariant = (status) => {
    switch (status) {
      case "UNPAID":
        return "warning";
      case "PAID":
        return "success";
      case "OVERDUE":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="py-5 invoice-print">
      {/* HEADER */}
      <Row className="align-items-center mb-4">
        <Col xs={6}>
          <img
            src="/img/logo/logoBakeApp.png"
            alt="BakeApp Logo"
            style={{ maxWidth: "160px" }}
          />
        </Col>
        <Col xs={6} className="text-end">
          <h5 className="fw-bold">INVOICE #{invoice.invoiceNumber || id}</h5>
          <p className="mb-0">
            Issued: {issueDate ? new Date(issueDate).toLocaleDateString() : "—"}
          </p>
          <p>Due: {dueDate ? new Date(dueDate).toLocaleDateString() : "—"}</p>
        </Col>
      </Row>

      <hr />

      {/* CUSTOMER INFO */}
      <Row className="mb-4">
        <Col md={6}>
          <h6 className="fw-bold mb-2 text-uppercase">Bill To:</h6>
          <p className="mb-1">
            <strong>
              {customer?.user?.name} {customer?.user?.surname}
            </strong>
          </p>
          <p className="mb-1">{customer?.user?.email}</p>
          <p className="mb-0">{customer?.address || "No address available"}</p>
        </Col>
        <Col md={6} className="text-md-end mt-4 mt-md-0">
          <h6 className="fw-bold mb-2 text-uppercase">Handled By:</h6>
          <p className="mb-1">
            {handledBy?.name} {handledBy?.surname}
          </p>
          <p className="mb-1">{handledBy?.email}</p>
        </Col>
      </Row>

      {/* ORDER DETAILS */}
      {customerOrder && customerOrder.products?.length > 0 && (
        <Row className="mb-4">
          <Col>
            <h6 className="fw-bold mb-2 text-uppercase">Order Summary:</h6>
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Price (€)</th>
                  <th>Qty</th>
                  <th>Subtotal (€)</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {customerOrder.products.map((item, index) => {
                  const product = item.product || {};
                  const price = Number(product.price) || 0;
                  const quantity = item.quantity || 1;
                  const subtotal = price * quantity;

                  return (
                    <tr key={product._id || index}>
                      <td>{index + 1}</td>
                      <td>{product.name || "Unnamed product"}</td>
                      <td>{product.description || "—"}</td>
                      <td className="text-end">{formatPrice(price)}</td>
                      <td className="text-center">{quantity}</td>
                      <td className="text-end">{formatPrice(subtotal)}</td>
                      <td className="text-center">
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
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="fw-bold table-secondary">
                  <td colSpan={5} className="text-end">
                    TOTAL
                  </td>
                  <td className="text-end">€{formatPrice(total)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>
      )}

      {/* FOOTER INFO */}
      <Row className="mt-5 align-items-center">
        <Col md={6}>
          <p className="mb-1">
            <strong>Status:</strong>{" "}
            <Badge bg={getStatusVariant(status)}>{status}</Badge>
          </p>
        </Col>
        <Col md={6} className="text-end">
          <p className="fw-bold mb-1">Thank you for your business!</p>
          <p className="small text-muted mb-0">
            BakeApp © {new Date().getFullYear()} — All Rights Reserved
          </p>
        </Col>
      </Row>

      {/* QR CODE SECTION */}
      <div className="d-flex flex-column align-items-center mt-5 d-print-none">
        <p className="text-muted mb-2">Scan to verify this invoice</p>
        <QRCodeCanvas
          value={JSON.stringify({
            invoiceId: invoice._id,
            total,
            status,
            customer: customer?.user?.email,
          })}
          size={150}
          includeMargin
        />
      </div>

      {/* PRINT BUTTON */}
      <div className="text-center mt-4 d-print-none">
        <Button variant="primary" size="lg" onClick={handlePrint}>
          <i className="bi bi-printer me-2"></i>Print Invoice
        </Button>
      </div>
    </Container>
  );
}

export default InvoicePrint;
