import { Container, Row, Col, Card, Spinner, Alert, Button, Badge } from "react-bootstrap";
import useMyProfile from "../hooks/users/useMyProfile";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { profile, loading, error } = useMyProfile();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <i className="bi bi-person-circle text-primary" style={{ fontSize: "6rem" }}></i>
            </Col>
            <Col md={9}>
              <h2 className="fw-bold text-primary mb-1">
                {profile.name} {profile.surname}
              </h2>
              <p className="text-muted mb-1">{profile.email}</p>
              <Badge bg="secondary">{profile.role}</Badge>

              {profile.customer && (
                <div className="mt-3">
                  <p><strong>Phone:</strong> {profile.customer.phone || "—"}</p>
                  <p><strong>Address:</strong> {profile.customer.address || "—"}</p>
                </div>
              )}

              {profile.employee && (
                <div className="mt-3">
                  <p><strong>Department:</strong> {profile.employee.department}</p>
                </div>
              )}

              {profile.supplier && (
                <div className="mt-3">
                  <p><strong>Company:</strong> {profile.supplier.companyName}</p>
                  <p><strong>Contact:</strong> {profile.supplier.contact}</p>
                  <p><strong>VAT:</strong> {profile.supplier.vatNumber}</p>
                </div>
              )}
            </Col>
          </Row>

          <hr />

          <div className="text-end">
            <Button variant="outline-primary" onClick={() => navigate("/settings")}>
              <i className="bi bi-gear me-2"></i>Edit Profile
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
