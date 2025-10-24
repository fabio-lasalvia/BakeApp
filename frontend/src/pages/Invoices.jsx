import { Container } from "react-bootstrap";
import InvoicesTable from "../components/invoices/InvoicesTable";

function Invoices() {
  return (
    <Container fluid className="py-4">
      <InvoicesTable />
    </Container>
  );
}

export default Invoices;
