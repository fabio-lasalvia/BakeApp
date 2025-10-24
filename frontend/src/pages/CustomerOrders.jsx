import { Container } from "react-bootstrap";
import CustomerOrdersTable from "../components/customerOrders/CustomerOrdersTable";

function CustomerOrders() {
  return (
    <Container fluid className="p-4">
      <CustomerOrdersTable />
    </Container>
  );
}

export default CustomerOrders;
