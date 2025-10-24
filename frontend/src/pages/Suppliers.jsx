import { Container } from "react-bootstrap";
import SuppliersTable from "../components/suppliers/SuppliersTable";

function Suppliers() {
  return (
    <Container fluid className="py-4">
      <h1 className="fw-bold text-primary mb-3">Suppliers Management</h1>
      <SuppliersTable />
    </Container>
  );
}

export default Suppliers;
