import { Button, Container } from "react-bootstrap";
import SuppliersTable from "../components/suppliers/SuppliersTable";
import { ArrowLeft } from "react-bootstrap-icons";

function Suppliers() {
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
      <SuppliersTable />
    </Container>
  );
}

export default Suppliers;
