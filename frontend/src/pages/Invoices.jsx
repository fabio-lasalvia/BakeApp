import { Button, Container } from "react-bootstrap";
import InvoicesTable from "../components/invoices/InvoicesTable";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function Invoices() {

  const navigate = useNavigate()

  return (
    <Container fluid className="py-4">
      <Button
        variant="outline-primary"
        className="d-flex align-items-center gap-2 mb-3"
        onClick={() => navigate("/home")}
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      <InvoicesTable />
    </Container>
  );
}

export default Invoices;
