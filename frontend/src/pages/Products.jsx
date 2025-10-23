import { Container } from "react-bootstrap";
import ProductsTable from "../components/products/ProductsTable";

function Products() {
  return (
    <Container fluid className="p-4">
      <ProductsTable />
    </Container>
  );
}

export default Products;
