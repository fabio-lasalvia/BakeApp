import { Button, Container } from "react-bootstrap";
import CustomerOrdersTable from "../components/customerOrders/CustomerOrdersTable";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function CustomerOrders() {

  const navigate = useNavigate()

  return (
    <Container fluid className="p-4">
      <Button
        variant="outline-primary"
        className="d-flex align-items-center gap-2 mb-3"
        onClick={() => navigate("/home")}
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      <CustomerOrdersTable />
    </Container>
  );
}

export default CustomerOrders;
