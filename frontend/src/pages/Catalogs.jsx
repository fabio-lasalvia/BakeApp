import { Container } from "react-bootstrap";
import CatalogsTable from "../components/catalogs/CatalogsTable";

function Catalogs() {
  return (
    <Container fluid className="p-4">
      <CatalogsTable />
    </Container>
  );
}

export default Catalogs;
